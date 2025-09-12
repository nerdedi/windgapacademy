/**
 * Windgap Academy Professional Backend Server
 *
 * Features:
 * - Advanced security middleware and authentication
 * - Comprehensive error handling and logging
 * - Performance monitoring and optimization
 * - Real-time WebSocket support
 * - Professional API documentation
 * - Health checks and monitoring endpoints
 * - Rate limiting and DDoS protection
 * - Database connection management
 * - Caching and session management
 * - Professional deployment configuration
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const winston = require("winston");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

// Import custom middleware and routes
const apiRouter = require("./api");
const logger = require("./utils/logger");
const authMiddleware = require("./middleware/auth");

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 9000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const isDevelopment = NODE_ENV === "development";
const isProduction = NODE_ENV === "production";

// Initialize Express application
const app = express();
const server = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'", "ws:", "wss:"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
app.use(
  cors({
    origin: isDevelopment ? true : CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Compression middleware
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/api/health";
  },
});

app.use(limiter);

// Logging middleware
if (isProduction) {
  app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
} else {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader("X-Request-ID", req.id);
  next();
});

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();

  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - req.startTime;
    res.setHeader("X-Response-Time", `${duration}ms`);

    // Log slow requests
    if (duration > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`, {
        requestId: req.id,
        method: req.method,
        path: req.path,
        duration,
        userAgent: req.get("User-Agent"),
      });
    }

    return originalSend.call(this, data);
  };

  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  res.status(200).json(healthCheck);
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    title: "Windgap Academy API",
    version: "2.0.0",
    description: "Professional learning platform API with comprehensive educational features",
    endpoints: {
      "/api/auth": "Authentication and user management",
      "/api/users": "User profiles and preferences",
      "/api/modules": "Educational modules and content",
      "/api/assignments": "Assignment management",
      "/api/game": "Game states and progress",
      "/api/materials": "Learning materials and resources",
      "/health": "Server health check",
      "/metrics": "Performance metrics",
    },
    documentation: "https://docs.windgapacademy.com/api",
  });
});

// Metrics endpoint for monitoring
app.get("/metrics", (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    connections: {
      active: io.engine.clientsCount,
      total: io.engine.generateId,
    },
  };

  res.json(metrics);
});

// API routes
app.use("/api", apiRouter);

// Static file serving for production
if (isProduction) {
  const staticPath = path.join(__dirname, "../dist");
  if (fs.existsSync(staticPath)) {
    app.use(
      express.static(staticPath, {
        maxAge: "1y",
        etag: true,
        lastModified: true,
        setHeaders: (res, path) => {
          if (path.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache");
          }
        },
      }),
    );

    // Serve React app for all non-API routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }
}

// WebSocket connection handling
io.on("connection", (socket) => {
  logger.info(`New WebSocket connection: ${socket.id}`, {
    socketId: socket.id,
    userAgent: socket.handshake.headers["user-agent"],
    ip: socket.handshake.address,
  });

  // Join user to their personal room for targeted updates
  socket.on("join-user-room", (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      logger.info(`User ${userId} joined personal room`, { socketId: socket.id, userId });
    }
  });

  // Handle learning progress updates
  socket.on("progress-update", (data) => {
    try {
      // Broadcast progress update to educators/parents if applicable
      socket.broadcast.to(`user-${data.userId}`).emit("progress-updated", data);

      // Log progress for analytics
      logger.info("Progress update received", {
        socketId: socket.id,
        userId: data.userId,
        module: data.module,
        progress: data.progress,
      });
    } catch (error) {
      logger.error("Error handling progress update", { error: error.message, socketId: socket.id });
    }
  });

  // Handle real-time collaboration
  socket.on("collaboration-join", (roomId) => {
    socket.join(`collab-${roomId}`);
    socket.to(`collab-${roomId}`).emit("user-joined", { socketId: socket.id });
  });

  socket.on("collaboration-data", (data) => {
    socket.to(`collab-${data.roomId}`).emit("collaboration-update", data);
  });

  // Handle game state synchronization
  socket.on("game-state-update", (gameData) => {
    try {
      // Broadcast to other players in the same game session
      socket.to(`game-${gameData.sessionId}`).emit("game-state-changed", gameData);
    } catch (error) {
      logger.error("Error handling game state update", {
        error: error.message,
        socketId: socket.id,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    logger.info(`WebSocket disconnected: ${socket.id}`, {
      socketId: socket.id,
      reason,
      duration: Date.now() - socket.handshake.time,
    });
  });

  // Handle errors
  socket.on("error", (error) => {
    logger.error("WebSocket error", {
      socketId: socket.id,
      error: error.message,
      stack: error.stack,
    });
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const errorId = Math.random().toString(36).substr(2, 9);

  logger.error("Unhandled application error", {
    errorId,
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  // Don't expose internal errors in production
  const message = isProduction ? "Internal server error" : err.message;

  res.status(err.status || 500).json({
    error: {
      message,
      errorId,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Endpoint not found",
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");

  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");

  server.close(() => {
    logger.info("Process terminated");
    process.exit(0);
  });
});

// Unhandled promise rejection handling
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason.toString(),
    stack: reason.stack,
    promise,
  });
});

// Uncaught exception handling
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });

  // Exit gracefully
  process.exit(1);
});

// Start server
if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(`🎓 Windgap Academy Backend Server started`, {
      port: PORT,
      environment: NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    });

    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
    console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
  });
}

module.exports = { app, server, io };

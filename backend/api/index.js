/**
 * Windgap Academy Professional API Router
 *
 * Features:
 * - Comprehensive API routing with versioning
 * - Professional middleware integration
 * - Rate limiting and security
 * - API documentation and monitoring
 * - Error handling and logging
 * - Performance optimization
 * - Authentication and authorization
 * - Request validation and sanitization
 */

const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { body, validationResult } = require("express-validator");

const logger = require("../utils/logger");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// API Security Middleware
router.use(
  helmet({
    contentSecurityPolicy: false, // Handled at app level
    crossOriginEmbedderPolicy: false,
  }),
);

// API-specific CORS configuration
router.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Request-ID"],
  }),
);

// Compression for API responses
router.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many API requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use API key if available, otherwise IP
    return req.headers["x-api-key"] || req.ip;
  },
});

router.use(apiLimiter);

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  skipSuccessfulRequests: true,
});

// Request logging middleware
router.use((req, res, next) => {
  const startTime = Date.now();

  // Log request
  logger.info("API Request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    requestId: req.id,
  });

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    logger.info("API Response", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      requestId: req.id,
    });

    return originalSend.call(this, data);
  };

  next();
});

// Request validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: errors.array(),
        timestamp: new Date().toISOString(),
      },
    });
  }
  next();
};

// API Health Check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Information
router.get("/info", (req, res) => {
  res.json({
    name: "Windgap Academy API",
    version: "2.0.0",
    description: "Professional learning platform API",
    documentation: "/api/docs",
    endpoints: {
      "/auth": "Authentication and authorization",
      "/users": "User management and profiles",
      "/assignments": "Assignment management",
      "/materials": "Learning materials and resources",
      "/modules": "Educational modules",
      "/game": "Game states and progress",
      "/analytics": "Learning analytics and insights",
      "/notifications": "Real-time notifications",
      "/collaboration": "Collaborative features",
    },
    features: [
      "JWT Authentication",
      "Role-based Access Control",
      "Real-time WebSocket Support",
      "Comprehensive Logging",
      "Rate Limiting",
      "Input Validation",
      "Error Handling",
      "Performance Monitoring",
    ],
  });
});

// API Documentation
router.get("/docs", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Windgap Academy API",
      version: "2.0.0",
      description: "Professional multi-modal learning platform API",
      contact: {
        name: "Windgap Academy Support",
        email: "support@windgapacademy.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Server",
      },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health check endpoint",
          responses: {
            200: {
              description: "Service is healthy",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "User authentication",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
        },
      },
    },
  });
});

// API Routes with middleware
router.use("/auth", authLimiter, require("./auth"));
router.use("/users", authMiddleware, require("./users"));
router.use("/assignments", authMiddleware, require("./assignments"));
router.use("/materials", authMiddleware, require("./materials"));
router.use("/modules", authMiddleware, require("./modules"));
router.use("/game", authMiddleware, require("./game"));

// Additional professional API routes
router.use("/analytics", authMiddleware, require("./analytics"));
router.use("/notifications", authMiddleware, require("./notifications"));
router.use("/collaboration", authMiddleware, require("./collaboration"));

// API Error Handler
router.use((err, req, res, next) => {
  const errorId = Math.random().toString(36).substr(2, 9);

  logger.error("API Error", {
    errorId,
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(err.status || 500).json({
    error: {
      message,
      errorId,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  });
});

// 404 Handler for API routes
router.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "API endpoint not found",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      availableEndpoints: [
        "/api/health",
        "/api/info",
        "/api/docs",
        "/api/auth",
        "/api/users",
        "/api/assignments",
        "/api/materials",
        "/api/modules",
        "/api/game",
      ],
    },
  });
});

module.exports = router;

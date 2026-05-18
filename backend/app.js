require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const dataRoutes = require("./routes/dataRoutes");
const simulationRoutes = require("./routes/simulation");
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");
const materialRoutes = require("./api/materials");
const assignmentRoutes = require("./api/assignments");
const gameRoutes = require("./api/game");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS — allow the frontend origin (configure via FRONTEND_URL env var in production)
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Global rate limit: 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down and try again shortly." },
});
app.use(globalLimiter);

// Tighter limit on auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many login attempts — please wait 15 minutes before trying again." },
});

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api/data", dataRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("Windgap Academy Backend API");
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;

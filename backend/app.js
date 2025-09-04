require("dotenv").config();
const express = require("express");

const dataRoutes = require("./routes/dataRoutes");
const simulationRoutes = require("./routes/simulation");
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");
const materialRoutes = require("./api/materials");
const assignmentRoutes = require("./api/assignments");
const gameRoutes = require("./api/game");
const modulesRoutes = require("./api/modules");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api/data", dataRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/modules", modulesRoutes);

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

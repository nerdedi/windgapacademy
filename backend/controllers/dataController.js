const logger = require("../utils/logger");

// In-memory storage for historical data
const dataHistory = [];
const MAX_HISTORY_SIZE = 100; // Store last 100 data points

// Generate random system metrics
const generateRandomMetrics = () => {
  return {
    timestamp: new Date(),
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 100),
    network: parseFloat((Math.random() * 10).toFixed(2)),
  };
};

// Store current metrics
let currentMetrics = generateRandomMetrics();

// Generate new metrics every 5 seconds and store in history
setInterval(() => {
  currentMetrics = generateRandomMetrics();
  dataHistory.unshift(currentMetrics);
  if (dataHistory.length > MAX_HISTORY_SIZE) {
    dataHistory.pop();
  }
  logger.debug("Generated new metrics", { currentMetrics });
}, 5000);

const getCurrentData = () => currentMetrics;
const getHistoricalData = () => dataHistory;

module.exports = {
  getCurrentData,
  getHistoricalData,
};

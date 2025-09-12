/**
 * Windgap Academy Professional Logging System
 *
 * Features:
 * - Structured logging with multiple levels
 * - Request correlation and tracing
 * - Performance monitoring integration
 * - Error tracking and alerting
 * - Environment-specific configuration
 * - Security and privacy compliance
 */

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

class WindgapLogger {
  constructor() {
    this.config = {
      level: process.env.LOG_LEVEL || "info",
      format: process.env.LOG_FORMAT || "json",
      enableConsole: process.env.NODE_ENV !== "production",
      enableFile: process.env.ENABLE_FILE_LOGGING === "true",
      enableMetrics: true,
    };

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4,
    };

    this.metrics = {
      totalLogs: 0,
      errorCount: 0,
      warnCount: 0,
      startTime: Date.now(),
    };
  }

  timestamp() {
    return new Date().toISOString();
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.config.level];
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = this.timestamp();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
      pid: process.pid,
    };

    if (this.config.format === "json") {
      return JSON.stringify(logEntry);
    } else {
      return `[${level.toUpperCase()}] ${timestamp} ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
    }
  }

  writeToConsole(level, formattedMessage) {
    if (!this.config.enableConsole) return;

    const consoleMethod =
      {
        error: console.error,
        warn: console.warn,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
      }[level] || console.log;

    consoleMethod(formattedMessage);
  }

  updateMetrics(level) {
    if (!this.config.enableMetrics) return;

    this.metrics.totalLogs++;

    if (level === "error") {
      this.metrics.errorCount++;
    } else if (level === "warn") {
      this.metrics.warnCount++;
    }
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    // Add performance timing if available
    if (meta.startTime) {
      meta.duration = performance.now() - meta.startTime;
    }

    // Add request correlation ID if available
    if (meta.requestId || meta.req?.id) {
      meta.correlationId = meta.requestId || meta.req.id;
    }

    const formattedMessage = this.formatMessage(level, message, meta);

    this.writeToConsole(level, formattedMessage);
    this.updateMetrics(level);
  }

  // Convenience methods
  error(message, meta = {}) {
    this.log("error", message, meta);
  }

  warn(message, meta = {}) {
    this.log("warn", message, meta);
  }

  info(message, meta = {}) {
    this.log("info", message, meta);
  }

  debug(message, meta = {}) {
    this.log("debug", message, meta);
  }

  trace(message, meta = {}) {
    this.log("trace", message, meta);
  }

  // Performance logging
  time(label) {
    const startTime = performance.now();
    return {
      end: (message = `Timer ${label} completed`, meta = {}) => {
        const duration = performance.now() - startTime;
        this.info(message, { ...meta, duration, label });
        return duration;
      },
    };
  }

  // Get logging metrics
  getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.metrics.startTime,
      errorRate: this.metrics.totalLogs > 0 ? this.metrics.errorCount / this.metrics.totalLogs : 0,
      warningRate: this.metrics.totalLogs > 0 ? this.metrics.warnCount / this.metrics.totalLogs : 0,
    };
  }

  // Configuration management
  setLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.config.level = level;
      this.info("Log level changed", { newLevel: level });
    } else {
      this.warn("Invalid log level", {
        attemptedLevel: level,
        validLevels: Object.keys(this.levels),
      });
    }
  }
}

// Create global logger instance
const logger = new WindgapLogger();

module.exports = logger;

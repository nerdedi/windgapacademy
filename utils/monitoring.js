/**
 * Windgap Academy Professional Monitoring System
 *
 * Comprehensive monitoring and analytics for:
 * - Performance tracking and optimization
 * - Error monitoring and reporting
 * - User engagement analytics
 * - Real-time system health
 * - Memory and resource monitoring
 * - Network performance tracking
 * - Custom metrics and events
 * - Professional logging and alerting
 */

class WindgapMonitoring {
  constructor() {
    this.config = {
      debugEnabled: process.env.NODE_ENV === "development",
      apiEndpoint: "/api/analytics/events",
      maxErrorCount: 5,
      performanceThresholds: {
        loadTime: 3000,
        memoryUsage: 100 * 1024 * 1024, // 100MB
        fps: 30,
        responseTime: 1000,
      },
      engagementInterval: 30000, // 30 seconds
      updateCheckInterval: 3600000, // 1 hour
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
    };

    this.metrics = {
      errors: [],
      performance: [],
      engagement: [],
      customEvents: [],
      systemHealth: {
        memory: null,
        fps: null,
        networkStatus: "online",
        lastUpdate: null,
      },
    };

    this.eventQueue = [];
    this.errorCount = 0;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();

    this.initialize();
  }

  initialize() {
    this.setupErrorTracking();
    this.setupPerformanceMonitoring();
    this.setupEngagementTracking();
    this.setupNetworkMonitoring();
    this.setupMemoryMonitoring();
    this.setupFPSMonitoring();
    this.startEventBatching();

    this.logInfo("Windgap Monitoring System initialized", {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Enhanced Logging System
  logDebug(...args) {
    if (this.config.debugEnabled) {
      console.log(`[WINDGAP DEBUG ${new Date().toISOString()}]`, ...args);
    }
  }

  logInfo(...args) {
    console.info(`[WINDGAP INFO ${new Date().toISOString()}]`, ...args);
  }

  logWarn(...args) {
    console.warn(`[WINDGAP WARN ${new Date().toISOString()}]`, ...args);
    this.sendEvent("warning", { message: args.join(" "), timestamp: Date.now() });
  }

  logError(...args) {
    console.error(`[WINDGAP ERROR ${new Date().toISOString()}]`, ...args);
    this.sendEvent("error", { message: args.join(" "), timestamp: Date.now() });
  }

  // Professional Event System
  sendEvent(eventType, data = {}) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      data: {
        ...data,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.eventQueue.push(event);
    this.logDebug("Event queued:", eventType, data);

    // Immediate flush for critical events
    if (["error", "critical", "security"].includes(eventType)) {
      this.flushEvents();
    }
  }

  // Advanced Performance Monitoring
  monitorPerformance() {
    const performanceData = this.collectPerformanceMetrics();

    this.metrics.performance.push(performanceData);
    this.logDebug("Performance metrics collected:", performanceData);

    // Check thresholds and alert if necessary
    this.checkPerformanceThresholds(performanceData);

    this.sendEvent("performance", performanceData);
  }

  collectPerformanceMetrics() {
    const navigation = performance.getEntriesByType("navigation")[0];
    const memory = performance.memory || {};

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : null,
      domContentLoaded: navigation
        ? navigation.domContentLoadedEventEnd - navigation.fetchStart
        : null,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      memory: {
        used: memory.usedJSHeapSize || 0,
        total: memory.totalJSHeapSize || 0,
        limit: memory.jsHeapSizeLimit || 0,
      },
      connection: this.getConnectionInfo(),
      timestamp: Date.now(),
    };
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find((entry) => entry.name === "first-paint");
    return firstPaint ? firstPaint.startTime : null;
  }

  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    return fcp ? fcp.startTime : null;
  }

  getConnectionInfo() {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return null;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  checkPerformanceThresholds(data) {
    const { loadTime, memory } = data;
    const thresholds = this.config.performanceThresholds;

    if (loadTime && loadTime > thresholds.loadTime) {
      this.logWarn(`Slow load time detected: ${loadTime}ms (threshold: ${thresholds.loadTime}ms)`);
      this.sendEvent("performance_warning", {
        type: "slow_load",
        value: loadTime,
        threshold: thresholds.loadTime,
      });
    }

    if (memory.used && memory.used > thresholds.memoryUsage) {
      this.logWarn(`High memory usage detected: ${Math.round(memory.used / 1024 / 1024)}MB`);
      this.sendEvent("performance_warning", {
        type: "high_memory",
        value: memory.used,
        threshold: thresholds.memoryUsage,
      });
    }
  }

  // Enhanced Error Tracking
  setupErrorTracking() {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.handleError({
        type: "javascript_error",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error ? event.error.stack : null,
        timestamp: Date.now(),
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError({
        type: "unhandled_promise_rejection",
        message: event.reason ? event.reason.toString() : "Unknown promise rejection",
        stack: event.reason ? event.reason.stack : null,
        timestamp: Date.now(),
      });
    });

    // React error boundary integration
    window.windgapErrorHandler = (error, errorInfo) => {
      this.handleError({
        type: "react_error",
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: Date.now(),
      });
    };
  }

  handleError(errorData) {
    this.errorCount++;
    this.metrics.errors.push(errorData);

    this.logError("Error tracked:", errorData);
    this.sendEvent("error", errorData);

    // Check if error rate is too high
    if (this.errorCount >= this.config.maxErrorCount) {
      this.handleCriticalErrorRate();
    }
  }

  handleCriticalErrorRate() {
    this.logError(`Critical error rate reached: ${this.errorCount} errors`);
    this.sendEvent("critical", {
      type: "high_error_rate",
      errorCount: this.errorCount,
      sessionDuration: Date.now() - this.startTime,
    });

    // Show user-friendly error message
    this.showErrorNotification(
      "Multiple errors detected. The application may be unstable. Please refresh the page or contact support if the issue persists.",
    );
  }

  // User Engagement Tracking
  setupEngagementTracking() {
    let lastActivity = Date.now();
    let isActive = true;

    // Track user activity
    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];

    activityEvents.forEach((event) => {
      document.addEventListener(
        event,
        () => {
          lastActivity = Date.now();
          if (!isActive) {
            isActive = true;
            this.sendEvent("user_active", { timestamp: lastActivity });
          }
        },
        { passive: true },
      );
    });

    // Check for inactivity
    setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;

      if (timeSinceActivity > 60000 && isActive) {
        // 1 minute of inactivity
        isActive = false;
        this.sendEvent("user_inactive", {
          inactiveDuration: timeSinceActivity,
          timestamp: Date.now(),
        });
      }

      // Send engagement heartbeat
      this.sendEvent("engagement_heartbeat", {
        isActive,
        sessionDuration: Date.now() - this.startTime,
        timestamp: Date.now(),
      });
    }, this.config.engagementInterval);
  }

  // Network Monitoring
  setupNetworkMonitoring() {
    // Online/offline status
    window.addEventListener("online", () => {
      this.metrics.systemHealth.networkStatus = "online";
      this.sendEvent("network_status", { status: "online", timestamp: Date.now() });
    });

    window.addEventListener("offline", () => {
      this.metrics.systemHealth.networkStatus = "offline";
      this.sendEvent("network_status", { status: "offline", timestamp: Date.now() });
    });

    // Network performance monitoring
    this.monitorNetworkPerformance();
  }

  monitorNetworkPerformance() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.sendEvent("network_request", {
          url: typeof url === "string" ? url : url.url,
          method: args[1]?.method || "GET",
          status: response.status,
          duration,
          success: response.ok,
          timestamp: Date.now(),
        });

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.sendEvent("network_error", {
          url: typeof url === "string" ? url : url.url,
          method: args[1]?.method || "GET",
          error: error.message,
          duration,
          timestamp: Date.now(),
        });

        throw error;
      }
    };
  }

  // Memory Monitoring
  setupMemoryMonitoring() {
    if (!performance.memory) return;

    setInterval(() => {
      const memoryInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };

      this.metrics.systemHealth.memory = memoryInfo;

      // Check for memory leaks
      if (memoryInfo.used > this.config.performanceThresholds.memoryUsage) {
        this.logWarn("High memory usage detected", memoryInfo);
      }
    }, 30000); // Check every 30 seconds
  }

  // FPS Monitoring
  setupFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.systemHealth.fps = fps;

        if (fps < this.config.performanceThresholds.fps) {
          this.logWarn(`Low FPS detected: ${fps}`);
          this.sendEvent("performance_warning", {
            type: "low_fps",
            value: fps,
            threshold: this.config.performanceThresholds.fps,
          });
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  // Event Batching System
  startEventBatching() {
    setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  async flushEvents() {
    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0, this.config.batchSize);

    try {
      await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          timestamp: Date.now(),
        }),
      });

      this.logDebug(`Flushed ${events.length} events to analytics`);
    } catch (error) {
      this.logError("Failed to flush events:", error);
      // Re-queue events for retry
      this.eventQueue.unshift(...events);
    }
  }

  // User Notifications
  showErrorNotification(message) {
    // Create a professional notification instead of alert
    const notification = document.createElement("div");
    notification.className = "windgap-error-notification";
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 16px;
        max-width: 400px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="color: #dc2626; font-size: 20px;">⚠️</div>
          <div>
            <div style="font-weight: 600; color: #991b1b; margin-bottom: 4px;">
              System Notice
            </div>
            <div style="color: #7f1d1d; font-size: 14px; line-height: 1.4;">
              ${message}
            </div>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()"
                  style="
                    background: none;
                    border: none;
                    color: #991b1b;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin-left: auto;
                  ">×</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // Public API
  getMetrics() {
    return {
      ...this.metrics,
      sessionInfo: {
        sessionId: this.sessionId,
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
        errorCount: this.errorCount,
        eventQueueSize: this.eventQueue.length,
      },
    };
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.logInfo("Configuration updated", newConfig);
  }

  // Legacy API for backward compatibility
  setDebug(enabled) {
    this.config.debugEnabled = !!enabled;
    this.logInfo("Debug mode", enabled ? "enabled" : "disabled");
  }
}

// Create global instance
const monitoring = new WindgapMonitoring();

// Export both new and legacy APIs
export default monitoring;

// Legacy exports for backward compatibility
export const setDebug = (enabled) => monitoring.setDebug(enabled);
export const logDebug = (...args) => monitoring.logDebug(...args);
export const warnDebug = (...args) => monitoring.logWarn(...args);
export const sendEvent = (event, data) => monitoring.sendEvent(event, data);
export const monitorPerformance = () => monitoring.monitorPerformance();
export const trackErrorRates = () => monitoring.setupErrorTracking();
export const trackUserEngagement = () => monitoring.setupEngagementTracking();
export const scheduleRegularUpdates = () => {
  setInterval(() => {
    // Check for updates logic here
    monitoring.sendEvent("update_check", { timestamp: Date.now() });
  }, monitoring.config.updateCheckInterval);
};

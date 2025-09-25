/**
 * Performance metrics collection for Unity WebGL experiences
 */

class PerfMetrics {
  constructor() {
    this.metrics = {
      loadTime: null,
      fps: [],
      memoryUsage: [],
      deviceInfo: this.getDeviceInfo(),
      timestamps: {
        start: Date.now(),
        loaded: null,
        firstInteraction: null,
      },
      sessions: {},
      deviceTypes: {
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
      },
    };

    this.isCollecting = false;
    this.sampleInterval = 10000; // 10 seconds between samples

    // For local storage of metrics when not actively monitoring
    this.storageKey = "windgap_performance_metrics";

    // Load any stored metrics on initialization
    this.loadStoredMetrics();
  }

  /**
   * Start collecting performance metrics
   */
  start() {
    if (this.isCollecting) return;
    this.isCollecting = true;

    // Reset metrics
    this.metrics.fps = [];
    this.metrics.memoryUsage = [];
    this.metrics.timestamps.start = Date.now();

    // Set collection interval
    this.collectionInterval = setInterval(() => {
      this.collectSample();
    }, this.sampleInterval);

    console.log("Performance metrics collection started");
  }

  /**
   * Stop collecting performance metrics
   */
  stop() {
    if (!this.isCollecting) return;
    this.isCollecting = false;

    clearInterval(this.collectionInterval);
    console.log("Performance metrics collection stopped");
  }

  /**
   * Mark Unity content as loaded
   */
  markLoaded() {
    this.metrics.timestamps.loaded = Date.now();
    this.metrics.loadTime = this.metrics.timestamps.loaded - this.metrics.timestamps.start;
    console.log(`Unity content loaded in ${this.metrics.loadTime}ms`);
  }

  /**
   * Mark first user interaction
   */
  markFirstInteraction() {
    if (this.metrics.timestamps.firstInteraction) return;
    this.metrics.timestamps.firstInteraction = Date.now();
  }

  /**
   * Collect a performance sample
   */
  collectSample() {
    try {
      // FPS estimation
      const fps = this.estimateFPS();
      if (fps > 0) {
        this.metrics.fps.push({
          timestamp: Date.now(),
          value: fps,
        });
      }

      // Memory usage
      if (performance && performance.memory) {
        this.metrics.memoryUsage.push({
          timestamp: Date.now(),
          value: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
        });
      }
    } catch (err) {
      console.warn("Error collecting performance sample:", err);
    }
  }

  /**
   * Estimate current FPS
   */
  estimateFPS() {
    if (!window.requestAnimationFrame) return 0;

    // Simple FPS counter
    const fpsSamples = [];
    let lastTime = performance.now();
    let frame = 0;

    const countFrames = (time) => {
      const fps = 1000 / (time - lastTime);
      lastTime = time;
      fpsSamples.push(fps);

      frame++;
      if (frame < 10) {
        window.requestAnimationFrame(countFrames);
      }
    };

    window.requestAnimationFrame(countFrames);

    // Wait for samples to collect
    return new Promise((resolve) => {
      setTimeout(() => {
        // Average the samples
        const average = fpsSamples.reduce((sum, fps) => sum + fps, 0) / fpsSamples.length;
        resolve(Math.round(average));
      }, 500);
    });
  }

  /**
   * Get device information
   */
  getDeviceInfo() {
    return {
      userAgent: navigator?.userAgent || "unknown",
      screenWidth: window?.innerWidth || 0,
      screenHeight: window?.innerHeight || 0,
      devicePixelRatio: window?.devicePixelRatio || 1,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator?.userAgent || "",
      ),
      webglInfo: this.getWebGLInfo(),
    };
  }

  /**
   * Get WebGL capabilities information
   */
  getWebGLInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return null;

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        extensions: gl.getSupportedExtensions(),
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      ...this.metrics,
      summary: {
        averageFps: this.getAverageFPS(),
        peakMemoryUsage: this.getPeakMemoryUsage(),
        loadTime: this.metrics.loadTime,
      },
    };
  }

  /**
   * Get average FPS
   */
  getAverageFPS() {
    if (!this.metrics.fps.length) return 0;

    const sum = this.metrics.fps.reduce((total, sample) => total + sample.value, 0);
    return Math.round(sum / this.metrics.fps.length);
  }

  /**
   * Get peak memory usage
   */
  getPeakMemoryUsage() {
    if (!this.metrics.memoryUsage.length) return 0;

    let peak = 0;
    this.metrics.memoryUsage.forEach((sample) => {
      if (sample.value > peak) {
        peak = sample.value;
      }
    });

    return peak;
  }

  /**
   * Save metrics data to localStorage for persistence
   */
  saveMetricsToStorage() {
    try {
      // Only save certain data to avoid localStorage size limits
      const metricsToSave = {
        // Save aggregated data rather than all raw samples
        avgFps: this.getAverageFPS(),
        peakMemory: this.getPeakMemoryUsage(),
        loadTime: this.metrics.loadTime,
        deviceTypes: this.metrics.deviceTypes,
        // For the dashboard, add aggregated metrics by device type
        metrics: {
          fps: this.metrics.fps.slice(-20), // Save only the last 20 samples
          memory: this.metrics.memoryUsage.slice(-20).map((sample) => ({
            timestamp: sample.timestamp,
            value: sample.value,
          })),
          loadTime: [{ value: this.metrics.loadTime }],
        },
      };

      // Get existing data and merge
      const existingData = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
      const mergedData = this.mergeMetricsData(existingData, metricsToSave);

      localStorage.setItem(this.storageKey, JSON.stringify(mergedData));
      console.log("Performance metrics saved to localStorage");
    } catch (err) {
      console.warn("Failed to save performance metrics to localStorage:", err);
    }
  }

  /**
   * Load stored metrics from localStorage
   */
  loadStoredMetrics() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Update device type counts
        if (parsedData.deviceTypes) {
          this.metrics.deviceTypes = parsedData.deviceTypes;
        }
      }
    } catch (err) {
      console.warn("Failed to load stored performance metrics:", err);
    }
  }

  /**
   * Merge metrics data for storage
   */
  mergeMetricsData(existing, newData) {
    // If no existing data, just return the new data
    if (!existing || Object.keys(existing).length === 0) {
      return newData;
    }

    // Merge device type counts
    if (existing.deviceTypes && newData.deviceTypes) {
      Object.keys(newData.deviceTypes).forEach((type) => {
        existing.deviceTypes[type] = (existing.deviceTypes[type] || 0) + newData.deviceTypes[type];
      });
    } else {
      existing.deviceTypes = newData.deviceTypes;
    }

    // Merge metrics samples
    if (existing.metrics && newData.metrics) {
      // Merge FPS samples
      if (existing.metrics.fps && newData.metrics.fps) {
        existing.metrics.fps = [...existing.metrics.fps, ...newData.metrics.fps].slice(-100);
      } else {
        existing.metrics.fps = newData.metrics.fps;
      }

      // Merge memory samples
      if (existing.metrics.memory && newData.metrics.memory) {
        existing.metrics.memory = [...existing.metrics.memory, ...newData.metrics.memory].slice(
          -100,
        );
      } else {
        existing.metrics.memory = newData.metrics.memory;
      }

      // Merge load time samples
      if (existing.metrics.loadTime && newData.metrics.loadTime) {
        existing.metrics.loadTime = [
          ...existing.metrics.loadTime,
          ...newData.metrics.loadTime,
        ].slice(-50);
      } else {
        existing.metrics.loadTime = newData.metrics.loadTime;
      }
    } else {
      existing.metrics = newData.metrics;
    }

    return existing;
  }

  /**
   * Start monitoring performance for a Unity WebGL experience
   */
  startMonitoring(canvas, options = {}) {
    // Set configuration from options
    const config = {
      collectFPS: options.collectFPS !== false,
      collectMemory: options.collectMemory !== false,
      collectLoadTime: options.collectLoadTime !== false,
      logToConsole: options.logToConsole || false,
      sampleInterval: options.sampleInterval || 5000,
      sessionId: options.sessionId || `session_${Date.now()}`,
      unityInstance: options.unityInstance || null,
    };

    this.sampleInterval = config.sampleInterval;

    // Update device type counts
    const deviceInfo = this.getDeviceInfo();
    if (deviceInfo.isMobile) {
      this.metrics.deviceTypes.mobile++;
    } else {
      this.metrics.deviceTypes.desktop++;
    }

    // Start collecting metrics
    this.start();

    // Mark as loaded
    this.markLoaded();

    // Save session reference
    this.metrics.sessions[config.sessionId] = {
      startTime: Date.now(),
      deviceType: deviceInfo.isMobile ? "mobile" : "desktop",
    };

    // For logging
    if (config.logToConsole) {
      console.log(`Performance monitoring started for session ${config.sessionId}`);
      console.log("Device info:", deviceInfo);
    }

    // Save initial metrics
    this.saveMetricsToStorage();

    // Return monitoring session ID
    return config.sessionId;
  }

  /**
   * Stop monitoring and save metrics
   */
  stopMonitoring() {
    this.stop();
    this.saveMetricsToStorage();
  }

  /**
   * Get all metrics for the dashboard
   */
  async getAllMetrics() {
    // Load any stored metrics
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        return (
          parsedData.metrics || {
            fps: [],
            memory: [],
            loadTime: [],
            deviceTypes: this.metrics.deviceTypes,
          }
        );
      }
    } catch (err) {
      console.warn("Failed to load metrics for dashboard:", err);
    }

    // Return empty data if nothing is available
    return {
      fps: [],
      memory: [],
      loadTime: [],
      deviceTypes: this.metrics.deviceTypes,
    };
  }
}

// Create singleton instance
const perfMetrics = typeof window !== "undefined" ? new PerfMetrics() : null;

export default perfMetrics;

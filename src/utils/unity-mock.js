/**
 * Mock WebGL Optimizer for testing Unity educational experiences
 * This file creates mock responses for the LiveSessions component during development
 *
 * Portions of this file were generated with the assistance of GitHub Copilot (https://github.com/features/copilot)
 */

class MockWebGLOptimizer {
  constructor() {
    this.unityInstances = new Map();
    this.mockResponses = this.generateMockResponses();
    this.performanceMetrics = this.generatePerformanceMetrics();
    this.currentDevice = this.detectMockDevice();
  }

  /**
   * Generate mock responses for testing
   * @returns {Object} Mock response data
   */
  generateMockResponses() {
    return {
      progress: [0.1, 0.25, 0.5, 0.75, 0.9, 1],
      errors: [
        "WebGL memory allocation failed",
        "Failed to load Unity module",
        "Unity canvas initialization error",
        "WebGL context lost",
        "Shader compilation error",
      ],
      optimizations: {
        mobile: {
          textureQuality: "low",
          maxMemory: 256 * 1024 * 1024, // 256MB
          targetFrameRate: 30,
          disableAntialiasing: true,
          useLowQualitySettings: true,
        },
        desktop: {
          textureQuality: "high",
          maxMemory: 512 * 1024 * 1024, // 512MB
          targetFrameRate: 60,
          disableAntialiasing: false,
          useLowQualitySettings: false,
        },
        lowSpec: {
          textureQuality: "medium",
          maxMemory: 384 * 1024 * 1024, // 384MB
          targetFrameRate: 45,
          disableAntialiasing: true,
          useLowQualitySettings: false,
        },
      },
    };
  }

  /**
   * Generate mock performance metrics for testing
   * @returns {Object} Mock performance metrics
   */
  generatePerformanceMetrics() {
    return {
      fps: {
        current: 55,
        min: 30,
        max: 60,
        average: 52,
        history: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 30),
      },
      memory: {
        used: 180 * 1024 * 1024, // 180MB
        total: 512 * 1024 * 1024, // 512MB
        limit: 2048 * 1024 * 1024, // 2GB
        textures: 85 * 1024 * 1024, // 85MB
        history: Array.from({ length: 20 }, (_, i) => (150 + i * 2) * 1024 * 1024),
      },
      loadTime: {
        total: 3200, // 3.2 seconds
        download: 2100, // 2.1 seconds
        compile: 800, // 0.8 seconds
        initialize: 300, // 0.3 seconds
      },
      rendering: {
        drawCalls: 120,
        triangles: 45000,
        vertices: 86000,
        batches: 38,
      },
    };
  }

  /**
   * Simulate device detection for testing different optimizations
   * @returns {String} The mock device type
   */
  detectMockDevice() {
    // For testing, randomly choose a device type or use URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mockDevice = urlParams.get("mockDevice");

    if (mockDevice) {
      return mockDevice; // 'mobile', 'desktop', or 'lowSpec'
    }

    // Default to desktop for most predictable testing
    return "desktop";
  }

  /**
   * Create a mock Unity instance for testing
   * @param {String} containerId - The ID of the container element
   * @returns {Object} A mock Unity instance object
   */
  mockUnityInstance(containerId) {
    // Create a canvas element to simulate Unity WebGL canvas
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.backgroundColor = "#000";

    // Set a class to help with styling and identifying the mock canvas
    canvas.className = "unity-mock-canvas";

    // Create the mock instance object with properties and methods
    // similar to the actual Unity WebGL instance
    const mockInstance = {
      containerId,
      canvas,
      progress: 0,
      isLoaded: false,
      lastError: null,
      startTime: Date.now(),

      // Module properties similar to Unity's Module object
      Module: {
        TOTAL_MEMORY: this.currentDevice === "mobile" ? 268435456 : 536870912,
        WebGL: {
          contextAttributes: {
            alpha: false,
            antialias: this.currentDevice !== "mobile",
            depth: true,
            premultipliedAlpha: true,
          },
        },
        maxFPS: this.currentDevice === "mobile" ? 30 : 60,
        companyName: "Windgap Academy",
        productName: "Educational Experience",
        productVersion: "1.0.0",
        streamingAssetsUrl: "StreamingAssets",
        graphicsAPI: ["WebGL 2.0", "WebGL 1.0"],
      },

      // Mock Unity's SendMessage function
      SendMessage: (objectName, methodName, value) => {
        console.log(`[MockUnity] SendMessage to ${objectName}.${methodName}:`, value);

        // Special case for performance logging
        if (objectName === "PerformanceLogger" && methodName === "LogPerformanceMetrics") {
          this.updateMockPerformanceMetrics();
        }

        // Return a mock promise that resolves after a short delay
        return new Promise((resolve) => setTimeout(resolve, 10));
      },

      // Mock Unity's SetFullscreen function
      SetFullscreen: (fullscreen) => {
        console.log(`[MockUnity] Setting fullscreen to ${fullscreen}`);
        // Return a mock promise
        return new Promise((resolve) => setTimeout(() => resolve(fullscreen), 100));
      },

      // Mock Unity's SetTargetFramerate function
      SetTargetFramerate: (fps) => {
        console.log(`[MockUnity] Setting framerate to ${fps}`);
        mockInstance.Module.maxFPS = fps;
        // Simulate the effect of changing framerate
        this.performanceMetrics.fps.current = Math.min(fps, this.performanceMetrics.fps.current);
        this.performanceMetrics.fps.max = fps;
        return fps;
      },

      // Mock Unity's Quit function
      Quit: () => {
        console.log("[MockUnity] Quitting Unity instance");
        this.unityInstances.delete(containerId);
        return new Promise((resolve) => setTimeout(resolve, 50));
      },
    };

    // Store the mock instance in our map
    this.unityInstances.set(containerId, mockInstance);

    return mockInstance;
  }

  /**
   * Update mock performance metrics to simulate changing values
   */
  updateMockPerformanceMetrics() {
    // Update FPS
    const baseFps = this.currentDevice === "mobile" ? 45 : 58;
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5 variation
    this.performanceMetrics.fps.current = Math.max(15, Math.min(60, baseFps + variation));
    this.performanceMetrics.fps.history.push(this.performanceMetrics.fps.current);
    this.performanceMetrics.fps.history.shift();
    this.performanceMetrics.fps.average =
      this.performanceMetrics.fps.history.reduce((a, b) => a + b, 0) /
      this.performanceMetrics.fps.history.length; // Update memory usage
    const memoryIncrease = Math.random() * 2 * 1024 * 1024; // Up to 2MB increase
    this.performanceMetrics.memory.used = Math.min(
      this.performanceMetrics.memory.total,
      this.performanceMetrics.memory.used + memoryIncrease,
    );
    this.performanceMetrics.memory.history.push(this.performanceMetrics.memory.used);
    this.performanceMetrics.memory.history.shift();

    // Update rendering stats with small variations
    this.performanceMetrics.rendering.drawCalls += Math.floor(Math.random() * 3) - 1;
    this.performanceMetrics.rendering.drawCalls = Math.max(
      100,
      this.performanceMetrics.rendering.drawCalls,
    );
  }

  /**
   * Get the current mock performance metrics
   * @returns {Object} Current performance metrics
   */
  getPerformanceMetrics(containerId) {
    if (containerId && this.unityInstances.has(containerId)) {
      // Update metrics for specific instance
      this.updateMockPerformanceMetrics();
    }
    return this.performanceMetrics;
  }

  /**
   * Get all mock responses
   * @returns {Object} All mock response data
   */
  getMockResponse() {
    return this.mockResponses;
  }

  /**
   * Simulate loading progress for testing loading states
   * @param {String} containerId - The ID of the container element
   * @param {Function} progressCallback - Callback function for progress updates
   * @returns {Promise} Promise that resolves when loading completes
   */
  simulateLoading(containerId, progressCallback) {
    return new Promise((resolve, reject) => {
      const instance = this.unityInstances.get(containerId);

      if (!instance) {
        reject(new Error("Instance not found"));
        return;
      }

      let currentProgress = 0;
      const interval = setInterval(() => {
        // Simulate non-linear progress
        currentProgress += (1 - currentProgress) * 0.2;
        instance.progress = currentProgress;

        if (progressCallback && typeof progressCallback === "function") {
          progressCallback(currentProgress);
        }

        if (currentProgress > 0.99) {
          clearInterval(interval);
          instance.isLoaded = true;
          instance.progress = 1;

          if (progressCallback && typeof progressCallback === "function") {
            progressCallback(1);
          }

          resolve(instance);
        }
      }, 500); // Update every 500ms

      // Random chance to simulate an error
      if (Math.random() < 0.05) {
        // 5% chance of error
        const errorIndex = Math.floor(Math.random() * this.mockResponses.errors.length);
        const randomError = this.mockResponses.errors[errorIndex];
        clearInterval(interval);
        instance.lastError = randomError;
        reject(new Error(randomError));
      }
    });
  }
}

// Create singleton instance for testing purposes
const mockWebGLOptimizer = new MockWebGLOptimizer();

/**
 * Get the mock optimizer instance for debugging
 * @returns {MockWebGLOptimizer} The mock optimizer instance
 */
export function __DEBUG_getMockOptimizer() {
  return mockWebGLOptimizer;
}

/**
 * Mock function to test unity-mock.js file
 * @returns {Boolean} Always returns true
 */
export function __TEST_runWebGLOptimizer() {
  console.log("WebGLOptimizer test function called");
  return true;
}

/**
 * Create a mock Unity instance for a container
 * @param {String} containerId - The ID of the container element
 * @returns {Object} A mock Unity instance
 */
export function createMockUnityInstance(containerId) {
  const mockInstance = mockWebGLOptimizer.mockUnityInstance(containerId);

  // If container exists, add the canvas to it
  if (typeof document !== "undefined") {
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(mockInstance.canvas);
    }
  }

  return mockInstance;
}

/**
 * Simulate Unity WebGL loading and provide mock instance
 * @param {HTMLElement} container - The container element
 * @param {Object} config - Unity configuration
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Promise that resolves with mock Unity instance
 */
export function createUnityInstanceMock(container, config, onProgress) {
  const containerId = container.id || `unity-container-${Math.random().toString(36).substr(2, 9)}`;

  if (!container.id) {
    container.id = containerId;
  }

  return mockWebGLOptimizer
    .simulateLoading(containerId, onProgress)
    .then(() => mockWebGLOptimizer.unityInstances.get(containerId));
}

// Export mock implementations that match the real WebGLOptimizer.js exports
export default {
  // Match the exports from the original WebGLOptimizer.js
  optimizeWebGLContext: (canvas, options = {}) => {
    console.log("[MockUnity] Optimizing WebGL context", options);
    return canvas.getContext("2d"); // Return 2d context as a mock
  },

  isMobileDevice: () => {
    // For testing, return based on the mock device type
    return mockWebGLOptimizer.currentDevice === "mobile";
  },

  optimizeMemoryUsage: (unityInstance, options = {}) => {
    console.log("[MockUnity] Optimizing memory usage", options);
    if (unityInstance && unityInstance.Module) {
      unityInstance.Module.TOTAL_MEMORY = options.maxMemory || unityInstance.Module.TOTAL_MEMORY;
    }
    return unityInstance;
  },

  getOptimizedBuildConfig: (buildUrl) => {
    return {
      dataUrl: `${buildUrl}/Build/windgap-academy.data`,
      frameworkUrl: `${buildUrl}/Build/windgap-academy.framework.js`,
      codeUrl: `${buildUrl}/Build/windgap-academy.wasm`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "Windgap Academy",
      productName: "Windgap Academy",
      productVersion: "1.0.0",
      cacheControl: mockWebGLOptimizer.currentDevice === "mobile" ? "must-revalidate" : "immutable",
      showBanner: false,
    };
  },

  applyRuntimeOptimizations: (unityInstance, options = {}) => {
    console.log("[MockUnity] Applying runtime optimizations", options);

    if (options.optimizeForMobile && mockWebGLOptimizer.currentDevice === "mobile") {
      console.log("[MockUnity] Applying mobile optimizations");
      if (unityInstance && typeof unityInstance.SendMessage === "function") {
        unityInstance.SendMessage("WindgapAcademyManager", "SetTextureQuality", "Low");
      }
    }

    return unityInstance;
  },

  createOptimizedUnityLoader: (buildUrl) => {
    console.log("[MockUnity] Creating optimized Unity loader for", buildUrl);

    // Mock the loader functionality
    window.createUnityInstance = createUnityInstanceMock;

    return Promise.resolve();
  },

  enableProgressiveLoading: (unityInstance, options = {}) => {
    console.log("[MockUnity] Enabling progressive loading", options);

    if (unityInstance && unityInstance.Module) {
      unityInstance.Module.streamingAssetsUrl = options.streamingAssetsUrl || "StreamingAssets";
    }

    return unityInstance;
  },

  // Additional mock methods
  getPerformanceMetrics: (containerId) => {
    return mockWebGLOptimizer.getPerformanceMetrics(containerId);
  },

  simulateError: (containerId, errorMessage) => {
    const instance = mockWebGLOptimizer.unityInstances.get(containerId);
    if (instance) {
      instance.lastError = errorMessage || mockWebGLOptimizer.mockResponses.errors[0];
      return true;
    }
    return false;
  },
};

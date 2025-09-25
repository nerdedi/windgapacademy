/**
 * WebGLOptimizer - Utility for optimizing Unity WebGL performance
 *
 * This utility provides functions to optimize the loading, rendering, and
 * performance of Unity WebGL builds within React applications.
 */

/**
 * Configure WebGL context for optimal performance
 * @param {HTMLCanvasElement} canvas - The canvas element for the Unity WebGL context
 * @param {Object} options - Configuration options
 * @returns {WebGLRenderingContext} The optimized WebGL context
 */
export const optimizeWebGLContext = (canvas, options = {}) => {
  const contextOptions = {
    alpha: false, // Disable alpha channel for better performance
    antialias: options.antialias ?? false, // Disable antialiasing by default for better performance
    depth: true,
    failIfMajorPerformanceCaveat: true, // Fail if the system can't provide good performance
    powerPreference: "high-performance",
    premultipliedAlpha: true,
    preserveDrawingBuffer: false, // Better performance when false
    stencil: true,
    ...options.contextOptions,
  };

  try {
    // Try to get WebGL2 context first for better performance
    const gl =
      canvas.getContext("webgl2", contextOptions) ||
      canvas.getContext("webgl", contextOptions) ||
      canvas.getContext("experimental-webgl", contextOptions);

    if (!gl) {
      console.warn("WebGL not supported. Unity experience may not run properly.");
      return null;
    }

    // Apply optimizations
    if (options.optimizeForMobile && isMobileDevice()) {
      applyMobileOptimizations(gl);
    }

    return gl;
  } catch (err) {
    console.error("Error creating WebGL context:", err);
    return null;
  }
};

/**
 * Check if the current device is a mobile device
 * @returns {boolean} True if the current device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Apply mobile-specific WebGL optimizations
 * @param {WebGLRenderingContext} gl - The WebGL context
 */
const applyMobileOptimizations = (gl) => {
  // Enable extension for compressed textures if available (saves memory and bandwidth)
  const ext =
    gl.getExtension("WEBGL_compressed_texture_s3tc") ||
    gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc") ||
    gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc");

  if (!ext) {
    console.warn("Compressed textures not supported. Performance may be reduced on mobile.");
  }
};

/**
 * Optimize Unity WebGL memory usage
 * @param {Object} unityInstance - The Unity instance
 * @param {Object} options - Memory optimization options
 */
export const optimizeMemoryUsage = (unityInstance, options = {}) => {
  if (!unityInstance || !unityInstance.Module) {
    return;
  }

  const module = unityInstance.Module;

  // Set suggested memory limits
  if (options.maxMemory) {
    module.TOTAL_MEMORY = options.maxMemory;
  }

  // Set up garbage collection hint
  if (typeof window !== "undefined" && window.gc) {
    const originalSendMessage = unityInstance.SendMessage;
    unityInstance.SendMessage = (...args) => {
      const result = originalSendMessage.apply(unityInstance, args);

      // Request garbage collection after large messages
      if (args[2] && typeof args[2] === "string" && args[2].length > 10000) {
        setTimeout(() => {
          try {
            window.gc();
          } catch (e) {
            // GC not available
          }
        }, 1000);
      }

      return result;
    };
  }
};

/**
 * Configure Unity WebGL loading and caching settings for better performance
 * @param {string} buildUrl - The URL of the Unity WebGL build
 * @returns {Object} The optimized build configuration
 */
export const getOptimizedBuildConfig = (buildUrl) => {
  const cacheControl = isMobileDevice() ? "must-revalidate" : "immutable";

  return {
    dataUrl: `${buildUrl}/Build/windgap-academy.data`,
    frameworkUrl: `${buildUrl}/Build/windgap-academy.framework.js`,
    codeUrl: `${buildUrl}/Build/windgap-academy.wasm`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Windgap Academy",
    productName: "Windgap Academy",
    productVersion: "1.0.0",
    cacheControl,
    splashScreenStyle: "Dark",
    backgroundColor: "#000000",
    showBanner: false,
  };
};

/**
 * Apply runtime performance optimizations to Unity WebGL
 * @param {Object} unityInstance - The Unity instance
 * @param {Object} options - Performance optimization options
 */
export const applyRuntimeOptimizations = (unityInstance, options = {}) => {
  if (!unityInstance || !window) {
    return;
  }

  // Optimize rendering when tab is not visible
  if (options.throttleOnHidden !== false) {
    let isVisible = true;
    let originalRequestAnimationFrame;

    document.addEventListener("visibilitychange", () => {
      isVisible = document.visibilityState === "visible";

      if (!isVisible) {
        // Save original requestAnimationFrame
        originalRequestAnimationFrame = window.requestAnimationFrame;
        // Throttle frame rate when tab is not visible
        window.requestAnimationFrame = (callback) => {
          return setTimeout(() => callback(Date.now()), 1000 / (options.backgroundFPS || 10));
        };
      } else if (originalRequestAnimationFrame) {
        // Restore original frame rate when tab becomes visible
        window.requestAnimationFrame = originalRequestAnimationFrame;
      }
    });
  }

  // Apply device-specific optimizations
  if (isMobileDevice() && options.optimizeForMobile !== false) {
    // Reduce texture quality on mobile if specified
    if (options.reduceMobileTextureQuality !== false) {
      try {
        unityInstance.SendMessage("WindgapAcademyManager", "SetTextureQuality", "Low");
      } catch (e) {
        console.warn("Could not set texture quality:", e);
      }
    }
  }
};

/**
 * Create a Unity WebGL loader with optimized loading states
 * @param {string} buildUrl - The URL of the Unity WebGL build
 * @returns {HTMLScriptElement} The script element for the Unity loader
 */
export const createOptimizedUnityLoader = (buildUrl) => {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document not available (SSR environment)"));
      return;
    }

    // Check if loader is already loaded
    if (window.createUnityInstance) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `${buildUrl}/Build/windgap-academy.loader.js`;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Unity WebGL loader"));

    document.body.appendChild(script);
  });
};

/**
 * Configure progressive loading for Unity WebGL
 * @param {Object} unityInstance - The Unity instance
 * @param {Object} options - Progressive loading options
 */
export const enableProgressiveLoading = (unityInstance, options = {}) => {
  if (!unityInstance || !unityInstance.Module) {
    return;
  }

  // Configure Unity's file packager for streaming
  const module = unityInstance.Module;
  if (module.streamingAssetsUrl) {
    // Enable streaming mode
    module.streamingAssetsUrl = module.streamingAssetsUrl || "StreamingAssets";
    module.companyName = module.companyName || "Windgap Academy";
    module.productName = module.productName || "Windgap Academy";
    module.productVersion = module.productVersion || "1.0.0";
    module.matchWebGLToCanvasSize = options.matchWebGLToCanvasSize !== false;
  }
};

export default {
  optimizeWebGLContext,
  isMobileDevice,
  optimizeMemoryUsage,
  getOptimizedBuildConfig,
  applyRuntimeOptimizations,
  createOptimizedUnityLoader,
  enableProgressiveLoading,
};

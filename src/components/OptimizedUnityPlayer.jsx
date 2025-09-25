import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WebGLOptimizer from "../utils/WebGLOptimizer";
import "./OptimizedUnityPlayer.css";

/**
 * OptimizedUnityPlayer - A React component for embedding and optimizing Unity WebGL builds
 *
 * This component provides an optimized way to embed Unity WebGL builds in a React application.
 * It includes automatic performance optimizations, responsive sizing, loading states, and
 * error handling.
 *
 * @param {Object} props Component props
 */
const OptimizedUnityPlayer = ({
  buildUrl,
  width = "100%",
  height = "600px",
  devicePixelRatio = window.devicePixelRatio || 1,
  onLoaded,
  onProgress,
  onError,
  onUnityMessage,
  className = "",
  loaderClassName = "",
  errorClassName = "",
  mobileOptimizations = true,
  memorySize = null,
  initialCommands = [],
  responsive = true,
  showLoader = true,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const unityInstanceRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Check if running on a mobile device
  useEffect(() => {
    setIsMobileDevice(WebGLOptimizer.isMobileDevice());
  }, []);

  // Handle Unity messages
  const handleUnityMessage = useCallback(
    (gameObject, method, messageData) => {
      if (!onUnityMessage) return;

      try {
        const data = typeof messageData === "string" ? JSON.parse(messageData) : messageData;
        onUnityMessage(method, data);
      } catch (err) {
        console.error("Failed to parse Unity message:", err);
        onUnityMessage(method, messageData);
      }
    },
    [onUnityMessage],
  );

  // Register global Unity message handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.receiveUnityMessage = handleUnityMessage;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.receiveUnityMessage;
      }
    };
  }, [handleUnityMessage]);

  // Initialize and load Unity WebGL build
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Apply responsive sizing if enabled
    if (responsive) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries.length || !unityInstanceRef.current) return;

        const { width, height } = entries[0].contentRect;
        const unityInstance = unityInstanceRef.current;

        // Only resize if Unity instance is ready
        if (
          unityInstance &&
          unityInstance.Module &&
          typeof unityInstance.Module.setCanvasSize === "function"
        ) {
          unityInstance.Module.setCanvasSize(width, height);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [responsive]);

  // Initialize Unity WebGL
  useEffect(() => {
    // Skip initialization during SSR
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    let unmounted = false;

    const initializeUnity = async () => {
      try {
        // Load Unity WebGL loader script
        await WebGLOptimizer.createOptimizedUnityLoader(buildUrl);

        if (unmounted || !window.createUnityInstance) {
          return;
        }

        // Get optimized build configuration
        const buildConfig = WebGLOptimizer.getOptimizedBuildConfig(buildUrl);

        // Apply device-specific optimizations
        if (mobileOptimizations && WebGLOptimizer.isMobileDevice()) {
          buildConfig.devicePixelRatio = Math.min(devicePixelRatio, 1.5); // Limit DPR on mobile
          buildConfig.matchWebGLToCanvasSize = true;
        } else {
          buildConfig.devicePixelRatio = devicePixelRatio;
        }

        // Create Unity instance
        const unityInstance = await window.createUnityInstance(
          canvasRef.current,
          buildConfig,
          (progress) => {
            setLoadingProgress(progress);
            onProgress?.(progress);
          },
        );

        if (unmounted) {
          unityInstance.Quit();
          return;
        }

        // Store the Unity instance
        unityInstanceRef.current = unityInstance;
        window.unityInstance = unityInstance;

        // Apply optimizations
        WebGLOptimizer.optimizeMemoryUsage(unityInstance, {
          maxMemory: memorySize,
        });

        WebGLOptimizer.applyRuntimeOptimizations(unityInstance, {
          optimizeForMobile: mobileOptimizations,
        });

        WebGLOptimizer.enableProgressiveLoading(unityInstance);

        // Execute initial commands if provided
        if (initialCommands && initialCommands.length) {
          initialCommands.forEach((cmd) => {
            if (cmd && cmd.gameObject && cmd.method) {
              const data = typeof cmd.data === "object" ? JSON.stringify(cmd.data) : cmd.data;
              unityInstance.SendMessage(cmd.gameObject, cmd.method, data);
            }
          });
        }

        setIsLoaded(true);
        onLoaded?.(unityInstance);
      } catch (err) {
        console.error("Failed to initialize Unity WebGL:", err);
        setError(err.message || "Failed to initialize Unity WebGL");
        onError?.(err);
      }
    };

    initializeUnity();

    // Cleanup function
    return () => {
      unmounted = true;

      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
        } catch (e) {
          console.error("Error quitting Unity instance:", e);
        }

        unityInstanceRef.current = null;
        window.unityInstance = null;
      }
    };
  }, [
    buildUrl,
    devicePixelRatio,
    mobileOptimizations,
    memorySize,
    onLoaded,
    onProgress,
    onError,
    initialCommands,
  ]);

  // Send message to Unity
  const sendMessage = useCallback((gameObject, method, data) => {
    if (!unityInstanceRef.current) return false;

    try {
      const message = typeof data === "object" ? JSON.stringify(data) : data;
      unityInstanceRef.current.SendMessage(gameObject, method, message);
      return true;
    } catch (err) {
      console.error("Failed to send message to Unity:", err);
      return false;
    }
  }, []);

  // Expose the sendMessage function to parent components
  React.useImperativeHandle(React.createRef(), () => ({
    sendMessage,
    unityInstance: unityInstanceRef.current,
    canvas: canvasRef.current,
  }));

  return (
    <div
      ref={containerRef}
      className={`unity-player-container ${className}`}
      style={{ width, height, position: "relative" }}
    >
      {/* Loading indicator */}
      {!isLoaded && !error && showLoader && (
        <div className={`unity-loading ${loaderClassName}`}>
          <div className="unity-loader-inner">
            <div className="unity-loader-spinner"></div>
            <div className="unity-loader-progress-container">
              <div className="unity-loader-progress-bar">
                <div
                  className="unity-loader-progress-fill"
                  style={{ width: `${loadingProgress * 100}%` }}
                ></div>
              </div>
              <div className="unity-loader-progress-text">{Math.round(loadingProgress * 100)}%</div>
            </div>
            <div className="unity-loader-status">Loading WebGL Experience...</div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className={`unity-error-message ${errorClassName}`}>
          <div className="unity-error-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
                fill="#FF5252"
              />
            </svg>
          </div>
          <div className="unity-error-content">
            <h3>Failed to load Unity WebGL experience</h3>
            <p>{error}</p>
            <div className="unity-error-help">
              <p>Please try:</p>
              <ul>
                <li>Using a modern browser (Chrome, Firefox, Edge, Safari)</li>
                <li>Enabling WebGL in your browser settings</li>
                <li>Updating your graphics drivers</li>
                <li>Using a device with WebGL support</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Unity canvas */}
      <canvas
        ref={canvasRef}
        className="unity-canvas"
        style={{
          width: "100%",
          height: "100%",
          display: isLoaded ? "block" : "none",
        }}
      />
    </div>
  );
};

OptimizedUnityPlayer.propTypes = {
  buildUrl: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  devicePixelRatio: PropTypes.number,
  onLoaded: PropTypes.func,
  onProgress: PropTypes.func,
  onError: PropTypes.func,
  onUnityMessage: PropTypes.func,
  className: PropTypes.string,
  loaderClassName: PropTypes.string,
  errorClassName: PropTypes.string,
  mobileOptimizations: PropTypes.bool,
  memorySize: PropTypes.number,
  initialCommands: PropTypes.arrayOf(
    PropTypes.shape({
      gameObject: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      data: PropTypes.any,
    }),
  ),
  responsive: PropTypes.bool,
  showLoader: PropTypes.bool,
};

export default OptimizedUnityPlayer;

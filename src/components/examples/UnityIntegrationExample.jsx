import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

// Import Unity integration utilities
import { sendToUnity } from "../../unity-integration/UnityBridge";
import WebGLOptimizer from "../../utils/WebGLOptimizer";

// Import UI components
import OptimizedUnityPlayer from "../OptimizedUnityPlayer";
import PerformanceDashboard from "../PerformanceDashboard/PerformanceDashboard";
import ErrorAlert from "../ui/ErrorAlert";
import LoadingSpinner from "../ui/LoadingSpinner";

// Import styles
import "./UnityIntegrationExample.css";

/**
 * UnityIntegrationExample - A comprehensive example component for Unity WebGL integration
 *
 * This component demonstrates best practices for integrating Unity WebGL into React applications,
 * including authentication, optimization, loading states, error handling, messaging,
 * and performance monitoring.
 *
 * Features demonstrated:
 * - Unity WebGL loading with progress feedback
 * - Authentication integration
 * - Two-way communication with Unity
 * - Device-specific optimizations
 * - Performance monitoring
 * - Error handling and fallbacks
 * - Responsive design
 * - Animation and transitions
 *
 * @param {Object} props Component props
 */
const UnityIntegrationExample = ({
  buildUrl,
  width = "100%",
  height = "600px",
  showPerformanceMetrics = false,
  showControls = true,
  unityLoaderPath = "unity/loader.js",
  customCommands = [],
}) => {
  // Refs
  const containerRef = useRef(null);
  const unityInstanceRef = useRef(null);

  // User authentication state
  const { currentUser } = useAuth();

  // Component state
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");
  const [perfMetrics, setPerfMetrics] = useState({
    fps: 0,
    memory: {
      used: 0,
      total: 0,
    },
    drawCalls: 0,
  });
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("experience"); // 'experience', 'performance', 'messages'

  // Detect device type on component mount
  useEffect(() => {
    const isMobile = WebGLOptimizer.isMobileDevice();
    setDeviceType(isMobile ? "mobile" : "desktop");
  }, []);

  // Handle messages coming from Unity
  const handleUnityMessage = useCallback((method, data) => {
    // Add message to message history
    setMessages((prev) => [...prev, { time: new Date(), method, data }].slice(-50));

    // Handle performance metrics if they're being sent
    if (method === "PerformanceMetrics") {
      setPerfMetrics((prevMetrics) => ({
        ...prevMetrics,
        ...data,
      }));
    }

    console.log(`Unity message received - ${method}:`, data);
  }, []);

  // Send a test message to Unity
  const sendTestMessage = useCallback(() => {
    if (!isUnityReady) return;

    const testData = {
      timestamp: new Date().toISOString(),
      user: currentUser?.email || "guest",
      testValue: Math.floor(Math.random() * 100),
    };

    sendToUnity("GameManager", "ReceiveFromReact", testData);

    // Add to message log
    setMessages((prev) =>
      [
        ...prev,
        {
          time: new Date(),
          method: "ReceiveFromReact",
          data: testData,
          direction: "outgoing",
        },
      ].slice(-50),
    );
  }, [isUnityReady, currentUser]);

  // Handle Unity player loading
  const handleLoaded = useCallback(
    (unityInstance) => {
      unityInstanceRef.current = unityInstance;
      setIsUnityReady(true);
      setLoading(false);

      // If user is logged in, send credentials to Unity
      if (currentUser) {
        sendToUnity("AuthenticationManager", "SetUserInfo", {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          isAuthenticated: true,
        });
      }

      // Start performance monitoring
      perfMetrics.startMonitoring(unityInstance, (metrics) => {
        setPerfMetrics(metrics);
      });

      // Execute any custom commands provided via props
      customCommands.forEach((cmd) => {
        if (cmd.gameObject && cmd.method) {
          sendToUnity(cmd.gameObject, cmd.method, cmd.data || null);
        }
      });
    },
    [currentUser, customCommands, perfMetrics],
  );

  // Handle Unity loading progress
  const handleProgress = useCallback((progress) => {
    setLoadProgress(progress);
  }, []);

  // Handle Unity errors
  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (unityInstanceRef.current) {
        perfMetrics.stopMonitoring();

        // If the Unity instance has a Quit method, use it
        if (typeof unityInstanceRef.current.Quit === "function") {
          unityInstanceRef.current.Quit();
        }
      }
    };
  }, [perfMetrics]);

  // Render loading state
  const renderLoading = () => (
    <motion.div
      className="unity-loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner size="large" />
      <div className="unity-loading-progress">
        <div className="unity-loading-bar">
          <div className="unity-loading-bar-fill" style={{ width: `${loadProgress * 100}%` }} />
        </div>
        <div className="unity-loading-text">
          Loading Unity Experience... {Math.round(loadProgress * 100)}%
        </div>
      </div>
    </motion.div>
  );

  // Render error state
  const renderError = () => (
    <motion.div className="unity-error-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ErrorAlert
        title="Unity WebGL Error"
        message={error || "Failed to load Unity WebGL experience."}
      />
      <p className="unity-error-help">
        Try refreshing the page or using a different browser. If the problem persists, please
        contact support.
      </p>
      <div className="unity-error-details">
        <h4>Environment Details:</h4>
        <ul>
          <li>Device: {deviceType}</li>
          <li>Browser: {navigator.userAgent}</li>
          <li>
            WebGL: {typeof WebGLRenderingContext !== "undefined" ? "Supported" : "Not Supported"}
          </li>
        </ul>
      </div>
    </motion.div>
  );

  // Render the experience tab content
  const renderExperienceTab = () => (
    <div className="unity-experience-tab">
      {/* The actual Unity Player */}
      <OptimizedUnityPlayer
        buildUrl={buildUrl}
        width={width}
        height={height}
        onLoaded={handleLoaded}
        onProgress={handleProgress}
        onError={handleError}
        onUnityMessage={handleUnityMessage}
        mobileOptimizations={deviceType === "mobile"}
        responsive={true}
      />

      {/* Controls for interacting with Unity */}
      {showControls && isUnityReady && (
        <div className="unity-controls">
          <button className="unity-control-button" onClick={sendTestMessage}>
            Send Test Message to Unity
          </button>

          {/* Optimization toggles */}
          <div className="unity-optimization-toggles">
            <label>
              <input
                type="checkbox"
                checked={deviceType === "mobile"}
                onChange={() => setDeviceType((prev) => (prev === "mobile" ? "desktop" : "mobile"))}
              />
              Mobile Optimizations
            </label>
          </div>
        </div>
      )}
    </div>
  );

  // Render the performance tab content
  const renderPerformanceTab = () => (
    <div className="unity-performance-tab">
      <PerformanceDashboard metrics={perfMetrics} />
    </div>
  );

  // Render the messages tab content
  const renderMessagesTab = () => (
    <div className="unity-messages-tab">
      <h3>Unity Communication Log</h3>
      <div className="unity-message-list">
        {messages.length === 0 ? (
          <p className="unity-no-messages">
            No messages yet. Interact with the Unity experience to see communication.
          </p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`unity-message ${msg.direction || "incoming"}`}>
              <div className="unity-message-time">{msg.time.toLocaleTimeString()}</div>
              <div className="unity-message-method">{msg.method}</div>
              <div className="unity-message-data">
                {typeof msg.data === "object"
                  ? JSON.stringify(msg.data, null, 2)
                  : String(msg.data)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main render method
  return (
    <div className="unity-integration-example" ref={containerRef}>
      <div className="unity-header">
        <h2>Unity WebGL Integration Example</h2>
        <div className="unity-device-badge">
          Device: <span>{deviceType}</span>
        </div>
      </div>

      {/* Show loading or error states */}
      <AnimatePresence>
        {loading && renderLoading()}
        {error && renderError()}
      </AnimatePresence>

      {/* Main content when loaded successfully */}
      {!loading && !error && (
        <div className="unity-content">
          {/* Tab navigation */}
          <div className="unity-tabs">
            <button
              className={`unity-tab ${activeTab === "experience" ? "active" : ""}`}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button
              className={`unity-tab ${activeTab === "performance" ? "active" : ""}`}
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </button>
            <button
              className={`unity-tab ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              Messages {messages.length > 0 && <span>({messages.length})</span>}
            </button>
          </div>

          {/* Tab content */}
          <div className="unity-tab-content">
            {activeTab === "experience" && renderExperienceTab()}
            {activeTab === "performance" && renderPerformanceTab()}
            {activeTab === "messages" && renderMessagesTab()}
          </div>
        </div>
      )}

      {/* User authentication indicator */}
      <div className="unity-auth-status">
        {currentUser ? (
          <span className="unity-logged-in">Logged in as: {currentUser.email}</span>
        ) : (
          <span className="unity-logged-out">Not logged in (Guest Mode)</span>
        )}
      </div>
    </div>
  );
};

// PropTypes for documentation and validation
UnityIntegrationExample.propTypes = {
  /** URL to the Unity build JSON file */
  buildUrl: PropTypes.string.isRequired,
  /** Width of the Unity container (px or %) */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Height of the Unity container (px or %) */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Whether to show performance metrics */
  showPerformanceMetrics: PropTypes.bool,
  /** Whether to show control buttons */
  showControls: PropTypes.bool,
  /** Path to Unity loader script */
  unityLoaderPath: PropTypes.string,
  /** Custom commands to send to Unity on initialization */
  customCommands: PropTypes.arrayOf(
    PropTypes.shape({
      gameObject: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      data: PropTypes.any,
    }),
  ),
};

export default UnityIntegrationExample;

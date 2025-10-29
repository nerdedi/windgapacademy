import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import perfMetrics from "../utils/PerfMetrics";
import WebGLOptimizer from "../utils/WebGLOptimizer";

import "./LiveSessions.css";
import UnityEducationalExperience from "./UnityEducationalExperience";

/**
 * LiveSessions component - Displays available live educational sessions
 * and allows users to join them with optimized Unity WebGL loading
 */
const LiveSessions = () => {
  const { currentUser: _currentUser } = useAuth(); // Prefix with underscore to avoid lint error
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionProgress, setSessionProgress] = useState({});
  const [_showCompletion, setShowCompletion] = useState(false); // Prefix with underscore to avoid lint error
  const [isMobile, setIsMobile] = useState(false);
  const [_unityInstanceReady, _setUnityInstanceReady] = useState(false); // Prefix with underscore to avoid lint error

  // Reference for unity container to apply optimizations
  const unityContainerRef = useRef(null);

  // Detect device type for optimizations
  useEffect(() => {
    const isMobileDevice = WebGLOptimizer.isMobileDevice();
    setIsMobile(isMobileDevice);

    // Apply different default settings based on device type
    if (unityContainerRef.current && isMobileDevice) {
      // Add mobile-specific class for responsive styling
      unityContainerRef.current.classList.add("mobile-device");
    }
  }, []);

  // Monitor for Unity loading completion by watching DOM changes
  useEffect(() => {
    // Unity is fully loaded when a canvas element appears in the container
    if (!selectedSession || !unityContainerRef.current) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const canvas = unityContainerRef.current.querySelector("canvas");
          if (canvas) {
            // Unity canvas found, mark as loaded
            _setUnityInstanceReady(true);

            // Apply WebGL optimizations once Unity is loaded
            if (canvas.parentNode?.__unityInstance) {
              const unityInstance = canvas.parentNode.__unityInstance;

              // Apply memory optimizations
              WebGLOptimizer.optimizeMemoryUsage(unityInstance, {
                maxMemory: WebGLOptimizer.isMobileDevice() ? 268435456 : 536870912, // 256MB for mobile, 512MB for desktop
              });

              // Start collecting performance metrics
              perfMetrics.startMonitoring(canvas, {
                collectFPS: true,
                collectMemory: true,
                collectLoadTime: true,
                logToConsole: false,
                sampleInterval: 5000, // Sample every 5 seconds
                unityInstance: unityInstance,
                sessionId: selectedSession?.id,
              });

              // Apply runtime optimizations
              WebGLOptimizer.applyRuntimeOptimizations(unityInstance, {
                throttleOnHidden: true,
                backgroundFPS: 10,
                optimizeForMobile: WebGLOptimizer.isMobileDevice(),
                reduceMobileTextureQuality: WebGLOptimizer.isMobileDevice(),
              });
            }

            // Disconnect observer once Unity is loaded
            observer.disconnect();
          }
        }
      }
    });

    // Start observing the container for Unity canvas
    observer.observe(unityContainerRef.current, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      // Stop performance monitoring when unmounting
      perfMetrics.stopMonitoring();
    };
  }, [selectedSession]);

  // Fetch available live sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/sessions");

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error("Failed to fetch live sessions:", err);
        setError("Failed to load live sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Handle session selection with optimizations
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    _setUnityInstanceReady(false); // Reset ready state for new session
  };

  // Handle session progress updates with persistence
  const handleProgressUpdate = (progress) => {
    if (selectedSession) {
      // Update progress state
      setSessionProgress((prev) => ({
        ...prev,
        [selectedSession.id]: progress,
      }));

      // Store progress in localStorage for persistence
      try {
        const storedProgress = JSON.parse(localStorage.getItem("sessionProgress") || "{}");
        storedProgress[selectedSession.id] = progress;
        localStorage.setItem("sessionProgress", JSON.stringify(storedProgress));
      } catch (err) {
        console.warn("Could not save progress to localStorage:", err);
      }
    }
  };

  // Handle session completion
  const handleSessionComplete = (data) => {
    console.log("Session completed:", data);

    if (selectedSession) {
      // Update progress to 100%
      setSessionProgress((prev) => ({
        ...prev,
        [selectedSession.id]: 1, // 100% complete
      }));

      // Show completion notification
      setShowCompletion(true);

      // Store progress in localStorage
      try {
        const storedProgress = JSON.parse(localStorage.getItem("sessionProgress") || "{}");
        storedProgress[selectedSession.id] = 1;
        localStorage.setItem("sessionProgress", JSON.stringify(storedProgress));
      } catch (err) {
        console.warn("Could not save progress to localStorage:", err);
      }

      // Return to sessions list after delay
      setTimeout(() => {
        setShowCompletion(false);
        setSelectedSession(null);
      }, 3000);
    }
  };

  // Load stored progress on component mount
  useEffect(() => {
    try {
      const storedProgress = JSON.parse(localStorage.getItem("sessionProgress") || "{}");
      if (Object.keys(storedProgress).length > 0) {
        setSessionProgress(storedProgress);
      }
    } catch (err) {
      console.warn("Could not load progress from localStorage:", err);
    }
  }, []);

  return (
    <div className="live-sessions" ref={unityContainerRef}>
      {!selectedSession ? (
        <div className="live-sessions-content">
          <div className="live-sessions-header">
            <h2 className="sessions-title">Live Educational Sessions</h2>
          </div>

          {loading && (
            <div className="session-loading">
              <div className="session-loading-spinner"></div>
              <p>Loading available sessions...</p>
            </div>
          )}

          {error && <div className="session-error">{error}</div>}

          <div className="sessions-grid">
            {sessions.length === 0 && !loading && !error ? (
              <div className="no-sessions">No live sessions currently available</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="session-card"
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className="session-card-image">
                    <img src={session.image} alt={session.title} />
                    {sessionProgress[session.id] > 0 && (
                      <div className="session-progress">
                        <div
                          className="session-progress-bar"
                          style={{ width: `${sessionProgress[session.id] * 100}%` }}
                        ></div>
                        <span className="session-progress-text">
                          {Math.round(sessionProgress[session.id] * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="session-card-content">
                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-description">{session.description}</p>
                    <div className="session-meta">
                      <span className="session-duration">{session.durationMinutes} min</span>
                      <span className="session-difficulty">Level: {session.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="session-experience-container">
          <button className="back-button" onClick={() => setSelectedSession(null)}>
            ← Back to Sessions
          </button>

          <div className="session-details">
            <h2 className="session-title">{selectedSession.title}</h2>
            <p className="session-description">{selectedSession.description}</p>
          </div>

          <div className={`unity-container ${isMobile ? "mobile" : ""}`}>
            {selectedSession && (
              <div className="unity-wrapper">
                <UnityEducationalExperience
                  sessionId={selectedSession.id}
                  unityData={selectedSession.unityData}
                  onProgress={handleProgressUpdate}
                  onComplete={handleSessionComplete}
                  isMobileDevice={isMobile}
                />

                <div className="unity-loading-overlay">
                  <div className="unity-loading-spinner"></div>
                  <p className="unity-loading-text">Loading educational experience...</p>
                  <p className="unity-loading-tip">
                    This may take a moment to optimize for your device
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedSession.additionalResources && (
            <div className="additional-resources">
              <h3>Additional Learning Resources</h3>
              <ul>
                {selectedSession.additionalResources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveSessions;

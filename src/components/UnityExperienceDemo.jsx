import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProgressData, saveProgressData } from "../utils/ProgressService";
import OptimizedUnityPlayer from "./OptimizedUnityPlayer";
import ErrorAlert from "./ui/ErrorAlert";
import LoadingSpinner from "./ui/LoadingSpinner";
import "./UnityExperienceDemo.css";

/**
 * UnityExperienceDemo - Example component showing how to integrate Unity experiences
 *
 * This component demonstrates a complete example of Unity WebGL integration
 * with authentication, progress tracking, and optimized WebGL performance.
 */
const UnityExperienceDemo = ({
  experienceId,
  lessonId,
  title = "Educational Experience",
  description = "",
  buildUrl = "/unity-integration/builds/default-experience",
  width = "100%",
  height = "600px",
}) => {
  const { currentUser } = useAuth();
  const playerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [status, setStatus] = useState("loading");
  const [lastActivity, setLastActivity] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Track component mount status for async operations
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load previous progress when component mounts
  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser || !experienceId) return;

      try {
        setLoading(true);
        const progressData = await getProgressData(currentUser.uid, experienceId, lessonId);

        if (isMounted.current) {
          if (progressData) {
            setProgress(progressData.progress || 0);
            setAchievements(progressData.achievements || []);
            setLastActivity(progressData.lastActivity || null);
            setStatus("loaded");
          } else {
            // No previous progress found
            setProgress(0);
            setStatus("new");
          }
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
        if (isMounted.current) {
          setError("Failed to load progress data");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadProgress();
  }, [currentUser, experienceId, lessonId]);

  // Handle Unity loading
  const handleUnityLoaded = () => {
    setLoading(false);
    setStatus("ready");

    // If we have previous progress, send it to Unity
    if (progress > 0 && playerRef.current) {
      playerRef.current.sendMessage("ProgressManager", "LoadProgress", {
        progress,
        userId: currentUser?.uid,
        experienceId,
        lessonId,
      });
    }
  };

  // Handle Unity loading progress
  const handleLoadingProgress = () => {
    // Optional: Update loading bar
  };

  // Handle Unity error
  const handleError = (err) => {
    console.error("Unity WebGL error:", err);
    setError(`Failed to load Unity experience: ${err.message || "Unknown error"}`);
    setLoading(false);
    setStatus("error");
  };

  // Handle messages from Unity
  const handleUnityMessage = (method, data) => {
    switch (method) {
      case "ProgressUpdate":
        if (data && typeof data.progress === "number") {
          const newProgress = data.progress;
          setProgress(newProgress);

          // Save progress to database
          if (currentUser) {
            saveProgressData(currentUser.uid, experienceId, lessonId, {
              progress: newProgress,
              lastUpdated: new Date().toISOString(),
              lessonId,
              experienceId,
            });
          }
        }
        break;

      case "ExperienceCompleted":
        handleExperienceCompleted(data);
        break;

      case "AchievementUnlocked":
        if (data && data.id) {
          const newAchievement = {
            id: data.id,
            title: data.title || "Achievement Unlocked",
            description: data.description || "",
            unlockedAt: new Date().toISOString(),
          };

          setAchievements((prev) => {
            // Check if this achievement is already in the array
            if (prev.some((a) => a.id === data.id)) {
              return prev;
            }
            return [...prev, newAchievement];
          });

          // Update achievements in database
          if (currentUser) {
            saveProgressData(
              currentUser.uid,
              experienceId,
              lessonId,
              {
                achievements: [...achievements, newAchievement],
              },
              true,
            ); // Merge with existing data
          }
        }
        break;

      case "ActivityTracked":
        if (data) {
          const activity = {
            type: data.type || "unknown",
            details: data.details || {},
            timestamp: new Date().toISOString(),
          };

          setLastActivity(activity);

          // Update activity in database
          if (currentUser) {
            saveProgressData(
              currentUser.uid,
              experienceId,
              lessonId,
              {
                lastActivity: activity,
              },
              true,
            ); // Merge with existing data
          }
        }
        break;

      default:
        // Handle other message types if needed
        break;
    }
  };

  // Handle experience completion
  const handleExperienceCompleted = (data) => {
    setProgress(1); // 100% complete
    setStatus("completed");

    // Save completion data
    if (currentUser) {
      saveProgressData(currentUser.uid, experienceId, lessonId, {
        progress: 1,
        completed: true,
        completedAt: new Date().toISOString(),
        score: data?.score,
        timeSpent: data?.timeSpent,
        lessonId,
        experienceId,
      });
    }

    // Show completion UI or trigger callback
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Send a message to Unity
  const sendMessageToUnity = (gameObject, method, data) => {
    if (playerRef.current) {
      return playerRef.current.sendMessage(gameObject, method, data);
    }
    return false;
  };

  return (
    <div className={`unity-experience-demo ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="unity-experience-header">
        <div className="unity-experience-info">
          <h2>{title}</h2>
          {description && <p className="unity-experience-description">{description}</p>}
        </div>

        <div className="unity-experience-actions">
          <button
            className="unity-action-button fullscreen-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="unity-experience-content">
        <div className="unity-player-wrapper" style={{ height }}>
          {loading && (
            <div className="unity-loading-overlay">
              <LoadingSpinner />
              <p>Loading educational experience...</p>
            </div>
          )}

          {error && (
            <div className="unity-error-overlay">
              <ErrorAlert message={error} />
              <button className="unity-retry-button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {!error && (
            <OptimizedUnityPlayer
              ref={playerRef}
              buildUrl={buildUrl}
              width={width}
              height={height}
              onLoaded={handleUnityLoaded}
              onProgress={handleLoadingProgress}
              onError={handleError}
              onUnityMessage={handleUnityMessage}
              className={isFullscreen ? "fullscreen" : ""}
              mobileOptimizations={true}
              responsive={true}
              initialCommands={
                currentUser
                  ? [
                      {
                        gameObject: "AuthManager",
                        method: "SetUserData",
                        data: {
                          userId: currentUser.uid,
                          displayName: currentUser.displayName || "Student",
                          email: currentUser.email,
                          isAuthenticated: true,
                        },
                      },
                      {
                        gameObject: "LessonManager",
                        method: "LoadLesson",
                        data: {
                          lessonId,
                          experienceId,
                        },
                      },
                    ]
                  : []
              }
            />
          )}
        </div>

        <div className="unity-experience-sidebar">
          <div className="unity-progress-section">
            <h3>Your Progress</h3>
            <div className="unity-progress-bar">
              <div
                className="unity-progress-fill"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="unity-progress-label">{Math.round(progress * 100)}% Complete</div>

            {status === "completed" && (
              <div className="unity-completion-badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Experience Completed!</span>
              </div>
            )}
          </div>

          {achievements.length > 0 && (
            <div className="unity-achievements-section">
              <h3>Achievements</h3>
              <ul className="unity-achievements-list">
                {achievements.map((achievement) => (
                  <li key={achievement.id} className="unity-achievement-item">
                    <div className="unity-achievement-icon">🏆</div>
                    <div className="unity-achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lastActivity && (
            <div className="unity-activity-section">
              <h3>Recent Activity</h3>
              <div className="unity-activity-item">
                <div className="unity-activity-type">{lastActivity.type}</div>
                <div className="unity-activity-time">
                  {new Date(lastActivity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          <div className="unity-controls-section">
            <h3>Controls</h3>
            <div className="unity-controls-grid">
              <button
                className="unity-control-button"
                onClick={() => sendMessageToUnity("GameManager", "Pause", true)}
              >
                Pause
              </button>
              <button
                className="unity-control-button"
                onClick={() => sendMessageToUnity("GameManager", "Resume", true)}
              >
                Resume
              </button>
              <button
                className="unity-control-button"
                onClick={() => sendMessageToUnity("GameManager", "Restart", true)}
              >
                Restart
              </button>
              <button
                className="unity-control-button"
                onClick={() => sendMessageToUnity("SettingsManager", "ToggleSound", true)}
              >
                Toggle Sound
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UnityExperienceDemo.propTypes = {
  experienceId: PropTypes.string.isRequired,
  lessonId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  buildUrl: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UnityExperienceDemo;

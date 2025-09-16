import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./EnhancedUnityPlayer.css";

/**
 * Enhanced UnityPlayer component for embedding Unity WebGL builds in the Windgap Academy platform
 * with improved bidirectional communication for animations and games
 * @param {Object} props - Component properties
 * @param {string} props.buildUrl - Base URL to the Unity WebGL build directory
 * @param {string} props.loaderUrl - URL to the Unity loader JavaScript file
 * @param {string} props.dataUrl - URL to the Unity data file
 * @param {string} props.frameworkUrl - URL to the Unity framework JavaScript file
 * @param {string} props.codeUrl - URL to the Unity WebAssembly code file
 * @param {number} props.width - Width of the Unity container (default: 960)
 * @param {number} props.height - Height of the Unity container (default: 600)
 * @param {Function} props.onScoreUpdate - Callback when a score is reported from Unity
 * @param {Function} props.onLevelComplete - Callback when a level is completed in Unity
 * @param {Function} props.onAnimationComplete - Callback when an animation completes in Unity
 * @param {Function} props.onUnityLoaded - Callback when Unity has finished loading
 * @param {Function} props.onUnityMessage - Generic callback for any message from Unity
 * @param {Object} props.initialState - Initial state to pass to Unity
 */
const EnhancedUnityPlayer = ({
  buildUrl,
  loaderUrl = `${buildUrl}/Build/UnityLoader.js`,
  dataUrl = null,
  frameworkUrl = null,
  codeUrl = null,
  width = 960,
  height = 600,
  onScoreUpdate = () => {},
  onLevelComplete = () => {},
  onAnimationComplete = () => {},
  onUnityLoaded = () => {},
  onUnityMessage = () => {},
  initialState = {},
}) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unityInstance, setUnityInstance] = useState(null);

  // Determine if we're using a JSON configuration or direct URLs
  const useJsonConfig = !dataUrl || !frameworkUrl || !codeUrl;

  // Handler for receiving messages from Unity
  const handleUnityMessage = useCallback(
    (actionType, jsonData) => {
      try {
        const data = JSON.parse(jsonData);
        console.log(`[REACT] Received from Unity: ${actionType}`, data);

        // Handle specific message types
        switch (actionType) {
          case "SCORE_UPDATE":
            onScoreUpdate(data.score, data.context);
            break;
          case "LEVEL_COMPLETE":
            onLevelComplete(data.level, data.stats);
            break;
          case "ANIMATION_COMPLETE":
            onAnimationComplete(data.animationName, data.character);
            break;
          default:
            // Forward all messages to the generic handler
            onUnityMessage(actionType, data);
        }
      } catch (error) {
        console.error("Error processing Unity message:", error);
      }
    },
    [onScoreUpdate, onLevelComplete, onAnimationComplete, onUnityMessage],
  );

  // Method to send messages to Unity
  const sendMessageToUnity = useCallback(
    (gameObject, method, parameter = null) => {
      if (unityInstance && typeof unityInstance.SendMessage === "function") {
        try {
          const paramStr =
            parameter !== null
              ? typeof parameter === "object"
                ? JSON.stringify(parameter)
                : parameter.toString()
              : "";

          console.log(`[REACT] Sending to Unity: ${gameObject}.${method}(${paramStr})`);
          unityInstance.SendMessage(gameObject, method, paramStr);
          return true;
        } catch (error) {
          console.error("Error sending message to Unity:", error);
          return false;
        }
      }
      return false;
    },
    [unityInstance],
  );

  // Helper methods for common Unity interactions
  const startAnimation = useCallback(
    (characterName, animationName, parameters = {}) => {
      return sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "START_ANIMATION",
        characterName,
        animationName,
        parameters,
      });
    },
    [sendMessageToUnity],
  );

  const setCharacter = useCallback(
    (characterName, options = {}) => {
      return sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "SET_CHARACTER",
        characterName,
        options,
      });
    },
    [sendMessageToUnity],
  );

  const startGame = useCallback(
    (gameType, options = {}) => {
      return sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "START_GAME",
        gameType,
        options,
      });
    },
    [sendMessageToUnity],
  );

  const setGameState = useCallback(
    (state) => {
      return sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
        actionType: "SET_GAME_STATE",
        state,
      });
    },
    [sendMessageToUnity],
  );

  useEffect(() => {
    let unmounted = false;
    let unity = null;

    // Set up the Unity message handler in the global context
    window.unityMessageHandler = handleUnityMessage;

    // Load Unity content
    const loadUnity = async () => {
      try {
        // Load the Unity loader script
        const script = document.createElement("script");
        script.src = loaderUrl;
        script.async = true;

        // Handle the script loading
        script.onload = () => {
          if (unmounted) return;

          // Unity config for loading
          let unityConfig = {
            dataUrl: dataUrl,
            frameworkUrl: frameworkUrl,
            codeUrl: codeUrl,
            streamingAssetsUrl: "StreamingAssets",
            companyName: "Windgap Academy",
            productName: "Windgap Academy Game",
            productVersion: "1.0.0",
          };

          // If we're using a JSON config instead of direct URLs
          if (useJsonConfig) {
            // Load the config from JSON
            fetch(`${buildUrl}/Build/config.json`)
              .then((response) => response.json())
              .then((config) => {
                if (unmounted) return;

                // Initialize Unity with the config
                if (window.createUnityInstance) {
                  window
                    .createUnityInstance(containerRef.current, config, (progress) =>
                      setLoadingProgress(progress),
                    )
                    .then((instance) => {
                      if (unmounted) return;
                      setUnityInstance(instance);
                      setIsLoaded(true);
                      onUnityLoaded(instance);

                      // Send initial state if provided
                      if (initialState && Object.keys(initialState).length > 0) {
                        setTimeout(() => {
                          sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
                            actionType: "INITIALIZE",
                            state: initialState,
                          });
                        }, 1000); // Give Unity a second to initialize fully
                      }
                    });
                }
              })
              .catch((error) => {
                console.error("Error loading Unity config:", error);
              });
          } else {
            // Direct initialization with provided URLs
            if (window.createUnityInstance) {
              window
                .createUnityInstance(containerRef.current, unityConfig, (progress) =>
                  setLoadingProgress(progress),
                )
                .then((instance) => {
                  if (unmounted) return;
                  setUnityInstance(instance);
                  setIsLoaded(true);
                  onUnityLoaded(instance);

                  // Send initial state if provided
                  if (initialState && Object.keys(initialState).length > 0) {
                    setTimeout(() => {
                      sendMessageToUnity("ReactBridgeManager", "ReceiveFromReact", {
                        actionType: "INITIALIZE",
                        state: initialState,
                      });
                    }, 1000); // Give Unity a second to initialize fully
                  }
                });
            }
          }
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Unity:", error);
      }
    };

    loadUnity();

    // Clean up
    return () => {
      unmounted = true;

      // Remove the global handler
      if (window.unityMessageHandler === handleUnityMessage) {
        delete window.unityMessageHandler;
      }

      // Clean up Unity instance
      if (unityInstance) {
        unityInstance.Quit();
      }
    };
  }, [
    buildUrl,
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
    useJsonConfig,
    handleUnityMessage,
    onUnityLoaded,
    initialState,
    unityInstance,
    sendMessageToUnity,
  ]);

  return (
    <div className="unity-player-container">
      {!isLoaded && (
        <div className="unity-loading">
          <div className="unity-progress-bar">
            <div className="unity-progress-fill" style={{ width: `${loadingProgress * 100}%` }} />
          </div>
          <div className="unity-loading-text">Loading... {Math.round(loadingProgress * 100)}%</div>
        </div>
      )}
      <div
        ref={containerRef}
        className="unity-canvas-container"
        style={{
          width: width + "px",
          height: height + "px",
          display: isLoaded ? "block" : "none",
        }}
      />
    </div>
  );
};

EnhancedUnityPlayer.propTypes = {
  buildUrl: PropTypes.string.isRequired,
  loaderUrl: PropTypes.string,
  dataUrl: PropTypes.string,
  frameworkUrl: PropTypes.string,
  codeUrl: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onScoreUpdate: PropTypes.func,
  onLevelComplete: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  onUnityLoaded: PropTypes.func,
  onUnityMessage: PropTypes.func,
  initialState: PropTypes.object,
};

export default EnhancedUnityPlayer;

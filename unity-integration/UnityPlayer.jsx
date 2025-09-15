import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./UnityPlayer.css";

/**
 * UnityPlayer component for embedding Unity WebGL builds in the Windgap Academy platform
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
 * @param {Function} props.onUnityLoaded - Callback when Unity has finished loading
 * @param {Object} props.initialState - Initial state to pass to Unity
 */
const UnityPlayer = ({
  buildUrl,
  loaderUrl = `${buildUrl}/Build/UnityLoader.js`,
  dataUrl = null,
  frameworkUrl = null,
  codeUrl = null,
  width = 960,
  height = 600,
  onScoreUpdate = () => {},
  onLevelComplete = () => {},
  onUnityLoaded = () => {},
  initialState = {},
}) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [unityInstance, setUnityInstance] = useState(null);

  // Determine if we're using a JSON configuration or direct URLs
  const useJsonConfig = !dataUrl || !frameworkUrl || !codeUrl;

  useEffect(() => {
    let unmounted = false;
    let unity = null;

    // Load Unity content
    const loadUnity = async () => {
      // Load the Unity loader script
      const script = document.createElement("script");
      script.src = loaderUrl;
      script.async = true;

      script.onload = () => {
        if (unmounted) return;

        // Initialize Unity with JSON config or direct URLs
        if (useJsonConfig) {
          unity = window.UnityLoader.instantiate(
            "unityContainer",
            `${buildUrl}/Build/WebGLBuild.json`,
            {
              onProgress: (instance, progress) => {
                if (unmounted) return;
                setLoadingProgress(progress);
                if (progress === 1) {
                  setIsLoaded(true);
                  setUnityInstance(instance);
                  onUnityLoaded(instance);
                }
              },
            },
          );
        } else {
          // Initialize with direct URLs (Unity 2019.3+)
          createUnityInstance(
            document.getElementById("unityContainer"),
            {
              dataUrl: dataUrl,
              frameworkUrl: frameworkUrl,
              codeUrl: codeUrl,
              streamingAssetsUrl: "StreamingAssets",
              companyName: "Windgap Academy",
              productName: "Windgap Educational Game",
              productVersion: "1.0",
            },
            (progress) => {
              if (unmounted) return;
              setLoadingProgress(progress);
            },
          )
            .then((instance) => {
              if (unmounted) return;
              unity = instance;
              setIsLoaded(true);
              setUnityInstance(instance);
              onUnityLoaded(instance);
            })
            .catch((error) => {
              console.error("Unity content failed to load:", error);
            });
        }
      };

      document.body.appendChild(script);
    };

    if (containerRef.current) {
      loadUnity();
    }

    // Setup message listener for Unity
    const handleMessage = (event) => {
      if (!event.data || typeof event.data !== "object") return;

      // Handle messages from Unity
      if (event.data.type === "UNITY_SCORE") {
        onScoreUpdate(event.data.data.score);
      } else if (event.data.type === "UNITY_LEVEL_COMPLETION") {
        onLevelComplete(event.data.data.levelId, event.data.data.completed);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      unmounted = true;
      window.removeEventListener("message", handleMessage);

      // Clean up Unity instance on unmount
      if (unity) {
        unity.Quit();
      }
    };
  }, [
    buildUrl,
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
    onScoreUpdate,
    onLevelComplete,
    onUnityLoaded,
    useJsonConfig,
  ]);

  // Send message to Unity
  const sendMessageToUnity = (gameObjectName, methodName, parameter) => {
    if (unityInstance && isLoaded) {
      unityInstance.SendMessage(gameObjectName, methodName, parameter);
      return true;
    }
    return false;
  };

  // Send initial state to Unity once loaded
  useEffect(() => {
    if (isLoaded && unityInstance && initialState && Object.keys(initialState).length > 0) {
      sendMessageToUnity("GameManager", "SetInitialState", JSON.stringify(initialState));
    }
  }, [isLoaded, unityInstance, initialState]);

  return (
    <div className="unity-player-container">
      <div
        id="unityContainer"
        ref={containerRef}
        style={{ width, height }}
        className="unity-player"
      />

      {!isLoaded && (
        <div className="unity-loading-overlay">
          <div className="unity-loading-bar">
            <div
              className="unity-loading-bar-fill"
              style={{ width: `${loadingProgress * 100}%` }}
            />
          </div>
          <div className="unity-loading-text">Loading... {Math.round(loadingProgress * 100)}%</div>
        </div>
      )}
    </div>
  );
};

UnityPlayer.propTypes = {
  buildUrl: PropTypes.string.isRequired,
  loaderUrl: PropTypes.string,
  dataUrl: PropTypes.string,
  frameworkUrl: PropTypes.string,
  codeUrl: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onScoreUpdate: PropTypes.func,
  onLevelComplete: PropTypes.func,
  onUnityLoaded: PropTypes.func,
  initialState: PropTypes.object,
};

export default UnityPlayer;

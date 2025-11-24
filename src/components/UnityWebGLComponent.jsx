import React, { useEffect, useRef, useState } from "react";

const UnityWebGLComponent = React.forwardRef(
  ({ buildUrl, width = "100%", height = "600px", onLoaded, onProgress, onError }, ref) => {
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState(null);
    const unityInstanceRef = useRef(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const script = document.createElement("script");
      script.src = `${buildUrl}/Build/windgap-academy.loader.js`;
      script.onload = () => {
        initializeUnity();
      };
      script.onerror = () => {
        setError("Failed to load Unity loader script");
        onError?.("Failed to load Unity loader script");
      };

      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (unityInstanceRef.current) {
          unityInstanceRef.current.Quit();
        }
      };
    }, [buildUrl]);

    const initializeUnity = () => {
      if (!window.createUnityInstance) {
        setError("Unity loader not available");
        return;
      }

      const buildConfig = {
        dataUrl: `${buildUrl}/Build/windgap-academy.data`,
        frameworkUrl: `${buildUrl}/Build/windgap-academy.framework.js`,
        codeUrl: `${buildUrl}/Build/windgap-academy.wasm`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Windgap Academy",
        productName: "Windgap Academy",
        productVersion: "1.0.0",
      };

      window
        .createUnityInstance(canvasRef.current, buildConfig, (progress) => {
          setLoadingProgress(progress);
          onProgress?.(progress);
        })
        .then((unityInstance) => {
          unityInstanceRef.current = unityInstance;
          setIsLoaded(true);
          onLoaded?.();

          // Set up global Unity instance for communication
          window.unityInstance = unityInstance;

          // Set up message handler
          window.unityMessageHandler = (message) => {
            try {
              const parsedMessage = JSON.parse(message);
              console.log("Unity message:", parsedMessage);
              // Handle Unity messages here
            } catch (e) {
              console.error("Failed to parse Unity message:", e);
            }
          };
        })
        .catch((message) => {
          setError(message);
          onError?.(message);
        });
    };

    const sendMessageToUnity = (gameObject, method, data) => {
      if (unityInstanceRef.current && isLoaded) {
        unityInstanceRef.current.SendMessage(gameObject, method, JSON.stringify(data));
      }
    };

    // Expose sendMessageToUnity for parent components
    React.useImperativeHandle(ref, () => ({
      sendMessage: sendMessageToUnity,
    }));

    return (
      <div className="unity-container" style={{ width, height, position: "relative" }}>
        {!isLoaded && !error && (
          <div
            className="unity-loading"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "200px",
                height: "20px",
                backgroundColor: "#e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${loadingProgress * 100}%`,
                  height: "100%",
                  backgroundColor: "#4CAF50",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ margin: 0, color: "#666" }}>
              Loading 3D Experience... {Math.round(loadingProgress * 100)}%
            </p>
          </div>
        )}

        {error && (
          <div
            className="unity-error"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#f44336",
              zIndex: 10,
            }}
          >
            <p>Failed to load Unity experience</p>
            <p style={{ fontSize: "14px", opacity: 0.7 }}>{error}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: isLoaded ? "block" : "none",
            border: "none",
          }}
        />
      </div>
    );
  },
);

UnityWebGLComponent.displayName = "UnityWebGLComponent";

export default UnityWebGLComponent;

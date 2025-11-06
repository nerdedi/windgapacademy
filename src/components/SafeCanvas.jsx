import { Canvas } from "@react-three/fiber";
import PropTypes from "prop-types";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import ThreeErrorBoundary from "./ThreeErrorBoundary";

/**
 * SafeCanvas - A wrapper around @react-three/fiber Canvas with error handling
 * Prevents "Cannot set properties of undefined" errors
 */
const SafeCanvas = ({ children, fallback, onError, ...canvasProps }) => {
  const [isThreeReady, setIsThreeReady] = useState(false);

  // Ensure Three.js is properly initialized
  useEffect(() => {
    try {
      // Initialize Three.js namespace if needed
      if (typeof THREE !== "undefined" && THREE.Object3D) {
        setIsThreeReady(true);
      }
    } catch (e) {
      console.error("Three.js initialization error:", e);
    }
  }, []);

  // Check if WebGL is supported
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  };

  if (!checkWebGLSupport() || !isThreeReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border-2 border-gray-200">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🖥️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {!isThreeReady ? "Loading 3D Engine..." : "WebGL Not Supported"}
          </h3>
          <p className="text-gray-600">
            {!isThreeReady
              ? "Initializing Three.js, please wait..."
              : "Your browser doesn't support WebGL, which is required for 3D graphics."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThreeErrorBoundary fallback={fallback} onError={onError}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="spinner w-12 h-12"></div>
          </div>
        }
      >
        <Canvas
          {...canvasProps}
          onCreated={(state) => {
            try {
              // Ensure proper initialization
              if (state.gl && state.gl.physicallyCorrectLights !== undefined) {
                state.gl.physicallyCorrectLights = true;
              }
              if (state.gl && state.gl.setClearColor) {
                state.gl.setClearColor(0x000000, 0);
              }

              // Call user's onCreated if provided
              if (canvasProps.onCreated) {
                canvasProps.onCreated(state);
              }
            } catch (error) {
              console.error("Canvas initialization error:", error);
            }
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            ...canvasProps.gl,
          }}
          dpr={[1, 2]} // Adaptive pixel ratio
        >
          {children}
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
};

SafeCanvas.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
  onCreated: PropTypes.func,
  gl: PropTypes.object,
};

SafeCanvas.defaultProps = {
  fallback: null,
  onError: null,
  onCreated: null,
  gl: {},
};

export default SafeCanvas;

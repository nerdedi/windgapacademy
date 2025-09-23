import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import BlenderModelLoader from "../utils/BlenderModelLoader";
import WebGLEffectsUtil from "../utils/WebGLEffects";
import "../styles/BlenderModelViewer.css";

/**
 * BlenderModelViewer component
 * A React component for viewing and interacting with Blender models
 * using the BlenderModelLoader utility
 */
const BlenderModelViewer = ({
  modelPath,
  isCharacter = false,
  width = "100%",
  height = "400px",
  backgroundColor = "#1a1a2e",
  initialAnimation = "idle",
  availableAnimations = [],
  showControls = true,
  showEffects = true,
  autoRotate = false,
  scale = 1,
  onLoaded = () => {},
  onError = () => {},
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelLoaderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const modelRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(initialAnimation);
  const [error, setError] = useState(null);

  // Setup THREE.js scene and renderer
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Initialize model loader
    modelLoaderRef.current = new BlenderModelLoader({
      useDraco: false,
      useKTX2: false,
      defaultScale: scale,
      autoPlayAnimation: initialAnimation,
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (modelLoaderRef.current) {
        modelLoaderRef.current.update(0.016); // Approx 60fps
      }

      if (modelRef.current && autoRotate) {
        modelRef.current.scene.rotation.y += 0.005;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (modelLoaderRef.current) {
        modelLoaderRef.current.disposeAll();
      }

      WebGLEffectsUtil.cleanupAll();
    };
  }, [backgroundColor, autoRotate, scale, initialAnimation]);

  // Load the model
  useEffect(() => {
    if (!modelPath || !modelLoaderRef.current || !sceneRef.current) return;

    setIsLoading(true);
    setError(null);

    const modelName = modelPath.split("/").pop().split(".")[0];
    const modelOptions = {
      name: modelName,
      scale: scale,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      isCharacter: isCharacter,
      animations: availableAnimations.reduce((acc, anim) => {
        acc[anim.id] = anim.clipName || anim.id;
        return acc;
      }, {}),
      onProgress: (progress) => {
        setLoadingProgress(Math.floor((progress.loaded / progress.total) * 100));
      },
    };

    modelLoaderRef.current
      .loadModel(modelPath, modelOptions)
      .then((model) => {
        // Clear any existing model
        if (modelRef.current && sceneRef.current) {
          sceneRef.current.remove(modelRef.current.scene);
        }

        // Add new model to scene
        sceneRef.current.add(model.scene);
        modelRef.current = model;

        // Play initial animation
        if (initialAnimation && model.actions[initialAnimation]) {
          modelLoaderRef.current.playAnimation(modelName, initialAnimation);
          setActiveAnimation(initialAnimation);
        }

        setIsLoading(false);
        onLoaded(model);
      })
      .catch((err) => {
        console.error("Error loading model:", err);
        setError("Failed to load model. Please check the console for details.");
        setIsLoading(false);
        onError(err);
      });
  }, [modelPath, scale, isCharacter, availableAnimations, initialAnimation, onLoaded, onError]);

  // Function to play animation
  const playAnimation = (animationId) => {
    if (!modelLoaderRef.current || !modelRef.current) return;

    const modelName = modelRef.current.name;
    const success = modelLoaderRef.current.playAnimation(modelName, animationId);

    if (success) {
      setActiveAnimation(animationId);
    }
  };

  // Function to apply effect
  const applyEffect = (effectType) => {
    if (!modelLoaderRef.current || !modelRef.current) return;

    const modelName = modelRef.current.name;
    modelLoaderRef.current.applyEffect(modelName, effectType);
  };

  return (
    <div className="blender-model-viewer" style={{ width, height }}>
      <div className="model-container" ref={containerRef}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Model: {loadingProgress}%</div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      {showControls && (
        <div className="controls-panel">
          <div className="animations-controls">
            <h4>Animations</h4>
            <div className="animation-buttons">
              {availableAnimations.map((anim) => (
                <button
                  key={anim.id}
                  className={`animation-button ${activeAnimation === anim.id ? "active" : ""}`}
                  onClick={() => playAnimation(anim.id)}
                >
                  {anim.label || anim.id}
                </button>
              ))}
            </div>
          </div>

          {showEffects && (
            <div className="effects-controls">
              <h4>Effects</h4>
              <div className="effect-buttons">
                <button className="effect-button" onClick={() => applyEffect("glow")}>
                  Glow Effect
                </button>
                <button className="effect-button" onClick={() => applyEffect("particles")}>
                  Particle Effect
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlenderModelViewer;

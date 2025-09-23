import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import BlenderCharacterLoader from "../utils/BlenderCharacterLoader";

/**
 * A component for displaying and interacting with Blender characters
 * in an educational context.
 */
const BlenderCharacterClassroom = ({
  characterIds = ["winnie", "natalie"],
  lessonId = null,
  backgroundColor = "#f5f5f5",
  showControls = true,
  onInteraction = () => {},
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const charactersRef = useRef({});
  const animationFrameRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [availableCharacters, setAvailableCharacters] = useState([]);

  // Initialize scene and load characters
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(1, 2, 1);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-1, 1, -1);
    scene.add(fillLight);

    // Add camera
    const { clientWidth, clientHeight } = containerRef.current;
    const camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // Create character loader
    const characterLoader = new BlenderCharacterLoader({
      onProgress: (progress) => {
        setLoadingProgress(progress);
      },
      onError: (error) => {
        console.error("Error loading character:", error);
      },
    });

    // Load characters
    const loadCharacters = async () => {
      try {
        setIsLoading(true);

        const loadedCharacters = await characterLoader.preloadCharacters(characterIds);
        charactersRef.current = loadedCharacters;

        // Add characters to scene
        const characterData = [];
        let xOffset = -1 * (characterIds.length - 1) * 0.8;

        Object.entries(loadedCharacters).forEach(([id, character]) => {
          // Position characters side by side
          character.model.position.set(xOffset, 0, 0);
          scene.add(character.model);

          // Play idle animation
          if (character.animations.idle) {
            character.playAnimation("idle");
          }

          // Store character data
          characterData.push({
            id,
            name: character.name,
            position: xOffset,
          });

          xOffset += 1.6;
        });

        setAvailableCharacters(characterData);
        setActiveCharacter(characterData[0]?.id || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load characters:", error);
        setIsLoading(false);
      }
    };

    loadCharacters();

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();

      // Update character animations
      Object.values(charactersRef.current).forEach((character) => {
        character.update(delta);
      });

      // Update controls
      controlsRef.current.update();

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const { clientWidth, clientHeight } = containerRef.current;

      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of all characters
      characterLoader.clearCache();
    };
  }, [characterIds, backgroundColor]);

  // Effect for lesson integration
  useEffect(() => {
    if (!lessonId || !charactersRef.current || isLoading) return;

    // Simulated lesson data - in a real app, this would come from an API
    const lessonActions = {
      intro: [
        { character: "winnie", animation: "teaching", text: "Welcome to today's lesson!" },
        { character: "natalie", animation: "idle", text: "We're going to learn something new." },
      ],
      activity1: [
        { character: "winnie", animation: "point", text: "Now try this activity." },
        { character: "natalie", animation: "celebrate", text: "Great job!" },
      ],
    };

    const actions = lessonActions[lessonId];
    if (!actions) return;

    // Execute the first action for each character
    actions.forEach((action) => {
      const character = charactersRef.current[action.character];
      if (character && character.animations[action.animation]) {
        character.playAnimation(action.animation);

        // Focus on this character
        if (action.character === actions[0].character) {
          setActiveCharacter(action.character);

          // Move camera to focus on this character
          const targetPosition = charactersRef.current[action.character].model.position.clone();
          controlsRef.current.target.copy(targetPosition);
          controlsRef.current.target.y = 1;

          // Position camera relative to character
          const cameraOffset = new THREE.Vector3(0, 0.5, 2);
          cameraRef.current.position.copy(targetPosition).add(cameraOffset);
        }
      }
    });
  }, [lessonId, isLoading]);

  // Handle character selection
  const handleCharacterClick = (characterId) => {
    setActiveCharacter(characterId);

    // Focus camera on selected character
    const character = charactersRef.current[characterId];
    if (character) {
      // Play a greeting animation
      if (character.animations.teaching) {
        character.playAnimation("teaching");
      }

      // Move camera to focus on this character
      const targetPosition = character.model.position.clone();
      controlsRef.current.target.copy(targetPosition);
      controlsRef.current.target.y = 1;

      // Position camera relative to character
      const cameraOffset = new THREE.Vector3(0, 0.5, 2);
      cameraRef.current.position.copy(targetPosition).add(cameraOffset);

      // Notify parent component
      onInteraction({
        type: "character_selected",
        characterId,
        characterName: character.name,
      });
    }
  };

  // Play a specific animation on the active character
  const playAnimation = (animationId) => {
    if (!activeCharacter || !charactersRef.current[activeCharacter]) return;

    const character = charactersRef.current[activeCharacter];
    if (character.animations[animationId]) {
      character.playAnimation(animationId);

      // Notify parent component
      onInteraction({
        type: "animation_played",
        characterId: activeCharacter,
        animationId,
      });
    }
  };

  return (
    <div className="blender-character-classroom">
      <div
        ref={containerRef}
        className="character-viewer"
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {isLoading && (
          <div
            className="loading-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(245, 245, 245, 0.8)",
              zIndex: 10,
            }}
          >
            <p>Loading Characters... {Math.round(loadingProgress)}%</p>
            <div
              className="progress-bar"
              style={{
                width: "70%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                className="progress"
                style={{
                  width: `${loadingProgress}%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {showControls && (
        <div className="character-controls mt-4">
          <div className="character-selector mb-3">
            <h4 className="text-lg font-bold mb-2">Characters</h4>
            <div className="flex space-x-2">
              {availableCharacters.map((character) => (
                <button
                  key={character.id}
                  className={`px-3 py-2 rounded ${
                    activeCharacter === character.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handleCharacterClick(character.id)}
                >
                  {character.name}
                </button>
              ))}
            </div>
          </div>

          <div className="animation-controls">
            <h4 className="text-lg font-bold mb-2">Animations</h4>
            <div className="grid grid-cols-3 gap-2">
              {["idle", "walk", "talk", "point", "celebrate", "teaching"].map((animId) => (
                <button
                  key={animId}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded capitalize"
                  onClick={() => playAnimation(animId)}
                >
                  {animId}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlenderCharacterClassroom;

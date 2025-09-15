import React, { useEffect, useRef, useState } from "react";
import WindgapCharacterSystem from "./WindgapCharacterSystem";
import "../styles/animations.css";
import WebGLEffectsUtil from "../utils/WebGLEffects";
import CharacterAnimator from "../utils/CharacterAnimator";

/**
 * VirtualCharacters component
 * React wrapper for the WindgapCharacterSystem
 * Replaces the Unity WebGL implementation with Three.js
 */
const VirtualCharacters = React.forwardRef(
  (
    {
      containerId = "virtual-characters-container",
      selectedCharacters = ["winnie"],
      environment = "classroom",
      onMessage,
      height = "500px",
      width = "100%",
      interactionEnabled = true,
      autoRotate = false,
      initialAnimations = {},
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const characterSystemRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [selectedCharacter, setSelectedCharacter] = useState(selectedCharacters[0] || "winnie");

    // Initialize the character system
    useEffect(() => {
      if (!containerRef.current) return;

      // Create character system configuration
      const config = {
        containerSelector: `#${containerId}`,
        autoRotate,
        defaultEnvironment: environment,
        onCharacterAction: (message) => {
          if (onMessage) {
            onMessage(message);
          }
        },
        // Filter to only include selected characters
        characters: Object.fromEntries(
          selectedCharacters.map((charId) => [
            charId,
            {
              model: `/assets/characters/${charId}/${charId}.glb`,
              position: getCharacterPosition(charId, selectedCharacters.length),
              scale: 1,
              animations: {
                idle: "Idle",
                teaching: "Teaching",
                encouraging: "Encouraging",
                celebrating: "Celebrating",
                // Add more animations as needed
              },
            },
          ]),
        ),
      };

      // Create the character system
      const characterSystem = new WindgapCharacterSystem(config);
      characterSystemRef.current = characterSystem;

      // Set up event listeners
      characterSystem.on("loadingProgress", (data) => {
        setLoadingProgress(data.progress);
      });

      characterSystem.on("loadingComplete", () => {
        setIsLoading(false);
      });

      characterSystem.on("ready", () => {
        // Play initial animations if specified
        Object.entries(initialAnimations).forEach(([charId, animation]) => {
          if (selectedCharacters.includes(charId)) {
            playCharacterAnimation(charId, animation);
          }
        });
      });

      characterSystem.on("characterClicked", (data) => {
        setSelectedCharacter(data.characterId);
      });

      // Set up message listener for React <-> Three.js communication
      const handleCharacterMessage = (event) => {
        if (onMessage) {
          onMessage(event.detail.message);
        }
      };

      window.addEventListener("windgap-character-message", handleCharacterMessage);

      // Cleanup
      return () => {
        window.removeEventListener("windgap-character-message", handleCharacterMessage);
        if (characterSystemRef.current) {
          characterSystemRef.current.dispose();
          characterSystemRef.current = null;
        }
      };
    }, [containerId, selectedCharacters, environment, autoRotate, onMessage]);

    // Play character animation
    const playCharacterAnimation = (characterId, animationType) => {
      if (!characterSystemRef.current) return;

      switch (animationType) {
        case "teaching":
          characterSystemRef.current.startTeaching(characterId);
          break;
        case "encourage":
          characterSystemRef.current.encourage(characterId);
          break;
        case "celebrate":
          characterSystemRef.current.celebrate(characterId);
          break;
        default:
          // Try to play the animation directly if it exists
          const controller = characterSystemRef.current.characterControllers[characterId];
          if (controller) {
            controller.playAnimation(animationType);
          }
          break;
      }
    };

    // Helper to position characters evenly
    const getCharacterPosition = (characterId, totalCharacters) => {
      // Arrange characters in a semi-circle
      const radius = 3;
      const angleStep = Math.PI / (totalCharacters + 1);
      const index = selectedCharacters.indexOf(characterId);

      // Calculate position on the arc
      const angle = Math.PI / 2 + angleStep * (index + 1);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      return { x, y: 0, z };
    };

    // Character interaction methods exposed to parent components
    React.useImperativeHandle(
      React.forwardRef((props, ref) => ref),
      () => ({
        playAnimation: playCharacterAnimation,
        changeEnvironment: (newEnvironment) => {
          if (characterSystemRef.current) {
            characterSystemRef.current.changeEnvironment(newEnvironment);
          }
        },
        lookAt: (characterId, targetId) => {
          if (characterSystemRef.current) {
            characterSystemRef.current.characterLookAt(characterId, targetId);
          }
        },
        walkTo: (characterId, position, callback) => {
          if (characterSystemRef.current) {
            characterSystemRef.current.characterWalkTo(
              characterId,
              new THREE.Vector3(position.x, position.y, position.z),
              callback,
            );
          }
        },
        addEffect: (characterId, effectType, options) => {
          if (characterSystemRef.current) {
            characterSystemRef.current.addCharacterEffect(characterId, effectType, options);
          }
        },
      }),
    );

    // Render loading screen
    const renderLoadingScreen = () => {
      return (
        <div className="loading-overlay">
          <div className="loading-content">
            <h3>Loading Virtual Academy</h3>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${loadingProgress}%` }} />
            </div>
            <p>{loadingProgress}%</p>
          </div>
        </div>
      );
    };

    // Render character controls
    const renderCharacterControls = () => {
      if (!interactionEnabled) return null;

      return (
        <div className="character-controls">
          <h4>Character: {selectedCharacter}</h4>
          <div className="control-buttons">
            <button onClick={() => playCharacterAnimation(selectedCharacter, "teaching")}>
              Teach
            </button>
            <button onClick={() => playCharacterAnimation(selectedCharacter, "encourage")}>
              Encourage
            </button>
            <button onClick={() => playCharacterAnimation(selectedCharacter, "celebrate")}>
              Celebrate
            </button>
          </div>
        </div>
      );
    };

    /**
     * Apply a WebGL effect to a character
     * @param {string} characterId - ID of the character or 'scene' for scene-wide effects
     * @param {string} effectType - 'particles', 'ripple', or 'glow'
     * @param {Object} options - Effect options
     */
    const applyEffect = (characterId, effectType, options = {}) => {
      if (characterSystemRef.current) {
        const effect = characterSystemRef.current.applyEffect(characterId, effectType, options);
        if (effect && onMessage) {
          onMessage(`Applied ${effectType} effect to ${characterId}`);
        }
        return effect;
      }
      return null;
    };

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      playAnimation,
      stopAnimation,
      setPosition,
      setRotation,
      switchCharacter,
      speak,
      applyEffect,
    }));

    return (
      <div className="virtual-characters-wrapper">
        <div
          id={containerId}
          ref={containerRef}
          className="virtual-characters-container"
          style={{ height, width }}
        />

        {isLoading && renderLoadingScreen()}

        {interactionEnabled && !isLoading && renderCharacterControls()}
      </div>
    );
  },
);

export default VirtualCharacters;

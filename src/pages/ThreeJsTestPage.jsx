import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "../styles/ThreeJsTestPage.css";

// Method 4: Import from convenience files
import { VirtualCharacters, initThreeJsGlobally } from "../threeJs";
import CharacterController from "../threeJs/CharacterController";

// Also import VirtualCharacters and other components from the main index

// Import our new WebGL utilities
import WebGLEffectsUtil from "../utils/WebGLEffects";

/**
 * ThreeJsTestPage Component
 *
 * A test page to verify that the Three.js character system is working properly.
 * This component demonstrates Method 4 of importing (from convenience files).
 */
const ThreeJsTestPage = () => {
  // Reference to our character system
  const virtualCharactersRef = useRef(null);

  // State to track loading and messages
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState("winnie");
  const [activeAnimation, setActiveAnimation] = useState("idle");

  // State for WebGL effects
  const [activeEffects, setActiveEffects] = useState({
    particles: null,
    ripple: null,
    glow: null,
  });

  // Initialize Three.js globally when the component mounts
  useEffect(() => {
    // This makes THREE available globally
    initThreeJsGlobally();

    // Set loading to false after a short delay to simulate initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle messages from characters
  const handleCharacterMessage = (message) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: message }]);
  };

  // Handle animation changes
  const playAnimation = () => {
    if (virtualCharactersRef.current) {
      virtualCharactersRef.current.playAnimation(activeCharacter, activeAnimation);
      handleCharacterMessage(`Playing ${activeAnimation} animation on ${activeCharacter}`);
    }
  };

  // Add a WebGL effect to the page
  const addEffect = (effectType) => {
    const containerId = "effects-container";

    // Create container if it doesn't exist
    if (!document.getElementById(containerId)) {
      const container = document.createElement("div");
      container.id = containerId;
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "10";
      document.body.appendChild(container);
    }

    // Clean up previous effect of the same type
    if (activeEffects[effectType]) {
      activeEffects[effectType].cleanup();
    }

    // Apply the selected effect using our new WebGLEffectsUtil
    let newEffect = null;

    switch (effectType) {
      case "particles":
        // Use the new WebGLEffectsUtil instead of WebGLEffects
        newEffect = WebGLEffectsUtil.initParticleSystem(containerId, {
          particleCount: 200,
          particleSize: 0.1,
          particleColors: [0xff9933, 0x66cc66, 0x6699ff],
          speed: 0.01,
          turbulence: 0.05,
          spread: 100,
          animationDuration: 3,
        });
        break;

      case "ripple":
        // Use the new WebGLEffectsUtil instead of WebGLEffects
        newEffect = WebGLEffectsUtil.createWaterRipple(containerId, {
          color: 0x6699ff,
          rippleSpeed: 0.02,
          rippleWidth: 0.8,
          rippleCount: 3,
          duration: 4,
        });
        break;

      case "glow": {
        // Find an element to apply glow to
        const targetElement = document.querySelector(".character-display")?.id || "test-characters";

        // Use the new WebGLEffectsUtil instead of WebGLEffects
        newEffect = WebGLEffectsUtil.createGlowEffect(targetElement, {
          color: "#6366f1",
          intensity: 0.5,
          pulseSpeed: 2,
          duration: 3,
        });
        break;
      }

      default:
        break;
    }

    // Update state with the new effect
    if (newEffect) {
      setActiveEffects((prev) => ({
        ...prev,
        [effectType]: newEffect,
      }));

      // Auto-cleanup after effect duration
      const duration = effectType === "ripple" ? 4000 : 3000;
      setTimeout(() => {
        setActiveEffects((prev) => ({
          ...prev,
          [effectType]: null,
        }));
      }, duration);
    }

    handleCharacterMessage(`Added ${effectType} effect with WebGLEffectsUtil`);
  };

  // Character options for dropdown
  const characterOptions = ["winnie", "natalie", "daisy", "andy"];

  // Animation options for dropdown
  const animationOptions = ["idle", "teaching", "encourage", "celebrate", "wave", "walk"];

  return (
    <div className="threejs-test-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Three.js Character System Test</h1>
        <p>This page demonstrates Method 4 of importing: from convenience files</p>
      </motion.div>

      {loading ? (
        <div className="loading-screen">
          <h2>Initializing Three.js Character System...</h2>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="test-content">
          <div className="characters-container">
            <h2>Character Viewer</h2>
            <div className="character-view" style={{ height: "400px" }}>
              <VirtualCharacters
                ref={virtualCharactersRef}
                containerId="test-characters"
                selectedCharacters={["winnie", "natalie"]}
                environment="classroom"
                height="100%"
                onMessage={handleCharacterMessage}
                interactionEnabled={true}
              />
            </div>

            <div className="controls">
              <div className="animation-control" id="animation-control">
                <h3>Animation Controls</h3>
                <div className="control-row">
                  <label>
                    Character:
                    <select
                      value={activeCharacter}
                      onChange={(e) => setActiveCharacter(e.target.value)}
                    >
                      {characterOptions.map((char) => (
                        <option key={char} value={char}>
                          {char}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Animation:
                    <select
                      value={activeAnimation}
                      onChange={(e) => setActiveAnimation(e.target.value)}
                    >
                      {animationOptions.map((anim) => (
                        <option key={anim} value={anim}>
                          {anim}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button onClick={playAnimation}>Play Animation</button>
                </div>
              </div>

              <div className="effects-control">
                <h3>WebGL Effects</h3>
                <div className="effects-buttons">
                  <button onClick={() => addEffect("particles")}>Particle Effect</button>
                  <button onClick={() => addEffect("ripple")}>Ripple Effect</button>
                  <button onClick={() => addEffect("glow")}>Glow Effect</button>
                </div>
              </div>
            </div>
          </div>

          <div className="message-log">
            <h3>Character Messages</h3>
            <div className="messages">
              {messages.length === 0 ? (
                <p className="empty-message">
                  No messages yet. Try interacting with the characters.
                </p>
              ) : (
                <ul>
                  {messages.map((msg) => (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {msg.text}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="implementation-details">
            <h3>Implementation Details</h3>
            <div className="code-sample">
              <pre>
                <code>{`
// Method 4: Import from convenience files
import CharacterController from '../threeJs/CharacterController';

// Also import components from the main index
import {
  VirtualCharacters,
  LearningEnvironment,
  WebGLEffects,
  initThreeJsGlobally
} from '../threeJs';

// Import the new WebGL utilities
import WebGLEffectsUtil from "../utils/WebGLEffects";
import CharacterAnimator from "../utils/CharacterAnimator";

// Initialize Three.js globally
useEffect(() => {
  initThreeJsGlobally();
}, []);

// Use the VirtualCharacters component
<VirtualCharacters
  ref={virtualCharactersRef}
  containerId="test-characters"
  selectedCharacters={['winnie', 'natalie']}
  environment="classroom"
  onMessage={handleCharacterMessage}
/>

// Add WebGL effects with our new utility
const addParticleEffect = () => {
  WebGLEffectsUtil.initParticleSystem('effects-container', {
    particleCount: 200,
    particleSize: 0.1,
    particleColors: [0xff9933, 0x66cc66, 0x6699ff],
    speed: 0.01,
    turbulence: 0.05,
    spread: 100,
    animationDuration: 3
  });
};
                `}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="test-footer">
        <p>
          <strong>CharacterController Reference:</strong>{" "}
          {CharacterController ? "Successfully Imported" : "Import Failed"}
        </p>
        <p>
          <strong>Three.js Status:</strong>{" "}
          {window.THREE ? "Globally Available" : "Not Initialized"}
        </p>
      </div>
    </div>
  );
};

export default ThreeJsTestPage;

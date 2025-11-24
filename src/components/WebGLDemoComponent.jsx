import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import CharacterAnimator from "../utils/CharacterAnimator";
import WebGLEffects from "../utils/WebGLEffects";

/**
 * Example React component that demonstrates WebGL effects and character animation
 */
const WebGLDemoComponent = () => {
  // State for tracking active effects and animations
  const [activeEffects, setActiveEffects] = useState({
    particles: null,
    ripple: null,
    glow: null,
  });

  // State for character animator
  const [character, setCharacter] = useState(null);
  const [animationList, setAnimationList] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState("");
  const [isRotating, setIsRotating] = useState(true);

  // Refs for containers
  const effectsContainerRef = useRef(null);
  const characterContainerRef = useRef(null);

  // Initialize character animation on mount
  useEffect(() => {
    if (!characterContainerRef.current) return;

    const characterInstance = new CharacterAnimator({
      characterPath: "/assets/characters/windgap/winnie.glb",
      containerSelector: "#character-container",
      autoRotate: isRotating,
      backgroundColor: 0xf0f2f5,
      ambientLightIntensity: 0.5,
      directionalLightIntensity: 0.8,
    });

    setCharacter(characterInstance);

    // Get animation list after a delay to ensure model is loaded
    setTimeout(() => {
      const animations = characterInstance.getAnimationList();
      setAnimationList(animations);

      // Play first animation if available
      if (animations.length > 0) {
        playAnimation(animations[0]);
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (characterInstance) {
        characterInstance.dispose();
      }
    };
  }, []);

  // Update character rotation when isRotating changes
  useEffect(() => {
    if (character) {
      character.options.autoRotate = isRotating;
    }
  }, [isRotating, character]);

  // Add particle effect
  const addParticleEffect = () => {
    if (!effectsContainerRef.current) return;

    // Cleanup any existing particle effect
    if (activeEffects.particles) {
      activeEffects.particles.cleanup();
    }

    // Create new particle effect
    const particleEffect = WebGLEffects.initParticleSystem("effects-container", {
      particleCount: 200,
      particleSize: 0.1,
      particleColors: [0xff9933, 0x66cc66, 0x6699ff],
      speed: 0.01,
      turbulence: 0.05,
      spread: 100,
      animationDuration: 3,
    });

    // Update state
    setActiveEffects((prev) => ({
      ...prev,
      particles: particleEffect,
    }));

    // Auto-cleanup after animation duration
    setTimeout(() => {
      setActiveEffects((prev) => ({
        ...prev,
        particles: null,
      }));
    }, 3000);
  };

  // Add ripple effect
  const addRippleEffect = () => {
    if (!effectsContainerRef.current) return;

    // Cleanup any existing ripple effect
    if (activeEffects.ripple) {
      activeEffects.ripple.cleanup();
    }

    // Create new ripple effect
    const rippleEffect = WebGLEffects.createWaterRipple("effects-container", {
      color: 0x6699ff,
      rippleSpeed: 0.02,
      rippleWidth: 0.8,
      rippleCount: 3,
      duration: 4,
    });

    // Update state
    setActiveEffects((prev) => ({
      ...prev,
      ripple: rippleEffect,
    }));

    // Auto-cleanup after animation duration
    setTimeout(() => {
      setActiveEffects((prev) => ({
        ...prev,
        ripple: null,
      }));
    }, 4000);
  };

  // Add glow effect
  const addGlowEffect = () => {
    if (!characterContainerRef.current) return;

    // Cleanup any existing glow effect
    if (activeEffects.glow) {
      activeEffects.glow.cleanup();
    }

    // Create new glow effect
    const glowEffect = WebGLEffects.createGlowEffect("character-container", {
      color: "#6366f1",
      intensity: 0.5,
      pulseSpeed: 2,
      duration: 3,
    });

    // Update state
    setActiveEffects((prev) => ({
      ...prev,
      glow: glowEffect,
    }));

    // Auto-cleanup after animation duration
    setTimeout(() => {
      setActiveEffects((prev) => ({
        ...prev,
        glow: null,
      }));
    }, 3000);
  };

  // Clean up all effects
  const cleanupAllEffects = () => {
    WebGLEffects.cleanupAll();

    setActiveEffects({
      particles: null,
      ripple: null,
      glow: null,
    });
  };

  // Play a specific animation
  const playAnimation = (animationName) => {
    if (!character || !animationName) return;

    character.playAnimation(animationName, {
      loop: THREE.LoopRepeat,
      crossfadeDuration: 0.3,
    });

    setCurrentAnimation(animationName);
  };

  // Toggle character rotation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="webgl-demo-component">
      <h2>WebGL Effects & Character Animation Demo</h2>

      <div className="demo-container">
        <div className="effects-panel">
          <h3>WebGL Effects</h3>
          <div id="effects-container" ref={effectsContainerRef} className="effects-container"></div>

          <div className="effect-controls">
            <button onClick={addParticleEffect}>Add Particle Effect</button>
            <button onClick={addRippleEffect}>Add Ripple Effect</button>
            <button onClick={cleanupAllEffects}>Clear All Effects</button>
          </div>
        </div>

        <div className="character-panel">
          <h3>Character Animation</h3>
          <div
            id="character-container"
            ref={characterContainerRef}
            className="character-container"
          ></div>

          <div className="animation-controls">
            <button onClick={toggleRotation}>
              {isRotating ? "Stop Rotation" : "Start Rotation"}
            </button>
            <button onClick={addGlowEffect}>Add Glow Effect</button>

            {animationList.length > 0 && (
              <div className="animation-selector">
                <h4>Animations:</h4>
                <div className="animation-buttons">
                  {animationList.map((anim) => (
                    <button
                      key={anim}
                      onClick={() => playAnimation(anim)}
                      className={currentAnimation === anim ? "active" : ""}
                    >
                      {anim}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-info">
        <h3>Implementation Details</h3>
        <p>
          This component demonstrates how to use the WebGLEffects and CharacterAnimator utilities in
          a React application. The utilities are imported at the top of the file and used within
          React&apos;s useEffect hooks for initialization and cleanup.
        </p>
        <code>
          import WebGLEffects from &apos;../utils/WebGLEffects&apos;;
          <br />
          import CharacterAnimator from &apos;../utils/CharacterAnimator&apos;;
        </code>
      </div>
    </div>
  );
};

export default WebGLDemoComponent;

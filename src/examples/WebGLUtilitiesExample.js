/**
 * WebGLUtilitiesExample.js
 * Example of how to import and use the WebGL utilities in your application
 */

// Import the WebGL utilities
import * as THREE from "three";

import CharacterAnimator from "./src/utils/CharacterAnimator.js";
import WebGLEffects from "./src/utils/WebGLEffects.js";

// Function to demonstrate WebGL effects
function demonstrateWebGLEffects() {
  console.log("Setting up WebGL effects demonstration");

  // Create a particle system
  const particleEffect = WebGLEffects.initParticleSystem("effects-container", {
    particleCount: 200,
    particleSize: 0.1,
    particleColors: [0xff9933, 0x66cc66, 0x6699ff],
    speed: 0.01,
    turbulence: 0.05,
    spread: 100,
    animationDuration: 3,
  });

  // Create a water ripple effect
  const rippleEffect = WebGLEffects.createWaterRipple("effects-container", {
    color: 0x6699ff,
    rippleSpeed: 0.02,
    rippleWidth: 0.8,
    rippleCount: 3,
    duration: 4,
  });

  // Add a glow effect to an element
  const glowEffect = WebGLEffects.createGlowEffect("glow-element", {
    color: "#6366f1",
    intensity: 0.5,
    pulseSpeed: 2,
    duration: 3,
  });

  // Return cleanup functions for later use
  return {
    cleanupParticles: () => particleEffect.cleanup(),
    cleanupRipple: () => rippleEffect.cleanup(),
    cleanupGlow: () => glowEffect.cleanup(),
    cleanupAll: () => WebGLEffects.cleanupAll(),
  };
}

// Function to demonstrate character animation
async function demonstrateCharacterAnimation() {
  console.log("Setting up character animation demonstration");

  // Create a character animator
  const character = new CharacterAnimator({
    characterPath: "/assets/characters/windgap/winnie.glb",
    containerSelector: "#character-container",
    autoRotate: true,
    backgroundColor: 0xf0f2f5,
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 0.8,
  });

  // Get available animations after model is loaded
  setTimeout(() => {
    const animations = character.getAnimationList();
    console.log("Available animations:", animations);

    // Play an animation if available
    if (animations.length > 0) {
      character.playAnimation(animations[0], {
        loop: THREE.LoopRepeat,
        crossfadeDuration: 0.3,
      });
    }
  }, 1000);

  // Return the character instance for later use
  return character;
}

// Example of integrating with React component
export function ExampleReactComponent() {
  // In a real component, these would be useEffect and useState hooks
  const effects = demonstrateWebGLEffects();
  const character = demonstrateCharacterAnimation();

  // Cleanup function for when component unmounts
  const cleanup = () => {
    effects.cleanupAll();
    character.dispose();
  };

  return {
    effects,
    character,
    cleanup,
  };
}

// Example of integrating with vanilla JS
export function initializeWithVanillaJS() {
  // Set up containers
  const effectsContainer = document.getElementById("effects-container");
  const characterContainer = document.getElementById("character-container");

  if (!effectsContainer || !characterContainer) {
    console.error("Required containers not found");
    return;
  }

  // Initialize effects and character
  const effects = demonstrateWebGLEffects();
  const character = demonstrateCharacterAnimation();

  // Set up event listeners
  document.getElementById("toggle-rotation-button")?.addEventListener("click", () => {
    character.options.autoRotate = !character.options.autoRotate;
  });

  document.getElementById("play-animation-button")?.addEventListener("click", () => {
    const animations = character.getAnimationList();
    if (animations.length > 0) {
      const randomIndex = Math.floor(Math.random() * animations.length);
      character.playAnimation(animations[randomIndex]);
    }
  });

  document.getElementById("cleanup-button")?.addEventListener("click", () => {
    effects.cleanupAll();
    character.dispose();
  });
}

// Auto-initialize if this script is loaded in a browser environment
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing WebGL utilities example");
    initializeWithVanillaJS();
  });
}

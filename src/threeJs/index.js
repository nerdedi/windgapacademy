/**
 * Windgap Academy Three.js Character System
 * This file exports all components needed for the 3D character system
 */

// Core Three.js components
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Character system utilities
import CharacterController from "../utils/CharacterController";
import WebGLEffects from "../utils/WebGLEffects";

// React components
import WindgapCharacterSystem from "../components/WindgapCharacterSystem";
import VirtualCharacters from "../components/VirtualCharacters";
import LearningEnvironment from "../components/LearningEnvironment";

// Import styles
import "../styles/animations.css";

// Export everything for easy import
export {
  // Three.js libraries
  THREE,
  OrbitControls,
  GLTFLoader,

  // Utilities
  CharacterController,
  WebGLEffects,

  // React components
  WindgapCharacterSystem,
  VirtualCharacters,
  LearningEnvironment,
};

/**
 * Initialize the Three.js character system globally
 * This makes Three.js available in the global scope for components that need it
 */
export const initThreeJsGlobally = () => {
  window.THREE = THREE;
  window.OrbitControls = OrbitControls;
  window.GLTFLoader = GLTFLoader;

  console.log("Three.js character system initialized globally");
};

// Default export for convenient import
export default {
  THREE,
  OrbitControls,
  GLTFLoader,
  CharacterController,
  WebGLEffects,
  WindgapCharacterSystem,
  VirtualCharacters,
  LearningEnvironment,
  initThreeJsGlobally,
};

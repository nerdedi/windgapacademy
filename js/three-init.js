// three-init.js - ES Module initialization for Three.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Make THREE available globally for legacy code
window.THREE = THREE;
window.OrbitControls = OrbitControls;
window.GLTFLoader = GLTFLoader;

console.log("Three.js ES modules initialized:", THREE.REVISION);

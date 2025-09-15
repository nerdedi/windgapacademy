/**
 * CharacterAnimator.js
 * A utility for animating 3D characters in the Windgap Academy
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Character animator class to handle loading and animating 3D models
 */
class CharacterAnimator {
  /**
   * Creates a new CharacterAnimator instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    const defaultOptions = {
      characterPath: "/assets/characters/windgap/winnie.glb",
      containerSelector: "#character-container",
      autoRotate: true,
      backgroundColor: 0xf0f2f5,
      ambientLightIntensity: 0.5,
      directionalLightIntensity: 0.8,
    };

    this.options = { ...defaultOptions, ...options };
    this.container = document.querySelector(this.options.containerSelector);

    if (!this.container) {
      console.error(`Character container not found: ${this.options.containerSelector}`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.animations = {};
    this.currentAnimation = null;

    this.init();
  }

  /**
   * Initialize the Three.js scene, camera, and renderer
   */
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 3;
    this.camera.position.y = 1;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, this.options.ambientLightIntensity);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      this.options.directionalLightIntensity,
    );
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.position.y = -1; // Position below character
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Setup window resize handler
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Auto-rotation controls
    this.autoRotateGroup = new THREE.Group();
    this.scene.add(this.autoRotateGroup);

    // Load the character model
    this.loadCharacter(this.options.characterPath);

    // Start animation loop
    this.animate();
  }

  /**
   * Load a 3D character model
   * @param {string} modelPath - Path to the GLTF/GLB model
   * @returns {Promise} A promise that resolves when the model is loaded
   */
  loadCharacter(modelPath) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        modelPath,
        (gltf) => {
          // Remove previous model if it exists
          if (this.model) {
            this.autoRotateGroup.remove(this.model);
          }

          this.model = gltf.scene;
          this.autoRotateGroup.add(this.model);

          // Center the model
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          this.model.position.x = -center.x;
          this.model.position.y = -center.y;
          this.model.position.z = -center.z;

          // Adjust model scale if needed
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 2) {
            const scale = 2 / maxDim;
            this.model.scale.set(scale, scale, scale);
          }

          // Setup animations
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);

            gltf.animations.forEach((clip) => {
              const action = this.mixer.clipAction(clip);
              this.animations[clip.name] = {
                clip,
                action,
              };
            });

            // Play the first animation by default
            const defaultAnim = Object.keys(this.animations)[0];
            if (defaultAnim) {
              this.playAnimation(defaultAnim);
            }
          }

          resolve(gltf);
        },
        (xhr) => {
          const percent = (xhr.loaded / xhr.total) * 100;
          console.log(`Loading model: ${percent.toFixed(2)}%`);
        },
        (error) => {
          console.error("Error loading character model:", error);
          reject(error);
        },
      );
    });
  }

  /**
   * Play a specific animation by name
   * @param {string} name - The name of the animation to play
   * @param {Object} options - Animation options (crossfade, loop, etc.)
   */
  playAnimation(name, options = {}) {
    if (!this.animations[name]) {
      console.error(`Animation "${name}" not found`);
      return;
    }

    const defaultOptions = {
      loop: THREE.LoopRepeat,
      crossfadeDuration: 0.3,
    };

    const config = { ...defaultOptions, ...options };

    const animation = this.animations[name];

    // Stop current animation with crossfade
    if (this.currentAnimation && this.currentAnimation !== name) {
      const current = this.animations[this.currentAnimation].action;
      current.fadeOut(config.crossfadeDuration);
    }

    // Configure and play the new animation
    const action = animation.action;
    action.reset();
    action.setLoop(config.loop);
    action.fadeIn(config.crossfadeDuration);
    action.play();

    this.currentAnimation = name;
  }

  /**
   * Stop the current animation
   * @param {number} fadeDuration - Duration of the fade out in seconds
   */
  stopAnimation(fadeDuration = 0.3) {
    if (this.currentAnimation && this.animations[this.currentAnimation]) {
      const action = this.animations[this.currentAnimation].action;
      action.fadeOut(fadeDuration);
      this.currentAnimation = null;
    }
  }

  /**
   * List all available animations for the current model
   * @returns {Array} Array of animation names
   */
  getAnimationList() {
    return Object.keys(this.animations);
  }

  /**
   * Handle window resize events
   */
  onWindowResize() {
    if (!this.camera || !this.renderer || !this.container) return;

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    // Auto-rotate the character
    if (this.options.autoRotate && this.autoRotateGroup) {
      this.autoRotateGroup.rotation.y += 0.005;
    }

    // Render the scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Remove event listeners
    window.removeEventListener("resize", this.onWindowResize.bind(this));

    // Dispose of Three.js objects
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    // Remove renderer from DOM
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }

    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.model = null;
    this.mixer = null;
    this.animations = {};
    this.currentAnimation = null;
  }
}

export default CharacterAnimator;

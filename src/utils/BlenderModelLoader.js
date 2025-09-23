// Blender Model Loader Utility
// This utility extends CharacterAnimator to handle Blender-specific model loading

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CharacterAnimator from "./CharacterAnimator";
import WebGLEffectsUtil from "./WebGLEffects";

/**
 * BlenderModelLoader
 * Specialized utility for loading and managing Blender-created models
 * with support for animations and effects
 */
class BlenderModelLoader {
  /**
   * Create a new BlenderModelLoader instance
   * @param {Object} options Configuration options
   */
  constructor(options = {}) {
    this.options = {
      useDraco: false, // Whether to use Draco compression
      useKTX2: false, // Whether to use KTX2 texture compression
      defaultScale: 1, // Default scale for models
      autoPlayAnimation: "", // Animation to auto-play when loaded
      ...options,
    };

    this.models = new Map(); // Map of loaded models
    this.animators = new Map(); // Map of character animators
    this.loader = new GLTFLoader();

    // Initialize loaders with compression if needed
    this._initializeLoaders();
  }

  /**
   * Initialize GLTF loaders with optional compression support
   * @private
   */
  _initializeLoaders() {
    // Add Draco compression if requested
    if (this.options.useDraco) {
      const { DRACOLoader } = require("three/examples/jsm/loaders/DRACOLoader");
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/assets/draco/");
      this.loader.setDRACOLoader(dracoLoader);
    }

    // Add KTX2 support if requested
    if (this.options.useKTX2) {
      const { KTX2Loader } = require("three/examples/jsm/loaders/KTX2Loader");
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath("/assets/basis/");
      this.loader.setKTX2Loader(ktx2Loader);
    }
  }

  /**
   * Load a Blender model from a GLTF/GLB file
   * @param {string} modelPath Path to the model file
   * @param {Object} options Loading and setup options
   * @returns {Promise<Object>} Promise resolving to the loaded model
   */
  loadModel(modelPath, options = {}) {
    const modelOptions = {
      name: modelPath.split("/").pop().split(".")[0],
      scale: this.options.defaultScale,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      animations: {},
      ...options,
    };

    return new Promise((resolve, reject) => {
      this.loader.load(
        modelPath,
        (gltf) => {
          // Process the loaded model
          const model = this._processModel(gltf, modelOptions);

          // Store the model
          this.models.set(modelOptions.name, model);

          // Create a character animator if it's a character
          if (options.isCharacter) {
            const animator = new CharacterAnimator();
            animator.setModel(model, modelOptions);
            this.animators.set(modelOptions.name, animator);

            // Auto-play animation if specified
            if (
              this.options.autoPlayAnimation &&
              animator.hasAnimation(this.options.autoPlayAnimation)
            ) {
              animator.playAnimation(this.options.autoPlayAnimation);
            }
          }

          resolve(model);
        },
        (progress) => {
          // Loading progress callback
          if (options.onProgress) {
            options.onProgress(progress);
          }
        },
        (error) => {
          console.error(`Error loading model ${modelPath}:`, error);
          reject(error);
        },
      );
    });
  }

  /**
   * Process a loaded GLTF model
   * @param {Object} gltf The loaded GLTF data
   * @param {Object} options Model options
   * @returns {Object} Processed model
   * @private
   */
  _processModel(gltf, options) {
    const model = {
      gltf,
      scene: gltf.scene,
      animations: gltf.animations,
      mixer: new THREE.AnimationMixer(gltf.scene),
      clips: {},
      actions: {},
      name: options.name,
    };

    // Apply scale
    model.scene.scale.set(options.scale, options.scale, options.scale);

    // Apply position
    model.scene.position.set(options.position.x, options.position.y, options.position.z);

    // Apply rotation
    model.scene.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

    // Process animations
    this._processAnimations(model, options.animations);

    return model;
  }

  /**
   * Process model animations
   * @param {Object} model The model object
   * @param {Object} animationMap Map of animation names to clip names
   * @private
   */
  _processAnimations(model, animationMap) {
    // Create a map of all available animations
    model.gltf.animations.forEach((clip) => {
      model.clips[clip.name] = clip;
    });

    // Map custom animation names to clips
    Object.entries(animationMap).forEach(([animName, clipName]) => {
      const clip = model.clips[clipName];
      if (clip) {
        const action = model.mixer.clipAction(clip);
        model.actions[animName] = action;
      } else {
        console.warn(`Animation clip "${clipName}" not found for animation "${animName}"`);
      }
    });
  }

  /**
   * Get a loaded model by name
   * @param {string} modelName Name of the model
   * @returns {Object|null} The model or null if not found
   */
  getModel(modelName) {
    return this.models.get(modelName) || null;
  }

  /**
   * Get a character animator by name
   * @param {string} characterName Name of the character
   * @returns {CharacterAnimator|null} The animator or null if not found
   */
  getAnimator(characterName) {
    return this.animators.get(characterName) || null;
  }

  /**
   * Play an animation on a model
   * @param {string} modelName Name of the model
   * @param {string} animationName Name of the animation to play
   * @param {Object} options Animation options
   * @returns {boolean} Success status
   */
  playAnimation(modelName, animationName, options = {}) {
    const model = this.getModel(modelName);
    if (!model) {
      console.warn(`Model "${modelName}" not found`);
      return false;
    }

    // For characters, use the animator
    if (this.animators.has(modelName)) {
      return this.animators.get(modelName).playAnimation(animationName, options);
    }

    // For other models, play the animation directly
    const action = model.actions[animationName];
    if (!action) {
      console.warn(`Animation "${animationName}" not found for model "${modelName}"`);
      return false;
    }

    // Set up animation options
    if (options.loop !== undefined) {
      action.loop = options.loop ? THREE.LoopRepeat : THREE.LoopOnce;
    }

    if (options.clampWhenFinished !== undefined) {
      action.clampWhenFinished = options.clampWhenFinished;
    }

    if (options.timeScale !== undefined) {
      action.timeScale = options.timeScale;
    }

    // Play the animation
    action.reset().play();
    return true;
  }

  /**
   * Apply a WebGL effect to a model
   * @param {string} modelName Name of the model
   * @param {string} effectType Type of effect to apply
   * @param {Object} effectOptions Effect configuration options
   */
  applyEffect(modelName, effectType, effectOptions = {}) {
    const model = this.getModel(modelName);
    if (!model) {
      console.warn(`Model "${modelName}" not found`);
      return false;
    }

    // Apply the effect using WebGLEffectsUtil
    switch (effectType) {
      case "glow":
        return WebGLEffectsUtil.createGlowEffect(model.scene, {
          color: "#6366f1",
          intensity: 0.5,
          pulseSpeed: 2,
          duration: 3,
          ...effectOptions,
        });

      case "particles": {
        // Create a container for the particles
        const containerId = `${modelName}-particles`;
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement("div");
          container.id = containerId;
          container.style.position = "absolute";
          container.style.top = "0";
          container.style.left = "0";
          container.style.width = "100%";
          container.style.height = "100%";
          container.style.pointerEvents = "none";
          document.body.appendChild(container);
        }

        return WebGLEffectsUtil.initParticleSystem(containerId, {
          particleCount: 100,
          particleSize: 0.1,
          particleColors: [0xff9933, 0x66cc66, 0x6699ff],
          speed: 0.01,
          turbulence: 0.05,
          spread: 100,
          animationDuration: 3,
          ...effectOptions,
        });
      }

      default:
        console.warn(`Effect type "${effectType}" not supported`);
        return false;
    }
  }

  /**
   * Update all model animations
   * @param {number} deltaTime Time in seconds since last update
   */
  update(deltaTime) {
    // Update all model mixers
    this.models.forEach((model) => {
      if (model.mixer) {
        model.mixer.update(deltaTime);
      }
    });

    // Update all character animators
    this.animators.forEach((animator) => {
      animator.update(deltaTime);
    });
  }

  /**
   * Dispose of a model and free resources
   * @param {string} modelName Name of the model to dispose
   */
  disposeModel(modelName) {
    const model = this.getModel(modelName);
    if (!model) return;

    // Dispose of the model's resources
    if (model.mixer) {
      model.mixer.stopAllAction();
    }

    // Dispose of geometries and materials
    model.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value && typeof value.dispose === "function") {
                value.dispose();
              }
            });
          });
        } else {
          Object.values(object.material).forEach((value) => {
            if (value && typeof value.dispose === "function") {
              value.dispose();
            }
          });
        }
      }
    });

    // Remove the model from the maps
    this.models.delete(modelName);
    this.animators.delete(modelName);
  }

  /**
   * Dispose of all models and free resources
   */
  disposeAll() {
    const modelNames = Array.from(this.models.keys());
    modelNames.forEach((name) => {
      this.disposeModel(name);
    });
  }
}

export default BlenderModelLoader;

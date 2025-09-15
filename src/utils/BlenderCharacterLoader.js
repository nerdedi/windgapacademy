// Sample code for a Blender character import utility for Windgap Academy
// This helper provides easy loading and management of Blender-created characters

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * A utility class for loading and managing Blender-created characters
 * in Windgap Academy projects.
 */
class BlenderCharacterLoader {
  /**
   * Create a new BlenderCharacterLoader
   * @param {Object} options - Configuration options
   * @param {string} options.basePath - Base path for character assets
   * @param {boolean} options.useDraco - Whether to use Draco compression
   * @param {string} options.dracoPath - Path to Draco decoder (if using)
   * @param {Function} options.onProgress - Progress callback
   * @param {Function} options.onError - Error callback
   */
  constructor(options = {}) {
    this.basePath = options.basePath || "/assets/characters/";
    this.useDraco = options.useDraco || false;
    this.dracoPath = options.dracoPath || "/js/libs/draco/";
    this.onProgress = options.onProgress || (() => {});
    this.onError = options.onError || ((err) => console.error(err));

    // Initialize loaders
    this.gltfLoader = new GLTFLoader();

    if (this.useDraco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(this.dracoPath);
      this.gltfLoader.setDRACOLoader(dracoLoader);
    }

    // Cache for loaded characters
    this.characterCache = new Map();
  }

  /**
   * Load a character by its ID
   * @param {string} characterId - The character identifier
   * @param {Object} options - Additional loading options
   * @returns {Promise<Object>} The loaded character data
   */
  async loadCharacter(characterId, options = {}) {
    const characterPath = `${this.basePath}${characterId}/${characterId}.glb`;
    const configPath = `${this.basePath}${characterId}/character_config.json`;

    // Check cache first
    if (this.characterCache.has(characterId) && !options.forceReload) {
      return this.characterCache.get(characterId);
    }

    try {
      // Load character configuration
      const configResponse = await fetch(configPath);
      if (!configResponse.ok) {
        throw new Error(`Failed to load character config: ${configResponse.statusText}`);
      }

      const config = await configResponse.json();

      // Load GLTF model
      const gltf = await this._loadGLTF(characterPath);

      // Process the model and animations
      const result = this._processCharacterModel(gltf, config);

      // Store in cache
      this.characterCache.set(characterId, result);

      return result;
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Load a GLTF file
   * @private
   * @param {string} path - Path to the GLTF file
   * @returns {Promise<Object>} The loaded GLTF data
   */
  _loadGLTF(path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(gltf),
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            this.onProgress(percentComplete);
          }
        },
        (error) => reject(error),
      );
    });
  }

  /**
   * Process a loaded character model
   * @private
   * @param {Object} gltf - The loaded GLTF data
   * @param {Object} config - The character configuration
   * @returns {Object} Processed character data
   */
  _processCharacterModel(gltf, config) {
    const model = gltf.scene;
    const mixer = new THREE.AnimationMixer(model);
    const animations = {};

    // Setup animations
    if (gltf.animations && gltf.animations.length > 0) {
      // Process each animation from the config
      config.animations.forEach((animConfig) => {
        // Find the matching animation clip
        const clip = gltf.animations.find((anim) => anim.name === animConfig.clipName);

        if (clip) {
          // Create an animation action
          const action = mixer.clipAction(clip);

          // Store by ID for easy access
          animations[animConfig.id] = {
            clip,
            action,
            config: animConfig,
          };
        }
      });
    }

    return {
      id: config.id,
      name: config.name,
      model,
      mixer,
      animations,
      config,

      /**
       * Play an animation by ID
       * @param {string} animationId - The animation ID to play
       * @param {Object} options - Animation options
       * @returns {THREE.AnimationAction|null} The animation action or null
       */
      playAnimation(animationId, options = {}) {
        const anim = this.animations[animationId];
        if (!anim) {
          console.warn(`Animation "${animationId}" not found for character "${this.name}"`);
          return null;
        }

        // Stop any current animations if exclusive
        if (options.exclusive !== false) {
          this.stopAllAnimations();
        }

        // Configure the animation
        anim.action.reset();

        if (options.loop !== false) {
          anim.action.loop = THREE.LoopRepeat;
        } else {
          anim.action.loop = THREE.LoopOnce;
          anim.action.clampWhenFinished = true;
        }

        if (options.timeScale) {
          anim.action.timeScale = options.timeScale;
        }

        // Play the animation
        anim.action.play();

        return anim.action;
      },

      /**
       * Stop all animations
       */
      stopAllAnimations() {
        this.mixer.stopAllAction();
      },

      /**
       * Update the character animations
       * @param {number} deltaTime - Time in seconds since the last update
       */
      update(deltaTime) {
        if (this.mixer) {
          this.mixer.update(deltaTime);
        }
      },

      /**
       * Clean up resources
       */
      dispose() {
        this.stopAllAnimations();
        this.mixer = null;

        // Traverse the model and dispose of geometries and materials
        this.model.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();

            if (object.material.isMaterial) {
              this._disposeMaterial(object.material);
            } else {
              // Array of materials
              for (const material of object.material) {
                this._disposeMaterial(material);
              }
            }
          }
        });
      },

      /**
       * Dispose of a material and its textures
       * @private
       * @param {THREE.Material} material - The material to dispose
       */
      _disposeMaterial(material) {
        // Dispose textures
        for (const key in material) {
          const value = material[key];
          if (value && typeof value === "object" && "isTexture" in value) {
            value.dispose();
          }
        }

        material.dispose();
      },
    };
  }

  /**
   * Preload multiple characters
   * @param {string[]} characterIds - Array of character IDs to preload
   * @returns {Promise<Object>} Map of character IDs to loaded data
   */
  async preloadCharacters(characterIds) {
    const loadPromises = characterIds.map((id) => this.loadCharacter(id));
    const loadedCharacters = await Promise.all(loadPromises);

    const resultMap = {};
    characterIds.forEach((id, index) => {
      resultMap[id] = loadedCharacters[index];
    });

    return resultMap;
  }

  /**
   * Clear the character cache
   * @param {string} [characterId] - Specific character ID to clear, or all if omitted
   */
  clearCache(characterId) {
    if (characterId) {
      // Clear specific character
      if (this.characterCache.has(characterId)) {
        const character = this.characterCache.get(characterId);
        if (character.dispose) {
          character.dispose();
        }
        this.characterCache.delete(characterId);
      }
    } else {
      // Clear all characters
      this.characterCache.forEach((character) => {
        if (character.dispose) {
          character.dispose();
        }
      });
      this.characterCache.clear();
    }
  }
}

export default BlenderCharacterLoader;

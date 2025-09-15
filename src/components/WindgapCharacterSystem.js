import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CharacterController from "../utils/CharacterController";
import WebGLEffects from "../utils/WebGLEffects";

/**
 * WindgapCharacterSystem
 * A Three.js-based character system to replace Unity implementation
 * Manages 3D character models, animations, and interactions
 */
class WindgapCharacterSystem {
  constructor(options = {}) {
    // Default configuration options
    const defaultOptions = {
      containerSelector: "#character-container",
      characters: {
        natalie: {
          model: "/assets/characters/natalie/natalie.glb",
          position: { x: -1, y: 0, z: 0 },
          scale: 1,
          animations: {
            idle: "Idle",
            teaching: "Teaching",
            encouraging: "Encouraging",
            celebrating: "Celebrating",
          },
        },
        daisy: {
          model: "/assets/characters/daisy/daisy.glb",
          position: { x: 1, y: 0, z: 0 },
          scale: 1,
          animations: {
            idle: "Idle",
            teaching: "Teaching",
            encouraging: "Encouraging",
            celebrating: "Celebrating",
          },
        },
        andy: {
          model: "/assets/characters/andy/andy.glb",
          position: { x: 2, y: 0, z: 1 },
          scale: 1,
          animations: {
            idle: "Idle",
            teaching: "Teaching",
            encouraging: "Encouraging",
            celebrating: "Celebrating",
          },
        },
        winnie: {
          model: "/assets/characters/winnie/winnie.glb",
          position: { x: -2, y: 0, z: 1 },
          scale: 1,
          animations: {
            idle: "Idle",
            teaching: "Teaching",
            encouraging: "Encouraging",
            celebrating: "Celebrating",
          },
        },
      },
      environments: {
        classroom: "/assets/environments/classroom/classroom.glb",
        library: "/assets/environments/library/library.glb",
        virtualAcademy: "/assets/environments/virtualAcademy/virtualAcademy.glb",
      },
      defaultEnvironment: "classroom",
      onCharacterAction: null,
      onSceneReady: null,
      enableShadows: true,
      autoRotate: false,
    };

    // Merge provided options with defaults
    this.options = { ...defaultOptions, ...options };

    // System state
    this.initialized = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.container = null;
    this.characterControllers = {};
    this.currentEnvironment = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = null;
    this.audioListener = new THREE.AudioListener();

    // Event callbacks
    this.eventListeners = {};

    // Bind methods
    this._onWindowResize = this._onWindowResize.bind(this);
    this._onClick = this._onClick.bind(this);
    this._animate = this._animate.bind(this);

    // Initialize the system
    this._init();
  }

  /**
   * Initialize the character system
   * @private
   */
  _init() {
    // Find container element
    this.container = document.querySelector(this.options.containerSelector);
    if (!this.container) {
      console.error(`Container element "${this.options.containerSelector}" not found`);
      return;
    }

    // Setup loading manager
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.floor((itemsLoaded / itemsTotal) * 100);
      this._dispatchEvent("loadingProgress", { progress, url, itemsLoaded, itemsTotal });
    };

    this.loadingManager.onLoad = () => {
      this._dispatchEvent("loadingComplete");
    };

    this.loadingManager.onError = (url) => {
      console.error(`Error loading: ${url}`);
      this._dispatchEvent("loadingError", { url });
    };

    // Initialize Three.js components
    this._setupScene();
    this._setupCamera();
    this._setupRenderer();
    this._setupLights();
    this._setupControls();

    // Initialize loaders
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    // Load default environment
    this._loadEnvironment(this.options.defaultEnvironment);

    // Add ground plane
    this._addGroundPlane();

    // Add event listeners
    window.addEventListener("resize", this._onWindowResize);
    this.container.addEventListener("click", this._onClick);

    // Start animation loop
    this._animate();

    this.initialized = true;

    // Dispatch ready event
    setTimeout(() => {
      this._dispatchEvent("ready");
      if (typeof this.options.onSceneReady === "function") {
        this.options.onSceneReady();
      }
    }, 0);
  }

  /**
   * Set up the Three.js scene
   * @private
   */
  _setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.fog = new THREE.Fog(0xf0f0f0, 10, 50);
  }

  /**
   * Set up the camera
   * @private
   */
  _setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 7);
    this.camera.lookAt(0, 1, 0);
    this.camera.add(this.audioListener);
  }

  /**
   * Set up the WebGL renderer
   * @private
   */
  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = this.options.enableShadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * Set up scene lighting
   * @private
   */
  _setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = this.options.enableShadows;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);

    // Add hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemisphereLight.position.set(0, 20, 0);
    this.scene.add(hemisphereLight);
  }

  /**
   * Set up camera controls
   * @private
   */
  _setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 15;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.autoRotate = this.options.autoRotate;
  }

  /**
   * Add a ground plane to the scene
   * @private
   */
  _addGroundPlane() {
    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = this.options.enableShadows;
    ground.name = "ground";
    this.scene.add(ground);
  }

  /**
   * Handle window resize events
   * @private
   */
  _onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Handle click events for character interaction
   * @private
   * @param {Event} event - The click event
   */
  _onClick(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Get all intersections with meshes in the scene
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // Check if we clicked on a character
    for (const intersect of intersects) {
      // Try to find the character from the clicked object
      const characterId = this._findCharacterFromObject(intersect.object);
      if (characterId) {
        this._dispatchEvent("characterClicked", { characterId });

        // Trigger character animation
        const controller = this.characterControllers[characterId];
        if (controller) {
          // Make the character look at the camera
          controller.lookAt(this.camera.position, true);

          // Play a reaction animation
          controller.react("excited", () => {
            // After the reaction, send event to React
            this._sendToReact(`${characterId} was clicked and reacted`);
          });
        }

        break;
      }
    }
  }

  /**
   * Find which character a mesh belongs to
   * @private
   * @param {THREE.Object3D} object - The clicked object
   * @returns {string|null} - The character ID or null if not found
   */
  _findCharacterFromObject(object) {
    // Check each character's model to see if the object is a descendant
    for (const [characterId, controller] of Object.entries(this.characterControllers)) {
      if (controller.model && controller.model.scene) {
        let current = object;

        // Traverse up the parent chain to see if we find the character's scene
        while (current) {
          if (current === controller.model.scene) {
            return characterId;
          }
          current = current.parent;
        }
      }
    }

    return null;
  }

  /**
   * Animation loop
   * @private
   */
  _animate() {
    requestAnimationFrame(this._animate);

    const delta = this.clock.getDelta();

    // Update controls
    this.controls.update();

    // Update character controllers
    Object.values(this.characterControllers).forEach((controller) => {
      controller.update(delta);
    });

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Load a 3D environment
   * @private
   * @param {string} environmentId - The ID of the environment to load
   */
  _loadEnvironment(environmentId) {
    const environmentPath = this.options.environments[environmentId];
    if (!environmentPath) {
      console.error(`Environment "${environmentId}" not found`);
      return;
    }

    // Remove previous environment if it exists
    if (this.currentEnvironment) {
      this.scene.remove(this.currentEnvironment);
    }

    // Load the new environment
    this.gltfLoader.load(
      environmentPath,
      (gltf) => {
        this.currentEnvironment = gltf.scene;

        // Prepare the environment
        this.currentEnvironment.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.scene.add(this.currentEnvironment);
        this._dispatchEvent("environmentLoaded", { environmentId });

        // Load characters after environment is ready
        this._loadCharacters();
      },
      (xhr) => {
        // Loading progress is handled by the loadingManager
      },
      (error) => {
        console.error(`Error loading environment: ${error}`);
      },
    );
  }

  /**
   * Load all character models
   * @private
   */
  _loadCharacters() {
    const characterIds = Object.keys(this.options.characters);

    // Load each character
    characterIds.forEach((characterId) => {
      this._loadCharacter(characterId);
    });
  }

  /**
   * Load a specific character model
   * @private
   * @param {string} characterId - The ID of the character to load
   */
  _loadCharacter(characterId) {
    const character = this.options.characters[characterId];
    if (!character) {
      console.error(`Character "${characterId}" not found in options`);
      return;
    }

    // Load the character model
    this.gltfLoader.load(
      character.model,
      (gltf) => {
        // Create character controller
        const controller = new CharacterController(gltf, {
          scale: character.scale,
          position: character.position,
          idleAnimation: character.animations.idle || "idle",
        });

        // Enable shadows
        gltf.scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Add to scene and store the controller
        this.scene.add(gltf.scene);
        this.characterControllers[characterId] = controller;

        // Dispatch loaded event
        this._dispatchEvent("characterLoaded", { characterId });

        // Send notification to React
        this._sendToReact(`${characterId} character loaded`);
      },
      (xhr) => {
        // Loading progress is handled by the loadingManager
      },
      (error) => {
        console.error(`Error loading character ${characterId}: ${error}`);
      },
    );
  }

  /**
   * Send a message to the React application
   * @private
   * @param {string} message - The message to send
   */
  _sendToReact(message) {
    // Dispatch custom event that React can listen for
    const event = new CustomEvent("windgap-character-message", {
      detail: { message },
    });
    window.dispatchEvent(event);

    // Also call the onCharacterAction callback if provided
    if (typeof this.options.onCharacterAction === "function") {
      this.options.onCharacterAction(message);
    }

    // Log the message
    console.log(`Character System: ${message}`);
  }

  /**
   * Register an event listener
   * @param {string} event - The event name
   * @param {Function} callback - The callback function
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - The event name
   * @param {Function} callback - The callback function to remove
   */
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter((cb) => cb !== callback);
    }
  }

  /**
   * Dispatch an event to registered listeners
   * @private
   * @param {string} event - The event name
   * @param {Object} data - The event data
   */
  _dispatchEvent(event, data = {}) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }

  /**
   * Public API: Make a character perform a teaching animation
   * @param {string} characterId - The ID of the character
   * @param {Function} callback - Optional callback when animation completes
   */
  startTeaching(characterId, callback) {
    const controller = this.characterControllers[characterId];
    if (controller) {
      const animationName =
        this.options.characters[characterId]?.animations?.teaching || "teaching";
      controller.playAnimation(animationName);
      this._sendToReact(`${characterId} started teaching`);

      if (callback) {
        // Assuming the teaching animation is about 3 seconds
        setTimeout(callback, 3000);
      }
    }
  }

  /**
   * Public API: Make a character perform an encouraging animation
   * @param {string} characterId - The ID of the character
   * @param {Function} callback - Optional callback when animation completes
   */
  encourage(characterId, callback) {
    const controller = this.characterControllers[characterId];
    if (controller) {
      const animationName =
        this.options.characters[characterId]?.animations?.encouraging || "encouraging";
      controller.playAnimation(animationName);
      this._sendToReact(`${characterId} encouraging student`);

      if (callback) {
        // Assuming the encouraging animation is about 2 seconds
        setTimeout(callback, 2000);
      }
    }
  }

  /**
   * Public API: Make a character perform a celebration animation
   * @param {string} characterId - The ID of the character
   * @param {Function} callback - Optional callback when animation completes
   */
  celebrate(characterId, callback) {
    const controller = this.characterControllers[characterId];
    if (controller) {
      const animationName =
        this.options.characters[characterId]?.animations?.celebrating || "celebrating";
      controller.playAnimation(animationName);
      this._sendToReact(`${characterId} celebrating success`);

      // Add particle effects for celebration
      const characterPosition = controller.model.scene.position.clone();
      characterPosition.y += 2; // Position above character's head

      // Create container for effects
      const effectsContainer = document.createElement("div");
      effectsContainer.id = `effects-${Date.now()}`;
      effectsContainer.style.position = "absolute";
      effectsContainer.style.top = "0";
      effectsContainer.style.left = "0";
      effectsContainer.style.width = "100%";
      effectsContainer.style.height = "100%";
      effectsContainer.style.pointerEvents = "none";
      this.container.appendChild(effectsContainer);

      // Add confetti effect
      WebGLEffects.initParticleSystem(effectsContainer.id, {
        particleCount: 300,
        particleSize: 0.15,
        animationDuration: 4,
      });

      if (callback) {
        // Assuming the celebration animation is about 3 seconds
        setTimeout(() => {
          // Clean up effects container
          if (this.container.contains(effectsContainer)) {
            this.container.removeChild(effectsContainer);
          }
          callback();
        }, 3000);
      } else {
        // Clean up effects container after animation
        setTimeout(() => {
          if (this.container.contains(effectsContainer)) {
            this.container.removeChild(effectsContainer);
          }
        }, 4000);
      }
    }
  }

  /**
   * Public API: Change the current environment
   * @param {string} environmentId - The ID of the environment to load
   */
  changeEnvironment(environmentId) {
    this._loadEnvironment(environmentId);
  }

  /**
   * Public API: Make a character look at another character or position
   * @param {string} characterId - The ID of the character that will look
   * @param {string|THREE.Vector3} target - The ID of the target character or a position
   * @param {boolean} smooth - Whether to smoothly transition to looking at the target
   */
  characterLookAt(characterId, target, smooth = true) {
    const controller = this.characterControllers[characterId];
    if (!controller) return;

    let targetPosition;

    // If target is a character ID, get its position
    if (typeof target === "string") {
      const targetController = this.characterControllers[target];
      if (targetController && targetController.model) {
        targetPosition = targetController.model.scene.position.clone();
        targetPosition.y += 1.6; // Aim at the head approximately
      }
    }
    // If target is a Vector3, use it directly
    else if (target instanceof THREE.Vector3) {
      targetPosition = target;
    }

    if (targetPosition) {
      controller.lookAt(targetPosition, smooth);
    }
  }

  /**
   * Public API: Make a character walk to a position
   * @param {string} characterId - The ID of the character
   * @param {THREE.Vector3} position - The target position
   * @param {Function} callback - Optional callback when movement completes
   */
  characterWalkTo(characterId, position, callback) {
    const controller = this.characterControllers[characterId];
    if (!controller) return;

    // Start movement
    const checkInterval = setInterval(() => {
      const finished = controller.moveTowards(position, 0.05, "walk");
      if (finished) {
        clearInterval(checkInterval);
        if (callback) callback();
      }
    }, 16);
  }

  /**
   * Public API: Add visual effects around a character
   * @param {string} characterId - The ID of the character
   * @param {string} effectType - The type of effect ('glow', 'ripple', etc.)
   * @param {Object} options - Effect options
   */
  addCharacterEffect(characterId, effectType, options = {}) {
    const controller = this.characterControllers[characterId];
    if (!controller || !controller.model) return;

    // Create container for the effect
    const effectsContainer = document.createElement("div");
    effectsContainer.id = `effects-${characterId}-${Date.now()}`;
    effectsContainer.style.position = "absolute";
    effectsContainer.style.top = "0";
    effectsContainer.style.left = "0";
    effectsContainer.style.width = "100%";
    effectsContainer.style.height = "100%";
    effectsContainer.style.pointerEvents = "none";
    this.container.appendChild(effectsContainer);

    // Apply the requested effect
    let effect;
    switch (effectType) {
      case "glow":
        // For glow, we need to create a special material and apply it
        // Simplified version using WebGLEffects
        effect = WebGLEffects.createGlowEffect(effectsContainer.id, {
          color: options.color || "#6366f1",
          intensity: options.intensity || 0.5,
          duration: options.duration || 3,
        });
        break;

      case "ripple":
        effect = WebGLEffects.createWaterRipple(effectsContainer.id, {
          color: options.color || 0x6699ff,
          duration: options.duration || 4,
        });
        break;

      case "particles":
        effect = WebGLEffects.initParticleSystem(effectsContainer.id, options);
        break;

      default:
        console.warn(`Effect type "${effectType}" not implemented`);
        break;
    }

    // Clean up container when effect is done
    setTimeout(
      () => {
        if (this.container.contains(effectsContainer)) {
          this.container.removeChild(effectsContainer);
        }
      },
      (options.duration || 3) * 1000 + 100,
    );

    return effect;
  }

  /**
   * Public API: Dispose of the character system
   * Clean up resources and remove event listeners
   */
  dispose() {
    // Stop animation loop
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }

    // Remove event listeners
    window.removeEventListener("resize", this._onWindowResize);
    this.container.removeEventListener("click", this._onClick);

    // Dispose of character controllers
    Object.values(this.characterControllers).forEach((controller) => {
      controller.dispose();
    });

    // Clean up WebGL effects
    WebGLEffects.cleanupAll();

    // Clean up Three.js resources
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    // Remove renderer from DOM
    if (this.renderer && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }

    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.characterControllers = {};
    this.currentEnvironment = null;
  }
}

export default WindgapCharacterSystem;

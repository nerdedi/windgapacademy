import * as THREE from "three";

/**
 * Character Controller for 3D characters in Windgap Academy
 * Manages animations, interactions, and behaviors for GLTF models
 */
class CharacterController {
  /**
   * Create a new character controller
   * @param {Object} model - The loaded GLTF model
   * @param {Object} options - Configuration options
   */
  constructor(model, options = {}) {
    this.model = model;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.animations = {};
    this.currentAction = null;

    const defaultOptions = {
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      animationCrossFade: 0.3,
      lookAtTarget: null,
      interactiveDistance: 1.5,
      idleAnimation: "idle",
    };

    this.options = { ...defaultOptions, ...options };

    this.init();
  }

  /**
   * Initialize the character controller
   */
  init() {
    if (!this.model) {
      console.error("No model provided to CharacterController");
      return;
    }

    // Apply scale and position
    this.model.scene.scale.set(this.options.scale, this.options.scale, this.options.scale);

    this.model.scene.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z,
    );

    this.model.scene.rotation.set(
      this.options.rotation.x,
      this.options.rotation.y,
      this.options.rotation.z,
    );

    // Setup animation mixer if animations exist
    if (this.model.animations && this.model.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.model.scene);

      // Store all animations by name for easy access
      this.model.animations.forEach((clip) => {
        this.animations[clip.name] = this.mixer.clipAction(clip);
      });

      // Start idle animation if available
      if (this.options.idleAnimation && this.animations[this.options.idleAnimation]) {
        this.playAnimation(this.options.idleAnimation);
      }
    }
  }

  /**
   * Play an animation by name
   * @param {string} name - Animation name
   * @param {Object} options - Animation options
   * @returns {Object} - The animation action
   */
  playAnimation(name, options = {}) {
    if (!this.animations[name]) {
      console.warn(`Animation "${name}" not found`);
      return null;
    }

    const defaultOptions = {
      loop: THREE.LoopRepeat,
      clampWhenFinished: false,
      fadeIn: this.options.animationCrossFade,
    };

    const config = { ...defaultOptions, ...options };

    // Stop current animation with crossfade
    if (this.currentAction && this.currentAction !== this.animations[name]) {
      this.currentAction.fadeOut(config.fadeIn);
    }

    // Configure and play the new animation
    const action = this.animations[name];
    action.reset();
    action.setLoop(config.loop);
    action.clampWhenFinished = config.clampWhenFinished;
    action.fadeIn(config.fadeIn);
    action.play();

    this.currentAction = action;
    return action;
  }

  /**
   * Make the character look at a target
   * @param {THREE.Vector3} target - The target position to look at
   * @param {boolean} smooth - Whether to smoothly transition to looking at the target
   * @param {number} speed - Speed of the smooth look transition
   */
  lookAt(target, smooth = false, speed = 0.05) {
    if (!target) return;

    if (!smooth) {
      this.model.scene.lookAt(target);
      return;
    }

    // Store target for smooth look in update method
    this.options.lookAtTarget = {
      position: target,
      speed: speed,
    };
  }

  /**
   * Check if the character is looking at a target
   * @param {THREE.Vector3} target - The target position
   * @param {number} threshold - Angle threshold in radians
   * @returns {boolean} - Whether the character is looking at the target
   */
  isLookingAt(target, threshold = 0.1) {
    if (!target) return false;

    const direction = new THREE.Vector3();
    const characterForward = new THREE.Vector3(0, 0, 1);
    characterForward.applyQuaternion(this.model.scene.quaternion);

    direction.subVectors(target, this.model.scene.position).normalize();

    const dot = direction.dot(characterForward);
    return dot > Math.cos(threshold);
  }

  /**
   * Check if a position is within interaction distance
   * @param {THREE.Vector3} position - The position to check
   * @returns {boolean} - Whether the position is within interaction distance
   */
  isWithinInteractionDistance(position) {
    if (!position) return false;

    const distance = position.distanceTo(this.model.scene.position);
    return distance <= this.options.interactiveDistance;
  }

  /**
   * Move the character towards a target position
   * @param {THREE.Vector3} target - The target position
   * @param {number} speed - Movement speed
   * @param {string} walkAnimation - The walk animation name
   * @returns {boolean} - Whether the character reached the target
   */
  moveTowards(target, speed = 0.05, walkAnimation = "walk") {
    if (!target) return false;

    const direction = new THREE.Vector3();
    direction.subVectors(target, this.model.scene.position).normalize();

    // Rotate character to face movement direction
    if (direction.length() > 0.001) {
      const lookAtPoint = new THREE.Vector3().copy(this.model.scene.position).add(direction);
      this.model.scene.lookAt(lookAtPoint);
    }

    // Calculate distance to target
    const distance = this.model.scene.position.distanceTo(target);

    // If we're close enough, stop
    if (distance < 0.1) {
      if (this.currentAction && this.currentAction === this.animations[walkAnimation]) {
        this.playAnimation(this.options.idleAnimation);
      }
      return true;
    }

    // Play walk animation if available
    if (this.animations[walkAnimation] && this.currentAction !== this.animations[walkAnimation]) {
      this.playAnimation(walkAnimation);
    }

    // Move character
    const moveDistance = Math.min(speed, distance);
    this.model.scene.position.add(direction.multiplyScalar(moveDistance));

    return false;
  }

  /**
   * Update the character controller
   * @param {number} deltaTime - Time since last update in seconds
   */
  update(deltaTime = null) {
    const dt = deltaTime || this.clock.getDelta();

    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(dt);
    }

    // Smooth look at target if set
    if (this.options.lookAtTarget) {
      const target = this.options.lookAtTarget.position;
      const speed = this.options.lookAtTarget.speed;

      // Get current and target quaternions
      const currentQ = this.model.scene.quaternion.clone();

      // Create a temporary object to get the target quaternion
      const tempObj = new THREE.Object3D();
      tempObj.position.copy(this.model.scene.position);
      tempObj.lookAt(target);
      const targetQ = tempObj.quaternion;

      // Smoothly interpolate between them
      THREE.Quaternion.slerp(currentQ, targetQ, this.model.scene.quaternion, speed);
    }
  }

  /**
   * Play a reaction animation
   * @param {string} emotion - The emotion to react with
   * @param {Function} callback - Optional callback when animation completes
   */
  react(emotion, callback = null) {
    const emotionMap = {
      happy: "happy",
      sad: "sad",
      surprised: "surprised",
      confused: "confused",
      excited: "excited",
      // Map more emotions to animation names
    };

    const animationName = emotionMap[emotion] || emotion;

    if (this.animations[animationName]) {
      const action = this.playAnimation(animationName, {
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
      });

      if (callback && action) {
        // Set up callback for when animation completes
        const mixer = this.mixer;
        const returnToIdle = () => {
          this.playAnimation(this.options.idleAnimation);
          callback();
          mixer.removeEventListener("finished", returnToIdle);
        };

        mixer.addEventListener("finished", returnToIdle);
      } else if (action) {
        // Auto return to idle after animation
        const mixer = this.mixer;
        const returnToIdle = () => {
          this.playAnimation(this.options.idleAnimation);
          mixer.removeEventListener("finished", returnToIdle);
        };

        mixer.addEventListener("finished", returnToIdle);
      }

      return true;
    } else {
      console.warn(`No animation found for emotion: ${emotion}`);
      return false;
    }
  }

  /**
   * Dispose of the character controller
   */
  dispose() {
    if (this.mixer) {
      this.mixer.stopAllAction();
      // The mixer doesn't need explicit disposal
    }

    // Clear references
    this.model = null;
    this.mixer = null;
    this.animations = {};
    this.currentAction = null;
  }
}

export default CharacterController;

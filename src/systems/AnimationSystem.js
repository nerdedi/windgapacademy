import { gsap } from "gsap";
import * as THREE from "three";
class AnimationSystem {
  constructor({ debug = false } = {}) {
    this.debug = debug;
    this.animations = new Map();
    this.activeSpriteAnimations = new Set();
    this.skeletalRigs = new Map();
    this.blendTrees = new Map();
    this.stateMachines = new Map();
    this._rafId = null;
    this._lastTime = null;
  }
  // Internal logging (debug-only)
  _log(message) {
    if (this.debug) console.info(message);
  }
  // Start a managed RAF loop (optional)
  start(updateFn) {
    const tick = (time) => {
      if (this._lastTime == null) this._lastTime = time;
      const deltaTime = (time - this._lastTime) / 1000; // seconds
      this._lastTime = time;
      try {
        updateFn?.(deltaTime);
      } catch (e) {
        this._log(e);
      }
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }
  stop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._lastTime = null;
  }
  // Sprite Sequencing with Frame Counter
  createSpriteAnimation(id, config) {
    const animation = {
      id,
      frames: config.frames || [],
      currentFrame: 0,
      frameRate: config.frameRate || 60,
      loop: config.loop !== false,
      playing: false,
      lastFrameTime: 0,
      onComplete: config.onComplete,
      blendMode: config.blendMode || "normal",
      interpolation: config.interpolation || "linear",
    };
    animation.loadedFrames = this.preloadFrames(animation.frames);
    this.animations.set(id, animation);
    return animation;
  }
  preloadFrames(frames) {
    return frames.map((src) => ({ src, loaded: true, element: null }));
  }
  updateSpriteAnimation(id, deltaTimeMs) {
    const animation = this.animations.get(id);
    if (!animation || !animation.playing) return null;
    const frameDuration = 1000 / animation.frameRate;
    animation.lastFrameTime += deltaTimeMs;
    if (animation.lastFrameTime >= frameDuration) {
      if (animation.frameRate > 30) this.applyMotionBlur(animation);
      animation.currentFrame = (animation.currentFrame + 1) % animation.frames.length;
      animation.lastFrameTime = 0;
      if (animation.currentFrame === 0 && !animation.loop) {
        animation.playing = false;
        animation.onComplete?.();
      }
    }
    return animation.loadedFrames[animation.currentFrame];
  }
  applyMotionBlur(animation) {
    this._log(`Motion blur: ${animation.id}`);
  }
  // Skeletal rigs (IK + procedural)
  createSkeletalRig(modelId, bones, config = {}) {
    const rig = {
      id: modelId,
      bones: new Map(bones),
      constraints: config.constraints || [],
      ikChains: config.ikChains || [],
      blendShapes: config.blendShapes || [],
      currentPose: null,
      targetPose: null,
      blendWeight: 0,
      ikSolver: config.enableIK ? this.createIKSolver(bones, config.ikChains || []) : null,
      proceduralAnimations: config.procedural
        ? this.setupProceduralAnimations(config.procedural)
        : null,
    };
    this.skeletalRigs.set(modelId, rig);
    return rig;
  }
  createStateMachine(id, states, transitions) {
    const machine = {
      id,
      states: new Map(states),
      transitions: new Map(transitions),
      currentState: null,
      previousState: null,
      transitionProgress: 0,
      parameters: new Map(),
    };
    machine.blendTree = this.createBlendTree({
      states: Array.from(states.keys()),
      blendType: "directional",
      parameters: ["velocityX", "velocityY", "speed"],
    });
    this.stateMachines.set(id, machine);
    return machine;
  }
  createBlendTree(config) {
    return {
      type: config.blendType,
      nodes: config.states.map((state) => ({ state, weight: 0, position: { x: 0, y: 0 } })),
      parameters: new Map(config.parameters.map((p) => [p, 0])),
      blendFunction: this.getBlendFunction(config.blendType),
    };
  }
  getBlendFunction(type) {
    const fns = {
      directional: this.directionalBlend,
      simple: this.simpleBlend,
      freeform: this.freeformBlend,
    };
    return fns[type] || fns.simple;
  }
  directionalBlend(parameters, nodes) {
    return nodes.map((n) => ({ ...n, weight: 0.5 }));
  }
  simpleBlend(parameters, nodes) {
    return nodes.map((n) => ({ ...n, weight: 1.0 / nodes.length }));
  }
  freeformBlend(parameters, nodes) {
    return nodes.map((n) => ({ ...n, weight: 0.5 }));
  }
  updateSkeletalAnimation(rigId, deltaTime) {
    const rig = this.skeletalRigs.get(rigId);
    if (!rig) return;
    if (rig.targetPose && rig.blendWeight < 1) {
      rig.blendWeight = Math.min(1, rig.blendWeight + deltaTime * 2);
      this.blendPoses(rig.currentPose, rig.targetPose, rig.blendWeight);
    }
    rig.ikSolver?.solve(rig.bones, rig.ikChains);
    if (rig.proceduralAnimations) this.applyProceduralAnimations(rig, deltaTime);
    this.updateBoneTransforms(rig);
  }
  blendPoses(currentPose, targetPose, weight) {
    return currentPose;
  }
  updateBoneTransforms(rig) {
    this._log(`Update bone transforms: ${rig.id}`);
  }
  createIKSolver(bones, chains) {
    return {
      solve: (b, c) => {
        c.forEach((chain) => {
          const iterations = 10,
            tolerance = 0.01;
          for (let i = 0; i < iterations; i++) {
            this.forwardReaching(chain, b);
            this.backwardReaching(chain, b);
            if (this.getDistance(chain.endEffector, chain.target) < tolerance) break;
          }
        });
      },
    };
  }
  forwardReaching(chain, bones) {
    this._log(`IK forward: ${chain.id}`);
  }
  backwardReaching(chain, bones) {
    this._log(`IK backward: ${chain.id}`);
  }
  getDistance(a, b) {
    return 0.1;
  }
  setupProceduralAnimations(config) {
    return {
      breathing: {
        enabled: !!config.breathing,
        rate: config.breathingRate || 1.0,
        amplitude: config.breathingAmplitude || 0.1,
        phase: 0,
      },
      lookAt: {
        enabled: !!config.lookAt,
        target: null,
        smoothing: config.lookAtSmoothing || 0.1,
        limits: config.lookAtLimits || { x: [-45, 45], y: [-30, 30] },
      },
      idle: {
        enabled: !!config.idle,
        variations: config.idleVariations || ["sway", "shift", "fidget"],
        currentVariation: null,
        timer: 0,
        frequency: config.idleFrequency || 5000,
      },
    };
  }
  applyProceduralAnimations(rig, deltaTime) {
    const proc = rig.proceduralAnimations;
    if (proc.breathing.enabled) {
      proc.breathing.phase += deltaTime * proc.breathing.rate;
      const breathingOffset = Math.sin(proc.breathing.phase) * proc.breathing.amplitude;
      this._log(`Breathing offset: ${breathingOffset}`);
    }
    if (proc.lookAt.enabled && proc.lookAt.target) this._log(`LookAt -> ${proc.lookAt.target}`);
    if (proc.idle.enabled) {
      proc.idle.timer += deltaTime;
      if (proc.idle.timer > proc.idle.frequency) {
        proc.idle.timer = 0;
        proc.idle.currentVariation =
          proc.idle.variations[Math.floor(Math.random() * proc.idle.variations.length)];
        this._log(`Idle variation: ${proc.idle.currentVariation}`);
      }
    }
  }
  applyIdleVariation(rig, variation, deltaTime) {
    this._log(`Apply idle: ${variation}`);
  }
  applyPhysicsAnimation(object, config) {
    const physics = {
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      mass: config.mass || 1.0,
      damping: config.damping || 0.95,
      springs: config.springs || [],
      constraints: config.constraints || [],
    };
    physics.acceleration.add(config.gravity || new THREE.Vector3(0, -9.81, 0));
    physics.springs.forEach((spring) => {
      const force = this.calculateSpringForce(spring);
      physics.acceleration.add(force.divideScalar(physics.mass));
    });
    physics.velocity.add(physics.acceleration.multiplyScalar(config.deltaTime));
    physics.velocity.multiplyScalar(physics.damping);
    object.position.add(physics.velocity.clone().multiplyScalar(config.deltaTime));
    return physics;
  }
  calculateSpringForce(spring) {
    return new THREE.Vector3();
  }
}
export default AnimationSystem;

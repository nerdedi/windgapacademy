/**
 * WebGLEffects.js - Advanced WebGL effects system for Windgap Academy
 *
 * Features:
 * - Particle systems with customizable behaviors
 * - Ripple and wave effects for interactive surfaces
 * - Glow highlights for UI elements
 * - Post-processing effects for scene enhancement
 * - Dynamic lighting and shadow effects
 * - Shader-based transitions between scenes
 * - Weather and environment effects
 * - Performance optimization with adaptive quality
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Color, Vector2, Vector3 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// Custom shaders
const RippleShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    center: { value: new Vector2(0.5, 0.5) },
    radius: { value: 0.1 },
    width: { value: 0.05 },
    amplitude: { value: 0.02 },
    waveFactor: { value: 20.0 },
    decay: { value: 0.95 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 center;
    uniform float radius;
    uniform float width;
    uniform float amplitude;
    uniform float waveFactor;
    uniform float decay;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 dir = uv - center;
      float dist = length(dir);

      // Calculate wave effect
      float waveAmp = amplitude * pow(decay, time * 10.0);
      float waveWidth = width * (1.0 + time);
      float waveRadius = radius * (1.0 + time * 2.0);

      // Apply ripple effect if within wave radius
      if (dist <= waveRadius + waveWidth && dist >= waveRadius - waveWidth) {
        float diff = (dist - waveRadius);
        float phase = 1.0 - sin(diff * waveFactor);
        float offset = phase * waveAmp;
        uv = uv + normalize(dir) * offset;
      }

      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `,
};

const GlowShader = {
  uniforms: {
    tDiffuse: { value: null },
    glowColor: { value: new Color(0x88ccff) },
    glowAmount: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 glowColor;
    uniform float glowAmount;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float brightness = (texel.r + texel.g + texel.b) / 3.0;

      // Apply glow to bright areas
      if (brightness > 0.7) {
        float glowFactor = smoothstep(0.7, 1.0, brightness);
        vec3 glow = mix(texel.rgb, glowColor, glowAmount * glowFactor);
        gl_FragColor = vec4(glow, texel.a);
      } else {
        gl_FragColor = texel;
      }
    }
  `,
};

// Particle System Class
class ParticleSystem {
  constructor(options = {}) {
    this.options = {
      count: options.count || 1000,
      size: options.size || { min: 0.1, max: 0.5 },
      speed: options.speed || { min: 0.1, max: 1.0 },
      lifetime: options.lifetime || { min: 1.0, max: 5.0 },
      color: options.color || { start: new Color(0x88ccff), end: new Color(0x1144aa) },
      shape: options.shape || "sphere",
      radius: options.radius || 5,
      texture: options.texture || null,
      blending: options.blending || THREE.AdditiveBlending,
      direction: options.direction || new Vector3(0, 1, 0),
      spread: options.spread || Math.PI / 4,
      gravity: options.gravity || 0.1,
      emitterShape: options.emitterShape || "point",
      emitterSize: options.emitterSize || new Vector3(1, 1, 1),
      spawnRate: options.spawnRate || 0, // 0 means all at once
      randomizeVelocity: options.randomizeVelocity !== undefined ? options.randomizeVelocity : true,
      fadeIn: options.fadeIn !== undefined ? options.fadeIn : true,
      fadeOut: options.fadeOut !== undefined ? options.fadeOut : true,
      loop: options.loop !== undefined ? options.loop : true,
      ...options,
    };

    // Create geometry and material
    this.initialize();
  }

  initialize() {
    this.particles = [];
    this.active = true;
    this.elapsedTime = 0;
    this.lastSpawnTime = 0;

    // Create arrays for particle attributes
    this.positions = new Float32Array(this.options.count * 3);
    this.colors = new Float32Array(this.options.count * 3);
    this.sizes = new Float32Array(this.options.count);
    this.opacities = new Float32Array(this.options.count);
    this.lifetimes = new Float32Array(this.options.count);
    this.velocities = new Float32Array(this.options.count * 3);

    // Create geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute("size", new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute("opacity", new THREE.BufferAttribute(this.opacities, 1));

    // Create material
    const material = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      blending: this.options.blending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // Apply texture if provided
    if (this.options.texture) {
      const loader = new THREE.TextureLoader();
      material.map = loader.load(this.options.texture);
      material.alphaTest = 0.01;
    }

    // Create mesh
    this.points = new THREE.Points(this.geometry, material);

    // Set initial state
    if (this.options.spawnRate === 0) {
      this.initializeParticles();
    }
  }

  initializeParticles() {
    for (let i = 0; i < this.options.count; i++) {
      this.createParticle(i);
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
  }

  createParticle(index) {
    // Initial position based on emitter shape
    let position = new Vector3();
    switch (this.options.emitterShape) {
      case "box":
        position.x = (Math.random() - 0.5) * this.options.emitterSize.x;
        position.y = (Math.random() - 0.5) * this.options.emitterSize.y;
        position.z = (Math.random() - 0.5) * this.options.emitterSize.z;
        break;
      case "sphere": {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.cbrt(Math.random()) * this.options.emitterSize.x;
        position.x = r * Math.sin(phi) * Math.cos(theta);
        position.y = r * Math.sin(phi) * Math.sin(theta);
        position.z = r * Math.cos(phi);
        break;
      }
      case "point":
      default:
        position.set(0, 0, 0);
        break;
    }

    // Set initial position
    this.positions[index * 3] = position.x;
    this.positions[index * 3 + 1] = position.y;
    this.positions[index * 3 + 2] = position.z;

    // Set initial velocity
    let velocity = new Vector3();
    if (this.options.randomizeVelocity) {
      // Random direction within spread cone
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * this.options.spread;

      velocity.x = Math.sin(phi) * Math.cos(theta);
      velocity.y = Math.cos(phi);
      velocity.z = Math.sin(phi) * Math.sin(theta);

      // Align with direction
      const dirMatrix = new THREE.Matrix4();
      dirMatrix.lookAt(new Vector3(0, 0, 0), this.options.direction, new Vector3(0, 1, 0));
      velocity.applyMatrix4(dirMatrix);
    } else {
      velocity.copy(this.options.direction).normalize();
    }

    // Apply speed
    const speed =
      this.options.speed.min + Math.random() * (this.options.speed.max - this.options.speed.min);
    velocity.multiplyScalar(speed);

    this.velocities[index * 3] = velocity.x;
    this.velocities[index * 3 + 1] = velocity.y;
    this.velocities[index * 3 + 2] = velocity.z;

    // Set lifetime
    this.lifetimes[index] =
      this.options.lifetime.min +
      Math.random() * (this.options.lifetime.max - this.options.lifetime.min);

    // Set size
    this.sizes[index] =
      this.options.size.min + Math.random() * (this.options.size.max - this.options.size.min);

    // Set color (initially start color)
    this.colors[index * 3] = this.options.color.start.r;
    this.colors[index * 3 + 1] = this.options.color.start.g;
    this.colors[index * 3 + 2] = this.options.color.start.b;

    // Set opacity
    this.opacities[index] = this.options.fadeIn ? 0 : 1;

    // Store particle data
    this.particles[index] = {
      active: true,
      age: 0,
    };
  }

  update(deltaTime) {
    if (!this.active) return;

    this.elapsedTime += deltaTime;

    // Spawn new particles if using spawn rate
    if (this.options.spawnRate > 0) {
      const spawnInterval = 1 / this.options.spawnRate;
      if (this.elapsedTime - this.lastSpawnTime >= spawnInterval) {
        this.lastSpawnTime = this.elapsedTime;

        // Find an inactive particle
        for (let i = 0; i < this.options.count; i++) {
          if (!this.particles[i] || !this.particles[i].active) {
            this.createParticle(i);
            break;
          }
        }
      }
    }

    // Update all particles
    for (let i = 0; i < this.options.count; i++) {
      if (!this.particles[i] || !this.particles[i].active) continue;

      const particle = this.particles[i];
      particle.age += deltaTime;

      // Check if particle has exceeded its lifetime
      if (particle.age >= this.lifetimes[i]) {
        if (this.options.loop) {
          this.createParticle(i);
        } else {
          particle.active = false;
          this.opacities[i] = 0;
        }
        continue;
      }

      // Calculate life progress (0 to 1)
      const lifeProgress = particle.age / this.lifetimes[i];

      // Update position based on velocity
      this.positions[i * 3] += this.velocities[i * 3] * deltaTime;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * deltaTime;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * deltaTime;

      // Apply gravity
      this.velocities[i * 3 + 1] -= this.options.gravity * deltaTime;

      // Update color based on life progress
      const startColor = this.options.color.start;
      const endColor = this.options.color.end;
      this.colors[i * 3] = startColor.r + (endColor.r - startColor.r) * lifeProgress;
      this.colors[i * 3 + 1] = startColor.g + (endColor.g - startColor.g) * lifeProgress;
      this.colors[i * 3 + 2] = startColor.b + (endColor.b - startColor.b) * lifeProgress;

      // Update opacity for fade in/out
      let opacity = 1.0;
      if (this.options.fadeIn && lifeProgress < 0.1) {
        opacity = lifeProgress / 0.1;
      } else if (this.options.fadeOut && lifeProgress > 0.9) {
        opacity = (1.0 - lifeProgress) / 0.1;
      }
      this.opacities[i] = opacity;
    }

    // Update geometry attributes
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.points.material.dispose();
    if (this.points.material.map) {
      this.points.material.map.dispose();
    }
  }

  play() {
    this.active = true;
  }

  pause() {
    this.active = false;
  }

  reset() {
    this.elapsedTime = 0;
    this.lastSpawnTime = 0;
    this.initializeParticles();
  }

  getMesh() {
    return this.points;
  }
}

// Effect system components
export const useRippleEffect = (options = {}) => {
  const { gl, scene, camera } = useThree();
  const composer = useRef();
  const [ripples, setRipples] = useState([]);
  const clock = useRef(new THREE.Clock());

  const config = useMemo(
    () => ({
      strength: options.strength || 1.0,
      radius: options.radius || 0.1,
      width: options.width || 0.05,
      amplitude: options.amplitude || 0.02,
      waveFactor: options.waveFactor || 20.0,
      maxRipples: options.maxRipples || 5,
      decaySpeed: options.decaySpeed || 0.5,
      ...options,
    }),
    [options],
  );

  // Initialize effect composer
  useEffect(() => {
    composer.current = new EffectComposer(gl);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    // Add FXAA pass
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = gl.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
    composer.current.addPass(fxaaPass);

    // Window resize handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      composer.current.setSize(width, height);
      fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
      fxaaPass.material.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      composer.current.passes.forEach((pass) => {
        if (pass.dispose) pass.dispose();
      });
    };
  }, [gl, scene, camera]);

  // Add a ripple at screen position
  const addRipple = useCallback(
    (screenX, screenY) => {
      // Convert screen position to UV coordinates
      const x = screenX / window.innerWidth;
      const y = 1.0 - screenY / window.innerHeight;

      // Create ripple pass
      const ripplePass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          time: { value: 0 },
          center: { value: new Vector2(x, y) },
          radius: { value: config.radius },
          width: { value: config.width },
          amplitude: { value: config.amplitude * config.strength },
          waveFactor: { value: config.waveFactor },
          decay: { value: 0.95 },
        },
        vertexShader: RippleShader.vertexShader,
        fragmentShader: RippleShader.fragmentShader,
      });

      // Add pass to composer
      composer.current.addPass(ripplePass);

      // Add to ripples array
      setRipples((prev) => {
        // Remove oldest ripple if at max capacity
        if (prev.length >= config.maxRipples) {
          const oldestPass = prev[0].pass;
          composer.current.removePass(oldestPass);
          return [...prev.slice(1), { pass: ripplePass, time: 0 }];
        }
        return [...prev, { pass: ripplePass, time: 0 }];
      });

      return ripplePass;
    },
    [config],
  );

  // Update ripples
  useFrame(() => {
    if (!composer.current || ripples.length === 0) return;

    const deltaTime = clock.current.getDelta();

    // Update ripples
    setRipples((prev) => {
      const updated = prev.map((ripple) => {
        ripple.time += deltaTime * config.decaySpeed;
        ripple.pass.uniforms.time.value = ripple.time;
        return ripple;
      });

      // Filter out ripples that have completed (time > 1.0)
      const active = updated.filter((ripple) => ripple.time < 1.0);

      // Remove passes for completed ripples
      updated.forEach((ripple) => {
        if (ripple.time >= 1.0) {
          composer.current.removePass(ripple.pass);
        }
      });

      return active;
    });

    // Render with composer
    composer.current.render(deltaTime);
  });

  return { addRipple };
};

// Glow effect hook
export const useGlowEffect = (options = {}) => {
  const { gl, scene, camera } = useThree();
  const composer = useRef();

  const config = useMemo(
    () => ({
      strength: options.strength || 0.5,
      radius: options.radius || 0.4,
      threshold: options.threshold || 0.85,
      color: options.color || new Color(0x88ccff),
      ...options,
    }),
    [options],
  );

  // Initialize effect composer
  useEffect(() => {
    composer.current = new EffectComposer(gl);

    // Add render pass
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    // Add bloom pass
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      config.strength,
      config.radius,
      config.threshold,
    );
    composer.current.addPass(bloomPass);

    // Add glow pass
    const glowPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        glowColor: { value: config.color },
        glowAmount: { value: config.strength },
      },
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
    });
    composer.current.addPass(glowPass);

    // Window resize handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      composer.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      composer.current.passes.forEach((pass) => {
        if (pass.dispose) pass.dispose();
      });
    };
  }, [gl, scene, camera, config]);

  // Update glow parameters
  const updateGlow = useCallback((params) => {
    if (!composer.current) return;

    const bloomPass = composer.current.passes.find((pass) => pass instanceof UnrealBloomPass);
    const glowPass = composer.current.passes.find((pass) => pass.uniforms?.glowColor !== undefined);

    if (bloomPass) {
      if (params.strength !== undefined) bloomPass.strength = params.strength;
      if (params.radius !== undefined) bloomPass.radius = params.radius;
      if (params.threshold !== undefined) bloomPass.threshold = params.threshold;
    }

    if (glowPass) {
      if (params.color !== undefined) glowPass.uniforms.glowColor.value = params.color;
      if (params.strength !== undefined) glowPass.uniforms.glowAmount.value = params.strength;
    }
  }, []);

  // Render with composer
  useFrame((_, delta) => {
    if (composer.current) {
      composer.current.render(delta);
    }
  });

  return { updateGlow };
};

// Weather effects
// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
// Removed duplicate export (class is exported in the aggregate export statement at the bottom)
class WeatherEffects {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      type: options.type || "rain", // rain, snow, fog, etc.
      intensity: options.intensity || 0.5,
      areaSize: options.areaSize || 20,
      height: options.height || 15,
      ...options,
    };

    this.effects = {
      rain: null,
      snow: null,
      fog: null,
      clouds: null,
    };

    this.active = false;
  }

  createRain() {
    if (this.effects.rain) return this.effects.rain;

    const rainOptions = {
      count: Math.floor(10000 * this.options.intensity),
      size: { min: 0.1, max: 0.3 },
      speed: { min: 15, max: 20 },
      lifetime: { min: 0.5, max: 1.0 },
      color: {
        start: new Color(0xaaaaff),
        end: new Color(0x8888ff),
      },
      shape: "box",
      blending: THREE.AdditiveBlending,
      direction: new Vector3(0, -1, 0),
      spread: Math.PI / 16,
      gravity: 9.8,
      emitterShape: "box",
      emitterSize: new Vector3(this.options.areaSize, 0.1, this.options.areaSize),
      spawnRate: 0,
      fadeIn: false,
      fadeOut: true,
      texture: this.options.rainTexture || null,
    };

    this.effects.rain = new ParticleSystem(rainOptions);
    const rainMesh = this.effects.rain.getMesh();
    rainMesh.position.y = this.options.height;
    this.scene.add(rainMesh);

    return this.effects.rain;
  }

  createSnow() {
    if (this.effects.snow) return this.effects.snow;

    const snowOptions = {
      count: Math.floor(5000 * this.options.intensity),
      size: { min: 0.1, max: 0.4 },
      speed: { min: 0.5, max: 2.0 },
      lifetime: { min: 4.0, max: 10.0 },
      color: {
        start: new Color(0xffffff),
        end: new Color(0xeeeeff),
      },
      shape: "sphere",
      blending: THREE.NormalBlending,
      direction: new Vector3(0, -1, 0),
      spread: Math.PI / 2,
      gravity: 0.05,
      emitterShape: "box",
      emitterSize: new Vector3(this.options.areaSize, 0.1, this.options.areaSize),
      spawnRate: 0,
      fadeIn: true,
      fadeOut: true,
      texture: this.options.snowTexture || null,
    };

    this.effects.snow = new ParticleSystem(snowOptions);
    const snowMesh = this.effects.snow.getMesh();
    snowMesh.position.y = this.options.height;
    this.scene.add(snowMesh);

    return this.effects.snow;
  }

  createFog() {
    if (this.effects.fog) return this.effects.fog;

    // Create fog
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.02 * this.options.intensity);
    this.effects.fog = this.scene.fog;

    return this.effects.fog;
  }

  setWeatherType(type) {
    // Clear current effect
    this.stop();

    this.options.type = type;
    this.start();
  }

  setIntensity(intensity) {
    this.options.intensity = Math.max(0, Math.min(1, intensity));

    // Update active effect
    if (this.active) {
      switch (this.options.type) {
        case "rain":
          if (this.effects.rain) {
            // Rain intensity affects particle count
            this.stop();
            this.start();
          }
          break;
        case "snow":
          if (this.effects.snow) {
            // Snow intensity affects particle count
            this.stop();
            this.start();
          }
          break;
        case "fog":
          if (this.effects.fog) {
            // Fog intensity affects density
            this.effects.fog.density = 0.02 * this.options.intensity;
          }
          break;
      }
    }
  }

  start() {
    if (this.active) return;

    switch (this.options.type) {
      case "rain":
        this.createRain();
        this.effects.rain.play();
        break;
      case "snow":
        this.createSnow();
        this.effects.snow.play();
        break;
      case "fog":
        this.createFog();
        break;
    }

    this.active = true;
  }

  stop() {
    if (!this.active) return;

    // Stop active effect
    switch (this.options.type) {
      case "rain":
        if (this.effects.rain) {
          this.effects.rain.pause();
        }
        break;
      case "snow":
        if (this.effects.snow) {
          this.effects.snow.pause();
        }
        break;
      case "fog":
        if (this.effects.fog) {
          this.scene.fog = null;
        }
        break;
    }

    this.active = false;
  }

  update(deltaTime) {
    if (!this.active) return;

    // Update active effect
    switch (this.options.type) {
      case "rain":
        if (this.effects.rain) {
          this.effects.rain.update(deltaTime);
        }
        break;
      case "snow":
        if (this.effects.snow) {
          this.effects.snow.update(deltaTime);
        }
        break;
    }
  }

  dispose() {
    // Dispose all effects
    if (this.effects.rain) {
      this.scene.remove(this.effects.rain.getMesh());
      this.effects.rain.dispose();
    }

    if (this.effects.snow) {
      this.scene.remove(this.effects.snow.getMesh());
      this.effects.snow.dispose();
    }

    if (this.effects.fog) {
      this.scene.fog = null;
    }

    this.active = false;
  }
}

// Main WebGL Effects System
class WebGLEffects {
  constructor(renderer, scene, camera, options = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.options = {
      enablePostProcessing: options.enablePostProcessing !== false,
      dynamicLighting: options.dynamicLighting !== false,
      adaptiveQuality: options.adaptiveQuality !== false,
      ...options,
    };

    this.clock = new THREE.Clock();
    this.particleSystems = [];
    this.weatherEffects = null;
    this.composer = null;

    this.passes = {
      bloom: null,
      glow: null,
      ripple: null,
    };

    if (this.options.enablePostProcessing) {
      this.setupPostProcessing();
    }

    if (this.options.adaptiveQuality) {
      this.setupPerformanceMonitoring();
    }
  }

  setupPostProcessing() {
    // Create effect composer
    this.composer = new EffectComposer(this.renderer);

    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add bloom pass
    if (this.options.bloom !== false) {
      const bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85,
      );
      this.composer.addPass(bloomPass);
      this.passes.bloom = bloomPass;
    }

    // Add FXAA pass
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
    this.composer.addPass(fxaaPass);

    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  setupPerformanceMonitoring() {
    this.performanceStats = {
      fps: 60,
      frameTime: 0,
      quality: 1.0,
    };

    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateInterval = 1.0; // Update FPS every second
    this.fpsUpdateTime = 0;
  }

  handleResize() {
    if (!this.renderer || !this.composer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    // Update FXAA pass
    const fxaaPass = this.composer.passes.find(
      (pass) => pass.material?.uniforms?.resolution !== undefined,
    );
    if (fxaaPass) {
      const pixelRatio = this.renderer.getPixelRatio();
      fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
      fxaaPass.material.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
    }

    // Update camera aspect ratio
    if (this.camera.isPerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  createParticleSystem(options) {
    const particleSystem = new ParticleSystem(options);
    this.scene.add(particleSystem.getMesh());
    this.particleSystems.push(particleSystem);
    return particleSystem;
  }

  createWeatherEffects(options) {
    if (this.weatherEffects) {
      this.weatherEffects.dispose();
    }

    this.weatherEffects = new WeatherEffects(this.scene, options);
    return this.weatherEffects;
  }

  addRippleEffect(x, y) {
    if (!this.composer) return;

    // Convert screen position to UV coordinates
    const screenX = x / window.innerWidth;
    const screenY = 1.0 - y / window.innerHeight;

    // Create ripple shader pass
    const ripplePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        center: { value: new Vector2(screenX, screenY) },
        radius: { value: 0.1 },
        width: { value: 0.05 },
        amplitude: { value: 0.02 },
        waveFactor: { value: 20.0 },
        decay: { value: 0.95 },
      },
      vertexShader: RippleShader.vertexShader,
      fragmentShader: RippleShader.fragmentShader,
    });

    // Add pass to composer
    this.composer.addPass(ripplePass);

    // Store pass for updates
    this.passes.ripple = ripplePass;

    // Remove pass after animation completes
    setTimeout(() => {
      if (this.composer && this.passes.ripple === ripplePass) {
        this.composer.removePass(ripplePass);
        this.passes.ripple = null;
      }
    }, 1000);

    return ripplePass;
  }

  updateBloom(params) {
    if (!this.passes.bloom) return;

    if (params.strength !== undefined) this.passes.bloom.strength = params.strength;
    if (params.radius !== undefined) this.passes.bloom.radius = params.radius;
    if (params.threshold !== undefined) this.passes.bloom.threshold = params.threshold;
  }

  updateQuality(qualityFactor) {
    // Clamp quality factor between 0.2 and 1.0
    const quality = Math.max(0.2, Math.min(1.0, qualityFactor));
    this.performanceStats.quality = quality;

    // Adjust renderer pixel ratio
    this.renderer.setPixelRatio(window.devicePixelRatio * quality);

    // Adjust post-processing
    if (this.passes.bloom) {
      // Reduce bloom quality when performance is low
      this.passes.bloom.strength = Math.min(1.5, 1.5 * quality);
      this.passes.bloom.radius = Math.min(0.4, 0.4 * quality);
    }

    // Adjust particle systems
    this.particleSystems.forEach((system) => {
      // Reduce active particles when performance is low
      const visibleCount = Math.floor(system.options.count * quality);
      for (let i = 0; i < system.options.count; i++) {
        if (system.particles[i]) {
          system.particles[i].active = i < visibleCount;
          if (i >= visibleCount) {
            system.opacities[i] = 0;
          }
        }
      }
    });
  }

  update() {
    const deltaTime = this.clock.getDelta();

    // Update particle systems
    this.particleSystems.forEach((system) => {
      system.update(deltaTime);
    });

    // Update weather effects
    if (this.weatherEffects && this.weatherEffects.active) {
      this.weatherEffects.update(deltaTime);
    }

    // Update ripple effect
    if (this.passes.ripple) {
      this.passes.ripple.uniforms.time.value += deltaTime;

      // Remove ripple pass when animation completes
      if (this.passes.ripple.uniforms.time.value >= 1.0) {
        this.composer.removePass(this.passes.ripple);
        this.passes.ripple = null;
      }
    }

    // Update performance monitoring
    if (this.options.adaptiveQuality) {
      this.updatePerformance();
    }
  }

  updatePerformance() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameCount++;
    this.fpsUpdateTime += frameTime / 1000;

    // Update FPS every second
    if (this.fpsUpdateTime >= this.fpsUpdateInterval) {
      this.performanceStats.fps = Math.round(this.frameCount / this.fpsUpdateTime);
      this.performanceStats.frameTime = frameTime;
      this.frameCount = 0;
      this.fpsUpdateTime = 0;

      // Adjust quality based on performance
      if (this.performanceStats.fps < 30) {
        this.updateQuality(this.performanceStats.quality * 0.9);
      } else if (this.performanceStats.fps > 55 && this.performanceStats.quality < 1.0) {
        this.updateQuality(this.performanceStats.quality * 1.1);
      }
    }
  }

  render() {
    if (this.composer && this.options.enablePostProcessing) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    // Clean up particle systems
    this.particleSystems.forEach((system) => {
      this.scene.remove(system.getMesh());
      system.dispose();
    });
    this.particleSystems = [];

    // Clean up weather effects
    if (this.weatherEffects) {
      this.weatherEffects.dispose();
      this.weatherEffects = null;
    }

    // Clean up post-processing
    if (this.composer) {
      this.composer.passes.forEach((pass) => {
        if (pass.dispose) pass.dispose();
      });
      this.composer = null;
    }

    // Remove event listeners
    window.removeEventListener("resize", this.handleResize);
  }
}

export { GlowShader, ParticleSystem, RippleShader, WeatherEffects, WebGLEffects };
export default WebGLEffects;

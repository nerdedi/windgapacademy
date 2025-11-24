import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Color, Vector2, Vector3 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
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
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float time; uniform vec2 center; uniform float radius; uniform float width; uniform float amplitude; uniform float waveFactor; uniform float decay; varying vec2 vUv; void main(){ vec2 uv = vUv; vec2 dir = uv - center; float dist = length(dir); float waveAmp = amplitude * pow(decay, time * 10.0); float waveWidth = width * (1.0 + time); float waveRadius = radius * (1.0 + time * 2.0); if (dist <= waveRadius + waveWidth && dist >= waveRadius - waveWidth){ float diff = (dist - waveRadius); float phase = 1.0 - sin(diff * waveFactor); float offset = phase * waveAmp; uv = uv + normalize(dir) * offset; } gl_FragColor = texture2D(tDiffuse, uv); }`,
};
const GlowShader = {
  uniforms: {
    tDiffuse: { value: null },
    glowColor: { value: new Color(0x88ccff) },
    glowAmount: { value: 0.5 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 glowColor; uniform float glowAmount; varying vec2 vUv; void main(){ vec4 texel = texture2D(tDiffuse, vUv); float brightness = (texel.r + texel.g + texel.b) / 3.0; if (brightness > 0.7){ float glowFactor = smoothstep(0.7, 1.0, brightness); vec3 glow = mix(texel.rgb, glowColor, glowAmount * glowFactor); gl_FragColor = vec4(glow, texel.a); } else { gl_FragColor = texel; } }`,
};
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
      spawnRate: options.spawnRate || 0,
      randomizeVelocity: options.randomizeVelocity !== undefined ? options.randomizeVelocity : true,
      fadeIn: options.fadeIn !== undefined ? options.fadeIn : true,
      fadeOut: options.fadeOut !== undefined ? options.fadeOut : true,
      loop: options.loop !== undefined ? options.loop : true,
      ...options,
    };
    this.initialize();
  }
  initialize() {
    this.particles = [];
    this.active = true;
    this.elapsedTime = 0;
    this.lastSpawnTime = 0;
    this.positions = new Float32Array(this.options.count * 3);
    this.colors = new Float32Array(this.options.count * 3);
    this.sizes = new Float32Array(this.options.count);
    this.opacities = new Float32Array(this.options.count);
    this.lifetimes = new Float32Array(this.options.count);
    this.velocities = new Float32Array(this.options.count * 3);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute("size", new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute("opacity", new THREE.BufferAttribute(this.opacities, 1));
    const material = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      blending: this.options.blending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    });
    if (this.options.texture) {
      const loader = new THREE.TextureLoader();
      material.map = loader.load(this.options.texture);
      material.alphaTest = 0.01;
    }
    this.points = new THREE.Points(this.geometry, material);
    if (this.options.spawnRate === 0) this.initializeParticles();
  }
  initializeParticles() {
    for (let i = 0; i < this.options.count; i++) this.createParticle(i);
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
  }
  createParticle(index) {
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
    }
    this.positions[index * 3] = position.x;
    this.positions[index * 3 + 1] = position.y;
    this.positions[index * 3 + 2] = position.z;
    let velocity = new Vector3();
    if (this.options.randomizeVelocity) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * this.options.spread;
      velocity.x = Math.sin(phi) * Math.cos(theta);
      velocity.y = Math.cos(phi);
      velocity.z = Math.sin(phi) * Math.sin(theta);
      const dirMatrix = new THREE.Matrix4();
      dirMatrix.lookAt(new Vector3(0, 0, 0), this.options.direction, new Vector3(0, 1, 0));
      velocity.applyMatrix4(dirMatrix);
    } else {
      velocity.copy(this.options.direction).normalize();
    }
    const speed =
      this.options.speed.min + Math.random() * (this.options.speed.max - this.options.speed.min);
    velocity.multiplyScalar(speed);
    this.velocities[index * 3] = velocity.x;
    this.velocities[index * 3 + 1] = velocity.y;
    this.velocities[index * 3 + 2] = velocity.z;
    this.lifetimes[index] =
      this.options.lifetime.min +
      Math.random() * (this.options.lifetime.max - this.options.lifetime.min);
    this.sizes[index] =
      this.options.size.min + Math.random() * (this.options.size.max - this.options.size.min);
    this.colors[index * 3] = this.options.color.start.r;
    this.colors[index * 3 + 1] = this.options.color.start.g;
    this.colors[index * 3 + 2] = this.options.color.start.b;
    this.opacities[index] = this.options.fadeIn ? 0 : 1;
    this.particles[index] = { active: true, age: 0 };
  }
  update(deltaTime) {
    if (!this.active) return;
    this.elapsedTime += deltaTime;
    if (this.options.spawnRate > 0) {
      const spawnInterval = 1 / this.options.spawnRate;
      if (this.elapsedTime - this.lastSpawnTime >= spawnInterval) {
        this.lastSpawnTime = this.elapsedTime;
        for (let i = 0; i < this.options.count; i++) {
          if (!this.particles[i] || !this.particles[i].active) {
            this.createParticle(i);
            break;
          }
        }
      }
    }
    for (let i = 0; i < this.options.count; i++) {
      if (!this.particles[i] || !this.particles[i].active) continue;
      const particle = this.particles[i];
      particle.age += deltaTime;
      if (particle.age >= this.lifetimes[i]) {
        if (this.options.loop) this.createParticle(i);
        else {
          particle.active = false;
          this.opacities[i] = 0;
        }
        continue;
      }
      const lifeProgress = particle.age / this.lifetimes[i];
      this.positions[i * 3] += this.velocities[i * 3] * deltaTime;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * deltaTime;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * deltaTime;
      this.velocities[i * 3 + 1] -= this.options.gravity * deltaTime;
      const s = this.options.color.start,
        e = this.options.color.end;
      this.colors[i * 3] = s.r + (e.r - s.r) * lifeProgress;
      this.colors[i * 3 + 1] = s.g + (e.g - s.g) * lifeProgress;
      this.colors[i * 3 + 2] = s.b + (e.b - s.b) * lifeProgress;
      let opacity = 1.0;
      if (this.options.fadeIn && lifeProgress < 0.1) opacity = lifeProgress / 0.1;
      else if (this.options.fadeOut && lifeProgress > 0.9) opacity = (1.0 - lifeProgress) / 0.1;
      this.opacities[i] = opacity;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
  }
  dispose() {
    this.geometry?.dispose();
    const mat = this.points?.material;
    mat?.map?.dispose?.();
    mat?.dispose?.();
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
  useEffect(() => {
    composer.current = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = gl.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
    composer.current.addPass(fxaaPass);
    const handleResize = () => {
      const width = window.innerWidth,
        height = window.innerHeight;
      composer.current.setSize(width, height);
      fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
      fxaaPass.material.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      composer.current.passes.forEach((p) => p.dispose?.());
    };
  }, [gl, scene, camera]);
  const addRipple = useCallback(
    (screenX, screenY) => {
      const x = screenX / window.innerWidth;
      const y = 1.0 - screenY / window.innerHeight;
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
      composer.current.addPass(ripplePass);
      setRipples((prev) => {
        if (prev.length >= config.maxRipples) {
          const oldest = prev[0].pass;
          composer.current.removePass(oldest);
          return [...prev.slice(1), { pass: ripplePass, time: 0 }];
        }
        return [...prev, { pass: ripplePass, time: 0 }];
      });
      return ripplePass;
    },
    [config],
  );
  useFrame(() => {
    if (!composer.current || ripples.length === 0) return;
    const deltaTime = clock.current.getDelta();
    setRipples((prev) => {
      const updated = prev.map((r) => {
        r.time += deltaTime * config.decaySpeed;
        r.pass.uniforms.time.value = r.time;
        return r;
      });
      updated.forEach((r) => {
        if (r.time >= 1.0) composer.current.removePass(r.pass);
      });
      return updated.filter((r) => r.time < 1.0);
    });
    composer.current.render(deltaTime);
  });
  return { addRipple };
};
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
  useEffect(() => {
    composer.current = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      config.strength,
      config.radius,
      config.threshold,
    );
    composer.current.addPass(bloomPass);
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
    const handleResize = () => {
      const width = window.innerWidth,
        height = window.innerHeight;
      composer.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      composer.current.passes.forEach((p) => p.dispose?.());
    };
  }, [gl, scene, camera, config]);
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
  useFrame((_, delta) => {
    composer.current?.render(delta);
  });
  return { updateGlow };
};
class WeatherEffects {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      type: options.type || "rain",
      intensity: Math.max(0, Math.min(1, options.intensity || 0.5)),
      areaSize: options.areaSize || 20,
      height: options.height || 15,
      ...options,
    };
    this.effects = { rain: null, snow: null, fog: null, clouds: null };
    this.active = false;
  }
  createRain() {
    if (this.effects.rain) return this.effects.rain;
    const rainOptions = {
      count: Math.floor(10000 * this.options.intensity),
      size: { min: 0.1, max: 0.3 },
      speed: { min: 15, max: 20 },
      lifetime: { min: 0.5, max: 1.0 },
      color: { start: new Color(0xaaaaff), end: new Color(0x8888ff) },
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
    const mesh = this.effects.rain.getMesh();
    mesh.position.y = this.options.height;
    this.scene.add(mesh);
    return this.effects.rain;
  }
  createSnow() {
    if (this.effects.snow) return this.effects.snow;
    const snowOptions = {
      count: Math.floor(5000 * this.options.intensity),
      size: { min: 0.1, max: 0.4 },
      speed: { min: 0.5, max: 2.0 },
      lifetime: { min: 4.0, max: 10.0 },
      color: { start: new Color(0xffffff), end: new Color(0xeeeeff) },
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
    const mesh = this.effects.snow.getMesh();
    mesh.position.y = this.options.height;
    this.scene.add(mesh);
    return this.effects.snow;
  }
  createFog() {
    if (this.effects.fog) return this.effects.fog;
    this.scene.fog = new THREE.FogExp2(0xcccccc, 0.02 * this.options.intensity);
    this.effects.fog = this.scene.fog;
    return this.effects.fog;
  }
  setWeatherType(type) {
    this.stop();
    this.options.type = type;
    this.start();
  }
  setIntensity(intensity) {
    this.options.intensity = Math.max(0, Math.min(1, intensity));
    if (this.active) {
      this.stop();
      this.start();
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
    switch (this.options.type) {
      case "rain":
        this.effects.rain?.pause();
        break;
      case "snow":
        this.effects.snow?.pause();
        break;
      case "fog":
        if (this.effects.fog) this.scene.fog = null;
        break;
    }
    this.active = false;
  }
  update(deltaTime) {
    if (!this.active) return;
    if (this.options.type === "rain") this.effects.rain?.update(deltaTime);
    else if (this.options.type === "snow") this.effects.snow?.update(deltaTime);
  }
  dispose() {
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
    this.passes = { bloom: null, glow: null, ripple: null };
    if (this.options.enablePostProcessing) this.setupPostProcessing();
    if (this.options.adaptiveQuality) this.setupPerformanceMonitoring();
    this._resizeHandler = this.handleResize.bind(this);
    window.addEventListener("resize", this._resizeHandler);
  }
  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    this.composer.addPass(bloomPass);
    this.passes.bloom = bloomPass;
    const fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
    this.composer.addPass(fxaaPass);
  }
  setupPerformanceMonitoring() {
    this.performanceStats = { fps: 60, frameTime: 0, quality: 1.0 };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsUpdateInterval = 1.0;
    this.fpsUpdateTime = 0;
  }
  handleResize() {
    if (!this.renderer) return;
    const width = window.innerWidth,
      height = window.innerHeight;
    this.renderer.setSize(width, height);
    if (this.composer) {
      this.composer.setSize(width, height);
      const fxaaPass = this.composer.passes.find(
        (p) => p.material?.uniforms?.resolution !== undefined,
      );
      if (fxaaPass) {
        const pr = this.renderer.getPixelRatio();
        fxaaPass.material.uniforms["resolution"].value.x = 1 / (width * pr);
        fxaaPass.material.uniforms["resolution"].value.y = 1 / (height * pr);
      }
    }
    if (this.camera.isPerspectiveCamera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
  createParticleSystem(options) {
    const ps = new ParticleSystem(options);
    this.scene.add(ps.getMesh());
    this.particleSystems.push(ps);
    return ps;
  }
  createWeatherEffects(options) {
    this.weatherEffects?.dispose();
    this.weatherEffects = new WeatherEffects(this.scene, options);
    return this.weatherEffects;
  }
  addRippleEffect(x, y) {
    if (!this.composer) return;
    const sx = x / window.innerWidth,
      sy = 1.0 - y / window.innerHeight;
    const ripplePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        center: { value: new Vector2(sx, sy) },
        radius: { value: 0.1 },
        width: { value: 0.05 },
        amplitude: { value: 0.02 },
        waveFactor: { value: 20.0 },
        decay: { value: 0.95 },
      },
      vertexShader: RippleShader.vertexShader,
      fragmentShader: RippleShader.fragmentShader,
    });
    this.composer.addPass(ripplePass);
    this.passes.ripple = ripplePass;
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
  updateQuality(q) {
    const quality = Math.max(0.2, Math.min(1.0, q));
    this.performanceStats.quality = quality;
    this.renderer.setPixelRatio(window.devicePixelRatio * quality);
    if (this.passes.bloom) {
      this.passes.bloom.strength = Math.min(1.5, 1.5 * quality);
      this.passes.bloom.radius = Math.min(0.4, 0.4 * quality);
    }
    this.particleSystems.forEach((sys) => {
      const visible = Math.floor(sys.options.count * quality);
      for (let i = 0; i < sys.options.count; i++) {
        if (sys.particles[i]) {
          sys.particles[i].active = i < visible;
          if (i >= visible) sys.opacities[i] = 0;
        }
      }
    });
  }
  update() {
    const deltaTime = this.clock.getDelta();
    this.particleSystems.forEach((sys) => sys.update(deltaTime));
    if (this.weatherEffects?.active) this.weatherEffects.update(deltaTime);
    if (this.passes.ripple) {
      this.passes.ripple.uniforms.time.value += deltaTime;
      if (this.passes.ripple.uniforms.time.value >= 1.0) {
        this.composer.removePass(this.passes.ripple);
        this.passes.ripple = null;
      }
    }
    if (this.options.adaptiveQuality) this.updatePerformance();
  }
  updatePerformance() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.frameCount++;
    this.fpsUpdateTime += frameTime / 1000;
    if (this.fpsUpdateTime >= this.fpsUpdateInterval) {
      this.performanceStats.fps = Math.round(this.frameCount / this.fpsUpdateTime);
      this.performanceStats.frameTime = frameTime;
      this.frameCount = 0;
      this.fpsUpdateTime = 0;
      if (this.performanceStats.fps < 30) this.updateQuality(this.performanceStats.quality * 0.9);
      else if (this.performanceStats.fps > 55 && this.performanceStats.quality < 1.0)
        this.updateQuality(this.performanceStats.quality * 1.1);
    }
  }
  render() {
    if (this.composer && this.options.enablePostProcessing) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.particleSystems.forEach((sys) => {
      this.scene.remove(sys.getMesh());
      sys.dispose();
    });
    this.particleSystems = [];
    this.weatherEffects?.dispose();
    this.weatherEffects = null;
    this.composer?.passes.forEach((p) => p.dispose?.());
    this.composer = null;
    window.removeEventListener("resize", this._resizeHandler);
  }
}
export { GlowShader, ParticleSystem, RippleShader, WeatherEffects, WebGLEffects };
export default WebGLEffects;

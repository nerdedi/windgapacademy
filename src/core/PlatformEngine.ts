import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';
import { Character3D } from '../characters/Character3D';
import { SoundManager } from '../audio/SoundManager';
import { AIEngine } from '../ai/AIEngine';

export interface PlatformEngineConfig {
  enablePhysics: boolean;
  enableAdvancedLighting: boolean;
  enablePostProcessing: boolean;
  enableVR: boolean;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
  targetFPS: number;
  enableShadows: boolean;
  enableAntialiasing: boolean;
}

export class PlatformEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private controls: OrbitControls;
  private audioContext: AudioContext;
  private soundManager: SoundManager;
  private aiEngine: AIEngine;
  private animationMixer: THREE.AnimationMixer;
  private characters: Map<string, Character3D> = new Map();
  private config: PlatformEngineConfig;
  private clock: THREE.Clock;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private isRunning: boolean = false;
  private frameId: number;
  private deltaTime: number = 0;
  private lastFrameTime: number = 0;
  private performanceStats: { fps: number; frameTime: number; memoryUsage: number } = {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0
  };

  constructor(container: HTMLElement, config: Partial<PlatformEngineConfig> = {}) {
    this.config = {
      enablePhysics: true,
      enableAdvancedLighting: true,
      enablePostProcessing: true,
      enableVR: false,
      qualityLevel: 'high',
      targetFPS: 60,
      enableShadows: true,
      enableAntialiasing: true,
      ...config
    };

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initializeEngine(container);
    this.setupPostProcessing();
    this.initializeAudio();
    this.initializeAI();
    this.setupEventListeners();
    this.start();
  }

  private initializeEngine(container: HTMLElement) {
    // Scene setup with advanced features
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000011, 0.0008);
    this.scene.background = new THREE.Color(0x000011);

    // Camera setup with professional settings
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 5, 10);

    // Advanced renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.config.enableAntialiasing,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Advanced shadow configuration
    if (this.config.enableShadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.shadowMap.autoUpdate = true;
    }

    // Advanced tone mapping and color management
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Performance optimizations
    this.renderer.info.autoReset = false;

    container.appendChild(this.renderer.domElement);

    // Enhanced controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  private setupPostProcessing() {
    if (!this.config.enablePostProcessing) return;

    this.composer = new EffectComposer(this.renderer);

    // Base render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Advanced anti-aliasing
    if (this.config.enableAntialiasing && this.config.qualityLevel !== 'low') {
      const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
      this.composer.addPass(smaaPass);
    }

    // Temporal Anti-Aliasing for ultra quality
    if (this.config.qualityLevel === 'ultra') {
      const taaRenderPass = new TAARenderPass(this.scene, this.camera);
      taaRenderPass.unbiased = false;
      taaRenderPass.sampleLevel = 2;
      this.composer.addPass(taaRenderPass);
    }

    // Screen Space Ambient Occlusion
    if (this.config.qualityLevel === 'high' || this.config.qualityLevel === 'ultra') {
      const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
      ssaoPass.kernelRadius = 8;
      ssaoPass.minDistance = 0.005;
      ssaoPass.maxDistance = 0.1;
      this.composer.addPass(ssaoPass);
    }

    // Bloom effect with quality-based settings
    const bloomStrength = this.config.qualityLevel === 'ultra' ? 2.0 :
                         this.config.qualityLevel === 'high' ? 1.5 : 1.0;
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomStrength, 0.4, 0.85
    );
    this.composer.addPass(bloomPass);
  }

  private initializeAudio() {
    this.soundManager = new SoundManager();
  }

  private initializeAI() {
    this.aiEngine = new AIEngine();
  }

  private setupEventListeners() {
    // Mouse interaction
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));

    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Performance monitoring
    window.addEventListener('beforeunload', this.cleanup.bind(this));
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onMouseClick(event: MouseEvent) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.handleObjectInteraction(object, intersects[0].point);
    }
  }

  private handleObjectInteraction(object: THREE.Object3D, point: THREE.Vector3) {
    // Emit interaction events for game objects
    const event = new CustomEvent('objectInteraction', {
      detail: { object, point, mouse: this.mouse }
    });
    this.renderer.domElement.dispatchEvent(event);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  async loadCharacter(name: string, modelPath: string): Promise<Character3D> {
    const loader = new GLTFLoader();

    // Setup DRACO compression support
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    // Setup KTX2 texture support
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/ktx2/');
    ktx2Loader.detectSupport(this.renderer);
    loader.setKTX2Loader(ktx2Loader);

    const gltf = await loader.loadAsync(modelPath);
    const character = new Character3D(gltf, this.scene);
    this.characters.set(name, character);
    return character;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private animate() {
    if (!this.isRunning) return;

    this.frameId = requestAnimationFrame(this.animate.bind(this));

    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    this.update();
    this.render();
    this.updatePerformanceStats();
  }

  private update() {
    // Update controls
    this.controls.update();

    // Update characters
    this.characters.forEach(character => {
      character.update(this.deltaTime);
    });

    // Update animation mixer
    if (this.animationMixer) {
      this.animationMixer.update(this.deltaTime);
    }
  }

  private render() {
    this.renderer.info.reset();

    if (this.composer && this.config.enablePostProcessing) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private updatePerformanceStats() {
    const frameTime = this.deltaTime * 1000;
    this.performanceStats.frameTime = frameTime;
    this.performanceStats.fps = Math.round(1 / this.deltaTime);

    // Memory usage (if available)
    if ((performance as any).memory) {
      this.performanceStats.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
    }
  }

  getPerformanceStats() {
    return { ...this.performanceStats };
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getCharacter(name: string): Character3D | undefined {
    return this.characters.get(name);
  }

  getAllCharacters(): Character3D[] {
    return Array.from(this.characters.values());
  }

  removeCharacter(name: string): boolean {
    const character = this.characters.get(name);
    if (character) {
      this.scene.remove(character.model);
      this.characters.delete(name);
      return true;
    }
    return false;
  }

  cleanup() {
    this.stop();

    // Dispose of geometries and materials
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    // Dispose of renderer
    this.renderer.dispose();

    // Clean up characters
    this.characters.clear();
  }
}

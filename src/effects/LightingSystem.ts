import * as THREE from 'three';

export interface LightConfig {
  type: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';
  color: THREE.Color;
  intensity: number;
  position?: THREE.Vector3;
  target?: THREE.Vector3;
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  castShadow?: boolean;
}

export class LightingSystem {
  private lights: Map<string, THREE.Light> = new Map();
  private scene: THREE.Scene;
  private dynamicLights: Map<string, { light: THREE.Light; animation: any }> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.setupDefaultLighting();
  }

  private setupDefaultLighting() {
    // Ambient light for base illumination
    this.addLight('ambient', {
      type: 'ambient',
      color: new THREE.Color(0x404040),
      intensity: 0.4
    });

    // Main directional light (sun)
    this.addLight('sun', {
      type: 'directional',
      color: new THREE.Color(0xffffff),
      intensity: 1.0,
      position: new THREE.Vector3(10, 10, 5),
      castShadow: true
    });

    // Hemisphere light for natural sky lighting
    this.addLight('sky', {
      type: 'hemisphere',
      color: new THREE.Color(0x87ceeb),
      intensity: 0.6
    });
  }

  addLight(name: string, config: LightConfig): THREE.Light {
    let light: THREE.Light;

    switch (config.type) {
      case 'ambient':
        light = new THREE.AmbientLight(config.color, config.intensity);
        break;

      case 'directional':
        light = new THREE.DirectionalLight(config.color, config.intensity);
        if (config.position) {
          light.position.copy(config.position);
        }
        if (config.castShadow) {
          light.castShadow = true;
          (light as THREE.DirectionalLight).shadow.mapSize.width = 2048;
          (light as THREE.DirectionalLight).shadow.mapSize.height = 2048;
          (light as THREE.DirectionalLight).shadow.camera.near = 0.5;
          (light as THREE.DirectionalLight).shadow.camera.far = 500;
          (light as THREE.DirectionalLight).shadow.camera.left = -50;
          (light as THREE.DirectionalLight).shadow.camera.right = 50;
          (light as THREE.DirectionalLight).shadow.camera.top = 50;
          (light as THREE.DirectionalLight).shadow.camera.bottom = -50;
        }
        break;

      case 'point':
        light = new THREE.PointLight(
          config.color,
          config.intensity,
          config.distance || 0,
          config.decay || 2
        );
        if (config.position) {
          light.position.copy(config.position);
        }
        if (config.castShadow) {
          light.castShadow = true;
          light.shadow.mapSize.width = 1024;
          light.shadow.mapSize.height = 1024;
        }
        break;

      case 'spot':
        light = new THREE.SpotLight(
          config.color,
          config.intensity,
          config.distance || 0,
          config.angle || Math.PI / 3,
          config.penumbra || 0,
          config.decay || 2
        );
        if (config.position) {
          light.position.copy(config.position);
        }
        if (config.target) {
          (light as THREE.SpotLight).target.position.copy(config.target);
          this.scene.add((light as THREE.SpotLight).target);
        }
        if (config.castShadow) {
          light.castShadow = true;
          light.shadow.mapSize.width = 1024;
          light.shadow.mapSize.height = 1024;
        }
        break;

      case 'hemisphere':
        light = new THREE.HemisphereLight(config.color, new THREE.Color(0x444444), config.intensity);
        break;

      default:
        throw new Error(`Unknown light type: ${config.type}`);
    }

    this.lights.set(name, light);
    this.scene.add(light);
    return light;
  }

  removeLight(name: string): boolean {
    const light = this.lights.get(name);
    if (light) {
      this.scene.remove(light);
      this.lights.delete(name);

      // Remove from dynamic lights if present
      if (this.dynamicLights.has(name)) {
        this.dynamicLights.delete(name);
      }

      return true;
    }
    return false;
  }

  getLight(name: string): THREE.Light | undefined {
    return this.lights.get(name);
  }

  updateLightIntensity(name: string, intensity: number) {
    const light = this.lights.get(name);
    if (light) {
      light.intensity = intensity;
    }
  }

  updateLightColor(name: string, color: THREE.Color) {
    const light = this.lights.get(name);
    if (light) {
      light.color.copy(color);
    }
  }

  updateLightPosition(name: string, position: THREE.Vector3) {
    const light = this.lights.get(name);
    if (light && light.position) {
      light.position.copy(position);
    }
  }

  animateLight(name: string, animation: {
    duration: number;
    intensity?: { from: number; to: number };
    color?: { from: THREE.Color; to: THREE.Color };
    position?: { from: THREE.Vector3; to: THREE.Vector3 };
    loop?: boolean;
  }) {
    const light = this.lights.get(name);
    if (!light) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const eased = this.easeInOutQuad(progress);

      if (animation.intensity) {
        const intensity = THREE.MathUtils.lerp(animation.intensity.from, animation.intensity.to, eased);
        light.intensity = intensity;
      }

      if (animation.color && light.color) {
        light.color.lerpColors(animation.color.from, animation.color.to, eased);
      }

      if (animation.position && light.position) {
        light.position.lerpVectors(animation.position.from, animation.position.to, eased);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (animation.loop) {
        // Restart animation
        setTimeout(() => {
          this.animateLight(name, animation);
        }, 100);
      }
    };

    this.dynamicLights.set(name, { light, animation });
    animate();
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  createDayNightCycle(duration: number = 60000) {
    const sunLight = this.getLight('sun') as THREE.DirectionalLight;
    const ambientLight = this.getLight('ambient') as THREE.AmbientLight;

    if (!sunLight || !ambientLight) return;

    const animate = () => {
      const time = (Date.now() % duration) / duration;
      const angle = time * Math.PI * 2;

      // Sun position
      const sunX = Math.cos(angle) * 10;
      const sunY = Math.sin(angle) * 10;
      sunLight.position.set(sunX, Math.max(sunY, -5), 5);

      // Sun intensity based on height
      const sunIntensity = Math.max(0, Math.sin(angle)) * 1.2;
      sunLight.intensity = sunIntensity;

      // Ambient light intensity
      const ambientIntensity = 0.2 + Math.max(0, Math.sin(angle)) * 0.4;
      ambientLight.intensity = ambientIntensity;

      // Sun color temperature
      const temperature = 0.5 + Math.max(0, Math.sin(angle)) * 0.5;
      sunLight.color.setHSL(0.1, 0.1, temperature);

      requestAnimationFrame(animate);
    };

    animate();
  }

  setTimeOfDay(hour: number) {
    const normalizedHour = (hour % 24) / 24;
    const angle = normalizedHour * Math.PI * 2 - Math.PI / 2; // Start at sunrise

    const sunLight = this.getLight('sun') as THREE.DirectionalLight;
    const ambientLight = this.getLight('ambient') as THREE.AmbientLight;

    if (sunLight) {
      const sunX = Math.cos(angle) * 10;
      const sunY = Math.sin(angle) * 10;
      sunLight.position.set(sunX, Math.max(sunY, -5), 5);

      const sunIntensity = Math.max(0, Math.sin(angle)) * 1.2;
      sunLight.intensity = sunIntensity;

      const temperature = 0.5 + Math.max(0, Math.sin(angle)) * 0.5;
      sunLight.color.setHSL(0.1, 0.1, temperature);
    }

    if (ambientLight) {
      const ambientIntensity = 0.2 + Math.max(0, Math.sin(angle)) * 0.4;
      ambientLight.intensity = ambientIntensity;
    }
  }

  cleanup() {
    this.lights.forEach((light, name) => {
      this.removeLight(name);
    });
    this.dynamicLights.clear();
  }
}

import * as THREE from 'three';

export interface ParticleConfig {
  count: number;
  size: number;
  color: THREE.Color;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  lifetime: number;
  opacity: number;
  texture?: THREE.Texture;
}

export class ParticleSystem {
  private particles: THREE.Points[] = [];
  private particleGroups: Map<string, THREE.Group> = new Map();
  private clock: THREE.Clock;

  constructor() {
    this.clock = new THREE.Clock();
  }

  createParticleSystem(name: string, config: ParticleConfig, position: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    group.position.copy(position);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const velocities = new Float32Array(config.count * 3);
    const lifetimes = new Float32Array(config.count);
    const sizes = new Float32Array(config.count);

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      // Random position within sphere
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocity
      velocities[i3] = (Math.random() - 0.5) * config.velocity.x;
      velocities[i3 + 1] = (Math.random() - 0.5) * config.velocity.y;
      velocities[i3 + 2] = (Math.random() - 0.5) * config.velocity.z;

      lifetimes[i] = Math.random() * config.lifetime;
      sizes[i] = config.size * (0.5 + Math.random() * 0.5);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: config.color,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      map: config.texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    this.particleGroups.set(name, group);
    return group;
  }

  createBurst(position: THREE.Vector3, type: 'success' | 'error' | 'magic' | 'explosion'): THREE.Group {
    const configs = {
      success: {
        count: 100,
        size: 0.1,
        color: new THREE.Color(0x00ff00),
        velocity: new THREE.Vector3(5, 5, 5),
        acceleration: new THREE.Vector3(0, -2, 0),
        lifetime: 2,
        opacity: 0.8
      },
      error: {
        count: 50,
        size: 0.15,
        color: new THREE.Color(0xff0000),
        velocity: new THREE.Vector3(3, 3, 3),
        acceleration: new THREE.Vector3(0, -1, 0),
        lifetime: 1.5,
        opacity: 0.9
      },
      magic: {
        count: 200,
        size: 0.05,
        color: new THREE.Color(0x9966ff),
        velocity: new THREE.Vector3(8, 8, 8),
        acceleration: new THREE.Vector3(0, 0, 0),
        lifetime: 3,
        opacity: 0.7
      },
      explosion: {
        count: 300,
        size: 0.2,
        color: new THREE.Color(0xff6600),
        velocity: new THREE.Vector3(10, 10, 10),
        acceleration: new THREE.Vector3(0, -5, 0),
        lifetime: 2.5,
        opacity: 1.0
      }
    };

    const config = configs[type];
    const name = `burst_${type}_${Date.now()}`;
    const burst = this.createParticleSystem(name, config, position);

    // Auto-remove after lifetime
    setTimeout(() => {
      this.removeParticleSystem(name);
    }, config.lifetime * 1000);

    return burst;
  }

  update(deltaTime: number) {
    this.particleGroups.forEach((group, name) => {
      group.children.forEach(child => {
        if (child instanceof THREE.Points) {
          this.updateParticles(child, deltaTime);
        }
      });
    });
  }

  private updateParticles(points: THREE.Points, deltaTime: number) {
    const geometry = points.geometry as THREE.BufferGeometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const velocities = geometry.attributes.velocity.array as Float32Array;
    const lifetimes = geometry.attributes.lifetime.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const index = i / 3;

      // Update lifetime
      lifetimes[index] -= deltaTime;

      if (lifetimes[index] > 0) {
        // Update position
        positions[i] += velocities[i] * deltaTime;
        positions[i + 1] += velocities[i + 1] * deltaTime;
        positions[i + 2] += velocities[i + 2] * deltaTime;

        // Apply gravity
        velocities[i + 1] -= 9.81 * deltaTime;
      } else {
        // Reset particle
        positions[i] = (Math.random() - 0.5) * 2;
        positions[i + 1] = (Math.random() - 0.5) * 2;
        positions[i + 2] = (Math.random() - 0.5) * 2;
        lifetimes[index] = Math.random() * 3;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.lifetime.needsUpdate = true;
  }

  getParticleGroup(name?: string): THREE.Group | undefined {
    if (name) {
      return this.particleGroups.get(name);
    }
    // Return first group if no name specified
    return this.particleGroups.values().next().value;
  }

  removeParticleSystem(name: string): boolean {
    const group = this.particleGroups.get(name);
    if (group) {
      // Dispose of geometries and materials
      group.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });

      this.particleGroups.delete(name);
      return true;
    }
    return false;
  }

  cleanup() {
    this.particleGroups.forEach((group, name) => {
      this.removeParticleSystem(name);
    });
    this.particleGroups.clear();
  }
}

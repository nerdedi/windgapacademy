import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface PhysicsObject {
  id: string;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  type: "static" | "dynamic" | "kinematic";
  material: string;
  collisionCallbacks: Map<string, Function>;
}

export interface PhysicsConfig {
  gravity: THREE.Vector3;
  timeStep: number;
  maxSubSteps: number;
  enableDebug: boolean;
  worldSize: number;
}

export class PhysicsSystem {
  private world: CANNON.World;
  private objects: Map<string, PhysicsObject>;
  private materials: Map<string, CANNON.Material>;
  private contactMaterials: Map<string, CANNON.ContactMaterial>;
  private config: PhysicsConfig;
  private debugRenderer?: any;

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = {
      gravity: new THREE.Vector3(0, -9.82, 0),
      timeStep: 1 / 60,
      maxSubSteps: 3,
      enableDebug: false,
      worldSize: 100,
      ...config,
    };

    this.objects = new Map();
    this.materials = new Map();
    this.contactMaterials = new Map();

    this.initializeWorld();
    this.createDefaultMaterials();
  }

  private initializeWorld(): void {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(this.config.gravity.x, this.config.gravity.y, this.config.gravity.z),
    });

    // Set up collision detection
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;
    this.world.allowSleep = true;

    // Add world boundaries
    this.createWorldBoundaries();
  }

  private createDefaultMaterials(): void {
    // Default material
    const defaultMaterial = new CANNON.Material("default");
    this.materials.set("default", defaultMaterial);

    // Bouncy material
    const bouncyMaterial = new CANNON.Material("bouncy");
    this.materials.set("bouncy", bouncyMaterial);

    // Slippery material
    const slipperyMaterial = new CANNON.Material("slippery");
    this.materials.set("slippery", slipperyMaterial);

    // Sticky material
    const stickyMaterial = new CANNON.Material("sticky");
    this.materials.set("sticky", stickyMaterial);

    // Create contact materials
    this.createContactMaterial("default", "default", {
      friction: 0.4,
      restitution: 0.3,
    });

    this.createContactMaterial("bouncy", "default", {
      friction: 0.2,
      restitution: 0.9,
    });

    this.createContactMaterial("slippery", "default", {
      friction: 0.1,
      restitution: 0.1,
    });

    this.createContactMaterial("sticky", "default", {
      friction: 0.9,
      restitution: 0.1,
    });
  }

  private createContactMaterial(
    material1: string,
    material2: string,
    properties: {
      friction: number;
      restitution: number;
    },
  ): void {
    const mat1 = this.materials.get(material1);
    const mat2 = this.materials.get(material2);

    if (mat1 && mat2) {
      const contactMaterial = new CANNON.ContactMaterial(mat1, mat2, {
        friction: properties.friction,
        restitution: properties.restitution,
      });

      this.world.addContactMaterial(contactMaterial);
      this.contactMaterials.set(`${material1}-${material2}`, contactMaterial);
    }
  }

  private createWorldBoundaries(): void {
    const size = this.config.worldSize;
    const thickness = 1;

    // Ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, -size / 2, 0);
    this.world.addBody(groundBody);

    // Walls
    const wallPositions = [
      { x: size / 2, y: 0, z: 0, rotation: [0, 0, 1, Math.PI / 2] },
      { x: -size / 2, y: 0, z: 0, rotation: [0, 0, 1, -Math.PI / 2] },
      { x: 0, y: 0, z: size / 2, rotation: [1, 0, 0, 0] },
      { x: 0, y: 0, z: -size / 2, rotation: [1, 0, 0, Math.PI] },
    ];

    wallPositions.forEach((pos) => {
      const wallShape = new CANNON.Plane();
      const wallBody = new CANNON.Body({ mass: 0 });
      wallBody.addShape(wallShape);
      wallBody.position.set(pos.x, pos.y, pos.z);
      wallBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(pos.rotation[0], pos.rotation[1], pos.rotation[2]),
        pos.rotation[3],
      );
      this.world.addBody(wallBody);
    });
  }

  // Object Management
  public addObject(
    id: string,
    mesh: THREE.Mesh,
    shape: CANNON.Shape,
    options: {
      mass?: number;
      position?: THREE.Vector3;
      rotation?: THREE.Euler;
      material?: string;
      type?: "static" | "dynamic" | "kinematic";
    } = {},
  ): PhysicsObject {
    const {
      mass = 1,
      position = new THREE.Vector3(),
      rotation = new THREE.Euler(),
      material = "default",
      type = "dynamic",
    } = options;

    // Create physics body
    const body = new CANNON.Body({
      mass: type === "static" ? 0 : mass,
      type: type === "kinematic" ? CANNON.Body.KINEMATIC : CANNON.Body.DYNAMIC,
    });

    body.addShape(shape);
    body.position.set(position.x, position.y, position.z);

    // Set rotation
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(rotation);
    body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

    // Set material
    const physicsMaterial = this.materials.get(material);
    if (physicsMaterial) {
      body.material = physicsMaterial;
    }

    this.world.addBody(body);

    // Create physics object
    const physicsObject: PhysicsObject = {
      id,
      mesh,
      body,
      type,
      material,
      collisionCallbacks: new Map(),
    };

    this.objects.set(id, physicsObject);

    // Set up collision detection
    body.addEventListener("collide", (event: any) => {
      this.handleCollision(physicsObject, event);
    });

    return physicsObject;
  }

  public removeObject(id: string): void {
    const object = this.objects.get(id);
    if (object) {
      this.world.removeBody(object.body);
      this.objects.delete(id);
    }
  }

  public getObject(id: string): PhysicsObject | undefined {
    return this.objects.get(id);
  }

  // Collision Handling
  public onCollision(objectId: string, callback: Function): void {
    const object = this.objects.get(objectId);
    if (object) {
      const callbackId = `callback_${Date.now()}_${Math.random()}`;
      object.collisionCallbacks.set(callbackId, callback);
    }
  }

  private handleCollision(object: PhysicsObject, event: any): void {
    const otherBody = event.target === object.body ? event.body : event.target;
    const otherObject = Array.from(this.objects.values()).find((obj) => obj.body === otherBody);

    const collisionData = {
      object,
      otherObject,
      contact: event.contact,
      impulse: event.contact?.getImpactVelocityAlongNormal() || 0,
    };

    object.collisionCallbacks.forEach((callback) => {
      callback(collisionData);
    });
  }

  // Forces and Impulses
  public applyForce(objectId: string, force: THREE.Vector3, worldPoint?: THREE.Vector3): void {
    const object = this.objects.get(objectId);
    if (object) {
      const cannonForce = new CANNON.Vec3(force.x, force.y, force.z);
      const cannonPoint = worldPoint
        ? new CANNON.Vec3(worldPoint.x, worldPoint.y, worldPoint.z)
        : object.body.position;

      object.body.applyForce(cannonForce, cannonPoint);
    }
  }

  public applyImpulse(objectId: string, impulse: THREE.Vector3, worldPoint?: THREE.Vector3): void {
    const object = this.objects.get(objectId);
    if (object) {
      const cannonImpulse = new CANNON.Vec3(impulse.x, impulse.y, impulse.z);
      const cannonPoint = worldPoint
        ? new CANNON.Vec3(worldPoint.x, worldPoint.y, worldPoint.z)
        : object.body.position;

      object.body.applyImpulse(cannonImpulse, cannonPoint);
    }
  }

  public setVelocity(objectId: string, velocity: THREE.Vector3): void {
    const object = this.objects.get(objectId);
    if (object) {
      object.body.velocity.set(velocity.x, velocity.y, velocity.z);
    }
  }

  public setAngularVelocity(objectId: string, angularVelocity: THREE.Vector3): void {
    const object = this.objects.get(objectId);
    if (object) {
      object.body.angularVelocity.set(angularVelocity.x, angularVelocity.y, angularVelocity.z);
    }
  }

  // Constraints and Joints
  public createDistanceConstraint(
    objectId1: string,
    objectId2: string,
    distance: number,
    options: { stiffness?: number; damping?: number } = {},
  ): CANNON.DistanceConstraint | null {
    const object1 = this.objects.get(objectId1);
    const object2 = this.objects.get(objectId2);

    if (object1 && object2) {
      const constraint = new CANNON.DistanceConstraint(
        object1.body,
        object2.body,
        distance,
        options.stiffness || 1e6,
        options.damping || 1e3,
      );

      this.world.addConstraint(constraint);
      return constraint;
    }

    return null;
  }

  public createHingeConstraint(
    objectId1: string,
    objectId2: string,
    pivotA: THREE.Vector3,
    pivotB: THREE.Vector3,
    axisA: THREE.Vector3,
    axisB: THREE.Vector3,
  ): CANNON.HingeConstraint | null {
    const object1 = this.objects.get(objectId1);
    const object2 = this.objects.get(objectId2);

    if (object1 && object2) {
      const constraint = new CANNON.HingeConstraint(object1.body, object2.body, {
        pivotA: new CANNON.Vec3(pivotA.x, pivotA.y, pivotA.z),
        pivotB: new CANNON.Vec3(pivotB.x, pivotB.y, pivotB.z),
        axisA: new CANNON.Vec3(axisA.x, axisA.y, axisA.z),
        axisB: new CANNON.Vec3(axisB.x, axisB.y, axisB.z),
      });

      this.world.addConstraint(constraint);
      return constraint;
    }

    return null;
  }

  // Simulation
  public step(deltaTime: number): void {
    this.world.step(this.config.timeStep, deltaTime, this.config.maxSubSteps);
    this.syncMeshes();
  }

  private syncMeshes(): void {
    this.objects.forEach((object) => {
      // Sync position
      object.mesh.position.copy(object.body.position as any);

      // Sync rotation
      object.mesh.quaternion.copy(object.body.quaternion as any);
    });
  }

  // Raycasting
  public raycast(
    from: THREE.Vector3,
    to: THREE.Vector3,
    options: { skipBackfaces?: boolean; collisionFilterMask?: number } = {},
  ): CANNON.RaycastResult[] {
    const raycastResult = new CANNON.RaycastResult();
    const hasHit = this.world.raycastClosest(
      new CANNON.Vec3(from.x, from.y, from.z),
      new CANNON.Vec3(to.x, to.y, to.z),
      options,
      raycastResult,
    );

    return hasHit ? [raycastResult] : [];
  }

  // Utility Methods
  public setGravity(gravity: THREE.Vector3): void {
    this.world.gravity.set(gravity.x, gravity.y, gravity.z);
    this.config.gravity = gravity;
  }

  public pause(): void {
    // Implementation for pausing physics simulation
  }

  public resume(): void {
    // Implementation for resuming physics simulation
  }

  public reset(): void {
    // Clear all objects
    this.objects.forEach((object) => {
      this.world.removeBody(object.body);
    });
    this.objects.clear();

    // Reset world
    this.world.bodies.length = 0;
    this.world.constraints.length = 0;

    // Recreate boundaries
    this.createWorldBoundaries();
  }

  public dispose(): void {
    this.reset();
    if (this.debugRenderer) {
      this.debugRenderer.dispose();
    }
  }

  // Debug
  public enableDebugRenderer(scene: THREE.Scene): void {
    if (this.config.enableDebug) {
      // Implementation for debug renderer would go here
      // This would typically use a library like cannon-es-debugger
    }
  }

  public getStats(): {
    objectCount: number;
    bodyCount: number;
    constraintCount: number;
  } {
    return {
      objectCount: this.objects.size,
      bodyCount: this.world.bodies.length,
      constraintCount: this.world.constraints.length,
    };
  }
}

export default PhysicsSystem;

// Visual effects utilities for curriculum components
import * as THREE from "three";
// @ts-ignore
import WebGLEffects from "../../src/utils/WebGLEffects.js";

/**
 * Creates a particle effect in the specified container
 *
 * @param containerId - ID of the container element
 * @param options - Configuration options for the particle system
 * @returns The particle system instance or null if creation failed
 */
export const createParticleEffect = (containerId: string, options = {}) => {
  try {
    // Try to create a div container if it doesn't exist
    if (!document.getElementById(containerId)) {
      const container = document.createElement("div");
      container.id = containerId;
      container.style.position = "absolute";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "10";
      document.body.appendChild(container);
    }

    // Use webglEffects directly without instantiation
    if (typeof WebGLEffects.initParticleSystem === "function") {
      return WebGLEffects.initParticleSystem(containerId, options);
    }
    console.error("WebGLEffects.initParticleSystem is not a function");
    return null;
  } catch (error) {
    console.error("Error creating particle effect:", error);
    return null;
  }
};

/**
 * Creates a water ripple effect in the specified container
 *
 * @param containerId - ID of the container element
 * @param options - Configuration options for the ripple effect
 * @returns The ripple effect instance or null if creation failed
 */
export const createRippleEffect = (containerId: string, options = {}) => {
  try {
    if (typeof WebGLEffects.createWaterRipple === "function") {
      return WebGLEffects.createWaterRipple(containerId, options);
    }
    console.error("WebGLEffects.createWaterRipple is not a function");
    return null;
  } catch (error) {
    console.error("Error creating ripple effect:", error);
    return null;
  }
};

/**
 * Creates a glow highlight effect for an element
 *
 * @param element - DOM element to apply the glow effect to
 * @param color - Color of the glow effect (default: blue)
 * @param intensity - Intensity of the glow effect (default: 0.5)
 * @returns A function to remove the glow effect
 */
export const createGlowEffect = (element: HTMLElement, color = "blue", intensity = 0.5) => {
  if (!element || !WebGLEffects.createElementGlow) {
    return () => {}; // Return empty cleanup function if element doesn't exist
  }

  try {
    const glowEffect = WebGLEffects.createElementGlow(element, { color, intensity });

    return () => {
      if (glowEffect && typeof glowEffect.destroy === "function") {
        glowEffect.destroy();
      }
    };
  } catch (error) {
    console.error("Error creating glow effect:", error);
    return () => {}; // Return empty cleanup function
  }
};

/**
 * Initializes a 3D model viewer
 *
 * @param containerId - ID of the container element
 * @param modelPath - Path to the 3D model file
 * @param options - Configuration options for the 3D viewer
 * @returns The 3D scene object or null if initialization failed
 */
export const initializeModelViewer = (containerId: string, modelPath: string, options = {}) => {
  const container = document.getElementById(containerId);
  if (!container) return null;

  try {
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);

        // Auto-adjust camera to fit model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        gltf.scene.position.x += gltf.scene.position.x - center.x;
        gltf.scene.position.y += gltf.scene.position.y - center.y;
        gltf.scene.position.z += gltf.scene.position.z - center.z;

        camera.position.z = size * 2;

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          if (options.autoRotate) {
            gltf.scene.rotation.y += 0.005;
          }

          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      },
    );

    // Handle window resize
    const handleResize = () => {
      if (!container) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Return cleanup and scene control functions
    return {
      scene,
      camera,
      renderer,
      cleanup: () => {
        window.removeEventListener("resize", handleResize);
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        // Dispose THREE.js resources
        renderer.dispose();
      },
    };
  } catch (error) {
    console.error("Error initializing 3D model viewer:", error);
    return null;
  }
};

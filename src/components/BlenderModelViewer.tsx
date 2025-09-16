import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore - External Three.js modules
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore - External Three.js modules
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Animation {
  id: string;
  label: string;
  clipName: string;
}

interface BlenderModelViewerProps {
  modelPath: string;
  isCharacter?: boolean;
  width?: string;
  height?: string;
  backgroundColor?: string;
  initialAnimation?: string;
  availableAnimations?: Animation[];
  autoRotate?: boolean;
  scale?: number;
}

const BlenderModelViewer: React.FC<BlenderModelViewerProps> = ({
  modelPath,
  isCharacter = false,
  width = "100%",
  height = "400px",
  backgroundColor = "#f0f0f0",
  initialAnimation = "idle",
  availableAnimations = [],
  autoRotate = true,
  scale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Scene objects stored in ref to persist between renders
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    mixer: THREE.AnimationMixer | null;
    animations: Record<string, THREE.AnimationAction>;
    model: THREE.Group | null;
    currentAnimation: string | null;
    clock: THREE.Clock;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    mixer: null,
    animations: {},
    model: null,
    currentAnimation: null,
    clock: new THREE.Clock(),
  });

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { clientWidth, clientHeight } = container;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add camera
    const camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;

    // Store references
    sceneRef.current = {
      ...sceneRef.current,
      scene,
      camera,
      renderer,
      controls,
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current.scene || !sceneRef.current.camera || !sceneRef.current.renderer) return;

      const delta = sceneRef.current.clock.getDelta();

      if (sceneRef.current.mixer) {
        sceneRef.current.mixer.update(delta);
      }

      if (sceneRef.current.controls) {
        sceneRef.current.controls.update();
      }

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (renderer && container) {
        container.removeChild(renderer.domElement);
      }

      if (sceneRef.current.mixer) {
        sceneRef.current.mixer = null;
      }

      scene.clear();
    };
  }, [backgroundColor, autoRotate]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current.camera || !sceneRef.current.renderer) return;

      const container = containerRef.current;
      const { clientWidth, clientHeight } = container;

      if (sceneRef.current.camera) {
        sceneRef.current.camera.aspect = clientWidth / clientHeight;
        sceneRef.current.camera.updateProjectionMatrix();
      }

      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.setSize(clientWidth, clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Load model
  useEffect(() => {
    if (!sceneRef.current.scene) return;

    setLoading(true);
    setError(null);

    // Clear previous model if exists
    if (sceneRef.current.model) {
      sceneRef.current.scene.remove(sceneRef.current.model);
      sceneRef.current.model = null;
    }

    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf: any) => {
        if (!sceneRef.current.scene) return;

        const model = gltf.scene;

        // Apply scaling
        model.scale.set(scale, scale, scale);

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // If it's a character, try to position it better
        if (isCharacter) {
          const size = box.getSize(new THREE.Vector3());
          model.position.y = -size.y / 2;
        }

        sceneRef.current.scene.add(model);
        sceneRef.current.model = model;

        // Set up animations
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          sceneRef.current.mixer = mixer;

          // Create animation actions
          const animations: Record<string, THREE.AnimationAction> = {};

          gltf.animations.forEach((clip: any) => {
            // If we have defined animations, look for matching clip names
            const matchingAnimation = availableAnimations.find(
              (anim) => anim.clipName === clip.name || anim.id === clip.name,
            );

            if (matchingAnimation) {
              animations[matchingAnimation.id] = mixer.clipAction(clip);
            } else if (availableAnimations.length === 0) {
              // If no specific animations were defined, use all found animations
              animations[clip.name] = mixer.clipAction(clip);
            }
          });

          sceneRef.current.animations = animations;

          // Play initial animation if available
          if (initialAnimation && animations[initialAnimation]) {
            animations[initialAnimation].play();
            sceneRef.current.currentAnimation = initialAnimation;
          } else if (Object.keys(animations).length > 0) {
            // Otherwise play the first available animation
            const firstAnimKey = Object.keys(animations)[0];
            animations[firstAnimKey].play();
            sceneRef.current.currentAnimation = firstAnimKey;
          }
        }

        setLoading(false);
      },
      (xhr: any) => {
        // Progress callback
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`${Math.round(percentComplete)}% loaded`);
      },
      (error: any) => {
        // Error callback
        console.error("Error loading model:", error);
        setError("Failed to load the 3D model. Please try again later.");
        setLoading(false);
      },
    );

    return () => {
      // Cleanup animations
      if (sceneRef.current.mixer) {
        sceneRef.current.mixer = null;
      }

      sceneRef.current.animations = {};
      sceneRef.current.currentAnimation = null;
    };
  }, [modelPath, initialAnimation, isCharacter, scale, availableAnimations]);

  // Update animation when it changes
  useEffect(() => {
    if (!sceneRef.current.mixer || !initialAnimation) return;

    // If animation exists and isn't already playing
    if (
      sceneRef.current.animations[initialAnimation] &&
      sceneRef.current.currentAnimation !== initialAnimation
    ) {
      // Stop current animation if any
      if (
        sceneRef.current.currentAnimation &&
        sceneRef.current.animations[sceneRef.current.currentAnimation]
      ) {
        sceneRef.current.animations[sceneRef.current.currentAnimation].stop();
      }

      // Play new animation
      sceneRef.current.animations[initialAnimation].reset().play();
      sceneRef.current.currentAnimation = initialAnimation;
    }
  }, [initialAnimation]);

  // Update auto-rotate setting when it changes
  useEffect(() => {
    if (sceneRef.current.controls) {
      sceneRef.current.controls.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <div>Loading model...</div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 200, 200, 0.7)",
            padding: "20px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default BlenderModelViewer;

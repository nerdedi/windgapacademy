import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { useGamification } from "../contexts/GamificationContext";

const HybridScene = ({
  characterModel = "/models/winnie-mascot.glb",
  backgroundColor = "#f0f9ff",
  interactive = true,
  onCharacterClick,
  width = "100%",
  height = "400px",
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const characterRef = useRef(null);
  const mixerRef = useRef(null);
  const animationsRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());

  const [isLoading, setIsLoading] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const gamification = useGamification();

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.5, 4);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    if (interactive) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.7;
      controls.minDistance = 2;
      controls.maxDistance = 7;
      controls.maxPolarAngle = Math.PI / 2;
      controlsRef.current = controls;
    }

    // Floor
    const floorGeometry = new THREE.CircleGeometry(5, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Character loading
    loadCharacter(characterModel);

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      if (characterRef.current) {
        // Subtle idle animation
        characterRef.current.rotation.y += 0.005;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(rendererRef.current.domElement);
      scene.dispose();
    };
  }, [backgroundColor, characterModel, interactive]);

  // Character loading function
  const loadCharacter = (modelPath) => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        // Setup animations
        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;

          animationsRef.current = gltf.animations.map((animation) => {
            return mixer.clipAction(animation);
          });

          // Play default animation
          if (animationsRef.current.length > 0) {
            animationsRef.current[0].play();
          }
        }

        characterRef.current = model;
        sceneRef.current.add(model);
        setIsLoading(false);

        // Add click handler if interactive
        if (interactive && onCharacterClick) {
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();

          const handleClick = (event) => {
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);
            const intersects = raycaster.intersectObject(model, true);

            if (intersects.length > 0) {
              onCharacterClick();
              playAnimation("wave");
              // Award XP for interaction
              gamification.addXP(5, "character interaction");
            }
          };

          rendererRef.current.domElement.addEventListener("click", handleClick);
        }
      },
      // Progress callback
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // Error callback
      (error) => {
        console.error("An error occurred loading the model:", error);
      },
    );
  };

  // Animation control function
  const playAnimation = (animationName) => {
    if (!mixerRef.current || animationsRef.current.length === 0) return;

    setCurrentAnimation(animationName);

    // Find appropriate animation (could be mapped by name in a real scenario)
    let animationIndex = 0;
    switch (animationName) {
      case "wave":
        animationIndex = 1 % animationsRef.current.length;
        break;
      case "jump":
        animationIndex = 2 % animationsRef.current.length;
        break;
      case "idle":
      default:
        animationIndex = 0;
    }

    // Fade out current animation and fade in new one
    animationsRef.current.forEach((animation, index) => {
      if (index === animationIndex) {
        animation.reset().fadeIn(0.5).play();
      } else {
        animation.fadeOut(0.5);
      }
    });

    // Return to idle after animation
    if (animationName !== "idle") {
      setTimeout(() => {
        playAnimation("idle");
      }, 2000);
    }
  };

  return (
    <div className="relative" style={{ width, height }}>
      <div
        ref={mountRef}
        className="w-full h-full rounded-lg overflow-hidden transition-all duration-500"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60">
          <div className="loader animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {interactive && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <div className="px-3 py-1.5 bg-white bg-opacity-70 backdrop-blur-sm text-sm text-gray-700 rounded-full shadow-md">
            Click the character to interact!
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridScene;

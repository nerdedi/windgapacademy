// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { MicroInteractions } from "../../src/components/ui/MicroInteractions.jsx";
import { curriculumCharacters } from "../../src/data/curriculumCharacters.js";
// @ts-ignore
import WebGLEffects from "../../src/utils/WebGLEffects.js";

// Initialize WebGL effects helper functions
const createParticleEffect = (containerId, options = {}) => {
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

const createRippleEffect = (containerId, options = {}) => {
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

// ============================================
// ACHIEVEMENT NOTIFICATION COMPONENT
// ============================================

interface AchievementNotificationProps {
  title: string;
  description: string;
  type: "xp" | "badge" | "level" | "coin";
  value?: number;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  title,
  description,
  type,
  value,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Allow animation to complete before removal
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "xp":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "badge":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "level":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      case "coin":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <MicroInteractions
      type="custom"
      customAnimation={{
        initial: { opacity: 0, y: -20, scale: 0.8 },
        animate: { opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20, scale: isVisible ? 1 : 0.8 },
        transition: { duration: 0.5, ease: "easeOut" },
      }}
      className="fixed top-4 right-4 z-50 max-w-md bg-white rounded-lg shadow-xl border-l-4 border-blue-500 overflow-hidden"
    >
      <div className="flex p-4 items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {title}
            {value && <span className="ml-2 text-lg font-bold text-blue-600">+{value}</span>}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="bg-blue-50 px-4 py-2 text-xs text-blue-600 font-medium">
        Your progress is being tracked!
      </div>
    </MicroInteractions>
  );
};

// ============================================
// GAMIFICATION CONTEXT SETUP
// ============================================

const GamificationContext = React.createContext<any>(null);

const useGamification = () => {
  const context = React.useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
};

interface PlayerData {
  level: number;
  xp: number;
  coins: number;
  badges: string[];
  achievements: string[];
  streakDays: number;
  totalLessonsCompleted: number;
  skills: {
    [key: string]: { level: number; xp: number };
  };
}

const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData>({
    level: 1,
    xp: 0,
    coins: 100,
    badges: [],
    achievements: [],
    streakDays: 0,
    totalLessonsCompleted: 0,
    skills: {
      literacy: { level: 1, xp: 0 },
      numeracy: { level: 1, xp: 0 },
      digital: { level: 1, xp: 0 },
      lifeSkills: { level: 1, xp: 0 },
      communication: { level: 1, xp: 0 },
    },
  });

  // Notification state
  const [notifications, setNotifications] = useState<
    {
      id: string;
      title: string;
      description: string;
      type: "xp" | "badge" | "level" | "coin";
      value?: number;
    }[]
  >([]);

  const addXP = useCallback((amount: number, skill: string | null = null) => {
    setPlayerData((prev) => {
      const newData = { ...prev };
      newData.xp += amount;

      // Level up logic
      const xpForNextLevel = prev.level * 100;
      let didLevelUp = false;

      if (newData.xp >= xpForNextLevel) {
        newData.level++;
        newData.xp -= xpForNextLevel;
        newData.coins += 50; // Bonus coins for leveling up
        didLevelUp = true;

        // Show level up notification
        const notificationId = `level-${Date.now()}`;
        setNotifications((prev) => [
          ...prev,
          {
            id: notificationId,
            title: "Level Up!",
            description: `Congratulations! You're now at level ${newData.level}. Keep up the great work!`,
            type: "level",
            value: newData.level,
          },
        ]);

        // Show coins notification
        const coinsNotificationId = `coins-${Date.now()}`;
        setNotifications((prev) => [
          ...prev,
          {
            id: coinsNotificationId,
            title: "Bonus Coins",
            description: "You received bonus coins for leveling up!",
            type: "coin",
            value: 50,
          },
        ]);
      }

      // Skill-specific XP
      if (skill && newData.skills[skill]) {
        newData.skills[skill].xp += amount;
        const skillXpForNextLevel = newData.skills[skill].level * 50;
        let didSkillLevelUp = false;

        if (newData.skills[skill].xp >= skillXpForNextLevel) {
          newData.skills[skill].level++;
          newData.skills[skill].xp -= skillXpForNextLevel;
          didSkillLevelUp = true;

          // Show skill level up notification
          const notificationId = `skill-${Date.now()}`;
          setNotifications((prev) => [
            ...prev,
            {
              id: notificationId,
              title: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Skill Improved!`,
              description: `Your ${skill} skill is now at level ${newData.skills[skill].level}!`,
              type: "xp",
              value: newData.skills[skill].level,
            },
          ]);
        }
      }

      // Always show XP notification if not leveling up
      if (!didLevelUp) {
        const notificationId = `xp-${Date.now()}`;
        setNotifications((prev) => [
          ...prev,
          {
            id: notificationId,
            title: "XP Earned",
            description: skill
              ? `You earned XP for your ${skill} skill!`
              : "You earned XP for your progress!",
            type: "xp",
            value: amount,
          },
        ]);
      }

      return newData;
    });
  }, []);

  const awardBadge = useCallback((badge: string) => {
    setPlayerData((prev) => {
      // Only add badge and notification if it's new
      if (!prev.badges.includes(badge)) {
        // Show badge notification
        const notificationId = `badge-${Date.now()}`;
        setNotifications((prev) => [
          ...prev,
          {
            id: notificationId,
            title: "New Badge Earned!",
            description: `Congratulations! You've earned the "${badge}" badge.`,
            type: "badge",
          },
        ]);

        return {
          ...prev,
          badges: [...prev.badges, badge],
        };
      }
      return prev;
    });
  }, []);

  // Handle removing notifications
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const value = {
    playerData,
    addXP,
    awardBadge,
    setPlayerData,
  };

  return (
    <GamificationContext.Provider value={value}>
      {/* Render notifications */}
      {notifications.map((notification) => (
        <AchievementNotification
          key={notification.id}
          title={notification.title}
          description={notification.description}
          type={notification.type}
          value={notification.value}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      {children}
    </GamificationContext.Provider>
  );
};

// ============================================
// 3D CHARACTER COMPONENT
// ============================================

interface Character3DProps {
  characterId: string;
  message?: string;
  animation?: string;
}

// Typing effect component for character speech bubbles
const TypingEffect: React.FC<{ text: string; speed?: number }> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </>
  );
};

// Enhanced 3D Character Component with real GLB model loading and animation
const Character3D = ({
  characterId,
  message,
  animation = "idle",
}: Character3DProps): React.ReactElement => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [modelError, setModelError] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Find the character data
  const characterData = curriculumCharacters.find((c) => c.id === characterId);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // @ts-ignore
    if ("physicallyCorrectLights" in renderer) renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Increased for better lighting
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brightened ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased intensity
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Increased shadow resolution
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.001;
    directionalLight.shadow.radius = 2; // Softer shadows
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5); // Increased fill light
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3); // Added back light for rim effect
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // Enhanced Ground and Environment
    // Ground with improved texture
    const groundSize = 12;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 32, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xa9d18e,
      roughness: 0.7,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle grid for reference
    const gridHelper = new THREE.GridHelper(groundSize, 20, 0x000000, 0xcccccc);
    gridHelper.position.y = 0.01;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Environment map for realistic reflections
    const envMapLoader = new THREE.TextureLoader();
    const envMap = envMapLoader.load(
      "/assets/backgrounds/lesson-bg.svg",
      // Success callback
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = new THREE.Color(0xf5f9ff); // Soft blue background
      },
      // Progress callback
      undefined,
      // Error callback
      (error) => {
        console.warn("Failed to load environment map:", error);
        // Still set a background color even if the texture fails to load
        scene.background = new THREE.Color(0xf5f9ff);
      },
    );

    // Add some decorative elements to the scene
    const decorGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const decorMaterial = new THREE.MeshStandardMaterial({
      color: 0x6699ff,
      roughness: 0.2,
      metalness: 0.8,
      envMap: envMap,
    });

    // Add decorative elements in corners
    const positions = [
      { x: -4, z: -4 },
      { x: 4, z: -4 },
      { x: -4, z: 4 },
      { x: 4, z: 4 },
    ];

    positions.forEach((pos) => {
      const sphere = new THREE.Mesh(decorGeometry, decorMaterial);
      sphere.position.set(pos.x, 0.2, pos.z);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      scene.add(sphere);
    });

    // Keyboard controls
    const keys: { [key: string]: boolean } = {};
    const keyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const keyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    // Enhanced Model loading with loading manager and DRACO compression support
    let fakeLoading: ReturnType<typeof setInterval> | null = null;

    if (characterData?.path) {
      // Create loading manager for better tracking
      const loadingManager = new THREE.LoadingManager();
      loadingManager.onProgress = (url, loaded, total) => {
        setLoadingProgress(Math.round((loaded / total) * 100));
      };

      // Improved GLTFLoader with loading manager
      const loader = new GLTFLoader(loadingManager);

      // Set higher detail loading for better models
      const modelQuality = {
        highDetail: window.innerWidth > 768, // Only load high detail on larger screens
      };

      // Load the model with progress tracking
      loader.load(
        characterData.path,
        (gltf: any) => {
          const gltfModel: THREE.Object3D = gltf.scene;

          // Performance optimization - traverse once and apply all mesh operations
          gltfModel.traverse((child: any) => {
            if (child.isMesh) {
              // Add shadows
              child.castShadow = true;
              child.receiveShadow = true;

              // Apply environment map for better reflections
              if (child.material) {
                child.material.envMapIntensity = 0.8;

                // Optimize materials for performance
                if (!modelQuality.highDetail && child.material.map) {
                  child.material.map.minFilter = THREE.LinearFilter;
                  child.material.map.anisotropy = 1;
                }
              }
            }
          });

          // Position and scale model appropriately
          gltfModel.position.y = 1;

          // Center model on scene origin
          const box = new THREE.Box3().setFromObject(gltfModel);
          const center = box.getCenter(new THREE.Vector3());
          gltfModel.position.x = gltfModel.position.x - center.x;
          gltfModel.position.z = gltfModel.position.z - center.z;

          scene.add(gltfModel);
          modelRef.current = gltfModel;
          // Enhanced Animation system
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltfModel);
            mixerRef.current = mixer;

            // Create a map of all available animations
            const animations: { [key: string]: THREE.AnimationAction } = {};

            // Map actions by id with cross-fade capability
            for (const anim of characterData.animations) {
              const clip = gltf.animations.find((c: any) => c.name === anim.clipName);
              if (clip) {
                animations[anim.id] = mixer.clipAction(clip);
              }
            }

            // Enhanced initial animation with smooth transition
            const initialAnim = characterData.animations.find((a) => a.id === animation);
            if (initialAnim) {
              const clip = gltf.animations.find((c: any) => c.name === initialAnim.clipName);
              if (clip) {
                const action = mixer.clipAction(clip);

                // Set up animation parameters for better playback
                action.clampWhenFinished = false;
                action.loop = initialAnim.id === "idle" ? THREE.LoopRepeat : THREE.LoopOnce;

                // Set appropriate time scale based on animation type
                action.timeScale = initialAnim.id === "celebrate" ? 1.2 : 1.0;

                // Play with smooth fade-in
                action.reset().fadeIn(0.5).play();
              }
            }
          }
          setModelLoaded(true);
        },
        (xhr: any) => {
          setLoadingProgress(Math.round((xhr.loaded / (xhr.total || 1)) * 100));
        },
        (error: any) => {
          console.error("Error loading model:", error);
          setModelError(true);
          setModelLoaded(false);
          setLoadingProgress(100);
        },
      );
    } else {
      // No model path: show placeholder and simulate loading
      fakeLoading = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            if (fakeLoading) clearInterval(fakeLoading);
            setModelLoaded(true);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      // Placeholder mesh
      const characterColor =
        characterId === "winnie"
          ? 0xffd700
          : characterId === "natalie"
            ? 0x4287f5
            : characterId === "andy"
              ? 0x00aa00
              : characterId === "daisy"
                ? 0xff69b4
                : 0x888888;
      const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
      const material = new THREE.MeshPhongMaterial({ color: characterColor });
      const character = new THREE.Mesh(geometry, material);
      character.position.y = 1;
      character.castShadow = true;
      scene.add(character);
      modelRef.current = character;
    }

    // Animation loop
    let animationId: number;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;
      // Animate model
      if (mixerRef.current) {
        mixerRef.current.update(0.016);
      } else if (modelRef.current) {
        // Placeholder animation
        modelRef.current.rotation.y += 0.01;
        modelRef.current.position.y = 1 + Math.sin(time * 1.5) * 0.05;
      }
      // Keyboard camera controls
      camera.position.x += (keys["ArrowRight"] ? 0.1 : 0) - (keys["ArrowLeft"] ? 0.1 : 0);
      camera.position.z += (keys["ArrowDown"] ? 0.1 : 0) - (keys["ArrowUp"] ? 0.1 : 0);
      camera.lookAt(new THREE.Vector3(0, 1, 0));
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (mixerRef.current) mixerRef.current.stopAllAction();
      if (fakeLoading) clearInterval(fakeLoading);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId, characterData?.path]);

  // Animation switching effect with enhanced transitions
  useEffect(() => {
    if (!modelLoaded || !mixerRef.current || !characterData) return;

    const anim = characterData.animations.find((a) => a.id === animation);
    if (!anim) return;

    // Find the clip by name
    const mixer = mixerRef.current;
    const root = modelRef.current;
    if (!mixer || !root) return;

    // Get all available animation clips
    // @ts-ignore
    const clips: THREE.AnimationClip[] = mixer._actions.map((a: any) => a._clip);
    const clip = clips.find((c: any) => c.name === anim.clipName);
    if (!clip) return;

    // Fade out all current animations before playing the new one
    mixer.stopAllAction();

    // Get the new action and configure it
    const action = mixer.clipAction(clip, root);

    // Set appropriate loop behavior based on animation type
    action.clampWhenFinished = false;
    action.loop = anim.id === "idle" ? THREE.LoopRepeat : THREE.LoopRepeat;

    // Adjust time scale for certain animations
    if (anim.id === "celebrate" || anim.id === "encourage") {
      action.timeScale = 1.2;
    } else if (anim.id === "thinking") {
      action.timeScale = 0.8;
    } else {
      action.timeScale = 1.0;
    }

    // Play with enhanced smooth fade-in
    action.reset().fadeIn(0.3).play();

    // Create a visual feedback effect when animation changes
    const container = document.getElementById("character-feedback");
    if (container && anim.id !== "idle") {
      if (anim.id === "celebrate") {
        createParticleEffect("character-feedback", {
          particleCount: 50,
          particleColors: [0xffcc00, 0xff9933],
          speed: 0.02,
          animationDuration: 2,
        });
      } else if (anim.id === "encourage") {
        createRippleEffect("character-feedback", {
          rippleCount: 2,
          duration: 2,
        });
      }
    }
  }, [animation, modelLoaded, characterData]);

  // Always return the JSX for the component
  return (
    <div className="relative" aria-label="3D Character Preview">
      {/* Feedback container for special effects */}
      <div id="character-feedback" className="absolute inset-0 pointer-events-none z-10"></div>

      {/* 3D scene container */}
      <div
        ref={mountRef}
        className="w-full h-72 rounded-lg overflow-hidden shadow-lg"
        role="img"
        aria-label={characterData?.name || "Character"}
      />

      {/* Loading indicator */}
      {!modelLoaded && !modelError && loadingProgress < 100 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
          aria-live="polite"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center">Loading {characterData?.name || "Character"}</div>
            <div className="w-48 h-2 bg-gray-200 rounded-full mt-2" aria-label="Loading progress">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
                aria-valuenow={loadingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {modelError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-80">
          <div className="text-red-700 font-bold">
            Failed to load 3D model. Showing placeholder.
          </div>
        </div>
      )}

      {/* Character speech bubble with enhanced styling */}
      {message && (
        <div
          className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3 shadow-lg border-2 border-blue-200"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 text-sm font-bold">
                  {characterData?.name?.charAt(0) || "?"}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">{characterData?.name || "Character"}</p>
              <p className="text-sm text-gray-700">
                <TypingEffect text={message} speed={25} />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced camera controls with tooltip */}
      <div className="absolute top-2 right-2">
        <button
          className="bg-gray-800 bg-opacity-60 text-white text-xs px-2 py-1 rounded hover:bg-opacity-80"
          title="Use arrow keys to move camera"
          aria-label="Camera controls"
        >
          <span className="sr-only">Camera controls</span>
          ↑↓←→
        </button>
      </div>

      {/* Animation controls - new feature */}
      {modelLoaded && characterData && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded p-1 shadow-md flex gap-1">
          {characterData.animations.slice(0, 4).map((anim) => (
            <button
              key={anim.id}
              onClick={() => animation !== anim.id && setSelectedAnimation?.(anim.id)}
              className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                animation === anim.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              title={anim.name}
              aria-label={`Play ${anim.name} animation`}
              aria-pressed={animation === anim.id}
            >
              {anim.id === "idle" && "I"}
              {anim.id === "teaching" && "T"}
              {anim.id === "encourage" && "E"}
              {anim.id === "celebrate" && "C"}
              {anim.id === "thinking" && "?"}
              {anim.id === "pointing" && "P"}
              {anim.id === "reading" && "R"}
              {anim.id === "explaining" && "X"}
              {anim.id === "demonstrating" && "D"}
              {anim.id === "counting" && "#"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// GAMIFICATION PROGRESS UI COMPONENT
// ============================================

interface GamificationProgressProps {
  playerData: PlayerData;
}

const GamificationProgress: React.FC<GamificationProgressProps> = ({ playerData }) => {
  // Calculate XP progress percentage
  const xpForNextLevel = playerData.level * 100;
  const xpProgress = Math.min(100, (playerData.xp / xpForNextLevel) * 100);

  // Visual feedback state
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Achievement animation state
  const [animateXP, setAnimateXP] = useState(false);
  const [animateLevel, setAnimateLevel] = useState(false);

  // Trigger animations periodically for visual feedback
  useEffect(() => {
    const xpTimer = setTimeout(() => {
      setAnimateXP(true);
      setTimeout(() => setAnimateXP(false), 1500);
    }, 3000);

    return () => clearTimeout(xpTimer);
  }, []);

  useEffect(() => {
    const levelTimer = setTimeout(() => {
      setAnimateLevel(true);
      setTimeout(() => setAnimateLevel(false), 1500);
    }, 5000);

    return () => clearTimeout(levelTimer);
  }, []);

  return (
    <MicroInteractions
      type="cardEntrance"
      className={`bg-white p-4 rounded-lg shadow-md border border-purple-100 mb-6 transition-all duration-300 ${
        isExpanded ? "transform scale-105" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <MicroInteractions
            type={animateLevel ? "celebrate" : "cardHover"}
            className={`bg-purple-600 text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              animateLevel ? "ring-4 ring-purple-300 ring-opacity-50" : ""
            }`}
          >
            {playerData.level}
          </MicroInteractions>
          <h3 className="font-semibold text-gray-800">
            Curriculum Designer Level {playerData.level}
          </h3>
        </div>
        <MicroInteractions
          type="buttonHover"
          className="text-amber-500 font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="relative group">
            {playerData.coins} coins
            <span className="absolute left-0 -bottom-6 hidden group-hover:block text-xs bg-amber-100 text-amber-800 p-1 rounded whitespace-nowrap">
              Use coins to unlock customizations
            </span>
          </span>
        </MicroInteractions>
      </div>

      {/* Expandable toggle */}
      <button
        className="w-full text-xs text-gray-500 flex items-center justify-center mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="mr-1">{isExpanded ? "Show less" : "Show details"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "transform rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* XP Progress Bar */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 ${
                animateXP ? "animate-pulse" : ""
              }`}
            >
              XP Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-600">
              {playerData.xp}/{xpForNextLevel} XP
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
          <MicroInteractions
            type="custom"
            customAnimation={{
              width: `${xpProgress}%`,
              transition: { duration: 1, ease: "easeOut" },
            }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
          ></MicroInteractions>
        </div>
      </div>

      {/* Skills Grid - Only visible when expanded */}
      {isExpanded && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
            {Object.entries(playerData.skills).map(([skill, data]) => (
              <MicroInteractions
                key={skill}
                type="cardHover"
                className={`bg-gray-100 p-2 rounded text-center cursor-pointer transition-colors duration-200 ${
                  activeSkill === skill ? "bg-blue-100 ring-2 ring-blue-300" : "hover:bg-blue-50"
                }`}
                onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
              >
                <div className="text-xs text-gray-500 capitalize">{skill}</div>
                <div className="font-medium">Level {data.level}</div>
                <div className="w-full bg-gray-300 h-1 rounded-full mt-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (data.xp / (data.level * 50)) * 100)}%` }}
                  ></div>
                </div>
                {activeSkill === skill && (
                  <div className="mt-2 text-xs text-blue-600">
                    {data.xp}/{data.level * 50} XP to level {data.level + 1}
                  </div>
                )}
              </MicroInteractions>
            ))}
          </div>

          {/* Skill description */}
          {activeSkill && (
            <MicroInteractions
              type="fadeIn"
              className="mt-3 text-sm text-gray-600 bg-blue-50 p-2 rounded"
            >
              <p className="font-medium">
                {activeSkill.charAt(0).toUpperCase() + activeSkill.slice(1)} Skill
              </p>
              <p className="text-xs mt-1">
                {activeSkill === "literacy" && "Improve your reading and writing abilities."}
                {activeSkill === "numeracy" && "Develop your mathematical and analytical thinking."}
                {activeSkill === "digital" &&
                  "Enhance your technology and digital creation skills."}
                {activeSkill === "lifeSkills" &&
                  "Build practical everyday skills for independence."}
                {activeSkill === "communication" &&
                  "Develop effective speaking and listening abilities."}
              </p>
            </MicroInteractions>
          )}

          {/* Achievement Statistics */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Streak</div>
              <div className="font-bold text-lg">{playerData.streakDays} days</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Lessons</div>
              <div className="font-bold text-lg">{playerData.totalLessonsCompleted}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-500">Badges</div>
              <div className="font-bold text-lg">{playerData.badges.length}</div>
            </div>
          </div>
        </>
      )}

      {/* Badges */}
      {playerData.badges.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Badges Earned
          </h4>
          <div className="flex flex-wrap gap-2">
            {playerData.badges.map((badge, index) => (
              <MicroInteractions
                key={index}
                type="celebrate"
                className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-400 cursor-help relative group"
              >
                {badge}
                <div className="absolute left-0 -top-14 hidden group-hover:block bg-yellow-50 border border-yellow-200 p-2 rounded shadow-lg text-xs w-40 z-10">
                  <p className="font-medium">"{badge}"</p>
                  <p className="text-gray-600 mt-1">Earned for excellence in curriculum design.</p>
                </div>
              </MicroInteractions>
            ))}
          </div>
        </div>
      )}
    </MicroInteractions>
  );
};

// ============================================
// CHARACTER SHOWCASE COMPONENT
// ============================================

interface CharacterShowcaseProps {
  onClose: () => void;
}

const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({ onClose }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>(curriculumCharacters[0].id);
  const [selectedAnimation, setSelectedAnimation] = useState<string>("idle");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Handle closing with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Allow exit animation to complete
  };

  return (
    <MicroInteractions
      type="custom"
      customAnimation={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 },
        transition: { duration: 0.5, ease: "easeOut" },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
    >
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Character Showcase</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-blue-200 transition-colors"
            aria-label="Close showcase"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content area */}
        <div className="flex flex-col md:flex-row h-[80vh] overflow-hidden">
          {/* Character list sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Available Characters</h3>
            <div className="space-y-3">
              {curriculumCharacters.map((character) => (
                <div
                  key={character.id}
                  onClick={() => setSelectedCharacter(character.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCharacter === character.id
                      ? "bg-blue-100 border-l-4 border-blue-500 shadow-sm"
                      : "bg-white hover:bg-blue-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3 text-blue-800 font-bold">
                      {character.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{character.name}</h4>
                      <p className="text-xs text-gray-500">{character.description}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Specializes in:</div>
                    <div className="flex flex-wrap gap-1">
                      {character.subjects.map((subject) => (
                        <span
                          key={`${character.id}-${subject}`}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character preview and details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 3D preview */}
            <div className="h-96 mb-6">
              <Character3D characterId={selectedCharacter} animation={selectedAnimation} />
            </div>

            {/* Character details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">
                {curriculumCharacters.find((c) => c.id === selectedCharacter)?.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {curriculumCharacters.find((c) => c.id === selectedCharacter)?.description}
              </p>

              {/* Animation controls */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2 text-gray-700">Available Animations</h4>
                <div className="flex flex-wrap gap-2">
                  {curriculumCharacters
                    .find((c) => c.id === selectedCharacter)
                    ?.animations.map((anim) => (
                      <button
                        key={anim.id}
                        onClick={() => setSelectedAnimation(anim.id)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedAnimation === anim.id
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {anim.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Character profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700">Teaching Style</h4>
                  <p className="text-sm text-gray-600">
                    {selectedCharacter === "winnie" &&
                      "Enthusiastic and encouraging, perfect for younger learners."}
                    {selectedCharacter === "natalie" &&
                      "Methodical and analytical, ideal for STEM subjects."}
                    {selectedCharacter === "andy" &&
                      "Practical and hands-on, great for applied learning."}
                    {selectedCharacter === "daisy" &&
                      "Creative and expressive, excellent for arts and humanities."}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700">Best Used For</h4>
                  <p className="text-sm text-gray-600">
                    {selectedCharacter === "winnie" &&
                      "Early childhood education, building confidence in learners."}
                    {selectedCharacter === "natalie" &&
                      "Advanced concepts, critical thinking, and problem-solving."}
                    {selectedCharacter === "andy" &&
                      "Life skills, vocational training, and practical demonstrations."}
                    {selectedCharacter === "daisy" &&
                      "Creative projects, storytelling, and cultural exploration."}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium mb-2 text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Usage Tips
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                <li>
                  Choose this character for{" "}
                  {selectedCharacter === "winnie"
                    ? "engaging younger learners"
                    : selectedCharacter === "natalie"
                      ? "technical and analytical subjects"
                      : selectedCharacter === "andy"
                        ? "practical, hands-on learning"
                        : "creative and expressive learning"}
                </li>
                <li>
                  Use the "
                  {curriculumCharacters.find((c) => c.id === selectedCharacter)?.animations[1]
                    ?.name || "Teaching"}
                  " animation when introducing new concepts
                </li>
                <li>
                  Switch to "
                  {curriculumCharacters.find((c) => c.id === selectedCharacter)?.animations[2]
                    ?.name || "Encourage"}
                  " animation when learners need motivation
                </li>
                <li>Combine with interactive elements for maximum engagement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-6 py-3 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </MicroInteractions>
  );
};

// ============================================
// CURRICULUM BUILDER COMPONENT
// ============================================

interface Module {
  id: string;
  title: string;
  description: string;
  subject: string;
  targetAge: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  materials: string[];
  characterId: string;
  animationStyle: string;
  gameElements: GameElement[];
}

interface GameElement {
  type: string;
  title: string;
  description: string;
  points: number;
}

const subjects = [
  "Mathematics",
  "Science",
  "History",
  "Language Arts",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Social Studies",
  "Geography",
  "Life Skills",
  "Digital Literacy",
  "Employment Skills",
];

const CurriculumBuilder: React.FC = () => {
  // Basic module state
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>(curriculumCharacters[0].id);
  const [selectedAnimation, setSelectedAnimation] = useState<string>("idle");
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [moduleDescription, setModuleDescription] = useState<string>("");
  const [targetAgeGroup, setTargetAgeGroup] = useState<string>("6-12 years");
  const [estimatedDuration, setEstimatedDuration] = useState<string>("30 minutes");
  const [difficulty, setDifficulty] = useState<string>("Beginner");

  // Advanced features
  const [learningObjectives, setLearningObjectives] = useState<string[]>([""]);
  const [materialsNeeded, setMaterialsNeeded] = useState<string[]>([""]);
  const [showCharacterPreview, setShowCharacterPreview] = useState<boolean>(false);
  const [generatedModule, setGeneratedModule] = useState<Module | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [moduleHistory, setModuleHistory] = useState<Module[]>([]);
  const [showCharacterShowcase, setShowCharacterShowcase] = useState<boolean>(false);

  // Gamification features
  const { addXP, playerData } = useGamification();

  // Character filtering based on selected subject
  const filteredCharacters = curriculumCharacters.filter((character) =>
    character.subjects.includes(selectedSubject),
  );

  useEffect(() => {
    // If current character doesn't support the selected subject, switch to first valid character
    if (
      filteredCharacters.length > 0 &&
      !filteredCharacters.find((char) => char.id === selectedCharacter)
    ) {
      setSelectedCharacter(filteredCharacters[0].id);
      setSelectedAnimation("idle");
    }
  }, [selectedSubject, selectedCharacter, filteredCharacters]);

  // Add ripple effect when character is selected
  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCharacterId = e.target.value;
    setSelectedCharacter(newCharacterId);

    // Create ripple effect container if needed
    const containerId = "character-selection-ripple";
    const containerExists = document.getElementById(containerId);

    if (!containerExists) {
      const rippleContainer = document.createElement("div");
      rippleContainer.id = containerId;
      rippleContainer.style.position = "absolute";
      rippleContainer.style.top = "0";
      rippleContainer.style.left = "0";
      rippleContainer.style.width = "100%";
      rippleContainer.style.height = "100%";
      rippleContainer.style.pointerEvents = "none";
      rippleContainer.style.zIndex = "10";

      // Find the character select element and append the container
      const selectElement = e.target;
      const parentElement = selectElement.closest(".space-y-2");
      if (parentElement) {
        parentElement.style.position = "relative";
        parentElement.appendChild(rippleContainer);

        // Apply the ripple effect
        createRippleEffect(containerId, {
          color: 0x6699ff,
          rippleSpeed: 0.03,
          rippleWidth: 0.9,
          rippleCount: 2,
          duration: 2.5,
        });

        // Clean up the effect container after animation
        setTimeout(() => {
          if (rippleContainer.parentNode) {
            parentElement.removeChild(rippleContainer);
          }
        }, 3000);
      }
    }
  };

  // Manage learning objectives
  const addObjective = () => {
    setLearningObjectives((prev) => [...prev, ""]);
  };

  const removeObjective = (index: number) => {
    setLearningObjectives((prev) => prev.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, value: string) => {
    setLearningObjectives((prev) => prev.map((obj, i) => (i === index ? value : obj)));
  };

  // Manage materials
  const addMaterial = () => {
    setMaterialsNeeded((prev) => [...prev, ""]);
  };

  const removeMaterial = (index: number) => {
    setMaterialsNeeded((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, value: string) => {
    setMaterialsNeeded((prev) => prev.map((mat, i) => (i === index ? value : mat)));
  };

  // Generate a curriculum module
  const generateModule = () => {
    setIsGenerating(true);

    // Create a container for the celebration effect
    const effectsContainerId = "generate-celebration-effects";

    // Reference to gamification context for rewards
    const { addXP, awardBadge } = useGamification();

    // Simulate AI generation process (in a real app, would call an API)
    setTimeout(() => {
      // Generate game elements based on subject
      const gameElementsForSubject: GameElement[] = [
        {
          type: "quiz",
          title: `${selectedSubject} Knowledge Check`,
          description: "Test your understanding with interactive questions",
          points: 100,
        },
        {
          type: "activity",
          title: "Hands-on Project",
          description: `Apply ${selectedSubject} concepts in a real-world scenario`,
          points: 150,
        },
        {
          type: "simulation",
          title: "Virtual Lab",
          description: "Practice skills in a safe, virtual environment",
          points: 200,
        },
      ];

      // Create the module
      const newModule: Module = {
        id: `module_${Date.now()}`,
        title: moduleTitle || `${selectedSubject} - Interactive Learning Module`,
        description:
          moduleDescription ||
          `A comprehensive ${selectedSubject} module with interactive elements and 3D character guidance.`,
        subject: selectedSubject,
        targetAge: targetAgeGroup,
        duration: estimatedDuration,
        difficulty,
        objectives: learningObjectives.filter((obj) => obj.trim() !== ""),
        materials: materialsNeeded.filter((mat) => mat.trim() !== ""),
        characterId: selectedCharacter,
        animationStyle: selectedAnimation,
        gameElements: gameElementsForSubject,
      };

      setGeneratedModule(newModule);
      setModuleHistory((prev) => [newModule, ...prev]);
      setShowCharacterPreview(true);
      setIsGenerating(false);

      // Gamification rewards based on module complexity
      const objectiveCount = newModule.objectives.filter((o) => o.trim() !== "").length;
      const materialCount = newModule.materials.filter((m) => m.trim() !== "").length;
      const moduleComplexity = objectiveCount + materialCount;

      // Base XP for creating a module
      const baseXP = 50;
      // Bonus XP based on how complete the module is
      const complexityBonus = Math.min(50, moduleComplexity * 10);
      // Total XP to award
      const totalXP = baseXP + complexityBonus;

      // Award XP for the appropriate skill based on subject
      let skill = "digital";
      if (["Mathematics", "Computer Science"].includes(selectedSubject)) {
        skill = "numeracy";
      } else if (["Language Arts", "Social Studies", "History"].includes(selectedSubject)) {
        skill = "literacy";
      } else if (["Life Skills", "Employment Skills"].includes(selectedSubject)) {
        skill = "lifeSkills";
      } else if (["Music", "Art", "Physical Education"].includes(selectedSubject)) {
        skill = "communication";
      }

      // Award XP with a slight delay for better UX flow
      setTimeout(() => {
        addXP(totalXP, skill);

        // Award badges based on achievements
        if (moduleHistory.length >= 5) {
          awardBadge("Prolific Creator");
        }

        if (objectiveCount >= 5) {
          awardBadge("Detail Oriented");
        }

        if (moduleComplexity >= 10) {
          awardBadge("Curriculum Master");
        }

        if (newModule.subject === "Computer Science") {
          awardBadge("Tech Educator");
        }
      }, 1000);

      // Create celebration particle effect
      createParticleEffect("generate-celebration-effects", {
        particleCount: 150,
        particleColors: [0x6699ff, 0xff9933, 0x66cc66, 0xffcc00],
        speed: 0.03,
        animationDuration: 3,
      });

      // Change character animation to celebrate
      setSelectedAnimation("celebrate");

      // Clean up the effects container after animation completes
      setTimeout(() => {
        const container = document.getElementById("generate-celebration-effects");
        if (container) {
          document.body.removeChild(container);
        }
      }, 4000);
    }, 1500);
  };

  // Reset the form
  const resetForm = () => {
    setSelectedSubject(subjects[0]);
    setSelectedCharacter(curriculumCharacters[0].id);
    setSelectedAnimation("idle");
    setModuleTitle("");
    setModuleDescription("");
    setTargetAgeGroup("6-12 years");
    setEstimatedDuration("30 minutes");
    setDifficulty("Beginner");
    setLearningObjectives([""]);
    setMaterialsNeeded([""]);
    setShowCharacterPreview(false);
  };

  // Export module as JSON
  const exportModule = () => {
    if (!generatedModule) return;

    const dataStr = JSON.stringify(generatedModule, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${generatedModule.title.replace(/\s+/g, "_")}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    // Gamification reward for exporting
    addXP(10, "digital");
  };

  return (
    <GamificationProvider>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <MicroInteractions type="pageEntrance" className="w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Enhanced Curriculum Builder
          </h1>

          {showCharacterPreview && selectedCharacter && (
            <MicroInteractions type="characterEntrance" position="top" className="mb-6">
              <Character3D
                characterId={selectedCharacter}
                animation={selectedAnimation}
                message={`I'm ${curriculumCharacters.find((c) => c.id === selectedCharacter)?.name || "your assistant"}, ready to help with your ${selectedSubject} curriculum!`}
              />
            </MicroInteractions>
          )}

          {/* Gamification Progress UI */}
          <GamificationProgress playerData={playerData} />

          <div className="space-y-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Character Selection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Select Character</label>
                <button
                  onClick={() => setShowCharacterShowcase(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Character Gallery
                </button>
              </div>
              <select
                value={selectedCharacter}
                onChange={handleCharacterSelect}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              >
                {filteredCharacters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name} - {character.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Animation Selection */}
            {selectedCharacter && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Animation</label>
                <select
                  value={selectedAnimation}
                  onChange={(e) => setSelectedAnimation(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  {curriculumCharacters
                    .find((c) => c.id === selectedCharacter)
                    ?.animations.map((anim) => (
                      <option key={anim.id} value={anim.id}>
                        {anim.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Basic Module Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="Enter module title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Description
                </label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  placeholder="Describe what students will learn"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Age Group
                  </label>
                  <input
                    type="text"
                    value={targetAgeGroup}
                    onChange={(e) => setTargetAgeGroup(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
              <div className="flex space-x-4">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      difficulty === level
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
              <div className="space-y-2">
                {learningObjectives.map((objective, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                    <button
                      onClick={() => removeObjective(index)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addObjective}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-700"
                >
                  + Add Objective
                </button>
              </div>
            </div>

            {/* Materials Needed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Materials Needed</label>
              <div className="space-y-2">
                {materialsNeeded.map((material, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => updateMaterial(index, e.target.value)}
                      placeholder={`Material ${index + 1}`}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                    <button
                      onClick={() => removeMaterial(index)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMaterial}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-700"
                >
                  + Add Material
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <MicroInteractions type="buttonHover" className="inline-block">
                <button
                  onClick={generateModule}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate Module"}
                </button>
              </MicroInteractions>

              <MicroInteractions type="buttonHover" className="inline-block">
                <button
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Reset Form
                </button>
              </MicroInteractions>
            </div>

            {/* Generated Module Display */}
            {generatedModule && (
              <MicroInteractions
                type="cardEntrance"
                className="mt-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50"
              >
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
                  Generated Curriculum Module
                </h2>

                <div className="space-y-4">
                  <MicroInteractions type="highlight" className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-lg">{generatedModule.title}</h3>
                    <p className="text-gray-600">{generatedModule.description}</p>
                  </MicroInteractions>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MicroInteractions type="cardHover" className="bg-white p-4 rounded-lg shadow">
                      <h4 className="font-semibold">Subject</h4>
                      <p>{generatedModule.subject}</p>
                    </MicroInteractions>

                    <MicroInteractions type="cardHover" className="bg-white p-4 rounded-lg shadow">
                      <h4 className="font-semibold">Target Age</h4>
                      <p>{generatedModule.targetAge}</p>
                    </MicroInteractions>

                    <MicroInteractions type="cardHover" className="bg-white p-4 rounded-lg shadow">
                      <h4 className="font-semibold">Duration</h4>
                      <p>{generatedModule.duration}</p>
                    </MicroInteractions>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-semibold mb-2">Learning Objectives</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {generatedModule.objectives.map((objective, idx) => (
                        <li key={idx}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-semibold mb-2">Materials Needed</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {generatedModule.materials.map((material, idx) => (
                        <li key={idx}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-semibold mb-2">Interactive Elements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {generatedModule.gameElements.map((element, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-3 bg-purple-50 border-purple-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{element.title}</h5>
                            <span className="text-sm text-purple-600">{element.points} pts</span>
                          </div>
                          <p className="text-sm text-gray-600">{element.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <MicroInteractions type="buttonHover" className="inline-block">
                      <button
                        onClick={exportModule}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Export Module
                      </button>
                    </MicroInteractions>
                  </div>
                </div>
              </MicroInteractions>
            )}

            {/* Module History */}
            {moduleHistory.length > 1 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Recently Created Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moduleHistory.slice(1, 5).map((module) => (
                    <div
                      key={module.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {module.subject} • {module.targetAge}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created with{" "}
                        {curriculumCharacters.find((c) => c.id === module.characterId)?.name ||
                          "Character"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MicroInteractions>
      </div>

      {/* Character Showcase Modal */}
      {showCharacterShowcase && (
        <CharacterShowcase onClose={() => setShowCharacterShowcase(false)} />
      )}
    </GamificationProvider>
  );
};

export default CurriculumBuilder;

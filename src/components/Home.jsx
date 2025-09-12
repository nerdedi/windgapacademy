/**
 * Windgap Academy - Sophisticated Homepage
 *
 * Features Figma-level sophistication:
 * - Advanced cursor interactions and magnetic effects
 * - Smooth parallax scrolling and micro-animations
 * - Interactive hero demonstrations
 * - Real-time preview animations
 * - Command palette and keyboard shortcuts
 * - Contextual menus and floating panels
 * - Advanced hover states and transitions
 * - Professional typography and spacing
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  // Sophisticated scroll animations
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  // Advanced cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Magnetic button effect
  const handleMagneticHover = useCallback((element, isHovering) => {
    if (isHovering) {
      setHoveredElement(element);
    } else {
      setHoveredElement(null);
    }
  }, []);

  // Navigation handlers
  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleExploreGames = () => {
    navigate("/games");
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return <SophisticatedLoader />;
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden"
    >
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed w-5 h-5 pointer-events-none z-50 transition-all duration-200 ${
          hoveredElement ? "scale-150 bg-blue-500" : "scale-100 bg-gray-400"
        } rounded-full mix-blend-difference`}
        style={{ left: 0, top: 0 }}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Sophisticated Navigation */}
      <SophisticatedNavigation onCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1
              className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              The Future of
              <motion.span
                className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Learning
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Experience AI-powered education with immersive 3D environments, personalized learning
              paths, and sophisticated analytics.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <MagneticButton
                onClick={handleGetStarted}
                onHover={(isHovering) => handleMagneticHover("cta", isHovering)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </MagneticButton>

              <MagneticButton
                onClick={handleExploreGames}
                onHover={(isHovering) => handleMagneticHover("explore", isHovering)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all duration-300"
              >
                Explore Games
              </MagneticButton>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-500">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">200+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-500">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <LivePreview />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section style={{ y: featuresY }} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Sophisticated Learning Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most advanced educational technology with AI-powered personalization,
              immersive 3D environments, and real-time collaboration.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <InteractiveCard
              title="AI-Powered Learning"
              description="Personalized learning paths that adapt to your pace and style"
              icon="🤖"
              delay={0.1}
            />
            <InteractiveCard
              title="3D Immersive Games"
              description="Explore mathematics, science, and language in stunning 3D worlds"
              icon="🎮"
              delay={0.2}
            />
            <InteractiveCard
              title="Real-time Analytics"
              description="Track progress with sophisticated analytics and insights"
              icon="📊"
              delay={0.3}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Learning?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Join thousands of learners already experiencing the future of education
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <MagneticButton
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Learning Today
            </MagneticButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleViewDashboard} />
    </div>
  );
};

// Sophisticated Loading Component
const SophisticatedLoader = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.h2
        className="text-2xl font-semibold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading Windgap Academy
      </motion.h2>
    </div>
  </div>
);

// Sophisticated Navigation Component
const SophisticatedNavigation = ({ onCommandPalette }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Windgap Academy</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/games">Games</NavLink>
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onCommandPalette}
            className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm">Search</span>
            <kbd className="text-xs bg-white px-2 py-1 rounded border">⌘K</kbd>
          </button>

          <MagneticButton
            onClick={() => navigate("/signin")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </MagneticButton>

          <MagneticButton
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
};

// Navigation Link Component
const NavLink = ({ href, children }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(href)}
      className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

// Enhanced Background Environment
function DynamicBackground() {
  const { scene } = useThree();
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.1;
    }
  });

  return (
    <>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Cloud position={[-4, -2, -25]} speed={0.2} opacity={0.5} />
      <Cloud position={[4, 2, -15]} speed={0.2} opacity={0.3} />
    </>
  );
}

// Enhanced Floating Island with sophisticated materials
function FloatingIsland({ position, children, type = "default" }) {
  const meshRef = useRef();
  const texture = useTexture("/textures/island-grass.jpg");

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  const islandColors = {
    default: "#4ade80",
    math: "#6366f1",
    reading: "#14b8a6",
    science: "#f59e0b",
    creative: "#10b981",
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef} position={position}>
        {/* Main island body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[3, 4, 1, 8]} />
          <meshStandardMaterial
            color={islandColors[type]}
            map={texture}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Floating crystals around island */}
        <Float speed={2} rotationIntensity={1}>
          <mesh position={[2, 1, 0]}>
            <octahedronGeometry args={[0.3]} />
            <MeshDistortMaterial
              color={islandColors[type]}
              distort={0.3}
              speed={2}
              roughness={0.4}
            />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={0.8}>
          <mesh position={[-2, 1.5, 1]}>
            <octahedronGeometry args={[0.2]} />
            <MeshDistortMaterial
              color={islandColors[type]}
              distort={0.4}
              speed={1.5}
              roughness={0.4}
            />
          </mesh>
        </Float>

        {children}
      </group>
    </Float>
  );
}

// Enhanced Portal with particle effects
function EnhancedPortal({ position, isActive }) {
  const portalRef = useRef();

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      portalRef.current.material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={portalRef}>
        <ringGeometry args={[1, 1.5, 32]} />
        <meshBasicMaterial
          color={isActive ? "#00ffff" : "#4444ff"}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {isActive && <Sparkles count={100} scale={3} size={3} speed={0.8} color="#00ffff" />}
    </group>
  );
}

// Enhanced Module Portal with sophisticated interactions
function ModulePortal({ module, position, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [activated, setActivated] = useState(false);
  const sphereRef = useRef();
  const textRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (hovered) {
        sphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      }
    }

    if (textRef.current && hovered) {
      textRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = () => {
    setActivated(true);
    setTimeout(() => setActivated(false), 1000);
    onClick(module);
  };

  return (
    <FloatingIsland position={position} type={module.world.split("-")[0]}>
      <group
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Enhanced Title Text */}
        <Text3D
          ref={textRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.3}
          height={0.1}
          position={[-1, 1, 0]}
        >
          {module.title}
          <meshStandardMaterial
            color={hovered ? "#fbbf24" : "#ffffff"}
            emissive={hovered ? "#222" : "#000"}
          />
        </Text3D>

        {/* Progress Ring */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshStandardMaterial color="#00ff88" transparent opacity={0.6} />
        </mesh>

        {/* Main Module Sphere */}
        <mesh ref={sphereRef} position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.8]} />
          <MeshDistortMaterial
            color={module.color}
            emissive={hovered ? "#444" : "#000"}
            transparent
            opacity={0.9}
            distort={hovered ? 0.2 : 0.1}
            speed={2}
            roughness={0.4}
          />
        </mesh>

        {/* Particle Effects */}
        <Sparkles
          count={hovered ? 150 : 30}
          scale={4}
          size={3}
          speed={hovered ? 0.8 : 0.4}
          color={module.color}
        />

        {/* Activation Portal Effect */}
        {activated && <EnhancedPortal position={[0, 0.5, 0]} isActive={true} />}

        {/* Module Icon/Symbol */}
        <Float speed={1} rotationIntensity={0.3}>
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="#ffffff" emissive="#444" />
          </mesh>
        </Float>
      </group>
    </FloatingIsland>
  );
}

function Home() {
  const gamification = useGamification();
  const [selectedModule, setSelectedModule] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([0, 5, 10]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const soundManager = useRef(new SoundManager());
  const platformEngine = useRef(null);
  const particleSystem = useRef(new ParticleSystem());

  const modules = [
    {
      id: 1,
      title: "Math Quest",
      description: "Advanced mathematical reasoning through immersive 3D challenges",
      progress: 80,
      color: "#6366f1",
      position: [-6, 2, -3],
      world: "mathematical-dimension",
      icon: "🔢",
      difficulty: "Intermediate",
      estimatedTime: "15-30 min",
    },
    {
      id: 2,
      title: "Reading Realm",
      description: "Literary adventures in enchanted story worlds",
      progress: 60,
      color: "#14b8a6",
      position: [6, 3, -2],
      world: "story-realm",
      icon: "📚",
      difficulty: "Beginner",
      estimatedTime: "20-40 min",
    },
    {
      id: 3,
      title: "Science Lab",
      description: "Molecular-level experiments in virtual reality",
      progress: 45,
      color: "#f59e0b",
      position: [0, 4, -8],
      world: "quantum-lab",
      icon: "🧪",
      difficulty: "Advanced",
      estimatedTime: "25-45 min",
    },
    {
      id: 4,
      title: "Creative Studio",
      description: "AI-powered artistic expression and storytelling",
      progress: 30,
      color: "#10b981",
      position: [-4, 1, 4],
      world: "creative-dimension",
      icon: "🎨",
      difficulty: "All Levels",
      estimatedTime: "10-60 min",
    },
  ];

  useEffect(() => {
    // Initialize audio and start ambient soundscape
    soundManager.current.createAmbientSoundscape(["ambient-home"], 3000);

    // Simulate loading completion
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Auto-hide welcome message
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => {
      soundManager.current.cleanup();
    };
  }, []);

  const handleModuleClick = async (module) => {
    await soundManager.current.play("portal-enter", { volume: 0.7 });
    setSelectedModule(module);
    setCameraPosition([module.position[0], module.position[1] + 2, module.position[2] + 5]);
  };

  const enterModule = async (module) => {
    await soundManager.current.play("world-transition", { volume: 0.8 });
    // Transition to module world
    window.location.hash = `#${module.world}`;
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Enhanced 3D Scene */}
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Background */}
          <DynamicBackground />

          {/* Enhanced Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-10, 5, -10]} intensity={0.6} color="#4444ff" />
          <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />

          {/* Module Portals */}
          {modules.map((module) => (
            <ModulePortal
              key={module.id}
              module={module}
              position={module.position}
              onClick={handleModuleClick}
            />
          ))}

          {/* Central Platform */}
          <mesh position={[0, -2, 0]} receiveShadow>
            <cylinderGeometry args={[15, 15, 0.5, 32]} />
            <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Particle Effects */}
          <primitive object={particleSystem.current.getParticleGroup()} />

          {/* Enhanced Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2}
            autoRotate={!selectedModule}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Welcome Animation */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="text-center text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome to Windgap Academy
                </h1>
                <p className="text-2xl opacity-90 mb-8">Where Learning Becomes Adventure</p>
                <div className="flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Title */}
        <motion.div
          className="absolute top-8 left-8 text-white pointer-events-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showWelcome ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: showWelcome ? 0 : 2 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Windgap Academy
          </h1>
          <p className="text-xl opacity-80">Your Journey Awaits</p>
          <div className="mt-4 text-sm opacity-60">
            Click on any floating world to begin your adventure
          </div>
        </motion.div>

        {/* Enhanced Stats Panel */}
        <motion.div
          className="absolute top-8 right-8 text-white pointer-events-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: showWelcome ? 0 : 1, x: 0 }}
          transition={{ duration: 1, delay: showWelcome ? 0 : 2.5 }}
        >
          <div className="bg-black bg-opacity-30 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm opacity-80">Online</span>
            </div>

            <div className="text-3xl font-bold mb-1">{gamification.xp || 0}</div>
            <div className="text-sm opacity-80 mb-4">Experience Points</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">{gamification.streak || 0}</div>
                <div className="text-xs opacity-80">Day Streak</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {modules.filter((m) => m.progress > 50).length}
                </div>
                <div className="text-xs opacity-80">Completed</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="text-xs opacity-60">Next Achievement</div>
              <div className="text-sm">Complete 5 Modules</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white pointer-events-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showWelcome ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: showWelcome ? 0 : 3 }}
        >
          <div className="bg-black bg-opacity-30 rounded-lg px-6 py-3 backdrop-blur-sm text-center">
            <div className="text-sm opacity-80 mb-2">Use mouse to explore • Click to interact</div>
            <div className="flex justify-center space-x-6 text-xs opacity-60">
              <span>🖱️ Rotate View</span>
              <span>🔍 Zoom In/Out</span>
              <span>✨ Click Worlds</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-lg mx-4 shadow-2xl border border-gray-200"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Module Header */}
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{selectedModule.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{selectedModule.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedModule.difficulty}
                    </span>
                    <span className="text-gray-600 text-sm">⏱️ {selectedModule.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{selectedModule.description}</p>

              {/* Progress Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800">Your Progress</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedModule.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedModule.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {selectedModule.progress > 80
                    ? "Almost complete! 🎉"
                    : selectedModule.progress > 50
                      ? "Great progress! 👍"
                      : selectedModule.progress > 0
                        ? "Keep going! 💪"
                        : "Ready to start! ✨"}
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">What you'll experience:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Interactive 3D Environment</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>AI-Powered Assistance</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Adaptive Difficulty</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Real-time Feedback</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => enterModule(selectedModule)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🚀 Enter World
                </motion.button>
                <motion.button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;

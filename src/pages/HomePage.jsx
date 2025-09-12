import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Text3D,
  Sparkles,
  Stars,
  Cloud,
} from "@react-three/drei";

import HomePageUI from "../../components/ui/HomePage";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { PlatformEngine } from "../core/PlatformEngine";
import { SoundManager } from "../audio/SoundManager";
import { GameMechanics } from "../core/GameMechanics";

// 3D Hero Section Component
function Hero3D() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} className="absolute inset-0">
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="sunset" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

          {/* Floating Elements */}
          <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={1.5}
              height={0.2}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              position={[-4, 2, 0]}
            >
              Windgap Academy
              <meshStandardMaterial color="#5ED1D2" />
            </Text3D>
          </Float>

          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.8}
              height={0.1}
              position={[-3, 0, 0]}
            >
              Learn • Play • Grow
              <meshStandardMaterial color="#A32C2B" />
            </Text3D>
          </Float>

          {/* Sparkles Effect */}
          <Sparkles count={100} scale={10} size={6} speed={0.4} opacity={0.6} color="#FBBF24" />

          {/* Floating Clouds */}
          <Cloud
            opacity={0.3}
            speed={0.4}
            width={10}
            depth={1.5}
            segments={20}
            position={[5, 3, -5]}
          />
          <Cloud
            opacity={0.2}
            speed={0.2}
            width={8}
            depth={1}
            segments={15}
            position={[-5, -2, -8]}
          />

          {/* Interactive Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          className="text-center text-white pointer-events-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Welcome to the Future
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Professional Multi-Modal Learning Platform
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Learning
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Explore Features
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced HomePage Component
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [platformReady, setPlatformReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializePlatform();
  }, []);

  const initializePlatform = async () => {
    try {
      // Initialize platform systems
      const platformEngine = new PlatformEngine();
      const soundManager = new SoundManager();
      const gameMechanics = new GameMechanics();

      // Wait for all systems to initialize
      await Promise.all([
        platformEngine.initialize(),
        soundManager.initialize(),
        gameMechanics.initialize(),
      ]);

      setPlatformReady(true);
      setIsLoading(false);

      // Play welcome sound
      if (soundManager.isInitialized()) {
        soundManager.playSound("welcome", { volume: 0.3 });
      }
    } catch (error) {
      console.error("Failed to initialize platform:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing Windgap Academy..."
        progress={platformReady ? 100 : 50}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">🎓 Windgap Academy</h1>
          <p className="text-lg mb-4">Failed to initialize platform</p>
          <p className="text-sm opacity-80 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* 3D Hero Section */}
        <Hero3D />

        {/* Main Content */}
        <div className="relative z-20 bg-white">
          <HomePageUI />
        </div>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 2, type: "spring", stiffness: 200 }}
        >
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all duration-300 transform hover:scale-110">
            🎓
          </button>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

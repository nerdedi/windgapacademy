import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

// 3D Floating Elements
function FloatingCube({ position, color, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function FloatingSphere({ position, color, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

// 3D Text Component
function Title3D() {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <Text
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, 2, 0]}
        font="/fonts/Inter-Bold.woff"
      >
        WINDGAP ACADEMY
      </Text>
      <Text
        fontSize={0.8}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.5, 0]}
        font="/fonts/Inter-Regular.woff"
      >
        Immersive 3D Learning Platform
      </Text>
    </Float>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />

      {/* Environment */}
      <Environment preset="night" />

      {/* 3D Title */}
      <Title3D />

      {/* Floating Elements */}
      <FloatingCube position={[-4, 0, -2]} color="#3b82f6" speed={0.8} />
      <FloatingCube position={[4, 1, -1]} color="#8b5cf6" speed={1.2} />
      <FloatingSphere position={[-2, -1, 1]} color="#06d6a0" speed={0.6} />
      <FloatingSphere position={[3, -0.5, 2]} color="#f72585" speed={1.0} />
      <FloatingCube position={[0, -2, -3]} color="#ffd60a" speed={0.9} />

      {/* Ground */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Camera Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Home Component
function Home3D() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading 3D Experience...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <nav className="flex justify-between items-center">
            <div className="text-white font-bold text-xl">🎓 Windgap Academy</div>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/educator-dashboard")}
                className="text-white hover:text-blue-400 transition-colors"
              >
                For Educators
              </button>
              <button
                onClick={() => navigate("/learner-dashboard")}
                className="text-white hover:text-blue-400 transition-colors"
              >
                For Learners
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                IMMERSIVE
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold text-white">3D LEARNING</h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                Experience education like never before with sophisticated 3D simulations, realistic
                physics, and cinematic interactions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate("/game")}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10">🌟 Enter 3D Worlds</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => navigate("/educator-dashboard")}
                className="group relative px-12 py-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 hover:bg-white/20"
              >
                <span className="relative z-10">👨‍🏫 For Educators</span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🏙️</div>
                <h3 className="text-xl font-bold text-white mb-2">3D City Builder</h3>
                <p className="text-gray-300">
                  Build and manage cities with realistic physics and economics
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-white mb-2">Life Simulator</h3>
                <p className="text-gray-300">
                  Experience virtual life with animated characters and environments
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">🦁</div>
                <h3 className="text-xl font-bold text-white mb-2">Zoo Explorer</h3>
                <p className="text-gray-300">
                  Explore realistic animal habitats with cinematic experiences
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-gray-400">
            © 2024 Windgap Academy - Revolutionizing Education Through Immersive 3D Technology
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home3D;

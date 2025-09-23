import { Physics, useBox, useSphere } from "@react-three/cannon";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Text,
  Box,
  Sphere,
  Plane,
  useGLTF,
  Html,
  Sky,
  ContactShadows,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// 3D Character Component with animations
function Character({ position, activity, mood, name }) {
  const characterRef = useRef();
  const [isMoving, setIsMoving] = useState(false);

  // Character physics body
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: position,
    args: [0.5],
  }));

  // Character animations based on activity
  useFrame((state) => {
    if (characterRef.current) {
      const time = state.clock.elapsedTime;

      // Breathing animation
      characterRef.current.scale.y = 1 + Math.sin(time * 4) * 0.02;

      // Activity-based animations
      switch (activity) {
        case "walking":
          characterRef.current.rotation.z = Math.sin(time * 8) * 0.1;
          characterRef.current.position.x += Math.sin(time) * 0.01;
          break;
        case "dancing":
          characterRef.current.rotation.y = time * 2;
          characterRef.current.position.y = position[1] + Math.sin(time * 6) * 0.2;
          break;
        case "sleeping":
          characterRef.current.rotation.z = Math.PI / 6;
          break;
        case "cooking":
          characterRef.current.rotation.x = Math.sin(time * 3) * 0.1;
          break;
        default:
          characterRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      }
    }
  });

  const getMoodColor = (mood) => {
    const colors = {
      happy: "#22c55e",
      sad: "#3b82f6",
      excited: "#f59e0b",
      tired: "#6b7280",
      angry: "#ef4444",
    };
    return colors[mood] || "#6b7280";
  };

  return (
    <group position={position}>
      {/* Character Body */}
      <mesh ref={characterRef} castShadow>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color={getMoodColor(mood)} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Character Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.1, 1.3, 0.25]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.3, 0.25]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Name Tag */}
      <Html position={[0, 2, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
          {name} - {activity}
        </div>
      </Html>

      {/* Mood Indicator */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial
          color={getMoodColor(mood)}
          emissive={getMoodColor(mood)}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D Room Environment
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[-10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 10, 20]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[10, 5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 10, 20]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Furniture */}
      {/* Bed */}
      <mesh position={[-7, 1, -7]} castShadow>
        <boxGeometry args={[3, 1, 6]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Kitchen Counter */}
      <mesh position={[7, 1.5, -7]} castShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Sofa */}
      <mesh position={[0, 1, 5]} castShadow>
        <boxGeometry args={[4, 1.5, 2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Table */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
    </group>
  );
}

// Interactive Objects
function InteractiveObject({ position, type, onClick, isHighlighted }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    }
  });

  const getObjectGeometry = (type) => {
    switch (type) {
      case "fridge":
        return <boxGeometry args={[1, 3, 1]} />;
      case "tv":
        return <boxGeometry args={[3, 2, 0.2]} />;
      case "computer":
        return <boxGeometry args={[1, 0.8, 0.1]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getObjectColor = (type) => {
    const colors = {
      fridge: "#f3f4f6",
      tv: "#111827",
      computer: "#374151",
    };
    return colors[type] || "#6b7280";
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => e.stopPropagation()}
      castShadow
    >
      {getObjectGeometry(type)}
      <meshStandardMaterial
        color={getObjectColor(type)}
        emissive={isHighlighted ? "#3b82f6" : "#000000"}
        emissiveIntensity={isHighlighted ? 0.2 : 0}
      />
    </mesh>
  );
}

// Particle Effects for Activities
function ActivityParticles({ position, activity }) {
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getParticleColor = (activity) => {
    const colors = {
      cooking: "#f59e0b",
      cleaning: "#3b82f6",
      relaxing: "#22c55e",
      working: "#8b5cf6",
    };
    return colors[activity] || "#ffffff";
  };

  return (
    <group position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 2))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={getParticleColor(activity)} transparent opacity={0.8} />
      </points>
    </group>
  );
}

// Main 3D Life Simulation Component
function Immersive3DLifeSim() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([
    { id: 1, name: "Alex", position: [0, 1, 0], activity: "relaxing", mood: "happy" },
    { id: 2, name: "Sam", position: [5, 1, 3], activity: "cooking", mood: "excited" },
  ]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [highlightedObject, setHighlightedObject] = useState(null);
  const [cameraMode, setCameraMode] = useState("overview");

  const interactiveObjects = [
    { id: 1, type: "fridge", position: [8, 2, -7] },
    { id: 2, type: "tv", position: [0, 3, 6] },
    { id: 3, type: "computer", position: [-8, 2, 0] },
  ];

  const handleObjectClick = (objectId) => {
    setHighlightedObject(objectId);
    // Trigger character interaction
    if (selectedCharacter) {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === selectedCharacter ? { ...char, activity: "walking" } : char,
        ),
      );
    }
  };

  const getCameraPosition = (mode) => {
    switch (mode) {
      case "overview":
        return [15, 15, 15];
      case "character":
        return [5, 8, 8];
      case "room":
        return [0, 12, 12];
      default:
        return [15, 15, 15];
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 to-black relative">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: getCameraPosition(cameraMode), fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.82, 0]}>
            {/* Environment */}
            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[0, 8, 0]} intensity={0.8} color="#fbbf24" />
            <pointLight position={[-8, 5, -8]} intensity={0.5} color="#3b82f6" />

            {/* Room Environment */}
            <Room />

            {/* Characters */}
            {characters.map((character) => (
              <Character
                key={character.id}
                position={character.position}
                activity={character.activity}
                mood={character.mood}
                name={character.name}
              />
            ))}

            {/* Interactive Objects */}
            {interactiveObjects.map((obj) => (
              <InteractiveObject
                key={obj.id}
                position={obj.position}
                type={obj.type}
                isHighlighted={highlightedObject === obj.id}
                onClick={() => handleObjectClick(obj.id)}
              />
            ))}

            {/* Activity Particles */}
            {characters.map((character) => (
              <ActivityParticles
                key={`particles-${character.id}`}
                position={[character.position[0], character.position[1] + 2, character.position[2]]}
                activity={character.activity}
              />
            ))}

            {/* Contact Shadows */}
            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={1} far={10} />

            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={30}
              maxPolarAngle={Math.PI / 2}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🏠 IMMERSIVE 3D LIFE SIMULATOR
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Characters</h3>
              <div className="space-y-2">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacter(char.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCharacter === char.id
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    <div className="font-semibold">{char.name}</div>
                    <div className="text-sm opacity-80">
                      {char.activity} • {char.mood}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Camera Views</h3>
              <div className="grid grid-cols-2 gap-2">
                {["overview", "character", "room"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCameraMode(mode)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      cameraMode === mode
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white text-sm">
          <p>
            <strong>Controls:</strong>
          </p>
          <p>• Click objects to interact</p>
          <p>• Select characters to control</p>
          <p>• Drag to rotate camera</p>
          <p>• Scroll to zoom</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => navigate("/games")}
          className="bg-black/80 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  );
}

export default Immersive3DLifeSim;

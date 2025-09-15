import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Text,
  Box,
  Plane,
  useTexture,
  Sky,
  Cloud,
  Stars,
} from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

// 3D Building Component with realistic models
function Building({ position, type, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Physics body for collision detection
  const [ref, api] = useBox(() => ({
    mass: 0,
    position: position,
    args: [2, getBuildingHeight(type), 2],
  }));

  // Animate building on hover and selection
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = hovered ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
      meshRef.current.scale.setScalar(isSelected ? 1.1 : hovered ? 1.05 : 1);
    }
  });

  function getBuildingHeight(type) {
    const heights = {
      residential: 3,
      commercial: 5,
      industrial: 4,
      office: 8,
      skyscraper: 15,
    };
    return heights[type] || 3;
  }

  function getBuildingColor(type) {
    const colors = {
      residential: "#4ade80",
      commercial: "#3b82f6",
      industrial: "#f59e0b",
      office: "#8b5cf6",
      skyscraper: "#ef4444",
    };
    return colors[type] || "#6b7280";
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, getBuildingHeight(type), 2]} />
      <meshStandardMaterial
        color={getBuildingColor(type)}
        metalness={0.3}
        roughness={0.4}
        emissive={hovered ? getBuildingColor(type) : "#000000"}
        emissiveIntensity={hovered ? 0.2 : 0}
      />

      {/* Building details */}
      <mesh position={[0, getBuildingHeight(type) / 2 + 0.1, 0]}>
        <Text fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          {type.toUpperCase()}
        </Text>
      </mesh>
    </mesh>
  );
}

// 3D Ground/Terrain Component
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    args: [100, 100],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#22c55e" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

// Animated Traffic System
function Traffic() {
  const carRef = useRef();

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.position.x = Math.sin(state.clock.elapsedTime) * 10;
      carRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 8;
      carRef.current.rotation.y = Math.atan2(
        Math.cos(state.clock.elapsedTime) * 10,
        -Math.sin(state.clock.elapsedTime * 0.5) * 8,
      );
    }
  });

  return (
    <mesh ref={carRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#dc2626" />
    </mesh>
  );
}

// Particle System for Environmental Effects
function ParticleSystem() {
  const particlesRef = useRef();
  const particleCount = 1000;

  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = -Math.random() * 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 20;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

// Dynamic Lighting System
function DynamicLighting() {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 20;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 20;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={lightRef}
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#fbbf24" />
    </>
  );
}

// Main 3D City Builder Component
function Immersive3DCityBuilder() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([
    { id: 1, position: [0, 1.5, 0], type: "residential" },
    { id: 2, position: [5, 2.5, 0], type: "commercial" },
    { id: 3, position: [-5, 2, 0], type: "industrial" },
  ]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildMode, setBuildMode] = useState("residential");
  const [cameraPosition, setCameraPosition] = useState([15, 15, 15]);

  const handleGroundClick = (event) => {
    if (event.point) {
      const newBuilding = {
        id: Date.now(),
        position: [
          Math.round(event.point.x / 2) * 2,
          getBuildingHeight(buildMode) / 2,
          Math.round(event.point.z / 2) * 2,
        ],
        type: buildMode,
      };
      setBuildings((prev) => [...prev, newBuilding]);
    }
  };

  const getBuildingHeight = (type) => {
    const heights = {
      residential: 3,
      commercial: 5,
      industrial: 4,
      office: 8,
      skyscraper: 15,
    };
    return heights[type] || 3;
  };

  return (
    <div className="w-full h-screen bg-black relative">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.82, 0]}>
            {/* Environment and Atmosphere */}
            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

            {/* Lighting */}
            <DynamicLighting />

            {/* Ground */}
            <Ground />
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.01, 0]}
              onClick={handleGroundClick}
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial transparent opacity={0} />
            </mesh>

            {/* Buildings */}
            {buildings.map((building) => (
              <Building
                key={building.id}
                position={building.position}
                type={building.type}
                isSelected={selectedBuilding === building.id}
                onClick={() => setSelectedBuilding(building.id)}
              />
            ))}

            {/* Animated Elements */}
            <Traffic />
            <ParticleSystem />

            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              maxPolarAngle={Math.PI / 2}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🏙️ IMMERSIVE 3D CITY BUILDER
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Building Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {["residential", "commercial", "industrial", "office", "skyscraper"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBuildMode(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      buildMode === type
                        ? "bg-blue-600 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Camera Presets</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCameraPosition([15, 15, 15])}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  Overview
                </button>
                <button
                  onClick={() => setCameraPosition([5, 5, 5])}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  Close-up
                </button>
                <button
                  onClick={() => setCameraPosition([0, 30, 0])}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  Top-down
                </button>
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
          <p>• Click ground to place buildings</p>
          <p>• Drag to rotate camera</p>
          <p>• Scroll to zoom</p>
          <p>• Right-click drag to pan</p>
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

export default Immersive3DCityBuilder;

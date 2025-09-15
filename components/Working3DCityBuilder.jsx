import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Environment, Sky } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

// Simple 3D Building Component
function Building({ position, type, onClick, isSelected }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const getBuildingHeight = (type) => {
    const heights = { residential: 2, commercial: 3, industrial: 2.5, office: 4 };
    return heights[type] || 2;
  };

  const getBuildingColor = (type) => {
    const colors = {
      residential: "#22c55e",
      commercial: "#3b82f6",
      industrial: "#f59e0b",
      office: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
  };

  return (
    <mesh
      ref={meshRef}
      position={[position[0], getBuildingHeight(type) / 2, position[2]]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1.8, getBuildingHeight(type), 1.8]} />
      <meshStandardMaterial color={getBuildingColor(type)} metalness={0.3} roughness={0.7} />

      {/* Building Label */}
      <Text
        position={[0, getBuildingHeight(type) / 2 + 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {type.toUpperCase()}
      </Text>
    </mesh>
  );
}

// Ground Grid Component
function Ground({ onGroundClick }) {
  return (
    <group>
      {/* Main Ground */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={onGroundClick}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Grid Lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <group key={i}>
          <mesh position={[i - 10, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 20]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0, 0.01, i - 10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 0.05]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Main 3D City Builder Component
function Working3DCityBuilder() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([
    { id: 1, position: [2, 0, 2], type: "residential" },
    { id: 2, position: [-2, 0, -2], type: "commercial" },
    { id: 3, position: [0, 0, 4], type: "office" },
  ]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildMode, setBuildMode] = useState("residential");
  const [cityStats, setCityStats] = useState({
    population: 1250,
    happiness: 85,
    budget: 50000,
  });

  const handleGroundClick = (event) => {
    if (event.point) {
      const x = Math.round(event.point.x);
      const z = Math.round(event.point.z);

      // Check if position is already occupied
      const occupied = buildings.some(
        (b) => Math.round(b.position[0]) === x && Math.round(b.position[2]) === z,
      );

      if (!occupied && Math.abs(x) <= 9 && Math.abs(z) <= 9) {
        const newBuilding = {
          id: Date.now(),
          position: [x, 0, z],
          type: buildMode,
        };
        setBuildings((prev) => [...prev, newBuilding]);

        // Update city stats
        setCityStats((prev) => ({
          population: prev.population + 50,
          happiness: Math.min(100, prev.happiness + 2),
          budget: prev.budget - 5000,
        }));
      }
    }
  };

  const removeBuilding = (buildingId) => {
    setBuildings((prev) => prev.filter((b) => b.id !== buildingId));
    setSelectedBuilding(null);
    setCityStats((prev) => ({
      population: Math.max(0, prev.population - 50),
      happiness: Math.max(0, prev.happiness - 1),
      budget: prev.budget + 3000,
    }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-green-800 relative">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [12, 8, 12], fov: 60 }} shadows gl={{ antialias: true }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />

          {/* Ground */}
          <Ground onGroundClick={handleGroundClick} />

          {/* Buildings */}
          {buildings.map((building) => (
            <Building
              key={building.id}
              position={building.position}
              type={building.type}
              isSelected={selectedBuilding === building.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBuilding(building.id);
              }}
            />
          ))}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white min-w-[300px]">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            🏙️ 3D CITY BUILDER
          </h1>

          {/* City Stats */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between">
              <span>👥 Population:</span>
              <span className="font-bold text-blue-400">
                {cityStats.population.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>😊 Happiness:</span>
              <span className="font-bold text-green-400">{cityStats.happiness}%</span>
            </div>
            <div className="flex justify-between">
              <span>💰 Budget:</span>
              <span className="font-bold text-yellow-400">
                ${cityStats.budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Building Tools */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Build Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                {["residential", "commercial", "industrial", "office"].map((type) => (
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

            {selectedBuilding && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Selected Building</h3>
                <button
                  onClick={() => removeBuilding(selectedBuilding)}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all"
                >
                  🗑️ Remove Building
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white text-sm max-w-[300px]">
          <p>
            <strong>How to Play:</strong>
          </p>
          <p>• Click empty grid spaces to build</p>
          <p>• Click buildings to select them</p>
          <p>• Use mouse to rotate and zoom camera</p>
          <p>• Watch your city stats grow!</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => navigate("/game")}
          className="bg-black/80 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  );
}

export default Working3DCityBuilder;

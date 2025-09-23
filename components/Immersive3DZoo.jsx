import { Physics, useBox, useSphere } from "@react-three/cannon";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Text,
  Box,
  Sphere,
  Plane,
  Html,
  Sky,
  ContactShadows,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

// 3D Animal Component with realistic animations
function Animal({ position, type, isActive, onClick }) {
  const animalRef = useRef();
  const [isMoving, setIsMoving] = useState(false);
  const [targetPosition, setTargetPosition] = useState(position);

  // Animal physics body
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: position,
    args: getAnimalSize(type),
  }));

  // Realistic animal animations
  useFrame((state) => {
    if (animalRef.current) {
      const time = state.clock.elapsedTime;

      // Breathing animation
      animalRef.current.scale.y = 1 + Math.sin(time * 3) * 0.05;

      // Animal-specific animations
      switch (type) {
        case "lion":
          // Prowling animation
          animalRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
          animalRef.current.position.x = position[0] + Math.sin(time * 0.3) * 2;
          break;
        case "elephant":
          // Swaying animation
          animalRef.current.rotation.z = Math.sin(time * 2) * 0.1;
          break;
        case "giraffe":
          // Neck movement
          animalRef.current.rotation.x = Math.sin(time * 1.5) * 0.2;
          break;
        case "penguin":
          // Waddling
          animalRef.current.rotation.z = Math.sin(time * 4) * 0.2;
          animalRef.current.position.z = position[2] + Math.sin(time * 2) * 1;
          break;
        case "monkey":
          // Jumping
          animalRef.current.position.y = position[1] + Math.abs(Math.sin(time * 3)) * 1;
          animalRef.current.rotation.y = time * 2;
          break;
        default:
          animalRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
      }

      // Highlight when active
      if (isActive) {
        animalRef.current.scale.setScalar(1.2 + Math.sin(time * 6) * 0.1);
      }
    }
  });

  function getAnimalSize(type) {
    const sizes = {
      lion: [2, 1.5, 3],
      elephant: [3, 3, 4],
      giraffe: [2, 4, 2],
      penguin: [0.8, 1.2, 0.8],
      monkey: [1, 1.5, 1],
    };
    return sizes[type] || [1, 1, 1];
  }

  function getAnimalColor(type) {
    const colors = {
      lion: "#d97706",
      elephant: "#6b7280",
      giraffe: "#fbbf24",
      penguin: "#1f2937",
      monkey: "#92400e",
    };
    return colors[type] || "#6b7280";
  }

  function getAnimalShape(type) {
    switch (type) {
      case "giraffe":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.5, 1, 2]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
            <mesh position={[0, 2.5, 0.5]}>
              <cylinderGeometry args={[0.3, 0.3, 3]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
            <mesh position={[0, 4, 0.5]}>
              <sphereGeometry args={[0.5]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
          </group>
        );
      case "elephant":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.5, 2, 3]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
            <mesh position={[0, 1.5, 1.8]}>
              <sphereGeometry args={[0.8]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
            <mesh position={[0, 1, 2.5]}>
              <cylinderGeometry args={[0.2, 0.3, 1.5]} />
              <meshStandardMaterial color={getAnimalColor(type)} />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={getAnimalSize(type)} />
            <meshStandardMaterial color={getAnimalColor(type)} />
          </mesh>
        );
    }
  }

  return (
    <group position={position} onClick={onClick} onPointerOver={(e) => e.stopPropagation()}>
      <group ref={animalRef} castShadow>
        {getAnimalShape(type)}
      </group>

      {/* Animal Info */}
      <Html position={[0, 3, 0]} center>
        <div
          className={`bg-black/80 text-white px-3 py-1 rounded-lg text-sm transition-all ${
            isActive ? "scale-110 bg-blue-600/80" : ""
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      </Html>

      {/* Activity indicator */}
      {isActive && (
        <mesh position={[0, 4, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// 3D Habitat Environment
function Habitat({ type }) {
  const getHabitatElements = (type) => {
    switch (type) {
      case "savanna":
        return (
          <group>
            {/* Savanna ground */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>

            {/* Acacia trees */}
            {Array.from({ length: 5 }, (_, i) => (
              <group key={i} position={[(Math.random() - 0.5) * 25, 0, (Math.random() - 0.5) * 25]}>
                <mesh position={[0, 2, 0]} castShadow>
                  <cylinderGeometry args={[0.3, 0.3, 4]} />
                  <meshStandardMaterial color="#92400e" />
                </mesh>
                <mesh position={[0, 5, 0]} castShadow>
                  <sphereGeometry args={[2]} />
                  <meshStandardMaterial color="#22c55e" />
                </mesh>
              </group>
            ))}

            {/* Rocks */}
            {Array.from({ length: 8 }, (_, i) => (
              <mesh
                key={i}
                position={[(Math.random() - 0.5) * 20, 0.5, (Math.random() - 0.5) * 20]}
                castShadow
              >
                <boxGeometry
                  args={[Math.random() * 2 + 0.5, Math.random() * 1 + 0.5, Math.random() * 2 + 0.5]}
                />
                <meshStandardMaterial color="#78716c" />
              </mesh>
            ))}
          </group>
        );

      case "arctic":
        return (
          <group>
            {/* Ice ground */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#e0f2fe" />
            </mesh>

            {/* Ice blocks */}
            {Array.from({ length: 10 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  (Math.random() - 0.5) * 25,
                  Math.random() * 2,
                  (Math.random() - 0.5) * 25,
                ]}
                castShadow
              >
                <boxGeometry
                  args={[Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * 3 + 1]}
                />
                <meshStandardMaterial
                  color="#bfdbfe"
                  transparent
                  opacity={0.8}
                  roughness={0.1}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        );

      case "rainforest":
        return (
          <group>
            {/* Forest ground */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#166534" />
            </mesh>

            {/* Trees */}
            {Array.from({ length: 15 }, (_, i) => (
              <group key={i} position={[(Math.random() - 0.5) * 25, 0, (Math.random() - 0.5) * 25]}>
                <mesh position={[0, 3, 0]} castShadow>
                  <cylinderGeometry args={[0.4, 0.4, 6]} />
                  <meshStandardMaterial color="#92400e" />
                </mesh>
                <mesh position={[0, 7, 0]} castShadow>
                  <sphereGeometry args={[2.5]} />
                  <meshStandardMaterial color="#15803d" />
                </mesh>
              </group>
            ))}

            {/* Vines */}
            {Array.from({ length: 8 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  (Math.random() - 0.5) * 20,
                  Math.random() * 8 + 2,
                  (Math.random() - 0.5) * 20,
                ]}
                castShadow
              >
                <cylinderGeometry args={[0.1, 0.1, Math.random() * 6 + 2]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            ))}
          </group>
        );

      default:
        return (
          <mesh position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        );
    }
  };

  return <group rotation={[-Math.PI / 2, 0, 0]}>{getHabitatElements(type)}</group>;
}

// Atmospheric Effects
function AtmosphericEffects({ habitat }) {
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.01; // Fall down

        if (positions[i + 1] < 0) {
          positions[i + 1] = 20; // Reset to top
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const getParticleEffect = (habitat) => {
    switch (habitat) {
      case "arctic":
        return { color: "#ffffff", count: 1000, size: 0.1 }; // Snow
      case "rainforest":
        return { color: "#3b82f6", count: 500, size: 0.05 }; // Rain
      default:
        return { color: "#fbbf24", count: 200, size: 0.02 }; // Dust
    }
  };

  const effect = getParticleEffect(habitat);
  const positions = new Float32Array(effect.count * 3);

  for (let i = 0; i < effect.count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={effect.count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={effect.size} color={effect.color} transparent opacity={0.6} />
    </points>
  );
}

// Main 3D Zoo Component
function Immersive3DZoo() {
  const navigate = useNavigate();
  const [currentHabitat, setCurrentHabitat] = useState("savanna");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [cameraMode, setCameraMode] = useState("overview");

  const habitats = {
    savanna: {
      animals: [
        { id: 1, type: "lion", position: [5, 1, 5] },
        { id: 2, type: "elephant", position: [-8, 2, -3] },
        { id: 3, type: "giraffe", position: [0, 2, -8] },
      ],
    },
    arctic: {
      animals: [
        { id: 4, type: "penguin", position: [3, 1, 2] },
        { id: 5, type: "penguin", position: [-2, 1, 4] },
        { id: 6, type: "penguin", position: [6, 1, -3] },
      ],
    },
    rainforest: {
      animals: [
        { id: 7, type: "monkey", position: [4, 1, 6] },
        { id: 8, type: "monkey", position: [-5, 1, -2] },
      ],
    },
  };

  const currentAnimals = habitats[currentHabitat]?.animals || [];

  const getCameraPosition = (mode) => {
    switch (mode) {
      case "overview":
        return [20, 20, 20];
      case "ground":
        return [5, 3, 8];
      case "aerial":
        return [0, 30, 0];
      default:
        return [20, 20, 20];
    }
  };

  const getHabitatLighting = (habitat) => {
    switch (habitat) {
      case "arctic":
        return { color: "#bfdbfe", intensity: 0.8 };
      case "rainforest":
        return { color: "#22c55e", intensity: 0.6 };
      default:
        return { color: "#fbbf24", intensity: 1.0 };
    }
  };

  const lighting = getHabitatLighting(currentHabitat);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-green-900 relative">
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

            {/* Dynamic Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[20, 20, 10]}
              intensity={lighting.intensity}
              color={lighting.color}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            {/* Habitat Environment */}
            <Habitat type={currentHabitat} />

            {/* Animals */}
            {currentAnimals.map((animal) => (
              <Animal
                key={animal.id}
                position={animal.position}
                type={animal.type}
                isActive={selectedAnimal === animal.id}
                onClick={() => setSelectedAnimal(animal.id)}
              />
            ))}

            {/* Atmospheric Effects */}
            <AtmosphericEffects habitat={currentHabitat} />

            {/* Contact Shadows */}
            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={30} blur={1} far={10} />

            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={8}
              maxDistance={50}
              maxPolarAngle={Math.PI / 2}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🦁 IMMERSIVE 3D ZOO EXPLORER
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Habitats</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(habitats).map((habitat) => (
                  <button
                    key={habitat}
                    onClick={() => {
                      setCurrentHabitat(habitat);
                      setSelectedAnimal(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      currentHabitat === habitat
                        ? "bg-green-600 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {habitat.charAt(0).toUpperCase() + habitat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Camera Views</h3>
              <div className="grid grid-cols-2 gap-2">
                {["overview", "ground", "aerial"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCameraMode(mode)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      cameraMode === mode
                        ? "bg-blue-600 text-white"
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

      {/* Animal Info Panel */}
      {selectedAnimal && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <h3 className="text-lg font-bold mb-2">
              {currentAnimals
                .find((a) => a.id === selectedAnimal)
                ?.type.charAt(0)
                .toUpperCase() + currentAnimals.find((a) => a.id === selectedAnimal)?.type.slice(1)}
            </h3>
            <p className="text-sm">
              Click and observe this magnificent creature in its natural habitat!
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white text-sm">
          <p>
            <strong>Controls:</strong>
          </p>
          <p>• Click animals to observe</p>
          <p>• Switch habitats to explore</p>
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

export default Immersive3DZoo;

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Html,
  Text3D,
  Stars,
  Sphere,
  MeshDistortMaterial,
  useTexture,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Physics, useBox, useSphere } from "@react-three/cannon";
import * as THREE from "three";
import { ExperimentEngine } from "./ExperimentEngine";
import { MoleculeSystem } from "./MoleculeSystem";
import { SoundManager } from "../../audio/SoundManager";
import { AIEngine } from "../../ai/AIEngine";
import { ParticleSystem } from "../../effects/ParticleSystem";

// Enhanced Laboratory Environment
function LaboratoryEnvironment({ currentExperiment }) {
  const { scene } = useThree();
  const equipmentRef = useRef();

  useFrame((state) => {
    if (equipmentRef.current) {
      equipmentRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const getLabTheme = () => {
    if (!currentExperiment) return "general";
    if (currentExperiment.type === "chemistry") return "chemical";
    if (currentExperiment.type === "physics") return "mechanical";
    if (currentExperiment.type === "biology") return "organic";
    return "general";
  };

  const theme = getLabTheme();

  return (
    <>
      {/* Laboratory Atmosphere */}
      <Stars
        radius={50}
        depth={30}
        count={theme === "chemical" ? 2000 : 1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Laboratory Equipment */}
      <group ref={equipmentRef}>
        {/* Microscope */}
        <group position={[-8, 2, -5]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.5, 2]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.5]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        </group>

        {/* Beakers and Flasks */}
        <group position={[6, 1, -3]}>
          <mesh>
            <cylinderGeometry args={[0.8, 1, 2]} />
            <meshPhysicalMaterial
              color="#88ccff"
              transparent
              opacity={0.3}
              transmission={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[2, 0, 0]}>
            <sphereGeometry args={[0.6]} />
            <meshPhysicalMaterial
              color="#ffcc88"
              transparent
              opacity={0.4}
              transmission={0.8}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Periodic Table Display */}
        <group position={[0, 4, -8]}>
          <mesh>
            <planeGeometry args={[6, 4]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <Html position={[0, 0, 0.1]} center>
            <div className="bg-blue-900 text-white p-4 rounded-lg text-center">
              <h3 className="text-lg font-bold mb-2">Periodic Table</h3>
              <div className="grid grid-cols-6 gap-1 text-xs">
                {["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg"].map(
                  (element) => (
                    <div key={element} className="bg-blue-700 p-1 rounded">
                      {element}
                    </div>
                  ),
                )}
              </div>
            </div>
          </Html>
        </group>
      </group>

      {/* Ambient Lab Particles */}
      {theme === "chemical" && (
        <Float speed={0.3} rotationIntensity={0.1}>
          {[...Array(15)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * 0.8) * 12,
                Math.cos(i * 0.5) * 6 + 3,
                Math.sin(i * 1.2) * 8 - 5,
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="#00ff88" />
            </mesh>
          ))}
        </Float>
      )}
    </>
  );
}

// Enhanced Molecule with sophisticated physics
function Molecule({ position, element, onClick, isSelected }) {
  const [ref, api] = useSphere(() => ({
    mass: element.mass,
    position,
    material: { friction: 0.1, restitution: 0.7 },
  }));

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (isSelected) {
      api.velocity.set(0, Math.sin(Date.now() * 0.005) * 2, 0);
    }
  });

  return (
    <mesh
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onClick(element)}
    >
      <sphereGeometry args={[element.radius]} />
      <meshStandardMaterial
        color={isSelected ? "#fbbf24" : element.color}
        emissive={hovered ? "#333" : "#000"}
        transparent
        opacity={0.9}
      />

      <Html position={[0, element.radius + 0.5, 0]} center>
        <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {element.symbol}
        </div>
      </Html>
    </mesh>
  );
}

function LabEquipment({ type, position, onUse }) {
  const [ref] = useBox(() => ({
    mass: 0,
    position,
    type: "Static",
  }));

  const equipment = {
    beaker: { size: [1, 2, 1], color: "#60a5fa" },
    microscope: { size: [1.5, 2.5, 1], color: "#374151" },
    bunsen: { size: [0.8, 1.5, 0.8], color: "#dc2626" },
    scale: { size: [2, 0.5, 1.5], color: "#6b7280" },
  };

  const config = equipment[type];

  return (
    <Float speed={0.5} rotationIntensity={0.1}>
      <mesh ref={ref} onClick={() => onUse(type)} position={position}>
        <boxGeometry args={config.size} />
        <meshStandardMaterial color={config.color} />

        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.02}
          position={[-0.5, config.size[1] + 0.5, 0]}
        >
          {type.toUpperCase()}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </mesh>
    </Float>
  );
}

function ChemicalReaction({ molecules, position }) {
  const particleCount = 50;
  const particles = useRef([]);

  useFrame((state) => {
    particles.current.forEach((particle, i) => {
      if (particle) {
        particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.01;
        particle.position.y += Math.cos(state.clock.elapsedTime + i) * 0.01;
        particle.position.z += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01;
      }
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (particles.current[i] = el)}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} emissive="#444" />
        </mesh>
      ))}
    </group>
  );
}

function ScienceLabGame() {
  const [selectedMolecules, setSelectedMolecules] = useState([]);
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [experimentResults, setExperimentResults] = useState(null);
  const [labMode, setLabMode] = useState("exploration"); // exploration, experiment, analysis
  const [score, setScore] = useState(0);
  const [discoveries, setDiscoveries] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [experimentProgress, setExperimentProgress] = useState(0);
  const [temperature, setTemperature] = useState(298); // Kelvin
  const [pressure, setPressure] = useState(1); // atm
  const [reactionRate, setReactionRate] = useState(0);
  const [molecularAnimation, setMolecularAnimation] = useState(true);

  const experimentEngine = useRef(new ExperimentEngine());
  const moleculeSystem = useRef(new MoleculeSystem());
  const soundManager = useRef(new SoundManager());
  const aiEngine = useRef(new AIEngine());
  const particleSystem = useRef(new ParticleSystem());

  const elements = [
    {
      symbol: "H",
      name: "Hydrogen",
      color: "#ffffff",
      radius: 0.3,
      mass: 1,
      atomicNumber: 1,
      electronConfig: "1s¹",
      properties: ["flammable", "lightest"],
      bondingCapacity: 1,
    },
    {
      symbol: "O",
      name: "Oxygen",
      color: "#ff0000",
      radius: 0.4,
      mass: 16,
      atomicNumber: 8,
      electronConfig: "1s² 2s² 2p⁴",
      properties: ["oxidizer", "essential for life"],
      bondingCapacity: 2,
    },
    {
      symbol: "C",
      name: "Carbon",
      color: "#000000",
      radius: 0.35,
      mass: 12,
      atomicNumber: 6,
      electronConfig: "1s² 2s² 2p²",
      properties: ["organic", "versatile bonding"],
      bondingCapacity: 4,
    },
    {
      symbol: "N",
      name: "Nitrogen",
      color: "#0000ff",
      radius: 0.35,
      mass: 14,
      atomicNumber: 7,
      electronConfig: "1s² 2s² 2p³",
      properties: ["inert gas", "triple bonds"],
      bondingCapacity: 3,
    },
    {
      symbol: "Na",
      name: "Sodium",
      color: "#ffa500",
      radius: 0.5,
      mass: 23,
      atomicNumber: 11,
      electronConfig: "1s² 2s² 2p⁶ 3s¹",
      properties: ["alkali metal", "reactive"],
      bondingCapacity: 1,
    },
    {
      symbol: "Cl",
      name: "Chlorine",
      color: "#00ff00",
      radius: 0.45,
      mass: 35,
      atomicNumber: 17,
      electronConfig: "1s² 2s² 2p⁶ 3s² 3p⁵",
      properties: ["halogen", "toxic gas"],
      bondingCapacity: 1,
    },
  ];

  const experiments = [
    {
      id: 1,
      name: "Water Formation",
      description: "Combine hydrogen and oxygen to form water molecules",
      reactants: ["H", "H", "O"],
      products: ["H2O"],
      type: "chemistry",
      difficulty: "beginner",
      energyChange: -286, // kJ/mol
      conditions: { temperature: 298, pressure: 1 },
    },
    {
      id: 2,
      name: "Salt Formation",
      description: "Ionic bonding between sodium and chlorine",
      reactants: ["Na", "Cl"],
      products: ["NaCl"],
      type: "chemistry",
      difficulty: "intermediate",
      energyChange: -411,
      conditions: { temperature: 1074, pressure: 1 },
    },
    {
      id: 3,
      name: "Combustion Analysis",
      description: "Study the complete combustion of methane",
      reactants: ["C", "H", "H", "H", "H", "O", "O", "O", "O"],
      products: ["CO2", "H2O"],
      type: "chemistry",
      difficulty: "advanced",
      energyChange: -890,
      conditions: { temperature: 1200, pressure: 1 },
    },
  ];

  const labEquipment = [
    { type: "beaker", position: [-6, 1, 2] },
    { type: "microscope", position: [6, 1.25, 2] },
    { type: "bunsen", position: [-6, 0.75, -2] },
    { type: "scale", position: [6, 0.25, -2] },
  ];

  useEffect(() => {
    soundManager.current.createAmbientSoundscape(["lab-ambient", "equipment-hum"]);

    // Initialize AI engine for scientific guidance
    aiEngine.current.initialize().then(() => {
      console.log("AI Engine initialized for ScienceLab");
    });
  }, []);

  const startExperiment = (experiment) => {
    setCurrentExperiment(experiment);
    setLabMode("experiment");
    setExperimentProgress(0);
    setTemperature(experiment.conditions.temperature);
    setPressure(experiment.conditions.pressure);

    // Create experiment start particles
    particleSystem.current.createBurst([0, 3, 0], "science");

    // Play experiment start sound
    soundManager.current.play("experiment-start");
  };

  const simulateReaction = () => {
    if (!currentExperiment) return;

    setExperimentProgress((prev) => {
      const newProgress = Math.min(100, prev + 10);

      // Calculate reaction rate based on temperature and pressure
      const rateConstant = Math.exp(-50000 / (8.314 * temperature)); // Arrhenius equation
      const rate = rateConstant * pressure;
      setReactionRate(rate);

      if (newProgress >= 100) {
        completeExperiment();
      }

      return newProgress;
    });

    // Create reaction particles
    particleSystem.current.createBurst([0, 2, 0], "reaction");
  };

  const completeExperiment = () => {
    const results = {
      success: true,
      products: currentExperiment.products,
      energyChange: currentExperiment.energyChange,
      yield: Math.random() * 30 + 70, // 70-100% yield
      observations: generateObservations(),
    };

    setExperimentResults(results);
    setScore((prev) => prev + 100);

    // Check for discoveries
    checkForDiscoveries(results);

    // Create success particles
    particleSystem.current.createBurst([0, 4, 0], "success");

    // Play completion sound
    soundManager.current.play("experiment-complete");

    setTimeout(() => {
      setLabMode("analysis");
    }, 2000);
  };

  const generateObservations = () => {
    const observations = [];

    if (currentExperiment.energyChange < 0) {
      observations.push("Exothermic reaction observed - heat released");
    } else {
      observations.push("Endothermic reaction observed - heat absorbed");
    }

    if (temperature > 500) {
      observations.push("High temperature caused rapid reaction");
    }

    if (pressure > 2) {
      observations.push("Increased pressure enhanced reaction rate");
    }

    observations.push(`Reaction rate: ${reactionRate.toExponential(2)} mol/L·s`);

    return observations;
  };

  const checkForDiscoveries = (results) => {
    const newDiscoveries = [];

    if (results.yield > 95) {
      newDiscoveries.push({
        id: "perfect-yield",
        name: "Perfect Synthesis",
        description: "Achieved >95% yield in reaction",
      });
    }

    if (temperature > 1000) {
      newDiscoveries.push({
        id: "high-temp",
        name: "High Temperature Mastery",
        description: "Successfully conducted high-temperature reaction",
      });
    }

    if (newDiscoveries.length > 0) {
      setDiscoveries((prev) => [...prev, ...newDiscoveries]);
      setAchievements((prev) => [...prev, ...newDiscoveries]);
      soundManager.current.play("discovery");
    }
  };

  const handleMoleculeClick = async (element) => {
    await soundManager.current.play("molecule-select", { volume: 0.6 });

    setSelectedMolecules((prev) => {
      const newSelection = [...prev, element];

      // Check for possible reactions
      const reaction = experimentEngine.current.checkReaction(newSelection);
      if (reaction) {
        setCurrentExperiment(reaction);
        setLabMode("experiment");
      }

      return newSelection;
    });
  };

  const handleEquipmentUse = async (equipmentType) => {
    await soundManager.current.play("equipment-use", { volume: 0.7 });

    if (selectedMolecules.length > 0) {
      const experiment = experimentEngine.current.createExperiment(
        selectedMolecules,
        equipmentType,
      );

      setCurrentExperiment(experiment);
      setLabMode("experiment");
    }
  };

  const runExperiment = async () => {
    if (!currentExperiment) return;

    await soundManager.current.play("experiment-start", { volume: 0.8 });

    const results = await experimentEngine.current.runExperiment(currentExperiment);
    setExperimentResults(results);
    setLabMode("analysis");

    if (results.success) {
      setScore((prev) => prev + results.points);
      setDiscoveries((prev) => [...prev, results.discovery]);
      await soundManager.current.play("discovery", { volume: 0.9 });
    }
  };

  const resetLab = () => {
    setSelectedMolecules([]);
    setCurrentExperiment(null);
    setExperimentResults(null);
    setLabMode("exploration");
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 relative">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="warehouse" />

        {/* Laboratory Environment */}
        <LaboratoryEnvironment currentExperiment={currentExperiment} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 8, -5]} intensity={0.8} color="#00aaff" />
        <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={2} castShadow />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} />

        <Physics gravity={[0, -9.81, 0]}>
          {/* Lab Floor */}
          <mesh position={[0, -1, 0]} receiveShadow>
            <boxGeometry args={[20, 0.1, 20]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>

          {/* Molecules */}
          {elements.map((element, index) => (
            <Molecule
              key={`${element.symbol}-${index}`}
              position={[(index - 2.5) * 2, 5 + Math.random() * 2, -5 + Math.random() * 2]}
              element={element}
              onClick={handleMoleculeClick}
              isSelected={selectedMolecules.includes(element)}
            />
          ))}

          {/* Lab Equipment */}
          {labEquipment.map((equipment, index) => (
            <LabEquipment
              key={index}
              type={equipment.type}
              position={equipment.position}
              onUse={handleEquipmentUse}
            />
          ))}

          {/* Chemical Reactions */}
          {currentExperiment && labMode === "experiment" && (
            <ChemicalReaction molecules={selectedMolecules} position={[0, 3, 0]} />
          )}
        </Physics>

        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 text-white pointer-events-auto">
          <motion.div
            className="bg-black bg-opacity-50 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">Quantum Lab</h2>
            <div className="text-lg">Score: {score}</div>
            <div className="text-sm text-gray-300">Mode: {labMode}</div>
            <div className="text-sm text-gray-300">
              Selected: {selectedMolecules.length} molecules
            </div>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 pointer-events-auto">
          <div className="space-x-4">
            <button
              onClick={resetLab}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Reset Lab
            </button>
            <button
              onClick={() => (window.location.hash = "#dashboard")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Return Home
            </button>
          </div>
        </div>

        {/* Selected Molecules Panel */}
        {selectedMolecules.length > 0 && (
          <div className="absolute bottom-8 left-8 pointer-events-auto">
            <motion.div
              className="bg-white bg-opacity-90 rounded-lg p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-bold mb-2">Selected Molecules</h3>
              <div className="flex space-x-2">
                {selectedMolecules.map((molecule, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: molecule.color }}
                  >
                    {molecule.symbol}
                  </div>
                ))}
              </div>
              {currentExperiment && (
                <button
                  onClick={runExperiment}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-all"
                >
                  Run Experiment
                </button>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Experiment Results Modal */}
      <AnimatePresence>
        {experimentResults && labMode === "analysis" && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4">Experiment Results</h3>

              <div className="space-y-4">
                <div>
                  <strong>Reaction:</strong> {experimentResults.reaction}
                </div>
                <div>
                  <strong>Result:</strong> {experimentResults.product}
                </div>
                <div>
                  <strong>Success:</strong> {experimentResults.success ? "Yes" : "No"}
                </div>
                {experimentResults.discovery && (
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <strong>New Discovery:</strong> {experimentResults.discovery}
                  </div>
                )}
                <div>
                  <strong>Points Earned:</strong> {experimentResults.points}
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={resetLab}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  New Experiment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ScienceLabGame;

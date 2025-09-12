import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Html, Text3D } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Physics, useBox, useSphere } from '@react-three/cannon';
import { ExperimentEngine } from './ExperimentEngine';
import { MoleculeSystem } from './MoleculeSystem';
import { SoundManager } from '../../audio/SoundManager';

function Molecule({ position, element, onClick, isSelected }) {
  const [ref, api] = useSphere(() => ({
    mass: element.mass,
    position,
    material: { friction: 0.1, restitution: 0.7 }
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
    type: 'Static'
  }));

  const equipment = {
    beaker: { size: [1, 2, 1], color: "#60a5fa" },
    microscope: { size: [1.5, 2.5, 1], color: "#374151" },
    bunsen: { size: [0.8, 1.5, 0.8], color: "#dc2626" },
    scale: { size: [2, 0.5, 1.5], color: "#6b7280" }
  };

  const config = equipment[type];

  return (
    <Float speed={0.5} rotationIntensity={0.1}>
      <mesh
        ref={ref}
        onClick={() => onUse(type)}
        position={position}
      >
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
          ref={el => particles.current[i] = el}
          position={[
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 70%, 60%)`}
            emissive="#444"
          />
        </mesh>
      ))}
    </group>
  );
}

function ScienceLabGame() {
  const [selectedMolecules, setSelectedMolecules] = useState([]);
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [experimentResults, setExperimentResults] = useState(null);
  const [labMode, setLabMode] = useState('exploration'); // exploration, experiment, analysis
  const [score, setScore] = useState(0);
  const [discoveries, setDiscoveries] = useState([]);

  const experimentEngine = useRef(new ExperimentEngine());
  const moleculeSystem = useRef(new MoleculeSystem());
  const soundManager = useRef(new SoundManager());

  const elements = [
    { symbol: 'H', name: 'Hydrogen', color: '#ffffff', radius: 0.3, mass: 1 },
    { symbol: 'O', name: 'Oxygen', color: '#ff0000', radius: 0.4, mass: 16 },
    { symbol: 'C', name: 'Carbon', color: '#000000', radius: 0.35, mass: 12 },
    { symbol: 'N', name: 'Nitrogen', color: '#0000ff', radius: 0.35, mass: 14 },
    { symbol: 'Na', name: 'Sodium', color: '#ffa500', radius: 0.5, mass: 23 },
    { symbol: 'Cl', name: 'Chlorine', color: '#00ff00', radius: 0.45, mass: 35 }
  ];

  const labEquipment = [
    { type: 'beaker', position: [-6, 1, 2] },
    { type: 'microscope', position: [6, 1.25, 2] },
    { type: 'bunsen', position: [-6, 0.75, -2] },
    { type: 'scale', position: [6, 0.25, -2] }
  ];

  useEffect(() => {
    soundManager.current.createAmbientSoundscape(['lab-ambient', 'equipment-hum']);
  }, []);

  const handleMoleculeClick = async (element) => {
    await soundManager.current.play('molecule-select', { volume: 0.6 });

    setSelectedMolecules(prev => {
      const newSelection = [...prev, element];

      // Check for possible reactions
      const reaction = experimentEngine.current.checkReaction(newSelection);
      if (reaction) {
        setCurrentExperiment(reaction);
        setLabMode('experiment');
      }

      return newSelection;
    });
  };

  const handleEquipmentUse = async (equipmentType) => {
    await soundManager.current.play('equipment-use', { volume: 0.7 });

    if (selectedMolecules.length > 0) {
      const experiment = experimentEngine.current.createExperiment(
        selectedMolecules,
        equipmentType
      );

      setCurrentExperiment(experiment);
      setLabMode('experiment');
    }
  };

  const runExperiment = async () => {
    if (!currentExperiment) return;

    await soundManager.current.play('experiment-start', { volume: 0.8 });

    const results = await experimentEngine.current.runExperiment(currentExperiment);
    setExperimentResults(results);
    setLabMode('analysis');

    if (results.success) {
      setScore(prev => prev + results.points);
      setDiscoveries(prev => [...prev, results.discovery]);
      await soundManager.current.play('discovery', { volume: 0.9 });
    }
  };

  const resetLab = () => {
    setSelectedMolecules([]);
    setCurrentExperiment(null);
    setExperimentResults(null);
    setLabMode('exploration');
  };

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900">
      <Canvas camera={{ position: [0, 8, 12], fov: 75 }}>
        <Environment preset="warehouse" />

        <ambientLight intensity={0.4} />
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
              position={[
                (index - 2.5) * 2,
                5 + Math.random() * 2,
                -5 + Math.random() * 2
              ]}
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
          {currentExperiment && labMode === 'experiment' && (
            <ChemicalReaction
              molecules={selectedMolecules}
              position={[0, 3, 0]}
            />
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
              onClick={() => window.location.hash = '#dashboard'}
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
        {experimentResults && labMode === 'analysis' && (
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
                  <strong>Success:</strong> {experimentResults.success ? 'Yes' : 'No'}
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

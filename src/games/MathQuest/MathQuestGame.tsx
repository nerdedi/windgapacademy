import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, OrbitControls, Environment, Float, Html, Sphere, MeshDistortMaterial, Stars, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { MathEngine } from './MathEngine';
import { ParticleSystem } from '../../effects/ParticleSystem';
import { SoundManager } from '../../audio/SoundManager';
import { AIEngine } from '../../ai/AIEngine';

function MathCrystal({ position, value, onClick, solved }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;

      if (solved) {
        meshRef.current.material.emissive.setHex(0x00ff00);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => onClick(value)}
        >
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color={solved ? "#10b981" : hovered ? "#fbbf24" : "#6366f1"}
            transparent
            opacity={0.8}
            emissive={solved ? "#004d40" : "#000"}
          />
        </mesh>

        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.3}
          height={0.05}
          position={[-0.2, 0, 1.2]}
        >
          {value}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      </group>
    </Float>
  );
}

function MathQuestGame() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [crystals, setCrystals] = useState([]);
  const [particles, setParticles] = useState([]);
  const [gameState, setGameState] = useState('playing');

  const mathEngine = useRef(new MathEngine());
  const soundManager = useRef(new SoundManager());
  const particleSystem = useRef(new ParticleSystem());

  useEffect(() => {
    generateNewProblem();
    soundManager.current.createAmbientSoundscape(['ambient-math', 'crystal-hum']);
  }, [level]);

  const generateNewProblem = () => {
    const problem = mathEngine.current.generateProblem(level);
    setCurrentProblem(problem);

    // Create answer crystals
    const answers = mathEngine.current.generateAnswerChoices(problem);
    const crystalPositions = [
      [-4, 2, 0], [0, 3, -2], [4, 2, 0], [0, 1, 2]
    ];

    const newCrystals = answers.map((answer, index) => ({
      id: index,
      value: answer,
      position: crystalPositions[index],
      solved: false
    }));

    setCrystals(newCrystals);
  };

  const handleCrystalClick = async (value) => {
    const isCorrect = mathEngine.current.checkAnswer(currentProblem, value);

    if (isCorrect) {
      await soundManager.current.play('correct-answer', { volume: 0.8 });

      // Update crystal state
      setCrystals(prev => prev.map(crystal =>
        crystal.value === value ? { ...crystal, solved: true } : crystal
      ));

      // Create success particles
      particleSystem.current.createBurst([0, 2, 0], 'success');

      setScore(prev => prev + (level * 10));

      setTimeout(() => {
        if (score > 0 && score % 100 === 0) {
          setLevel(prev => prev + 1);
        }
        generateNewProblem();
      }, 2000);

    } else {
      await soundManager.current.play('incorrect-answer', { volume: 0.6 });
      particleSystem.current.createBurst([0, 2, 0], 'error');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
      {/* 3D Game Scene */}
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <Environment preset="night" />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} />

        {/* Problem Display */}
        {currentProblem && (
          <Float speed={1} rotationIntensity={0.2}>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.8}
              height={0.1}
              position={[-3, 6, 0]}
            >
              {currentProblem.question}
              <meshStandardMaterial color="#ffffff" emissive="#444" />
            </Text3D>
          </Float>
        )}

        {/* Answer Crystals */}
        {crystals.map((crystal) => (
          <MathCrystal
            key={crystal.id}
            position={crystal.position}
            value={crystal.value}
            onClick={handleCrystalClick}
            solved={crystal.solved}
          />
        ))}

        {/* Particle Effects */}
        <primitive object={particleSystem.current.getParticleGroup()} />

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 text-white pointer-events-auto">
          <motion.div
            className="bg-black bg-opacity-30 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-2xl font-bold">Level {level}</div>
            <div className="text-lg">Score: {score}</div>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 text-white pointer-events-auto">
          <button
            onClick={() => window.location.hash = '#dashboard'}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Return Home
          </button>
        </div>
      </div>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {/* Achievement popup logic here */}
      </AnimatePresence>
    </div>
  );
}

export default MathQuestGame;

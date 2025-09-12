import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text3D,
  OrbitControls,
  Environment,
  Float,
  Html,
  Sphere,
  MeshDistortMaterial,
  Stars,
  useTexture,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { MathEngine } from "./MathEngine";
import { ParticleSystem } from "../../effects/ParticleSystem";
import { SoundManager } from "../../audio/SoundManager";
import { AIEngine } from "../../ai/AIEngine";

// Enhanced Mathematical Environment
function MathematicalSpace() {
  const { scene } = useThree();
  const geometryRef = useRef();

  useFrame((state) => {
    if (geometryRef.current) {
      geometryRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      geometryRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <>
      {/* Mathematical Grid Background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {/* Floating Mathematical Symbols */}
      <Float speed={0.5} rotationIntensity={0.2}>
        <group ref={geometryRef} position={[10, 5, -10]}>
          <Text3D font="/fonts/helvetiker_regular.typeface.json" size={2} height={0.2}>
            π
            <MeshDistortMaterial color="#4444ff" distort={0.3} speed={2} />
          </Text3D>
        </group>
      </Float>

      <Float speed={0.7} rotationIntensity={0.3}>
        <group position={[-8, 3, -8]}>
          <Text3D font="/fonts/helvetiker_regular.typeface.json" size={1.5} height={0.2}>
            ∑
            <MeshDistortMaterial color="#ff4444" distort={0.2} speed={1.5} />
          </Text3D>
        </group>
      </Float>
    </>
  );
}

// Enhanced Math Crystal with sophisticated visuals
function MathCrystal({ position, value, onClick, solved, isCorrect, problemType }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const texture = useTexture("/textures/crystal.jpg");

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;

      if (solved) {
        meshRef.current.material.emissive.setHex(0x00ff00);
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else if (animating) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.2);
      }
    }
  });

  const handleClick = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1000);
    onClick(value);
  };

  const getCrystalColor = () => {
    if (solved) return "#10b981";
    if (hovered) return "#fbbf24";

    // Color based on problem type
    switch (problemType) {
      case "algebra":
        return "#6366f1";
      case "geometry":
        return "#f59e0b";
      case "calculus":
        return "#8b5cf6";
      default:
        return "#6366f1";
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <group position={position}>
        {/* Main Crystal */}
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={handleClick}
          castShadow
          receiveShadow
        >
          <octahedronGeometry args={[1]} />
          <MeshDistortMaterial
            color={getCrystalColor()}
            map={texture}
            transparent
            opacity={0.9}
            distort={hovered ? 0.3 : 0.1}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Value Display */}
        <Html position={[0, 1.5, 0]} center>
          <div
            className={`
            px-4 py-2 rounded-lg font-bold text-lg transition-all duration-300
            ${
              solved
                ? "bg-green-500 text-white"
                : hovered
                  ? "bg-yellow-400 text-black"
                  : "bg-blue-600 text-white"
            }
            ${hovered ? "scale-110" : "scale-100"}
          `}
          >
            {value}
          </div>
        </Html>

        {/* Energy Field */}
        {(hovered || solved) && (
          <Sphere args={[1.5]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={solved ? "#00ff00" : "#ffff00"}
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </Sphere>
        )}

        {/* Particle Trail */}
        {solved && (
          <Float speed={3} rotationIntensity={1}>
            <group>
              {[...Array(8)].map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    Math.cos((i * Math.PI) / 4) * 2,
                    Math.sin((i * Math.PI) / 4) * 0.5,
                    Math.sin((i * Math.PI) / 4) * 2,
                  ]}
                >
                  <sphereGeometry args={[0.1]} />
                  <meshBasicMaterial color="#00ff88" />
                </mesh>
              ))}
            </group>
          </Float>
        )}
      </group>
    </Float>
  );
}

// Enhanced Problem Visualization
function ProblemVisualization({ problem, onSolve }) {
  const [step, setStep] = useState(0);
  const [showHint, setShowHint] = useState(false);

  if (!problem) return null;

  return (
    <Float speed={1} rotationIntensity={0.2}>
      <group position={[0, 6, 0]}>
        {/* Problem Display */}
        <Html position={[0, 0, 0]} center>
          <div className="bg-black bg-opacity-80 text-white p-6 rounded-xl max-w-md text-center backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">{problem.title}</h3>
            <div className="text-lg mb-4">{problem.question}</div>

            {problem.visualization && (
              <div className="mb-4">
                <img
                  src={problem.visualization}
                  alt="Problem visualization"
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {showHint && (
              <div className="bg-blue-600 p-3 rounded-lg mb-4">
                <div className="text-sm font-semibold mb-1">💡 Hint:</div>
                <div className="text-sm">{problem.hint}</div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-all"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              <button
                onClick={() => onSolve()}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm transition-all"
              >
                Skip Problem
              </button>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function MathQuestGame() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [crystals, setCrystals] = useState([]);
  const [gameState, setGameState] = useState("playing");
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [achievements, setAchievements] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [problemType, setProblemType] = useState("algebra");

  const mathEngine = useRef(new MathEngine());
  const soundManager = useRef(new SoundManager());
  const particleSystem = useRef(new ParticleSystem());
  const aiEngine = useRef(new AIEngine());

  useEffect(() => {
    generateNewProblem();
    soundManager.current.createAmbientSoundscape(["ambient-math", "crystal-hum"]);

    // Initialize AI engine for adaptive difficulty
    aiEngine.current.initialize().then(() => {
      console.log("AI Engine initialized for MathQuest");
    });

    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState("timeUp");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  const generateNewProblem = () => {
    const difficulty = calculateAdaptiveDifficulty();
    const problem = mathEngine.current.generateProblem(level, problemType, difficulty);
    setCurrentProblem(problem);

    // Create answer crystals with enhanced positioning
    const answers = mathEngine.current.generateAnswerChoices(problem);
    const crystalPositions = [
      [-4, 2, 0],
      [0, 3, -2],
      [4, 2, 0],
      [0, 1, 2],
      [-2, 4, -1],
      [2, 1, 1],
    ];

    const newCrystals = answers.map((answer, index) => ({
      id: index,
      value: answer,
      position: crystalPositions[index] || [
        Math.random() * 6 - 3,
        Math.random() * 2 + 1,
        Math.random() * 4 - 2,
      ],
      solved: false,
      isCorrect: answer === problem.answer,
      problemType: problemType,
    }));

    setCrystals(newCrystals);
  };

  const calculateAdaptiveDifficulty = () => {
    // AI-driven difficulty adjustment based on performance
    const baseScore = score / Math.max(1, level * 10);
    const streakBonus = Math.min(streak * 0.1, 0.5);
    return Math.min(0.9, Math.max(0.1, baseScore + streakBonus));
  };

  const handleCrystalClick = async (value) => {
    const isCorrect = mathEngine.current.checkAnswer(currentProblem, value);

    if (isCorrect) {
      await soundManager.current.play("correct-answer", { volume: 0.8 });

      // Update crystal state
      setCrystals((prev) =>
        prev.map((crystal) => (crystal.value === value ? { ...crystal, solved: true } : crystal)),
      );

      // Update score and streak
      const points = level * 10 * (streak + 1); // Streak multiplier
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);

      // Check for achievements
      checkAchievements(points);

      // Create success particles
      particleSystem.current.createBurst([0, 2, 0], "success");

      // Show celebration for high streaks
      if (streak > 0 && streak % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      setTimeout(() => {
        if (score > level * 100) {
          setLevel((prev) => prev + 1);
        }
        generateNewProblem();
      }, 2000);
    } else {
      await soundManager.current.play("incorrect-answer", { volume: 0.6 });

      // Reset streak on wrong answer
      setStreak(0);

      // Create error particles
      particleSystem.current.createBurst([0, 2, 0], "error");

      // Provide AI-powered hint
      if (aiEngine.current.isReady()) {
        const hint = aiEngine.current.provideTutoring(
          `Help with: ${currentProblem.question}`,
          `Student answered ${value}, correct answer is ${currentProblem.answer}`,
        );
        console.log("AI Hint:", hint);
      }
    }
  };

  const checkAchievements = (points) => {
    const newAchievements = [];

    if (streak === 5)
      newAchievements.push({
        id: "streak5",
        name: "Hot Streak!",
        description: "5 correct answers in a row",
      });
    if (streak === 10)
      newAchievements.push({
        id: "streak10",
        name: "Math Master!",
        description: "10 correct answers in a row",
      });
    if (score >= 1000)
      newAchievements.push({
        id: "score1000",
        name: "Point Collector",
        description: "Reached 1000 points",
      });
    if (level >= 10)
      newAchievements.push({
        id: "level10",
        name: "Advanced Learner",
        description: "Reached level 10",
      });

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      soundManager.current.play("achievement-unlock");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 to-indigo-900 relative">
      {/* Enhanced 3D Game Scene */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="night" />

        {/* Mathematical Space Background */}
        <MathematicalSpace />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight
          position={[-10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2} castShadow />

        {/* Enhanced Problem Display */}
        {currentProblem && (
          <ProblemVisualization problem={currentProblem} onSolve={() => generateNewProblem()} />
        )}

        {/* Enhanced Answer Crystals */}
        {crystals.map((crystal) => (
          <MathCrystal
            key={crystal.id}
            position={crystal.position}
            value={crystal.value}
            onClick={handleCrystalClick}
            solved={crystal.solved}
            isCorrect={crystal.isCorrect}
            problemType={crystal.problemType}
          />
        ))}

        {/* Particle Effects */}
        <primitive object={particleSystem.current.getParticleGroup()} />

        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Game Stats Panel */}
        <div className="absolute top-8 left-8 text-white pointer-events-auto">
          <motion.div
            className="bg-black bg-opacity-40 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-3xl font-bold mb-2">Level {level}</div>
            <div className="text-xl mb-2">Score: {score.toLocaleString()}</div>
            <div className="text-lg mb-2">🔥 Streak: {streak}</div>
            <div className="text-sm opacity-80">
              ⏱️ Time: {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="text-sm opacity-80 mb-1">Level Progress</div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${score % 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Problem Type Selector */}
        <div className="absolute top-8 right-8 text-white pointer-events-auto">
          <motion.div
            className="bg-black bg-opacity-40 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20 mb-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-sm opacity-80 mb-2">Problem Type</div>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="algebra">🔢 Algebra</option>
              <option value="geometry">📐 Geometry</option>
              <option value="calculus">📊 Calculus</option>
              <option value="statistics">📈 Statistics</option>
            </select>
          </motion.div>

          <button
            onClick={() => (window.location.hash = "#dashboard")}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-all w-full"
          >
            🏠 Return Home
          </button>
        </div>

        {/* Achievement Notifications */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <AnimatePresence>
            {achievements.slice(-3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="bg-yellow-500 text-black rounded-lg p-4 mb-2 shadow-lg"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="font-bold">🏆 {achievement.name}</div>
                <div className="text-sm">{achievement.description}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Celebration Effect */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-6xl font-bold text-yellow-400"
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1.2, rotate: 0 }}
                exit={{ scale: 0.5, rotate: 180 }}
              >
                🎉 AMAZING STREAK! 🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Screen */}
        <AnimatePresence>
          {gameState === "timeUp" && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 text-center max-w-md"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Time's Up!</h2>
                <div className="text-xl mb-2">Final Score: {score.toLocaleString()}</div>
                <div className="text-lg mb-4">Best Streak: {streak}</div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setGameState("playing");
                      setScore(0);
                      setLevel(1);
                      setStreak(0);
                      setTimeRemaining(300);
                      generateNewProblem();
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => (window.location.hash = "#dashboard")}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Home
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement Notifications */}
      <AnimatePresence>{/* Achievement popup logic here */}</AnimatePresence>
    </div>
  );
}

export default MathQuestGame;

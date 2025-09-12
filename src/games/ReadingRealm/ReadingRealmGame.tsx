import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text3D,
  OrbitControls,
  Environment,
  Float,
  Html,
  Stars,
  Cloud,
  useTexture,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { StoryEngine } from "./StoryEngine";
import { CharacterSystem } from "./CharacterSystem";
import { SoundManager } from "../../audio/SoundManager";
import { AIEngine } from "../../ai/AIEngine";
import { ParticleSystem } from "../../effects/ParticleSystem";

// Enhanced Story Environment
function StoryEnvironment({ currentStory }) {
  const { scene } = useThree();
  const cloudsRef = useRef();

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const getEnvironmentTheme = () => {
    if (!currentStory) return "default";
    if (currentStory.genre === "fantasy") return "magical";
    if (currentStory.genre === "adventure") return "epic";
    if (currentStory.genre === "mystery") return "mysterious";
    return "peaceful";
  };

  const theme = getEnvironmentTheme();

  return (
    <>
      {/* Dynamic Sky */}
      <Stars
        radius={100}
        depth={50}
        count={theme === "magical" ? 8000 : 3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Themed Clouds */}
      <group ref={cloudsRef}>
        <Cloud
          position={[-10, 5, -20]}
          speed={0.2}
          opacity={theme === "mysterious" ? 0.8 : 0.4}
          color={theme === "magical" ? "#8b5cf6" : "#ffffff"}
        />
        <Cloud
          position={[8, 3, -15]}
          speed={0.15}
          opacity={0.3}
          color={theme === "magical" ? "#ec4899" : "#ffffff"}
        />
      </group>

      {/* Magical Particles for Fantasy Stories */}
      {theme === "magical" && (
        <Float speed={0.5} rotationIntensity={0.2}>
          {[...Array(20)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * 0.5) * 15,
                Math.cos(i * 0.3) * 8 + 5,
                Math.sin(i * 0.7) * 10 - 10,
              ]}
            >
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#ffd700" />
            </mesh>
          ))}
        </Float>
      )}
    </>
  );
}

function StoryBook({ position, story, onClick, isOpen }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (isOpen) {
        meshRef.current.rotation.x = -Math.PI / 6;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={() => onClick(story)}
        >
          <boxGeometry args={[2, 0.3, 3]} />
          <meshStandardMaterial
            color={hovered ? "#fbbf24" : story.color}
            emissive={hovered ? "#444" : "#000"}
          />
        </mesh>

        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.02}
          position={[-0.8, 0.2, 1.6]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {story.title}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>

        {isOpen && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 className="text-xl font-bold mb-4">{story.title}</h3>
              <p className="text-gray-700">{story.preview}</p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

function ReadingCharacter({ character, position, isActive }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={character.color} emissive={isActive ? "#333" : "#000"} />
      </mesh>

      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        size={0.15}
        height={0.02}
        position={[-0.3, 1, 0]}
      >
        {character.name}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>
    </group>
  );
}

function ReadingRealmGame() {
  const [currentStory, setCurrentStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [gameMode, setGameMode] = useState("exploration"); // exploration, reading, quiz
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [comprehensionScore, setComprehensionScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [userChoices, setUserChoices] = useState([]);
  const [narrativeMode, setNarrativeMode] = useState("immersive"); // immersive, guided, interactive

  const storyEngine = useRef(new StoryEngine());
  const characterSystem = useRef(new CharacterSystem());
  const soundManager = useRef(new SoundManager());
  const aiEngine = useRef(new AIEngine());
  const particleSystem = useRef(new ParticleSystem());

  const stories = [
    {
      id: 1,
      title: "The Quantum Garden",
      preview:
        "A young scientist discovers a garden where plants exist in multiple dimensions, where each flower blooms in a different reality.",
      color: "#10b981",
      difficulty: "intermediate",
      genre: "science-fiction",
      pages: 42,
      position: [-4, 2, 0],
      content: storyEngine.current.getStoryContent("quantum-garden"),
      chapters: [
        {
          title: "The Discovery",
          content:
            "Dr. Maya Chen stepped through the shimmering portal into a garden that defied all laws of physics...",
          choices: [
            { text: "Examine the quantum flowers", consequence: "scientific" },
            { text: "Follow the glowing path", consequence: "adventurous" },
            { text: "Document everything carefully", consequence: "methodical" },
          ],
        },
      ],
      characters: ["Dr. Maya Chen", "Professor Quantum", "The Garden Keeper"],
    },
    {
      id: 2,
      title: "Digital Dragons",
      preview:
        "In a world where dragons live in computer networks, a young hacker must save both the digital and physical realms.",
      color: "#f59e0b",
      difficulty: "beginner",
      genre: "fantasy-tech",
      pages: 35,
      position: [0, 3, -2],
      content: storyEngine.current.getStoryContent("digital-dragons"),
      chapters: [
        {
          title: "The Virus Attack",
          content:
            "The screen flickered as Zara's fingers danced across the keyboard, but something was wrong in cyberspace...",
          choices: [
            { text: "Trace the virus source", consequence: "detective" },
            { text: "Summon a digital dragon", consequence: "magical" },
            { text: "Create a firewall", consequence: "defensive" },
          ],
        },
      ],
      characters: ["Zara the Hacker", "Byte the Dragon", "The Virus King"],
    },
    {
      id: 3,
      title: "The Time Library",
      preview:
        "Every book in this library contains a different timeline, and the librarian needs help preventing a temporal catastrophe.",
      color: "#8b5cf6",
      difficulty: "advanced",
      genre: "time-travel",
      pages: 58,
      position: [4, 2, 0],
      content: storyEngine.current.getStoryContent("time-library"),
      chapters: [
        {
          title: "The Temporal Anomaly",
          content:
            "The ancient library existed outside of time itself, its books containing the threads of history...",
          choices: [
            { text: "Read the forbidden chronicle", consequence: "knowledge" },
            { text: "Seek the Timekeeper's guidance", consequence: "wisdom" },
            { text: "Investigate the anomaly", consequence: "brave" },
          ],
        },
      ],
      characters: ["The Timekeeper", "Echo from the Future", "The Paradox Guardian"],
    },
  ];

  useEffect(() => {
    const storyCharacters = characterSystem.current.generateCharacters(stories);
    setCharacters(storyCharacters);
    soundManager.current.createAmbientSoundscape(["library-ambient", "page-turning"]);

    // Initialize AI engine for personalized storytelling
    aiEngine.current.initialize().then(() => {
      console.log("AI Engine initialized for ReadingRealm");
    });
  }, []);

  const handleStorySelect = (story) => {
    setCurrentStory(story);
    setSelectedBook(story);
    setGameMode("reading");
    setCurrentChapter(0);
    setStoryProgress(0);

    // Generate personalized story elements based on user preferences
    if (aiEngine.current.isReady()) {
      const adaptedStory = aiEngine.current.adaptContent(story, {
        readingLevel: story.difficulty,
        interests: [story.genre],
        learningStyle: "visual",
      });
      setCurrentStory(adaptedStory);
    }

    // Play story-specific ambient sounds
    const ambientSounds = {
      "science-fiction": ["sci-fi-ambient", "computer-hum"],
      "fantasy-tech": ["digital-magic", "keyboard-clicks"],
      "time-travel": ["temporal-echoes", "clock-ticking"],
    };

    soundManager.current.createAmbientSoundscape(ambientSounds[story.genre] || ["story-ambient"]);

    // Create story entrance particles
    particleSystem.current.createBurst([0, 3, 0], "magic");
  };

  const handleChapterChoice = (choice) => {
    setUserChoices((prev) => [...prev, choice]);

    // AI-powered consequence generation
    if (aiEngine.current.isReady()) {
      const storyContext = `User chose: ${choice.text}. Story consequence: ${choice.consequence}`;
      const aiResponse = aiEngine.current.generateContent("narrative", 0.7, currentStory.genre);
      console.log("AI Story Response:", aiResponse);
    }

    // Update story progress
    setStoryProgress((prev) => Math.min(100, prev + 20));

    // Check for achievements
    checkReadingAchievements();

    // Move to next chapter or complete story
    if (currentChapter < currentStory.chapters.length - 1) {
      setCurrentChapter((prev) => prev + 1);
    } else {
      completeStory();
    }
  };

  const checkReadingAchievements = () => {
    const newAchievements = [];

    if (storyProgress >= 100) {
      newAchievements.push({
        id: "story-complete",
        name: "Story Master",
        description: "Completed your first story",
      });
    }

    if (userChoices.length >= 5) {
      newAchievements.push({
        id: "choice-maker",
        name: "Decision Maker",
        description: "Made 5 story choices",
      });
    }

    if (comprehensionScore >= 80) {
      newAchievements.push({
        id: "comprehension-master",
        name: "Reading Comprehension Expert",
        description: "Achieved 80% comprehension score",
      });
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      soundManager.current.play("achievement-unlock");
    }
  };

  const completeStory = () => {
    setGameMode("completed");
    setStoryProgress(100);

    // Calculate final comprehension score
    const finalScore = Math.round(userChoices.length * 20 + storyProgress * 0.8);
    setComprehensionScore(finalScore);

    // Create celebration particles
    particleSystem.current.createBurst([0, 5, 0], "success");

    // Play completion sound
    soundManager.current.play("story-complete");

    checkReadingAchievements();
  };

  const handleStorySelect = async (story) => {
    await soundManager.current.play("book-open", { volume: 0.7 });
    setCurrentStory(story);
    setGameMode("reading");
    setStoryProgress(0);
  };

  const handleReadingProgress = (progress) => {
    setStoryProgress(progress);

    if (progress >= 100) {
      const questions = storyEngine.current.generateComprehensionQuestions(currentStory);
      setComprehensionQuestions(questions);
      setGameMode("quiz");
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    const quizScore = storyEngine.current.calculateScore(comprehensionQuestions, userAnswers);
    setScore((prev) => prev + quizScore);

    await soundManager.current.play("quiz-complete", { volume: 0.8 });

    setTimeout(() => {
      setGameMode("exploration");
      setCurrentStory(null);
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-red-100 relative">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="sunset" />

        {/* Story Environment */}
        <StoryEnvironment currentStory={currentStory} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1.5} castShadow />

        {gameMode === "exploration" && (
          <>
            {/* Library Environment */}
            <group>
              {/* Enhanced Floating Books */}
              {stories.map((story, index) => (
                <StoryBook
                  key={story.id}
                  position={story.position}
                  story={story}
                  onClick={handleStorySelect}
                  isOpen={currentStory?.id === story.id}
                  isSelected={selectedBook?.id === story.id}
                />
              ))}

              {/* Library Platform */}
              <mesh position={[0, -1, 0]} receiveShadow>
                <cylinderGeometry args={[12, 12, 0.2, 32]} />
                <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.1} />
              </mesh>

              {/* Floating Ambient Books */}
              <Float speed={0.5} rotationIntensity={0.1}>
                {[...Array(8)].map((_, i) => (
                  <mesh
                    key={i}
                    position={[
                      Math.cos((i * Math.PI) / 4) * 8,
                      4 + Math.sin(i * 0.5) * 2,
                      Math.sin((i * Math.PI) / 4) * 8,
                    ]}
                  >
                    <boxGeometry args={[0.3, 0.05, 0.4]} />
                    <meshStandardMaterial color="#654321" />
                  </mesh>
                ))}
              </Float>

              {/* Story Characters */}
              {characters.map((character, index) => (
                <ReadingCharacter
                  key={character.id}
                  character={character}
                  position={[(index - 1) * 3, 0, 4]}
                  isActive={false}
                />
              ))}
            </group>
          </>
        )}

        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 text-gray-800 pointer-events-auto">
          <motion.div
            className="bg-white bg-opacity-90 rounded-lg p-4 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold mb-2">Reading Realm</h2>
            <div className="text-lg">Score: {score}</div>
            <div className="text-sm text-gray-600">Mode: {gameMode}</div>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 pointer-events-auto">
          <button
            onClick={() => (window.location.hash = "#dashboard")}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>

      {/* Reading Interface */}
      <AnimatePresence>
        {gameMode === "reading" && currentStory && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-4xl max-h-[80vh] overflow-y-auto mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{currentStory.title}</h2>
                <div className="text-sm text-gray-600">Progress: {Math.round(storyProgress)}%</div>
              </div>

              <div className="prose prose-lg max-w-none">
                <StoryReader content={currentStory.content} onProgress={handleReadingProgress} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Interface */}
      <AnimatePresence>
        {gameMode === "quiz" && (
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
              <h3 className="text-2xl font-bold mb-6">Comprehension Quiz</h3>

              <div className="space-y-6">
                {comprehensionQuestions.map((question, index) => (
                  <div key={question.id} className="border-b pb-4">
                    <p className="font-semibold mb-3">{question.text}</p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            onChange={() => handleQuizAnswer(question.id, option)}
                            className="mr-3"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={submitQuiz}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  Submit Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReadingRealmGame;

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, OrbitControls, Environment, Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryEngine } from './StoryEngine';
import { CharacterSystem } from './CharacterSystem';
import { SoundManager } from '../../audio/SoundManager';

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
        <meshStandardMaterial
          color={character.color}
          emissive={isActive ? "#333" : "#000"}
        />
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
  const [gameMode, setGameMode] = useState('exploration'); // exploration, reading, quiz
  const [comprehensionQuestions, setComprehensionQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const storyEngine = useRef(new StoryEngine());
  const characterSystem = useRef(new CharacterSystem());
  const soundManager = useRef(new SoundManager());

  const stories = [
    {
      id: 1,
      title: "The Quantum Garden",
      preview: "A young scientist discovers a garden where plants exist in multiple dimensions...",
      color: "#10b981",
      difficulty: "intermediate",
      content: storyEngine.current.getStoryContent('quantum-garden')
    },
    {
      id: 2,
      title: "Digital Dragons",
      preview: "In a world where dragons live in computer networks...",
      color: "#f59e0b",
      difficulty: "beginner",
      content: storyEngine.current.getStoryContent('digital-dragons')
    },
    {
      id: 3,
      title: "The Time Library",
      preview: "Every book in this library contains a different timeline...",
      color: "#8b5cf6",
      difficulty: "advanced",
      content: storyEngine.current.getStoryContent('time-library')
    }
  ];

  useEffect(() => {
    const storyCharacters = characterSystem.current.generateCharacters(stories);
    setCharacters(storyCharacters);
    soundManager.current.createAmbientSoundscape(['library-ambient', 'page-turning']);
  }, []);

  const handleStorySelect = async (story) => {
    await soundManager.current.play('book-open', { volume: 0.7 });
    setCurrentStory(story);
    setGameMode('reading');
    setStoryProgress(0);
  };

  const handleReadingProgress = (progress) => {
    setStoryProgress(progress);

    if (progress >= 100) {
      const questions = storyEngine.current.generateComprehensionQuestions(currentStory);
      setComprehensionQuestions(questions);
      setGameMode('quiz');
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    const quizScore = storyEngine.current.calculateScore(comprehensionQuestions, userAnswers);
    setScore(prev => prev + quizScore);

    await soundManager.current.play('quiz-complete', { volume: 0.8 });

    setTimeout(() => {
      setGameMode('exploration');
      setCurrentStory(null);
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-red-100">
      <Canvas camera={{ position: [0, 8, 12], fov: 75 }}>
        <Environment preset="sunset" />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {gameMode === 'exploration' && (
          <>
            {/* Library Environment */}
            <group>
              {/* Floating Books */}
              {stories.map((story, index) => (
                <StoryBook
                  key={story.id}
                  position={[
                    (index - 1) * 4,
                    2 + Math.sin(index) * 2,
                    -2
                  ]}
                  story={story}
                  onClick={handleStorySelect}
                  isOpen={false}
                />
              ))}

              {/* Story Characters */}
              {characters.map((character, index) => (
                <ReadingCharacter
                  key={character.id}
                  character={character}
                  position={[
                    (index - 1) * 3,
                    0,
                    4
                  ]}
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
            onClick={() => window.location.hash = '#dashboard'}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>

      {/* Reading Interface */}
      <AnimatePresence>
        {gameMode === 'reading' && currentStory && (
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
                <div className="text-sm text-gray-600">
                  Progress: {Math.round(storyProgress)}%
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <StoryReader
                  content={currentStory.content}
                  onProgress={handleReadingProgress}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Interface */}
      <AnimatePresence>
        {gameMode === 'quiz' && (
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

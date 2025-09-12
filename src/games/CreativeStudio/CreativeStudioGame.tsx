import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Text3D,
  Html,
  Float,
  Stars,
  Sphere,
  MeshDistortMaterial,
  useTexture,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { AIArtEngine } from "./AIArtEngine";
import { StoryGenerator } from "./StoryGenerator";
import { MusicComposer } from "./MusicComposer";
import { SoundManager } from "../../audio/SoundManager";
import { AIEngine } from "../../ai/AIEngine";
import { ParticleSystem } from "../../effects/ParticleSystem";

// Enhanced Creative Environment
function CreativeEnvironment({ currentProject, mood }) {
  const { scene } = useThree();
  const inspirationRef = useRef();

  useFrame((state) => {
    if (inspirationRef.current) {
      inspirationRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      inspirationRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  const getEnvironmentTheme = () => {
    if (mood === "energetic") return "vibrant";
    if (mood === "calm") return "serene";
    if (mood === "focused") return "minimal";
    return "inspiring";
  };

  const theme = getEnvironmentTheme();

  return (
    <>
      {/* Creative Atmosphere */}
      <Stars
        radius={100}
        depth={50}
        count={theme === "vibrant" ? 10000 : 5000}
        factor={6}
        saturation={theme === "vibrant" ? 0.8 : 0.2}
        fade
        speed={theme === "energetic" ? 2 : 0.5}
      />

      {/* Floating Inspiration Orbs */}
      <group ref={inspirationRef}>
        {[...Array(12)].map((_, i) => (
          <Float key={i} speed={1 + i * 0.1} rotationIntensity={0.3}>
            <mesh
              position={[
                Math.cos((i * Math.PI) / 6) * 8,
                Math.sin(i * 0.5) * 4 + 6,
                Math.sin((i * Math.PI) / 6) * 8,
              ]}
            >
              <sphereGeometry args={[0.2]} />
              <MeshDistortMaterial
                color={
                  theme === "vibrant" ? `hsl(${i * 30}, 80%, 60%)` : `hsl(${i * 30}, 40%, 70%)`
                }
                distort={0.4}
                speed={2}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Creative Tools Showcase */}
      <group position={[0, 8, -12]}>
        {/* Digital Canvas */}
        <mesh>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>

        {/* Floating Brushes */}
        <Float speed={0.8} rotationIntensity={0.2}>
          <group position={[-3, 2, 1]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 2]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
          </group>
        </Float>

        <Float speed={1.2} rotationIntensity={0.3}>
          <group position={[3, 1, 1]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 1.8]} />
              <meshStandardMaterial color="#2c3e50" />
            </mesh>
            <mesh position={[0, 0.9, 0]}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#4ecdc4" />
            </mesh>
          </group>
        </Float>
      </group>

      {/* Color Palette Visualization */}
      <group position={[10, 3, -5]}>
        {["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"].map((color, i) => (
          <Float key={i} speed={0.5 + i * 0.1}>
            <mesh position={[0, i * 0.8 - 2, 0]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </Float>
        ))}
      </group>

      {/* Inspiration Particles */}
      {theme === "vibrant" && (
        <Float speed={0.3} rotationIntensity={0.1}>
          {[...Array(25)].map((_, i) => (
            <mesh
              key={i}
              position={[Math.random() * 20 - 10, Math.random() * 10 + 2, Math.random() * 20 - 10]}
            >
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
            </mesh>
          ))}
        </Float>
      )}
    </>
  );
}

// Enhanced Creative Tool with sophisticated interactions
function CreativeTool({ type, position, onClick, isActive }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isActive) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });

  const tools = {
    paintbrush: { color: "#ff6b6b", icon: "🎨", size: [0.5, 2, 0.5] },
    pen: { color: "#4ecdc4", icon: "✍️", size: [0.3, 2.5, 0.3] },
    music: { color: "#ffe66d", icon: "🎵", size: [1.5, 1, 0.5] },
    camera: { color: "#a8e6cf", icon: "📷", size: [1.2, 0.8, 1] },
  };

  const tool = tools[type];

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onClick(type)}
      >
        <boxGeometry args={tool.size} />
        <meshStandardMaterial
          color={isActive ? "#ffd93d" : tool.color}
          emissive={hovered ? "#333" : "#000"}
        />
      </mesh>

      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        size={0.3}
        height={0.05}
        position={[-0.5, tool.size[1] + 0.5, 0]}
      >
        {tool.icon}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>

      <Html position={[0, -1, 0]} center>
        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {type.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

function AICanvas({ creations, onCreationClick }) {
  const canvasRef = useRef();
  const { size } = useThree();

  useFrame(() => {
    if (canvasRef.current) {
      canvasRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={canvasRef} position={[0, 3, -5]}>
      <mesh>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {creations.map((creation, index) => (
        <mesh
          key={creation.id}
          position={[((index % 3) - 1) * 2, Math.floor(index / 3) * 1.5 - 1, 0.01]}
          onClick={() => onCreationClick(creation)}
        >
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={creation.color} />

          <Html position={[0, -0.7, 0]} center>
            <div className="text-xs text-center">{creation.title}</div>
          </Html>
        </mesh>
      ))}
    </group>
  );
}

function CreativeStudioGame() {
  const [activeTool, setActiveTool] = useState(null);
  const [creations, setCreations] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [studioMode, setStudioMode] = useState("selection"); // selection, creating, editing, sharing
  const [aiPrompt, setAiPrompt] = useState("");
  const [score, setScore] = useState(0);
  const [gallery, setGallery] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [mood, setMood] = useState("inspiring");
  const [creativeProgress, setCreativeProgress] = useState(0);
  const [artStyle, setArtStyle] = useState("realistic");
  const [brushSize, setBrushSize] = useState(5);
  const [selectedColor, setSelectedColor] = useState("#ff6b6b");

  const aiArtEngine = useRef(new AIArtEngine());
  const storyGenerator = useRef(new StoryGenerator());
  const musicComposer = useRef(new MusicComposer());
  const soundManager = useRef(new SoundManager());
  const aiEngine = useRef(new AIEngine());
  const particleSystem = useRef(new ParticleSystem());

  const tools = [
    {
      type: "paintbrush",
      position: [-6, 2, 2],
      name: "AI Art Generator",
      description: "Create stunning digital artwork with AI assistance",
      icon: "🎨",
      capabilities: ["digital painting", "style transfer", "concept art"],
    },
    {
      type: "pen",
      position: [-2, 2, 2],
      name: "Story Creator",
      description: "Write interactive stories and narratives",
      icon: "✍️",
      capabilities: ["creative writing", "character development", "plot generation"],
    },
    {
      type: "music",
      position: [2, 2, 2],
      name: "Music Composer",
      description: "Compose original music and soundscapes",
      icon: "🎵",
      capabilities: ["melody creation", "harmony generation", "rhythm patterns"],
    },
    {
      type: "camera",
      position: [6, 2, 2],
      name: "Visual Designer",
      description: "Design graphics, logos, and visual elements",
      icon: "📷",
      capabilities: ["graphic design", "logo creation", "visual effects"],
    },
  ];

  const artStyles = [
    { name: "Realistic", value: "realistic", description: "Photorealistic artwork" },
    { name: "Impressionist", value: "impressionist", description: "Soft, dreamy brushstrokes" },
    { name: "Abstract", value: "abstract", description: "Non-representational art" },
    { name: "Anime", value: "anime", description: "Japanese animation style" },
    { name: "Cyberpunk", value: "cyberpunk", description: "Futuristic neon aesthetic" },
    { name: "Watercolor", value: "watercolor", description: "Fluid, translucent effects" },
  ];

  const colorPalettes = [
    { name: "Vibrant", colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"] },
    { name: "Pastel", colors: ["#ffd3e1", "#c8f7c5", "#a8e6cf", "#dcedc1", "#ffd3a5", "#fd9853"] },
    {
      name: "Monochrome",
      colors: ["#2c3e50", "#34495e", "#7f8c8d", "#95a5a6", "#bdc3c7", "#ecf0f1"],
    },
    { name: "Sunset", colors: ["#ff7675", "#fd79a8", "#fdcb6e", "#e17055", "#74b9ff", "#0984e3"] },
  ];

  useEffect(() => {
    soundManager.current.createAmbientSoundscape(["studio-ambient", "creative-flow"]);

    // Initialize AI engine for creative assistance
    aiEngine.current.initialize().then(() => {
      console.log("AI Engine initialized for CreativeStudio");
    });
  }, []);

  const startCreativeProject = (tool) => {
    setActiveTool(tool);
    setStudioMode("creating");
    setCurrentProject({
      id: Date.now(),
      type: tool.type,
      name: `New ${tool.name}`,
      createdAt: new Date(),
      progress: 0,
      style: artStyle,
      mood: mood,
    });

    // Create project start particles
    particleSystem.current.createBurst([0, 3, 0], "creative");

    // Play tool selection sound
    soundManager.current.play("tool-select");
  };

  const generateAIContent = async () => {
    if (!aiPrompt.trim() || !activeTool) return;

    setCreativeProgress(0);

    // Simulate AI generation progress
    const progressInterval = setInterval(() => {
      setCreativeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completeCreation();
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Generate content based on tool type
    let content;
    switch (activeTool.type) {
      case "paintbrush":
        content = await aiArtEngine.current.generateArt(aiPrompt, artStyle);
        break;
      case "pen":
        content = await storyGenerator.current.generateStory(aiPrompt, mood);
        break;
      case "music":
        content = await musicComposer.current.composeMusic(aiPrompt, mood);
        break;
      case "camera":
        content = await aiArtEngine.current.generateDesign(aiPrompt, artStyle);
        break;
      default:
        content = { type: "text", data: "Creative content generated!" };
    }

    // Create generation particles
    particleSystem.current.createBurst([0, 4, 0], "magic");
  };

  const completeCreation = () => {
    const newCreation = {
      ...currentProject,
      progress: 100,
      completedAt: new Date(),
      prompt: aiPrompt,
      style: artStyle,
      mood: mood,
    };

    setCreations((prev) => [...prev, newCreation]);
    setGallery((prev) => [...prev, newCreation]);
    setScore((prev) => prev + 50);

    // Check for achievements
    checkCreativeAchievements();

    // Create completion particles
    particleSystem.current.createBurst([0, 5, 0], "success");

    // Play completion sound
    soundManager.current.play("creation-complete");

    setStudioMode("editing");
  };

  const checkCreativeAchievements = () => {
    const newAchievements = [];

    if (creations.length === 1) {
      newAchievements.push({
        id: "first-creation",
        name: "First Masterpiece",
        description: "Created your first artwork",
      });
    }

    if (creations.length >= 5) {
      newAchievements.push({
        id: "prolific-artist",
        name: "Prolific Artist",
        description: "Created 5 artworks",
      });
    }

    if (creations.filter((c) => c.type === "paintbrush").length >= 3) {
      newAchievements.push({
        id: "digital-painter",
        name: "Digital Painter",
        description: "Mastered digital art creation",
      });
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      soundManager.current.play("achievement-unlock");
    }
  };

  const handleToolClick = async (toolType) => {
    await soundManager.current.play("tool-select", { volume: 0.6 });
    setActiveTool(toolType);
    setStudioMode("creating");
  };

  const createWithAI = async () => {
    if (!aiPrompt.trim() || !activeTool) return;

    await soundManager.current.play("ai-generating", { volume: 0.7 });

    let creation;
    switch (activeTool) {
      case "paintbrush":
        creation = await aiArtEngine.current.generateArt(aiPrompt);
        break;
      case "pen":
        creation = await storyGenerator.current.generateStory(aiPrompt);
        break;
      case "music":
        creation = await musicComposer.current.composeMusic(aiPrompt);
        break;
      case "camera":
        creation = await aiArtEngine.current.generatePhoto(aiPrompt);
        break;
      default:
        return;
    }

    const newCreation = {
      id: Date.now().toString(),
      type: activeTool,
      title: creation.title,
      content: creation.content,
      color: creation.color || "#" + Math.floor(Math.random() * 16777215).toString(16),
      prompt: aiPrompt,
      timestamp: new Date(),
      likes: 0,
      views: 0,
    };

    setCreations((prev) => [...prev, newCreation]);
    setCurrentProject(newCreation);
    setScore((prev) => prev + 25);
    setAiPrompt("");

    await soundManager.current.play("creation-complete", { volume: 0.8 });
  };

  const handleCreationClick = (creation) => {
    setCurrentProject(creation);
    setStudioMode("editing");
  };

  const shareCreation = async (creation) => {
    await soundManager.current.play("share-success", { volume: 0.7 });
    setGallery((prev) => [...prev, { ...creation, shared: true }]);
    setScore((prev) => prev + 50);
  };

  const remixCreation = async (creation) => {
    const remixed = await aiArtEngine.current.remixCreation(creation);
    const newCreation = {
      ...remixed,
      id: Date.now().toString(),
      title: `${creation.title} (Remix)`,
      timestamp: new Date(),
    };

    setCreations((prev) => [...prev, newCreation]);
    setScore((prev) => prev + 35);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-orange-700 relative">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="studio" />

        {/* Creative Environment */}
        <CreativeEnvironment currentProject={currentProject} mood={mood} />

        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 8, -5]} intensity={0.8} color="#ff6b6b" />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

        {/* Creative Tools */}
        {tools.map((tool, index) => (
          <CreativeTool
            key={index}
            type={tool.type}
            position={tool.position}
            onClick={handleToolClick}
            isActive={activeTool === tool.type}
          />
        ))}

        {/* AI Canvas */}
        <AICanvas creations={creations} onCreationClick={handleCreationClick} />

        {/* Studio Environment */}
        <mesh position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

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
            <h2 className="text-2xl font-bold mb-2">Creative Studio</h2>
            <div className="text-lg">Score: {score}</div>
            <div className="text-sm text-gray-300">Mode: {studioMode}</div>
            <div className="text-sm text-gray-300">Active Tool: {activeTool || "None"}</div>
            <div className="text-sm text-gray-300">Creations: {creations.length}</div>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 pointer-events-auto">
          <button
            onClick={() => (window.location.hash = "#dashboard")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Return Home
          </button>
        </div>

        {/* AI Prompt Interface */}
        {studioMode === "creating" && activeTool && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <motion.div
              className="bg-white bg-opacity-95 rounded-lg p-6 backdrop-blur-sm max-w-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">AI Creative Assistant</h3>
              <p className="text-sm text-gray-600 mb-3">
                Describe what you want to create with your {activeTool}:
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="A magical forest with glowing mushrooms..."
                className="w-full h-20 p-3 border rounded-lg resize-none"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setStudioMode("selection")}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createWithAI}
                  disabled={!aiPrompt.trim()}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  Create with AI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Creation Detail Modal */}
      <AnimatePresence>
        {currentProject && studioMode === "editing" && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{currentProject.title}</h3>
                <div className="text-sm text-gray-500">{currentProject.type.toUpperCase()}</div>
              </div>

              <div className="mb-6">
                <div
                  className="w-full h-48 rounded-lg mb-4"
                  style={{ backgroundColor: currentProject.color }}
                />
                <p className="text-gray-700">{currentProject.content}</p>
              </div>

              <div className="mb-6">
                <strong>Original Prompt:</strong>
                <p className="text-gray-600 italic">"{currentProject.prompt}"</p>
              </div>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <button
                    onClick={() => remixCreation(currentProject)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    Remix
                  </button>
                  <button
                    onClick={() => shareCreation(currentProject)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    Share
                  </button>
                </div>
                <button
                  onClick={() => {
                    setCurrentProject(null);
                    setStudioMode("selection");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreativeStudioGame;

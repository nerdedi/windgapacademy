import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { AIArtEngine } from './AIArtEngine';
import { StoryGenerator } from './StoryGenerator';
import { MusicComposer } from './MusicComposer';
import { SoundManager } from '../../audio/SoundManager';

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
    paintbrush: { color: '#ff6b6b', icon: '🎨', size: [0.5, 2, 0.5] },
    pen: { color: '#4ecdc4', icon: '✍️', size: [0.3, 2.5, 0.3] },
    music: { color: '#ffe66d', icon: '🎵', size: [1.5, 1, 0.5] },
    camera: { color: '#a8e6cf', icon: '📷', size: [1.2, 0.8, 1] }
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
          color={isActive ? '#ffd93d' : tool.color}
          emissive={hovered ? '#333' : '#000'}
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
          position={[
            (index % 3 - 1) * 2,
            Math.floor(index / 3) * 1.5 - 1,
            0.01
          ]}
          onClick={() => onCreationClick(creation)}
        >
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={creation.color} />

          <Html position={[0, -0.7, 0]} center>
            <div className="text-xs text-center">
              {creation.title}
            </div>
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
  const [studioMode, setStudioMode] = useState('selection'); // selection, creating, editing, sharing
  const [aiPrompt, setAiPrompt] = useState('');
  const [score, setScore] = useState(0);
  const [gallery, setGallery] = useState([]);

  const aiArtEngine = useRef(new AIArtEngine());
  const storyGenerator = useRef(new StoryGenerator());
  const musicComposer = useRef(new MusicComposer());
  const soundManager = useRef(new SoundManager());

  const tools = [
    { type: 'paintbrush', position: [-6, 2, 2] },
    { type: 'pen', position: [-2, 2, 2] },
    { type: 'music', position: [2, 2, 2] },
    { type: 'camera', position: [6, 2, 2] }
  ];

  useEffect(() => {
    soundManager.current.createAmbientSoundscape(['studio-ambient', 'creative-flow']);
  }, []);

  const handleToolClick = async (toolType) => {
    await soundManager.current.play('tool-select', { volume: 0.6 });
    setActiveTool(toolType);
    setStudioMode('creating');
  };

  const createWithAI = async () => {
    if (!aiPrompt.trim() || !activeTool) return;

    await soundManager.current.play('ai-generating', { volume: 0.7 });

    let creation;
    switch (activeTool) {
      case 'paintbrush':
        creation = await aiArtEngine.current.generateArt(aiPrompt);
        break;
      case 'pen':
        creation = await storyGenerator.current.generateStory(aiPrompt);
        break;
      case 'music':
        creation = await musicComposer.current.composeMusic(aiPrompt);
        break;
      case 'camera':
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
      color: creation.color || '#' + Math.floor(Math.random()*16777215).toString(16),
      prompt: aiPrompt,
      timestamp: new Date(),
      likes: 0,
      views: 0
    };

    setCreations(prev => [...prev, newCreation]);
    setCurrentProject(newCreation);
    setScore(prev => prev + 25);
    setAiPrompt('');

    await soundManager.current.play('creation-complete', { volume: 0.8 });
  };

  const handleCreationClick = (creation) => {
    setCurrentProject(creation);
    setStudioMode('editing');
  };

  const shareCreation = async (creation) => {
    await soundManager.current.play('share-success', { volume: 0.7 });
    setGallery(prev => [...prev, { ...creation, shared: true }]);
    setScore(prev => prev + 50);
  };

  const remixCreation = async (creation) => {
    const remixed = await aiArtEngine.current.remixCreation(creation);
    const newCreation = {
      ...remixed,
      id: Date.now().toString(),
      title: `${creation.title} (Remix)`,
      timestamp: new Date()
    };

    setCreations(prev => [...prev, newCreation]);
    setScore(prev => prev + 35);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-orange-700">
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <Environment preset="studio" />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} />

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
        <AICanvas
          creations={creations}
          onCreationClick={handleCreationClick}
        />

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
            <div className="text-sm text-gray-300">
              Active Tool: {activeTool || 'None'}
            </div>
            <div className="text-sm text-gray-300">
              Creations: {creations.length}
            </div>
          </motion.div>
        </div>

        <div className="absolute top-8 right-8 pointer-events-auto">
          <button
            onClick={() => window.location.hash = '#dashboard'}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Return Home
          </button>
        </div>

        {/* AI Prompt Interface */}
        {studioMode === 'creating' && activeTool && (
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
                  onClick={() => setStudioMode('selection')}
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
        {currentProject && studioMode === 'editing' && (
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
                <div className="text-sm text-gray-500">
                  {currentProject.type.toUpperCase()}
                </div>
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
                    setStudioMode('selection');
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

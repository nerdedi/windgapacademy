// 3D LMS Architecture Visualization
// This file demonstrates the recommended architecture for the gamified 3D LMS

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';

/**
 * Architecture Visualization Component
 * Shows the layered approach of the recommended 3D LMS architecture
 */
export function ArchitectureVisualization() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Frontend Layer */}
        <group position={[0, 4, 0]}>
          <Box args={[8, 1, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#4F46E5" />
          </Box>
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Frontend Layer (React + Three.js)
          </Text>
          
          {/* UI Components */}
          <Box args={[3, 0.5, 1]} position={[-2, -1, 0]}>
            <meshStandardMaterial color="#06B6D4" />
          </Box>
          <Text
            position={[-2, -1, 0.6]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            UI Layer (Chakra UI)
          </Text>
          
          {/* 3D Render Layer */}
          <Box args={[3, 0.5, 1]} position={[2, -1, 0]}>
            <meshStandardMaterial color="#10B981" />
          </Box>
          <Text
            position={[2, -1, 0.6]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            3D Render (R3F)
          </Text>
        </group>

        {/* API Layer */}
        <group position={[0, 1, 0]}>
          <Box args={[6, 0.8, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#F59E0B" />
          </Box>
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            API Layer (tRPC + Express.js)
          </Text>
        </group>

        {/* Backend Layer */}
        <group position={[0, -2, 0]}>
          <Box args={[8, 1, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#EF4444" />
          </Box>
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Backend Services
          </Text>
          
          {/* Database */}
          <Box args={[2.5, 0.5, 1]} position={[-2.5, -1, 0]}>
            <meshStandardMaterial color="#8B5CF6" />
          </Box>
          <Text
            position={[-2.5, -1, 0.6]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Firebase DB
          </Text>
          
          {/* Authentication */}
          <Box args={[2.5, 0.5, 1]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#EC4899" />
          </Box>
          <Text
            position={[0, -1, 0.6]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Auth & Security
          </Text>
          
          {/* Analytics */}
          <Box args={[2.5, 0.5, 1]} position={[2.5, -1, 0]}>
            <meshStandardMaterial color="#14B8A6" />
          </Box>
          <Text
            position={[2.5, -1, 0.6]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Analytics
          </Text>
        </group>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold mb-2">3D LMS Architecture</h1>
        <p className="text-sm opacity-80">
          Drag to rotate • Scroll to zoom • Recommended tech stack visualization
        </p>
      </div>
    </div>
  );
}

/**
 * Technology Stack Comparison Component
 * Interactive comparison of different technology options
 */
export function TechStackComparison() {
  const stacks = [
    {
      name: 'Current Stack (Recommended)',
      position: [-4, 0, 0],
      color: '#10B981',
      technologies: [
        'React 19',
        'Three.js + R3F',
        'Express.js',
        'Firebase',
        'TailwindCSS'
      ]
    },
    {
      name: 'Unity WebGL Alternative',
      position: [0, 0, 0],
      color: '#F59E0B',
      technologies: [
        'Unity WebGL',
        'C# Scripts',
        'PlayFab Backend',
        'Photon Multiplayer',
        'Unity Analytics'
      ]
    },
    {
      name: 'BabylonJS Enhanced',
      position: [4, 0, 0],
      color: '#8B5CF6',
      technologies: [
        'BabylonJS',
        'React Frontend',
        'Node.js + Express',
        'MongoDB',
        'WebXR Support'
      ]
    }
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-r from-gray-900 to-blue-900">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {stacks.map((stack, index) => (
          <group key={index} position={stack.position}>
            {/* Main stack box */}
            <Box args={[2.5, 4, 1]} position={[0, 0, 0]}>
              <meshStandardMaterial color={stack.color} />
            </Box>
            
            {/* Stack title */}
            <Text
              position={[0, 2.5, 0.6]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
            >
              {stack.name}
            </Text>
            
            {/* Technology items */}
            {stack.technologies.map((tech, techIndex) => (
              <group key={techIndex} position={[0, 1.5 - techIndex * 0.7, 0]}>
                <Box args={[2, 0.5, 0.8]} position={[0, 0, 0]}>
                  <meshStandardMaterial color={stack.color} opacity={0.8} transparent />
                </Box>
                <Text
                  position={[0, 0, 0.5]}
                  fontSize={0.15}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {tech}
                </Text>
              </group>
            ))}
          </group>
        ))}
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold mb-2">Technology Stack Comparison</h1>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Recommended (Current Enhanced)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Unity WebGL Alternative</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
            <span>BabylonJS Enhanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Gamification Features Wireframe
 * Shows the recommended gamification elements layout
 */
export function GamificationWireframe() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Gamified 3D LMS Interface Wireframe
        </h1>
        
        {/* Header with navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-blue-600">Windgap Academy</div>
            <div className="flex space-x-4">
              <div className="px-4 py-2 bg-blue-100 rounded">3D World</div>
              <div className="px-4 py-2 bg-green-100 rounded">Games</div>
              <div className="px-4 py-2 bg-purple-100 rounded">Progress</div>
              <div className="px-4 py-2 bg-orange-100 rounded">Profile</div>
            </div>
          </div>
        </div>
        
        {/* Main layout */}
        <div className="grid grid-cols-4 gap-6">
          {/* 3D Viewport */}
          <div className="col-span-3 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 text-white min-h-96">
            <h2 className="text-xl font-semibold mb-4">3D Learning Environment</h2>
            <div className="border-2 border-dashed border-white border-opacity-50 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div>Interactive 3D World</div>
                <div className="text-sm opacity-75 mt-1">(Three.js + React Three Fiber)</div>
              </div>
            </div>
            
            {/* 3D Controls */}
            <div className="mt-4 flex space-x-2">
              <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm">Reset View</button>
              <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm">Fullscreen</button>
              <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm">Settings</button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Panel */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Learning Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level 5</span>
                  <span>2,450 XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <div className="text-xs text-gray-600">750 XP to next level</div>
              </div>
            </div>
            
            {/* Badge Collection */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Achievements</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">🏆</div>
                <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center text-2xl">⭐</div>
                <div className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🎯</div>
                <div className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center text-2xl">💎</div>
                <div className="aspect-square bg-red-100 rounded-lg flex items-center justify-center text-2xl">🔥</div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-lg">+</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Start New Game
                </button>
                <button className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  Continue Learning
                </button>
                <button className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                  Join Multiplayer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Game Modules */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">🔢</div>
            <h3 className="font-semibold text-gray-800 mb-2">Numeracy Games</h3>
            <p className="text-sm text-gray-600 mb-4">Practice math skills in 3D environments</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Launch Game
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Literacy Games</h3>
            <p className="text-sm text-gray-600 mb-4">Interactive reading and writing activities</p>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              Launch Game
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
            <p className="text-sm text-gray-600 mb-4">Social skills and communication practice</p>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
              Launch Game
            </button>
          </div>
        </div>
        
        {/* Accessibility Features Note */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">Accessibility Features</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Full keyboard navigation support</li>
            <li>• Screen reader compatible with ARIA labels</li>
            <li>• High contrast mode and dyslexia-friendly fonts</li>
            <li>• Adjustable text size and UI scaling</li>
            <li>• Voice commands and audio descriptions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default {
  ArchitectureVisualization,
  TechStackComparison,
  GamificationWireframe
};
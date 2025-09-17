import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CurriculumBuilderWithBlender - 3D Curriculum Building Interface
 * 
 * This component provides a 3D interface for building and editing curriculum
 * content using Blender-style 3D interactions and React Three Fiber.
 */

interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  connections: string[];
  type: 'lesson' | 'quiz' | 'project' | 'assessment';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

interface CurriculumBuilderProps {
  modules?: CurriculumModule[];
  onModuleUpdate?: (modules: CurriculumModule[]) => void;
  onModuleSelect?: (module: CurriculumModule) => void;
  editable?: boolean;
}

/**
 * 3D Module Node Component
 * Represents individual curriculum modules in 3D space
 */
function ModuleNode({ 
  module, 
  selected, 
  onSelect, 
  onPositionChange 
}: {
  module: CurriculumModule;
  selected: boolean;
  onSelect: (module: CurriculumModule) => void;
  onPositionChange: (id: string, position: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation for non-dragged items
      if (!dragging) {
        meshRef.current.position.y = module.position[1] + Math.sin(state.clock.elapsedTime + module.position[0]) * 0.1;
      }
      
      // Scale animation when hovered
      const targetScale = hovered || selected ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const moduleColor = useMemo(() => {
    const colors = {
      lesson: '#4299e1',
      quiz: '#f56565',
      project: '#48bb78',
      assessment: '#9f7aea'
    };
    return colors[module.type] || '#a0aec0';
  }, [module.type]);

  const difficultySize = useMemo(() => {
    const sizes = {
      beginner: 1,
      intermediate: 1.3,
      advanced: 1.6
    };
    return sizes[module.difficulty] || 1;
  }, [module.difficulty]);

  const handlePointerDown = useCallback((event: THREE.Event) => {
    event.stopPropagation();
    setDragging(true);
    onSelect(module);
  }, [module, onSelect]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handlePointerMove = useCallback((event: THREE.Event) => {
    if (dragging && meshRef.current) {
      const newPosition: [number, number, number] = [
        event.point.x,
        event.point.y,
        event.point.z
      ];
      meshRef.current.position.set(...newPosition);
      onPositionChange(module.id, newPosition);
    }
  }, [dragging, module.id, onPositionChange]);

  return (
    <group position={module.position}>
      <Sphere
        ref={meshRef}
        args={[difficultySize, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      >
        <meshStandardMaterial
          color={moduleColor}
          transparent
          opacity={hovered ? 0.8 : 0.6}
          emissive={selected ? moduleColor : '#000000'}
          emissiveIntensity={selected ? 0.2 : 0}
        />
      </Sphere>
      
      {/* Module title */}
      <Text
        position={[0, difficultySize + 1, 0]}
        fontSize={0.5}
        color={moduleColor}
        anchorX="center"
        anchorY="bottom"
        maxWidth={5}
      >
        {module.title}
      </Text>
      
      {/* Module type indicator */}
      <Text
        position={[0, -difficultySize - 0.5, 0]}
        fontSize={0.3}
        color="#a0aec0"
        anchorX="center"
        anchorY="top"
      >
        {module.type.toUpperCase()}
      </Text>
      
      {/* Difficulty indicator */}
      <Text
        position={[0, -difficultySize - 1, 0]}
        fontSize={0.25}
        color="#718096"
        anchorX="center"
        anchorY="top"
      >
        {module.difficulty} • {module.estimatedTime}min
      </Text>
    </group>
  );
}

/**
 * Connection Line Component
 * Shows relationships between curriculum modules
 */
function ModuleConnection({ 
  fromPosition, 
  toPosition, 
  active = false 
}: {
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  active?: boolean;
}) {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...fromPosition),
      new THREE.Vector3(...toPosition)
    ];
  }, [fromPosition, toPosition]);

  useFrame((state) => {
    if (lineRef.current && active) {
      // Animate active connections
      const opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      // Note: In a real implementation, you'd need to access the material
    }
  });

  return (
    <line>
      <bufferGeometry ref={lineRef}>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={active ? "#ffd700" : "#4a5568"}
        transparent
        opacity={active ? 0.8 : 0.4}
        linewidth={active ? 3 : 1}
      />
    </line>
  );
}

/**
 * Curriculum Grid Component
 * Provides visual reference grid for positioning modules
 */
function CurriculumGrid({ size = 20, divisions = 10 }) {
  return (
    <>
      <gridHelper
        args={[size, divisions, "#4a5568", "#2d3748"]}
        position={[0, -0.1, 0]}
      />
      <axesHelper args={[3]} />
    </>
  );
}

/**
 * Module Properties Panel
 * 3D overlay showing selected module details
 */
function ModulePropertiesPanel({ 
  module, 
  position 
}: {
  module: CurriculumModule | null;
  position: [number, number, number];
}) {
  if (!module) return null;

  return (
    <group position={position}>
      <Box args={[4, 3, 0.1]}>
        <meshStandardMaterial color="#2d3748" transparent opacity={0.9} />
      </Box>
      
      <Text
        position={[0, 1, 0.1]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
      >
        {module.title}
      </Text>
      
      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.25}
        color="#a0aec0"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
      >
        {module.description}
      </Text>
      
      <Text
        position={[0, -0.5, 0.1]}
        fontSize={0.2}
        color="#68d391"
        anchorX="center"
        anchorY="middle"
      >
        Type: {module.type} | Difficulty: {module.difficulty}
      </Text>
      
      <Text
        position={[0, -0.9, 0.1]}
        fontSize={0.2}
        color="#68d391"
        anchorX="center"
        anchorY="middle"
      >
        Estimated Time: {module.estimatedTime} minutes
      </Text>
    </group>
  );
}

/**
 * Main Curriculum Builder Component
 */
export function CurriculumBuilderWithBlender({
  modules = [],
  onModuleUpdate,
  onModuleSelect,
  editable = true
}: CurriculumBuilderProps) {
  const [currentModules, setCurrentModules] = useState<CurriculumModule[]>(modules);
  const [selectedModule, setSelectedModule] = useState<CurriculumModule | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([10, 10, 10]);

  const handleModuleSelect = useCallback((module: CurriculumModule) => {
    setSelectedModule(module);
    onModuleSelect?.(module);
  }, [onModuleSelect]);

  const handleModulePositionChange = useCallback((id: string, position: [number, number, number]) => {
    if (!editable) return;
    
    setCurrentModules(prev => {
      const updated = prev.map(module =>
        module.id === id ? { ...module, position } : module
      );
      onModuleUpdate?.(updated);
      return updated;
    });
  }, [editable, onModuleUpdate]);

  const moduleConnections = useMemo(() => {
    const connections: Array<{
      from: [number, number, number];
      to: [number, number, number];
      active: boolean;
    }> = [];

    currentModules.forEach(module => {
      module.connections.forEach(connectionId => {
        const targetModule = currentModules.find(m => m.id === connectionId);
        if (targetModule) {
          connections.push({
            from: module.position,
            to: targetModule.position,
            active: selectedModule?.id === module.id || selectedModule?.id === targetModule.id
          });
        }
      });
    });

    return connections;
  }, [currentModules, selectedModule]);

  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} color="#4299e1" />
        
        {/* Environment and grid */}
        <Environment preset="night" />
        <CurriculumGrid size={30} divisions={15} />
        
        {/* Module nodes */}
        {currentModules.map(module => (
          <ModuleNode
            key={module.id}
            module={module}
            selected={selectedModule?.id === module.id}
            onSelect={handleModuleSelect}
            onPositionChange={handleModulePositionChange}
          />
        ))}
        
        {/* Module connections */}
        {moduleConnections.map((connection, index) => (
          <ModuleConnection
            key={index}
            fromPosition={connection.from}
            toPosition={connection.to}
            active={connection.active}
          />
        ))}
        
        {/* Properties panel */}
        {selectedModule && (
          <ModulePropertiesPanel
            module={selectedModule}
            position={[8, 3, 0]}
          />
        )}
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* 2D UI Overlay */}
      <div className="absolute top-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">Curriculum Builder</h2>
        <div className="text-sm text-gray-300">
          <p>Modules: {currentModules.length}</p>
          <p>Connections: {moduleConnections.length}</p>
          {selectedModule && (
            <p className="mt-2 text-yellow-400">
              Selected: {selectedModule.title}
            </p>
          )}
        </div>
      </div>
      
      {/* Controls panel */}
      <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <h3 className="text-md font-bold mb-2">Controls</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Click to select modules</p>
          <p>• Drag to move modules</p>
          <p>• Mouse wheel to zoom</p>
          <p>• Right-click + drag to rotate</p>
          <p>• Middle-click + drag to pan</p>
        </div>
      </div>
    </div>
  );
}

export default CurriculumBuilderWithBlender;
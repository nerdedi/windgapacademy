/**
 * Architecture Wireframes - React Three Fiber Components
 * 
 * This file contains wireframe components and architectural patterns for
 * building 3D learning environments in Windgap Academy using React Three Fiber.
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Box, 
  Sphere, 
  Plane,
  useGLTF, 
  Environment,
  PerspectiveCamera,
  Html,
  Line,
  Points,
  Edges
} from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// 🏫 Learning Environment Wireframes
// ============================================================================

/**
 * Virtual Campus Layout Wireframe
 * Main campus structure with buildings and navigation paths
 */
export function CampusLayoutWireframe({ buildings = [], paths = [] }) {
  return (
    <group>
      {/* Ground plane wireframe */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshBasicMaterial color="#2a4a3a" wireframe transparent opacity={0.3} />
      </Plane>
      
      {/* Grid overlay */}
      <gridHelper args={[100, 20, "#4a7c59", "#4a7c59"]} position={[0, 0, 0]} />
      
      {/* Building wireframes */}
      {buildings.map((building, index) => (
        <BuildingWireframe
          key={index}
          position={building.position}
          size={building.size}
          type={building.type}
          label={building.name}
        />
      ))}
      
      {/* Navigation paths */}
      {paths.map((path, index) => (
        <PathWireframe
          key={index}
          points={path.points}
          color={path.color || "#ffd700"}
        />
      ))}
      
      {/* Compass rose */}
      <CompassWireframe position={[40, 1, 40]} />
    </group>
  );
}

/**
 * Individual Building Wireframe
 * Represents different types of learning spaces
 */
function BuildingWireframe({ position, size, type, label }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const buildingColor = useMemo(() => {
    const colors = {
      classroom: "#4299e1",
      library: "#9f7aea",
      lab: "#f56565",
      office: "#48bb78",
      cafeteria: "#ed8936"
    };
    return colors[type] || "#a0aec0";
  }, [type]);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={size}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial 
          color={buildingColor} 
          wireframe 
          transparent 
          opacity={hovered ? 0.8 : 0.5} 
        />
      </Box>
      
      {/* Building edges for better visibility */}
      <Box args={size}>
        <Edges color={buildingColor} />
      </Box>
      
      {/* Building label */}
      <Text
        position={[0, size[1] / 2 + 1, 0]}
        fontSize={0.8}
        color={buildingColor}
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </Text>
      
      {/* Type indicator */}
      <Text
        position={[0, size[1] / 2 + 0.3, 0]}
        fontSize={0.4}
        color="#a0aec0"
        anchorX="center"
        anchorY="bottom"
      >
        {type.toUpperCase()}
      </Text>
    </group>
  );
}

/**
 * Navigation Path Wireframe
 * Shows connections between different areas
 */
function PathWireframe({ points, color = "#ffd700" }) {
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    
    points.forEach((point, index) => {
      positions[index * 3] = point[0];
      positions[index * 3 + 1] = point[1];
      positions[index * 3 + 2] = point[2];
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

/**
 * Compass Navigation Wireframe
 * Helps users orient themselves in 3D space
 */
function CompassWireframe({ position }) {
  return (
    <group position={position}>
      {/* North arrow */}
      <Line
        points={[[0, 0, 0], [0, 0, 2]]}
        color="#ff4757"
        lineWidth={3}
      />
      <Text
        position={[0, 0.5, 2.5]}
        fontSize={0.5}
        color="#ff4757"
        anchorX="center"
      >
        N
      </Text>
      
      {/* East arrow */}
      <Line
        points={[[0, 0, 0], [2, 0, 0]]}
        color="#2ed573"
        lineWidth={2}
      />
      <Text
        position={[2.5, 0.5, 0]}
        fontSize={0.4}
        color="#2ed573"
        anchorX="center"
      >
        E
      </Text>
      
      {/* Compass circle */}
      <Sphere args={[0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffa502" />
      </Sphere>
    </group>
  );
}

// ============================================================================
// 🎮 Interactive Learning Spaces
// ============================================================================

/**
 * Classroom Layout Wireframe
 * Interactive classroom with seating and teaching areas
 */
export function ClassroomWireframe({ capacity = 30, layout = "traditional" }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [teacherPosition, setTeacherPosition] = useState([0, 0, -8]);

  const seatLayout = useMemo(() => {
    const seats = [];
    
    switch (layout) {
      case "traditional":
        // Rows of desks facing forward
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 5; col++) {
            if (seats.length < capacity) {
              seats.push({
                id: `seat-${row}-${col}`,
                position: [(col - 2) * 2, 0, row * 2],
                rotation: [0, 0, 0]
              });
            }
          }
        }
        break;
        
      case "collaborative":
        // Circular groups
        const groupCount = Math.ceil(capacity / 6);
        for (let group = 0; group < groupCount; group++) {
          const centerX = (group % 3 - 1) * 6;
          const centerZ = Math.floor(group / 3) * 6;
          
          for (let seat = 0; seat < 6 && seats.length < capacity; seat++) {
            const angle = (seat / 6) * Math.PI * 2;
            seats.push({
              id: `seat-${group}-${seat}`,
              position: [
                centerX + Math.cos(angle) * 2,
                0,
                centerZ + Math.sin(angle) * 2
              ],
              rotation: [0, angle + Math.PI, 0]
            });
          }
        }
        break;
        
      case "amphitheater":
        // Curved seating facing center
        const rowCount = Math.ceil(Math.sqrt(capacity));
        for (let row = 0; row < rowCount; row++) {
          const seatsInRow = Math.min(capacity - seats.length, Math.floor(capacity / rowCount));
          const radius = 3 + row * 1.5;
          
          for (let seat = 0; seat < seatsInRow; seat++) {
            const angle = ((seat / seatsInRow) - 0.5) * Math.PI;
            seats.push({
              id: `seat-${row}-${seat}`,
              position: [
                Math.sin(angle) * radius,
                row * 0.3,
                Math.cos(angle) * radius
              ],
              rotation: [0, -angle, 0]
            });
          }
        }
        break;
    }
    
    return seats;
  }, [capacity, layout]);

  return (
    <group>
      {/* Floor */}
      <Plane args={[20, 15]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshBasicMaterial color="#f7fafc" wireframe transparent opacity={0.2} />
      </Plane>
      
      {/* Teaching area */}
      <TeachingAreaWireframe position={teacherPosition} />
      
      {/* Student seats */}
      {seatLayout.map((seat) => (
        <StudentSeatWireframe
          key={seat.id}
          position={seat.position}
          rotation={seat.rotation}
          selected={selectedSeat === seat.id}
          onClick={() => setSelectedSeat(seat.id)}
        />
      ))}
      
      {/* Layout label */}
      <Text
        position={[0, 3, 8]}
        fontSize={0.8}
        color="#4a5568"
        anchorX="center"
      >
        {layout.toUpperCase()} LAYOUT ({capacity} seats)
      </Text>
    </group>
  );
}

/**
 * Teaching Area Wireframe
 * Interactive whiteboard and teacher space
 */
function TeachingAreaWireframe({ position }) {
  return (
    <group position={position}>
      {/* Whiteboard */}
      <Box args={[6, 3, 0.1]} position={[0, 1.5, 0]}>
        <meshBasicMaterial color="#ffffff" wireframe />
      </Box>
      <Edges>
        <boxGeometry args={[6, 3, 0.1]} />
        <lineBasicMaterial color="#2d3748" />
      </Edges>
      
      {/* Teacher's desk */}
      <Box args={[2, 0.8, 1]} position={[0, 0.4, 1.5]}>
        <meshBasicMaterial color="#8b4513" wireframe transparent opacity={0.6} />
      </Box>
      
      {/* Podium */}
      <Box args={[0.8, 1.2, 0.6]} position={[2, 0.6, 1.5]}>
        <meshBasicMaterial color="#4a5568" wireframe transparent opacity={0.7} />
      </Box>
    </group>
  );
}

/**
 * Student Seat Wireframe
 * Individual desk and chair combination
 */
function StudentSeatWireframe({ position, rotation, selected, onClick }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current && selected) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      onClick={onClick}
    >
      {/* Chair */}
      <Box args={[0.5, 0.8, 0.5]} position={[0, 0.4, 0.5]}>
        <meshBasicMaterial 
          color={selected ? "#ffd700" : "#4a5568"} 
          wireframe 
          transparent 
          opacity={selected ? 0.8 : 0.4} 
        />
      </Box>
      
      {/* Desk */}
      <Box args={[1, 0.1, 0.6]} position={[0, 0.8, 0]}>
        <meshBasicMaterial 
          color={selected ? "#ff9800" : "#8b4513"} 
          wireframe 
          transparent 
          opacity={selected ? 0.8 : 0.4} 
        />
      </Box>
      
      {/* Seat selection indicator */}
      {selected && (
        <Sphere args={[0.1]} position={[0, 1.2, 0]}>
          <meshBasicMaterial color="#ffd700" />
        </Sphere>
      )}
    </group>
  );
}

// ============================================================================
// 🎯 Game Environment Wireframes
// ============================================================================

/**
 * Game Level Wireframe
 * Platform-style game environment structure
 */
export function GameLevelWireframe({ platforms = [], collectibles = [], obstacles = [] }) {
  return (
    <group>
      {/* Skybox wireframe */}
      <SkyboxWireframe />
      
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <PlatformWireframe
          key={index}
          position={platform.position}
          size={platform.size}
          type={platform.type}
        />
      ))}
      
      {/* Collectible items */}
      {collectibles.map((item, index) => (
        <CollectibleWireframe
          key={index}
          position={item.position}
          type={item.type}
          value={item.value}
        />
      ))}
      
      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <ObstacleWireframe
          key={index}
          position={obstacle.position}
          type={obstacle.type}
        />
      ))}
      
      {/* Start/End markers */}
      <StartEndWireframe 
        startPosition={[-15, 0, 0]} 
        endPosition={[15, 0, 0]} 
      />
    </group>
  );
}

/**
 * Platform Wireframe
 * Solid ground or moving platforms in game levels
 */
function PlatformWireframe({ position, size, type = "static" }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && type === "moving") {
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime) * 2;
    }
  });

  const platformColor = type === "moving" ? "#ed8936" : "#48bb78";

  return (
    <group position={type === "moving" ? [0, position[1], position[2]] : position}>
      <Box ref={meshRef} args={size} position={type === "moving" ? [position[0], 0, 0] : [0, 0, 0]}>
        <meshBasicMaterial color={platformColor} wireframe transparent opacity={0.6} />
      </Box>
      <Box args={size} position={type === "moving" ? [position[0], 0, 0] : [0, 0, 0]}>
        <Edges color={platformColor} />
      </Box>
    </group>
  );
}

/**
 * Collectible Item Wireframe
 * Points, power-ups, and learning objectives
 */
function CollectibleWireframe({ position, type, value }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const itemConfig = {
    coin: { color: "#ffd700", size: 0.3, shape: "sphere" },
    gem: { color: "#9f7aea", size: 0.4, shape: "box" },
    book: { color: "#4299e1", size: [0.3, 0.4, 0.1], shape: "box" },
    key: { color: "#f56565", size: 0.2, shape: "sphere" }
  };

  const config = itemConfig[type] || itemConfig.coin;

  return (
    <group position={position}>
      {config.shape === "sphere" ? (
        <Sphere ref={meshRef} args={[config.size]}>
          <meshBasicMaterial color={config.color} wireframe />
        </Sphere>
      ) : (
        <Box ref={meshRef} args={Array.isArray(config.size) ? config.size : [config.size, config.size, config.size]}>
          <meshBasicMaterial color={config.color} wireframe />
        </Box>
      )}
      
      {/* Value indicator */}
      <Text
        position={[0, config.size + 0.5, 0]}
        fontSize={0.3}
        color={config.color}
        anchorX="center"
      >
        {value}
      </Text>
    </group>
  );
}

/**
 * Obstacle Wireframe
 * Hazards and challenges in game levels
 */
function ObstacleWireframe({ position, type }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      switch (type) {
        case "spinning":
          meshRef.current.rotation.y = state.clock.elapsedTime * 2;
          break;
        case "bouncing":
          meshRef.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 2;
          break;
      }
    }
  });

  const obstacleConfig = {
    spike: { color: "#f56565", size: [0.5, 2, 0.5] },
    saw: { color: "#e53e3e", size: 1 },
    wall: { color: "#4a5568", size: [0.5, 3, 2] }
  };

  const config = obstacleConfig[type] || obstacleConfig.spike;

  return (
    <group position={position}>
      {type === "saw" ? (
        <Sphere ref={meshRef} args={[config.size]}>
          <meshBasicMaterial color={config.color} wireframe />
        </Sphere>
      ) : (
        <Box ref={meshRef} args={config.size}>
          <meshBasicMaterial color={config.color} wireframe />
        </Box>
      )}
      
      {/* Danger indicator */}
      <Text
        position={[0, (Array.isArray(config.size) ? config.size[1] : config.size) + 0.5, 0]}
        fontSize={0.4}
        color="#ff0000"
        anchorX="center"
      >
        ⚠
      </Text>
    </group>
  );
}

/**
 * Start and End Markers
 * Level boundaries and goals
 */
function StartEndWireframe({ startPosition, endPosition }) {
  return (
    <>
      {/* Start marker */}
      <group position={startPosition}>
        <Box args={[1, 3, 1]}>
          <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.7} />
        </Box>
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#22c55e"
          anchorX="center"
        >
          START
        </Text>
      </group>
      
      {/* End marker */}
      <group position={endPosition}>
        <Box args={[1, 3, 1]}>
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.7} />
        </Box>
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#3b82f6"
          anchorX="center"
        >
          FINISH
        </Text>
      </group>
    </>
  );
}

/**
 * Skybox Wireframe
 * Environmental boundaries
 */
function SkyboxWireframe() {
  return (
    <Box args={[50, 30, 50]} position={[0, 15, 0]}>
      <meshBasicMaterial color="#87ceeb" wireframe transparent opacity={0.1} side={THREE.BackSide} />
    </Box>
  );
}

// ============================================================================
// 🎨 UI Overlay Wireframes
// ============================================================================

/**
 * HUD (Heads-Up Display) Wireframe
 * Game interface elements overlaid on 3D scene
 */
export function HUDWireframe({ score = 0, health = 100, time = 300, level = 1 }) {
  return (
    <>
      {/* Score display */}
      <Html position={[-8, 4, 0]} transform occlude>
        <div className="bg-black bg-opacity-50 text-white p-2 rounded border border-white">
          <div className="text-sm">SCORE</div>
          <div className="text-xl font-bold">{score.toLocaleString()}</div>
        </div>
      </Html>
      
      {/* Health bar */}
      <Html position={[0, 4, 0]} transform occlude>
        <div className="bg-black bg-opacity-50 text-white p-2 rounded border border-white">
          <div className="text-sm">HEALTH</div>
          <div className="w-32 h-2 bg-gray-600 rounded">
            <div 
              className="h-full bg-green-500 rounded transition-all"
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      </Html>
      
      {/* Timer */}
      <Html position={[8, 4, 0]} transform occlude>
        <div className="bg-black bg-opacity-50 text-white p-2 rounded border border-white">
          <div className="text-sm">TIME</div>
          <div className="text-xl font-bold">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </Html>
      
      {/* Level indicator */}
      <Html position={[0, -4, 0]} transform occlude>
        <div className="bg-black bg-opacity-50 text-white p-2 rounded border border-white">
          <div className="text-lg font-bold">LEVEL {level}</div>
        </div>
      </Html>
    </>
  );
}

/**
 * Menu System Wireframe
 * 3D space navigation and selection menus
 */
export function MenuSystemWireframe({ items = [], onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef();

  useFrame((state) => {
    if (menuRef.current) {
      menuRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={menuRef}>
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = (index - items.length / 2) * 0.5;

        return (
          <MenuItemWireframe
            key={index}
            position={[x, y, z]}
            rotation={[0, -angle, 0]}
            label={item.label}
            icon={item.icon}
            selected={selectedIndex === index}
            onClick={() => {
              setSelectedIndex(index);
              onSelect?.(item);
            }}
          />
        );
      })}
      
      {/* Center hub */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#4a5568" wireframe />
      </Sphere>
    </group>
  );
}

/**
 * Individual Menu Item Wireframe
 * Selectable options in 3D menu
 */
function MenuItemWireframe({ position, rotation, label, icon, selected, onClick }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && selected) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <Box ref={meshRef} args={[1.5, 1, 0.2]}>
        <meshBasicMaterial 
          color={selected ? "#ffd700" : "#4a5568"} 
          wireframe 
          transparent 
          opacity={selected ? 0.8 : 0.5} 
        />
      </Box>
      
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.3}
        color={selected ? "#ffd700" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {icon} {label}
      </Text>
    </group>
  );
}

// ============================================================================
// 🔧 Utility Wireframe Components
// ============================================================================

/**
 * Debug Grid Wireframe
 * Coordinate system visualization for development
 */
export function DebugGridWireframe({ size = 20, divisions = 20 }) {
  return (
    <>
      <gridHelper args={[size, divisions, "#ff0000", "#808080"]} />
      <axesHelper args={[5]} />
      
      {/* Coordinate labels */}
      <Text position={[6, 0, 0]} fontSize={0.5} color="#ff0000">X</Text>
      <Text position={[0, 6, 0]} fontSize={0.5} color="#00ff00">Y</Text>
      <Text position={[0, 0, 6]} fontSize={0.5} color="#0000ff">Z</Text>
    </>
  );
}

/**
 * Performance Monitor Wireframe
 * Visual representation of system performance
 */
export function PerformanceMonitorWireframe({ fps = 60, drawCalls = 100, triangles = 10000 }) {
  const fpsColor = fps > 50 ? "#22c55e" : fps > 30 ? "#f59e0b" : "#ef4444";
  
  return (
    <Html position={[-9, 5, 5]} transform occlude>
      <div className="bg-black bg-opacity-75 text-white p-3 rounded border border-gray-500 font-mono text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>FPS:</div>
          <div style={{ color: fpsColor }}>{fps}</div>
          
          <div>Draw Calls:</div>
          <div className="text-yellow-400">{drawCalls}</div>
          
          <div>Triangles:</div>
          <div className="text-blue-400">{triangles.toLocaleString()}</div>
        </div>
      </div>
    </Html>
  );
}

/**
 * Bounding Box Wireframe
 * Visual representation of object boundaries
 */
export function BoundingBoxWireframe({ target, color = "#00ff00" }) {
  const [box, setBox] = useState(null);
  
  useEffect(() => {
    if (target?.current) {
      const boundingBox = new THREE.Box3().setFromObject(target.current);
      setBox(boundingBox);
    }
  }, [target]);

  if (!box) return null;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  return (
    <Box args={[size.x, size.y, size.z]} position={[center.x, center.y, center.z]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
    </Box>
  );
}

// ============================================================================
// 📦 Complete Scene Examples
// ============================================================================

/**
 * Complete Learning Environment Scene
 * Combines multiple wireframe components into a full scene
 */
export function CompleteLearningScene() {
  const [currentView, setCurrentView] = useState("campus");
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const campusData = {
    buildings: [
      { name: "Library", position: [-10, 2, -10], size: [4, 4, 6], type: "library" },
      { name: "Science Lab", position: [10, 1.5, -10], size: [6, 3, 4], type: "lab" },
      { name: "Classroom A", position: [-10, 1, 10], size: [8, 2, 6], type: "classroom" },
      { name: "Cafeteria", position: [10, 1, 10], size: [6, 2, 8], type: "cafeteria" },
      { name: "Admin Office", position: [0, 2, 0], size: [4, 4, 4], type: "office" }
    ],
    paths: [
      { points: [[-10, 0.1, -10], [0, 0.1, 0], [10, 0.1, 10]], color: "#ffd700" },
      { points: [[10, 0.1, -10], [0, 0.1, 0], [-10, 0.1, 10]], color: "#ffd700" }
    ]
  };

  return (
    <Canvas camera={{ position: [20, 15, 20], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Main scene content based on current view */}
      {currentView === "campus" && (
        <CampusLayoutWireframe 
          buildings={campusData.buildings}
          paths={campusData.paths}
        />
      )}
      
      {currentView === "classroom" && (
        <ClassroomWireframe capacity={24} layout="collaborative" />
      )}
      
      {currentView === "game" && (
        <GameLevelWireframe
          platforms={[
            { position: [-10, 0, 0], size: [3, 1, 3], type: "static" },
            { position: [0, 2, 0], size: [2, 1, 2], type: "moving" },
            { position: [10, 4, 0], size: [3, 1, 3], type: "static" }
          ]}
          collectibles={[
            { position: [-5, 2, 0], type: "coin", value: 100 },
            { position: [5, 6, 0], type: "gem", value: 500 }
          ]}
          obstacles={[
            { position: [0, 0, -5], type: "spike" },
            { position: [7, 1, 0], type: "saw" }
          ]}
        />
      )}
      
      {/* UI overlays */}
      <HUDWireframe score={12500} health={85} time={245} level={3} />
      
      {/* Development tools */}
      <DebugGridWireframe size={30} divisions={30} />
      <PerformanceMonitorWireframe fps={58} drawCalls={45} triangles={8500} />
      
      {/* Navigation menu */}
      <MenuSystemWireframe
        items={[
          { label: "Campus", icon: "🏫" },
          { label: "Classroom", icon: "📚" },
          { label: "Game", icon: "🎮" },
          { label: "Settings", icon: "⚙️" }
        ]}
        onSelect={(item) => setCurrentView(item.label.toLowerCase())}
      />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxDistance={50}
        minDistance={5}
      />
      
      {/* Environment */}
      <Environment preset="sunset" />
    </Canvas>
  );
}

// Export all wireframe components
export {
  CampusLayoutWireframe,
  ClassroomWireframe,
  GameLevelWireframe,
  HUDWireframe,
  MenuSystemWireframe,
  DebugGridWireframe,
  PerformanceMonitorWireframe,
  BoundingBoxWireframe
};
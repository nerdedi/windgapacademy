import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useCallback } from "react";

import BackToTopButton from "./BackToTopButton";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";
// You can import Drei helpers for lights, controls, etc.
// import { OrbitControls, Environment } from '@react-three/drei';

// Simple 3D Building logic
function Building({ position, color, label, onClick }) {
  return (
    <group position={position}>
      <mesh onClick={onClick} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html center>
        <div
          style={{
            pointerEvents: "none",
            fontWeight: "bold",
            color: "#222",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 14,
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

// Collectible item logic
function _handleCollectibleItem(item) {
  logEvent("Collectible item acquired", { item });
  showFeedbackModal(`You collected: ${item}`);
}

function showFeedbackModal(message) {
  const modal = document.createElement("div");
  modal.style =
    "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#fff;border:2px solid #1976d2;border-radius:12px;padding:24px;z-index:1001;min-width:320px;";
  modal.innerHTML = `<h2>Feedback</h2><p>${message}</p><button id='close-feedback'>Close</button>`;
  document.body.appendChild(modal);
  document.getElementById("close-feedback").onclick = () => modal.remove();
}
function Collectible({ position, visible, label }) {
  if (!visible) return null;
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <Html center>
        <div
          style={{
            pointerEvents: "none",
            color: "#222",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 12,
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

// Landscape features
function Path({ start, end }) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  return (
    <mesh
      position={[(start[0] + end[0]) / 2, 0.05, (start[2] + end[2]) / 2]}
      rotation={[0, -angle, 0]}
    >
      <cylinderGeometry args={[0.2, 0.2, length, 16]} />
      <meshStandardMaterial color="#bca16b" />
    </mesh>
  );
}

function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
}

function Water({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#4fc3f7" transparent opacity={0.7} />
    </mesh>
  );
}

const buildings = [
  { label: "Buy", position: [-6, 1, -4], color: "#4caf50", route: "/buy" },
  { label: "Sell", position: [6, 1, -4], color: "#f44336", route: "/sell" },
  { label: "Exchange", position: [0, 1, 7], color: "#2196f3", route: "/exchange" },
  { label: "ClubHouse", position: [0, 1, -8], color: "#ff9800", route: "/clubhouse" },
  { label: "Mini-Game", position: [8, 1, 6], color: "#9c27b0", route: "/minigame" },
];

const trees = [
  [-8, 0, 0],
  [8, 0, 0],
  [0, 0, 8],
  [0, 0, -8],
  [-5, 0, 5],
  [5, 0, -5],
];

const waterAreas = [
  { position: [0, -0.5, 12], size: [8, 0.2, 6] },
  { position: [-10, -0.5, -10], size: [6, 0.2, 4] },
];

const paths = [
  { start: [0, 0, 0], end: [-6, 0, -4] },
  { start: [0, 0, 0], end: [6, 0, -4] },
  { start: [0, 0, 0], end: [0, 0, 7] },
  { start: [0, 0, 0], end: [0, 0, -8] },
  { start: [6, 0, -4], end: [8, 0, 6] },
];

const collectibles = [{ position: [-7, 1.5, -5], label: "Achievement", visible: true }];

const IslandScene = ({ onNavigate }) => {
  const handleBuildingClick = useCallback(
    (route) => {
      if (onNavigate) onNavigate(route);
    },
    [onNavigate],
  );

  return (
    <div
      className="relative island-scene w-full h-[600px] bg-blue-100 rounded-xl shadow-lg"
      role="region"
      aria-label="Island Scene"
    >
      <Spinner show={false} size={32} className="absolute left-1/2 top-1/2" />
      <BackToTopButton />
      <Canvas camera={{ position: [0, 12, 22], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        {/* Island base */}
        <mesh position={[0, -1, 0]} receiveShadow>
          <sphereGeometry args={[9, 32, 32]} />
          <meshStandardMaterial color="#8fd19e" />
        </mesh>
        {/* Water features */}
        {waterAreas.map((w, i) => (
          <Water key={i} {...w} />
        ))}
        {/* Paths */}
        {paths.map((p, i) => (
          <Path key={i} {...p} />
        ))}
        {/* Trees */}
        {trees.map((pos, i) => (
          <Tree key={i} position={pos} />
        ))}
        {/* Buildings with tooltips */}
        {buildings.map((b) => (
          <Tooltip key={b.label} text={`Go to ${b.label}`}>
            <Building
              position={b.position}
              color={b.color}
              label={b.label}
              onClick={() => handleBuildingClick(b.route)}
            />
          </Tooltip>
        ))}
        {/* Collectibles */}
        {collectibles.map((c, i) => (
          <Collectible key={i} {...c} />
        ))}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      {/* Onboarding modal, tooltips, feedback forms, etc. can be rendered here using React */}
    </div>
  );
};

export default IslandScene;

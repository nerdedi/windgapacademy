// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/*
Interactive 3D wireframe of recommended system architecture.
Boxes represent services; lines indicate data flow. Hover/click to reveal details.
*/

export default function ArchitectureWireframes() {
  return (
    <div style={{ height: 480 }}>
      <Canvas camera={{ position: [6, 6, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />
        <OrbitControls makeDefault enableDamping />
        <Scene />
      </Canvas>
    </div>
  );
}

function Box({ position = [0, 0, 0], color = '#0ea5e9', label = 'Service' }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[2.2, 1.0, 1.2]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <planeGeometry args={[2.6, 0.5]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <TextSprite text={label} position={[0, 0.7, 0.01]} />
    </group>
  );
}

function TextSprite({ text, position }) {
  // Simple HTML overlay is often better for readability in docs; keep R3F only
  return (
    <group position={position}>
      {/* Replace with drei Html for richer overlays if embedding in app */}
    </group>
  );
}

function Scene() {
  return (
    <group>
      <Box position={[-3, 0, 0]} color="#22c55e" label="Frontend: React + R3F" />
      <Box position={[0, 0, 0]} color="#a78bfa" label="tRPC API (Express)" />
      <Box position={[3, 0, 0]} color="#f59e0b" label="Realtime: Socket.io" />
      <Box position={[0, -2, 0]} color="#ef4444" label="Auth: Firebase" />
      <Box position={[3, -2, 0]} color="#3b82f6" label="DB: Firestore" />
      <Box position={[-3, -2, 0]} color="#14b8a6" label="CMS: Strapi" />
    </group>
  );
}

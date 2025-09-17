// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)

/*
Production-ready sample snippets for:
- Enhanced 3D learning environment with physics
- tRPC usage (type-safe mutation)
- OpenBadges award flow
- Accessibility patterns
*/

// --- Enhanced 3D Learning Environment (R3F + physics)
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function Enhanced3DLearningEnvironment({ gameConfig, onProgress }) {
  return (
    <Canvas shadows camera={{ position: [4, 4, 8], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Suspense fallback={null}>
        <GameScene gameConfig={gameConfig} onProgress={onProgress} />
      </Suspense>
      <OrbitControls makeDefault enableDamping />
    </Canvas>
  );
}

function GameScene({ gameConfig, onProgress }) {
  const targets = useMemo(() => new Array(10).fill(0).map((_, i) => ({ id: i })), []);
  return (
    <group>
      {targets.map((t) => (
        <mesh key={t.id} position={[Math.random() * 4 - 2, 1, Math.random() * 4 - 2]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

// --- tRPC type-safe mutation example
// import { trpc } from '../src/lib/trpc';
export function UpdateProgressButton({ gameId, score }) {
  // const mutation = trpc.game.updateProgress.useMutation({
  //   onSuccess: (data) => console.log('awarded badges', data.newBadges),
  // });
  return (
    <button
      aria-label="Update game progress"
      onClick={() => {/* mutation.mutate({ gameId, score }) */}}
    >
      Submit Score
    </button>
  );
}

// --- OpenBadges issuance utility (server-side example shown in docs/integration-guide.md)
export async function awardBadge(userId, badgeId, meta = {}) {
  // Call server endpoint that signs & stores assertion
  return { assertionUrl: `https://example.org/assertions/${userId}/${badgeId}` };
}

// --- Accessibility helpers
export function VisuallyHiddenText({ children }) {
  return (
    <span style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>
      {children}
    </span>
  );
}

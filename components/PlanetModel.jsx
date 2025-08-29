import React, { useRef } from 'react';
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// Example: Load a glTF planet model and animate rotation
export default function PlanetModel({ url, position = [0,0,0], scale = 1 }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);

  // Simple rotation animation
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.003;
    }
  });

  return (
    <Tooltip text="Planet Model">
      <group ref={group} position={position} scale={scale}>
        <Spinner show={false} size={24} />
        <primitive object={scene} />
      </group>
    </Tooltip>
  );
}

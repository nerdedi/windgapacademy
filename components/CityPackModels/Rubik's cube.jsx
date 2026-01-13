// Rubik's Cube 3D Model placeholder

// Placeholder model - creates a colorful cube approximation
export function Model(props) {
  return (
    <group {...props} dispose={null}>
      <mesh scale={0.5}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}

// components/ThreeScene.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Box = () => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.x += 0.01));

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box />
    </Canvas>
  );
};

export default ThreeScene;

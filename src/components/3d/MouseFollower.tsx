import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MouseFollower = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Track mouse position
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }
  
  useFrame(() => {
    if (mesh.current) {
      const targetX = mousePosition.current.x * viewport.width * 0.3;
      const targetY = mousePosition.current.y * viewport.height * 0.3;
      
      mesh.current.position.x += (targetX - mesh.current.position.x) * 0.05;
      mesh.current.position.y += (targetY - mesh.current.position.y) * 0.05;
      
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.015;
    }
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, 2]}>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color="white"
        // transparent
        opacity={0.3}
        wireframe
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

export default MouseFollower;

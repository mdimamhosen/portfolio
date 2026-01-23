import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveGrid = () => {
  const meshRef = useRef<THREE.Points>(null);
  
  const { positions, originalPositions } = useMemo(() => {
    const size = 40;
    const segments = 50;
    const positions = new Float32Array(segments * segments * 3);
    const originalPositions = new Float32Array(segments * segments * 3);
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const index = (i * segments + j) * 3;
        const x = (i / segments - 0.5) * size;
        const z = (j / segments - 0.5) * size;
        
        positions[index] = x;
        positions[index + 1] = 0;
        positions[index + 2] = z;
        
        originalPositions[index] = x;
        originalPositions[index + 1] = 0;
        originalPositions[index + 2] = z;
      }
    }
    
    return { positions, originalPositions };
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const positionAttribute = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = originalPositions[i * 3];
        const z = originalPositions[i * 3 + 2];
        
        // Create wave effect
        const wave1 = Math.sin(x * 0.3 + time) * 0.5;
        const wave2 = Math.sin(z * 0.3 + time * 0.8) * 0.5;
        const wave3 = Math.sin((x + z) * 0.2 + time * 1.2) * 0.3;
        
        positionAttribute.setY(i, wave1 + wave2 + wave3);
      }
      
      positionAttribute.needsUpdate = true;
    }
  });
  
  return (
    <points ref={meshRef} position={[0, -8, -15]} rotation={[-Math.PI * 0.3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00d4ff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

export default WaveGrid;

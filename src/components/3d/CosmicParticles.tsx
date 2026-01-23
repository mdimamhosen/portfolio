import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicParticlesProps {
  count?: number;
}

const CosmicParticles = ({ count = 600 }: CosmicParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const actualCount = isMobile ? Math.floor(count / 2) : count;
  
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3);
    const speeds = new Float32Array(actualCount);
    
    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      
      // Distribute in a large sphere
      const radius = 20 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      speeds[i] = 0.1 + Math.random() * 0.3;
    }
    
    return { positions, speeds };
  }, [actualCount]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < actualCount; i++) {
        const i3 = i * 3;
        const speed = speeds[i];
        
        // Gentle floating motion
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        positionAttribute.setX(i, x + Math.sin(time * speed + i) * 0.5);
        positionAttribute.setY(i, y + Math.cos(time * speed * 0.8 + i) * 0.5);
        positionAttribute.setZ(i, z + Math.sin(time * speed * 0.6 + i * 0.5) * 0.5);
      }
      
      positionAttribute.needsUpdate = true;
      
      // Slow rotation
      pointsRef.current.rotation.y = time * 0.01;
    }
  });
  
  return (
    <points ref={pointsRef}>
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
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default CosmicParticles;
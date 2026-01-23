import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DNA = ({ position = [8, 0, -10] as [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const spheres = useMemo(() => {
    const items = [];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const t = i / count * Math.PI * 4;
      const y = (i / count - 0.5) * 15;
      
      items.push({
        position1: [Math.sin(t) * 1.5, y, Math.cos(t) * 1.5] as [number, number, number],
        position2: [Math.sin(t + Math.PI) * 1.5, y, Math.cos(t + Math.PI) * 1.5] as [number, number, number],
        index: i,
      });
    }
    
    return items;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {spheres.map((sphere, i) => (
        <group key={i}>
          <mesh position={sphere.position1}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={sphere.position2}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#9400d3" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Connecting line */}
          {i % 3 === 0 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...sphere.position1, ...sphere.position2])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </line>
          )}
        </group>
      ))}
    </group>
  );
};

export default DNA;

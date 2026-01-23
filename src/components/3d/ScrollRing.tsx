import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ScrollRing = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ringRef.current) {
      ringRef.current.rotation.x = scrollProgress * Math.PI * 4 + time * 0.1;
      ringRef.current.rotation.y = time * 0.2;
      ringRef.current.scale.setScalar(1 + scrollProgress * 0.5);
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -scrollProgress * Math.PI * 3 + time * 0.15;
      ring2Ref.current.rotation.z = time * 0.1;
      ring2Ref.current.scale.setScalar(1.2 + scrollProgress * 0.3);
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = scrollProgress * Math.PI * 5 + time * 0.08;
      ring3Ref.current.rotation.z = -time * 0.12;
      ring3Ref.current.scale.setScalar(0.8 + scrollProgress * 0.7);
    }
  });
  
  return (
    <group position={[0, 0, -5]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="gray" transparent opacity={0.4} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="gray" transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshBasicMaterial color="gray" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export default ScrollRing;

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Enhanced Planet Component with GSAP animations and hover effects
export const Planet = ({ 
  position, 
  size = 1, 
  color = "#ff6b35",
  ringColor = "#ffd700",
  hasRing = false 
}: { 
  position: [number, number, number]; 
  size?: number;
  color?: string;
  ringColor?: string;
  hasRing?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (meshRef.current && clicked) {
      gsap.to(meshRef.current.scale, {
        x: size * 1.5,
        y: size * 1.5,
        z: size * 1.5,
        duration: 0.4,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1
      });
      
      gsap.to(meshRef.current.rotation, {
        y: meshRef.current.rotation.y + Math.PI * 4,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [clicked, size]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.015 : 0.003;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += hovered ? 0.01 : 0.002;
    }
    if (groupRef.current && hovered) {
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.05);
    }
  });
  
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group 
        ref={groupRef} 
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <Trail 
          width={hovered ? 3 : 1.5} 
          length={6} 
          color={new THREE.Color(color)} 
          attenuation={(t) => t * t}
        >
          <mesh 
            ref={meshRef}
            onClick={() => setClicked(!clicked)}
            scale={size}
          >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              color={color}
              metalness={0.4}
              roughness={0.6}
              emissive={color}
              emissiveIntensity={hovered ? 0.4 : 0.15}
            />
          </mesh>
        </Trail>
        
        {hasRing && (
          <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
            <torusGeometry args={[size * 1.8, size * 0.15, 2, 64]} />
            <meshBasicMaterial color={ringColor} transparent opacity={hovered ? 0.9 : 0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
        
        {/* Atmosphere glow */}
        <mesh scale={size * 1.15}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.25 : 0.1} side={THREE.BackSide} />
        </mesh>
        
        <pointLight color={color} intensity={hovered ? 1.5 : 0.5} distance={15} />
        
        {/* Sparkles on hover */}
        {hovered && <Sparkles count={30} scale={size * 3} size={2} speed={0.5} color={color} />}
      </group>
    </Float>
  );
};

// Nebula Cloud with enhanced GSAP
export const NebulaCloud = ({ 
  position, 
  color = "#9b59b6",
  size = 5 
}: { 
  position: [number, number, number];
  color?: string;
  size?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: size * 1.2,
        y: size * 1.2,
        z: size * 1.2,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
      
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 80,
        ease: "none",
        repeat: -1
      });
    }
  }, [size]);
  
  return (
    <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.2}>
      <Sphere 
        ref={meshRef} 
        args={[size, 32, 32]} 
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={hovered ? 0.7 : 0.4}
          speed={hovered ? 2 : 0.8}
          transparent
          opacity={hovered ? 0.25 : 0.12}
        />
      </Sphere>
      {hovered && <Sparkles count={50} scale={size * 2} size={3} speed={1} color={color} />}
    </Float>
  );
};

// Shooting Star with trail
export const ShootingStar = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const triggerStar = () => {
      if (meshRef.current) {
        const startX = (Math.random() - 0.5) * 60;
        const startY = Math.random() * 25 + 15;
        const startZ = -25 - Math.random() * 25;
        
        meshRef.current.position.set(startX, startY, startZ);
        setVisible(true);
        
        gsap.to(meshRef.current.position, {
          x: startX + 40,
          y: startY - 20,
          z: startZ + 15,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => setVisible(false)
        });
        
        gsap.fromTo(meshRef.current.scale,
          { x: 0.5, y: 0.5, z: 0.5 },
          { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, yoyo: true, repeat: 1 }
        );
      }
      
      setTimeout(triggerStar, Math.random() * 4000 + 1500);
    };
    
    const timeout = setTimeout(triggerStar, Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <group>
      <mesh ref={meshRef} visible={visible}>
        <boxGeometry args={[4, 0.04, 0.04]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.95} />
      </mesh>
    </group>
  );
};

// Galaxy Spiral with enhanced interactivity
export const GalaxySpiral = ({ position }: { position: [number, number, number] }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color('#ff6b35');
    const colorOutside = new THREE.Color('#ff6b35').lerp(new THREE.Color('#000000'), 0.8);
    
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 10;
      const spinAngle = radius * 4;
      const branchAngle = (i % 4) * ((Math.PI * 2) / 4);
      
      const randomX = (Math.random() - 0.5) * (radius / 3);
      const randomY = (Math.random() - 0.5) * (radius / 6);
      const randomZ = (Math.random() - 0.5) * (radius / 3);
      
      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 10);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, []);
  
  useEffect(() => {
    if (pointsRef.current) {
      gsap.to(pointsRef.current.rotation, {
        y: Math.PI * 2,
        duration: hovered ? 30 : 80,
        ease: "none",
        repeat: -1
      });
    }
  }, [hovered]);
  
  return (
    <points 
      ref={pointsRef} 
      position={position} 
      rotation={[Math.PI / 4, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={hovered ? 0.08 : 0.05}
        vertexColors
        transparent
        opacity={hovered ? 1 : 0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Asteroid Belt with click interaction
export const AsteroidBelt = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [clicked, setClicked] = useState(false);
  
  const asteroids = useMemo(() => {
    const count = 150;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 14 + (Math.random() - 0.5) * 3;
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 0.8,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.08 + Math.random() * 0.12,
        rotation: Math.random() * Math.PI * 2
      };
    });
  }, []);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: clicked ? 20 : 100,
        ease: "none",
        repeat: -1
      });
    }
  }, [clicked]);
  
  return (
    <group ref={groupRef} position={position} onClick={() => setClicked(!clicked)}>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={i}
          position={asteroid.position}
          rotation={[asteroid.rotation, asteroid.rotation, 0]}
          scale={asteroid.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={clicked ? "#ffd700" : "#8b7355"}
            metalness={0.3}
            roughness={0.8}
            emissive={clicked ? "#ffd700" : "#000000"}
            emissiveIntensity={clicked ? 0.2 : 0}
          />
        </mesh>
      ))}
    </group>
  );
};

// Black Hole with enhanced effects
export const BlackHole = ({ position }: { position: [number, number, number] }) => {
  const diskRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (diskRef.current) {
      gsap.to(diskRef.current.rotation, {
        z: Math.PI * 2,
        duration: hovered ? 3 : 8,
        ease: "none",
        repeat: -1
      });
    }
    
    if (clicked && coreRef.current) {
      gsap.to(coreRef.current.scale, {
        x: 2.5,
        y: 2.5,
        z: 2.5,
        duration: 0.5,
        ease: "power4.out",
        yoyo: true,
        repeat: 1
      });
    }
  }, [clicked, hovered]);
  
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={position} 
      onClick={() => setClicked(!clicked)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Event horizon glow */}
      <mesh scale={1.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={hovered ? 0.4 : 0.2} side={THREE.BackSide} />
      </mesh>
      
      {/* Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3, 1, 2, 64]} />
        <meshBasicMaterial 
          color={hovered ? "#ffd700" : "#ff6b35"} 
          transparent 
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Glow rings */}
      {[4, 4.8, 5.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[radius, 0.03, 16, 64]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={hovered ? 0.6 - i * 0.1 : 0.4 - i * 0.1}
          />
        </mesh>
      ))}
      
      <pointLight color="#ff6b35" intensity={hovered ? 4 : 2} distance={20} />
      {hovered && <Sparkles count={80} scale={8} size={3} speed={2} color="#ff6b35" />}
    </group>
  );
};

// Comet with enhanced trail
export const Comet = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      const animateComet = () => {
        if (!groupRef.current) return;
        
        groupRef.current.position.set(-40, 20, -25);
        
        gsap.to(groupRef.current.position, {
          x: 40,
          y: -20,
          z: 15,
          duration: 6,
          ease: "none",
          onComplete: () => {
            setTimeout(animateComet, Math.random() * 8000 + 3000);
          }
        });
      };
      
      setTimeout(animateComet, 2000);
    }
  }, []);
  
  return (
    <group ref={groupRef} position={[-40, 20, -25]}>
      <Trail width={4} length={12} color={new THREE.Color("#87ceeb")} attenuation={(t) => t * t}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#e0f7ff" />
        </mesh>
      </Trail>
      <Sparkles count={40} scale={3} size={2} speed={1} color="#87ceeb" />
      <pointLight color="#e0f7ff" intensity={2} distance={8} />
    </group>
  );
};

// Wormhole Portal - NEW
export const WormholePortal = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (innerRef.current) {
      gsap.to(innerRef.current.rotation, {
        z: Math.PI * 2,
        duration: clicked ? 1 : 4,
        ease: "none",
        repeat: -1
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.scale.setScalar(hovered ? pulse * 1.2 : pulse);
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={() => setClicked(!clicked)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.15, 16, 64]} />
        <meshBasicMaterial color="#9b59b6" transparent opacity={0.8} />
      </mesh>
      
      {/* Inner spiral */}
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 2.3, 64, 8]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={clicked ? "#ff00ff" : "#ffffff"} transparent opacity={0.9} />
      </mesh>
      
      <pointLight color="#9b59b6" intensity={3} distance={15} />
      {(hovered || clicked) && <Sparkles count={60} scale={5} size={3} speed={2} color="#9b59b6" />}
    </group>
  );
};

// Pulsar Star - NEW
export const PulsarStar = ({ position }: { position: [number, number, number] }) => {
  const beamRef1 = useRef<THREE.Mesh>(null);
  const beamRef2 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (beamRef1.current && beamRef2.current) {
      gsap.to([beamRef1.current.rotation, beamRef2.current.rotation], {
        z: Math.PI * 2,
        duration: hovered ? 0.5 : 2,
        ease: "none",
        repeat: -1
      });
    }
  }, [hovered]);
  
  useFrame((state) => {
    if (coreRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
      coreRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Beams */}
      <mesh ref={beamRef1}>
        <cylinderGeometry args={[0.05, 0.2, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      <mesh ref={beamRef2} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.2, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      
      <pointLight color="#00d4ff" intensity={hovered ? 5 : 2} distance={12} />
    </group>
  );
};

// SuperNova - NEW
export const Supernova = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [exploded, setExploded] = useState(false);
  const ringsRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (exploded && ringsRef.current) {
      gsap.fromTo(ringsRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 3, y: 3, z: 3, duration: 2, ease: "expo.out" }
      );
      gsap.to(ringsRef.current.rotation, {
        y: Math.PI * 2,
        duration: 3,
        ease: "power2.out"
      });
      
      setTimeout(() => setExploded(false), 3000);
    }
  }, [exploded]);
  
  return (
    <group ref={groupRef} position={position} onClick={() => setExploded(true)}>
      {/* Core star */}
      <mesh>
        <sphereGeometry args={[exploded ? 0.2 : 0.6, 16, 16]} />
        <meshBasicMaterial color={exploded ? "#ffffff" : "#ff4500"} />
      </mesh>
      
      {/* Explosion rings */}
      <group ref={ringsRef} visible={exploded}>
        {[1, 1.5, 2].map((scale, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
            <torusGeometry args={[scale, 0.05, 8, 64]} />
            <meshBasicMaterial color={["#ff4500", "#ffd700", "#ff6b35"][i]} transparent opacity={0.8 - i * 0.2} />
          </mesh>
        ))}
      </group>
      
      <pointLight color="#ff4500" intensity={exploded ? 8 : 1} distance={exploded ? 25 : 10} />
      {exploded && <Sparkles count={100} scale={6} size={4} speed={3} color="#ffd700" />}
    </group>
  );
};

// Universe Environment
const Universe = () => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  
  return (
    <>
      {/* Galaxy */}
      <GalaxySpiral position={[0, 0, -45]} />
      
      {/* Asteroid Belt */}
      <AsteroidBelt position={[0, -3, -12]} />
    </>
  );
};

export default Universe;
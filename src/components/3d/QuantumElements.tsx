import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Quantum Wave - Neon energy wave with cinematic glow
export const QuantumWave = ({ position = [0, 0, -15] as [number, number, number] }) => {
  const meshRef = useRef<THREE.Line>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 100; i++) {
      const t = i / 99;
      const x = (t - 0.5) * 40;
      const y = Math.sin(t * Math.PI * 4) * 2;
      const z = Math.cos(t * Math.PI * 2) * 1.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        ease: "none",
        repeat: -1
      });
    }
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.count; i++) {
        const t = i / (positions.count - 1);
        const y = Math.sin(t * Math.PI * 4 + time * 2) * (hovered ? 3 : 2);
        const z = Math.cos(t * Math.PI * 2 + time * 1.5) * 1.5;
        positions.setY(i, y);
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <line ref={meshRef as any}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(curve.getPoints(99).flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ffff" linewidth={2} transparent opacity={0.8} />
      </line>
      
      {/* Glow effect */}
      <mesh>
        <tubeGeometry args={[curve, 100, 0.3, 8, false]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={hovered ? 0.3 : 0.15} />
      </mesh>
      
      <Sparkles count={50} scale={[40, 6, 4]} size={1.5} speed={0.5} color="#00ffff" />
    </group>
  );
};

// Glowing Atom with orbiting electrons
export const GlowingAtom = ({ 
  position, 
  scale = 1,
  color = "#ff00ff"
}: { 
  position: [number, number, number];
  scale?: number;
  color?: string;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const electronsRef = useRef<THREE.Group[]>([]);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    electronsRef.current.forEach((electron, i) => {
      if (electron) {
        gsap.to(electron.rotation, {
          z: Math.PI * 2,
          duration: clicked ? 1 + i * 0.3 : 3 + i * 0.5,
          ease: "none",
          repeat: -1
        });
      }
    });
  }, [clicked]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      if (hovered) {
        groupRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 5) * 0.1));
      }
    }
  });
  
  const orbitAngles = [0, Math.PI / 3, -Math.PI / 3];
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={groupRef} 
        position={position} 
        scale={scale}
        onClick={() => setClicked(!clicked)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Nucleus */}
        <Sphere args={[0.3, 32, 32]}>
          <meshBasicMaterial color={color} />
        </Sphere>
        
        {/* Nucleus glow */}
        <Sphere args={[0.5, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.5 : 0.3} />
        </Sphere>
        
        {/* Electron orbits */}
        {orbitAngles.map((angle, i) => (
          <group 
            key={i} 
            ref={(el) => { if (el) electronsRef.current[i] = el; }}
            rotation={[angle, 0, 0]}
          >
            {/* Orbit ring */}
            <mesh>
              <torusGeometry args={[1.5, 0.02, 8, 64]} />
              <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.3} />
            </mesh>
            
            {/* Electron */}
            <mesh position={[1.5, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
        
        <pointLight color={color} intensity={hovered ? 2 : 1} distance={8} />
        {hovered && <Sparkles count={30} scale={4} size={2} speed={1} color={color} />}
      </group>
    </Float>
  );
};

// Digital Light Grid - Floating grid plane
export const DigitalGrid = ({ 
  position = [0, -8, -10] as [number, number, number],
  size = 50,
  divisions = 30
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: position[1] + 1,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, [position]);
  
  useFrame((state) => {
    if (gridRef.current) {
      // Scroll-based grid movement
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / maxScroll;
      
      gridRef.current.position.z = -10 + scrollProgress * 20;
      gridRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <gridHelper 
        ref={gridRef}
        args={[size, divisions, '#00ffff', '#0066ff']} 
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Secondary grid layer */}
      <gridHelper 
        args={[size * 0.8, divisions / 2, '#ff00ff', '#6600ff']} 
        position={[0, 0.5, 0]}
        rotation={[Math.PI / 2, Math.PI / 4, 0]}
      />
      
      {/* Fog plane for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color="#000033" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// Energy Field Network - Connected nodes
export const EnergyNetwork = ({ position = [0, 0, -20] as [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  
  const nodes = useMemo(() => {
    const nodeCount = 15;
    return Array.from({ length: nodeCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]
    }));
  }, []);
  
  const connections = useMemo(() => {
    const lines: { start: number; end: number }[] = [];
    nodes.forEach((_, i) => {
      const connectTo = Math.floor(Math.random() * nodes.length);
      if (connectTo !== i) {
        lines.push({ start: i, end: connectTo });
      }
    });
    return lines;
  }, [nodes]);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 0.5,
        x: Math.PI * 0.1,
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, []);
  
  return (
    <group ref={groupRef} position={position}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh 
              onClick={() => setActiveNode(activeNode === i ? null : i)}
              scale={activeNode === i ? 1.5 : 1}
            >
              <octahedronGeometry args={[0.2, 0]} />
              <meshBasicMaterial color={node.color} />
            </mesh>
            
            <mesh scale={0.4}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color={node.color} transparent opacity={activeNode === i ? 0.4 : 0.15} />
            </mesh>
            
            <pointLight color={node.color} intensity={activeNode === i ? 1.5 : 0.3} distance={5} />
          </Float>
        </group>
      ))}
      
      {/* Connections */}
      {connections.map((conn, i) => {
        const start = nodes[conn.start].position;
        const end = nodes[conn.end].position;
        const points = new Float32Array([...start, ...end]);
        
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={points}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#00ffff" 
              transparent 
              opacity={activeNode === conn.start || activeNode === conn.end ? 0.8 : 0.2} 
            />
          </line>
        );
      })}
    </group>
  );
};

// Holographic Ring - Sci-fi ring with data visualization
export const HolographicRing = ({ 
  position = [0, 0, -12] as [number, number, number],
  radius = 5
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const dataRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current.rotation, {
        z: Math.PI * 2,
        duration: 10,
        ease: "none",
        repeat: -1
      });
    }
    if (dataRef.current) {
      gsap.to(dataRef.current.rotation, {
        z: -Math.PI * 2,
        duration: 15,
        ease: "none",
        repeat: -1
      });
    }
  }, []);
  
  const dataPoints = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      const height = Math.random() * 0.8 + 0.2;
      return { angle, height };
    });
  }, []);
  
  return (
    <group 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main ring */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[radius, 0.05, 8, 64]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        
        <mesh>
          <torusGeometry args={[radius * 0.95, 0.03, 8, 64]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {/* Data bars */}
      <group ref={dataRef}>
        {dataPoints.map((point, i) => (
          <mesh 
            key={i}
            position={[
              Math.cos(point.angle) * radius,
              Math.sin(point.angle) * radius,
              0
            ]}
            rotation={[0, 0, point.angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.05, point.height * (hovered ? 1.5 : 1), 0.02]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#00ffff" : "#ff00ff"} 
              transparent 
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Center glow */}
      <Sphere args={[radius * 0.3, 16, 16]}>
        <MeshDistortMaterial
          color="#0066ff"
          distort={hovered ? 0.5 : 0.3}
          speed={2}
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      <pointLight color="#00ffff" intensity={hovered ? 2 : 1} distance={15} />
      {hovered && <Sparkles count={50} scale={radius * 2} size={2} speed={1} color="#00ffff" />}
    </group>
  );
};

// Nebula Dust - Volumetric cloud effect
export const NebulaDust = ({ 
  position = [0, 0, -25] as [number, number, number],
  color = "#6600ff",
  size = 15
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 60,
        ease: "none",
        repeat: -1
      });
      
      gsap.to(groupRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, []);
  
  return (
    <group ref={groupRef} position={position}>
      {[0, 1, 2].map((layer) => (
        <Sphere 
          key={layer} 
          args={[size - layer * 2, 32, 32]}
          position={[layer * 2, -layer, layer * 3]}
        >
          <MeshDistortMaterial
            color={color}
            distort={0.4 + layer * 0.1}
            speed={0.5}
            transparent
            opacity={0.08 - layer * 0.02}
          />
        </Sphere>
      ))}
    </group>
  );
};

// Particle Vortex - Swirling particles
export const ParticleVortex = ({ position = [0, 0, -18] as [number, number, number] }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [clicked, setClicked] = useState(false);
  
  const particles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8;
      const radius = t * 8;
      const height = (t - 0.5) * 10;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Color gradient from cyan to magenta
      colors[i * 3] = t;
      colors[i * 3 + 1] = 1 - t * 0.5;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * (clicked ? 1 : 0.3);
      
      const positions = pointsRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.count; i++) {
        const t = i / positions.count;
        const angle = t * Math.PI * 8 + time * (clicked ? 2 : 0.5);
        const radius = t * 8 + Math.sin(time + i * 0.1) * 0.5;
        
        positions.setX(i, Math.cos(angle) * radius);
        positions.setZ(i, Math.sin(angle) * radius);
      }
      positions.needsUpdate = true;
    }
  });
  
  return (
    <points 
      ref={pointsRef} 
      position={position}
      onClick={() => setClicked(!clicked)}
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
        size={clicked ? 0.15 : 0.1}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
};

export default {
  QuantumWave,
  GlowingAtom,
  DigitalGrid,
  EnergyNetwork,
  HolographicRing,
  NebulaDust,
  ParticleVortex
};

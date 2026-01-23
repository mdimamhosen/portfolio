import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Octahedron, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Wireframe Icosahedron with enhanced effects
export const WireframeSphere = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (clicked && mesh.current) {
      gsap.to(mesh.current.rotation, {
        x: mesh.current.rotation.x + Math.PI * 2,
        y: mesh.current.rotation.y + Math.PI * 2,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.15;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      const targetScale = clicked ? 1.8 : hovered ? 1.4 : 1;
      mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <Trail 
          width={hovered ? 2 : 1} 
          length={5} 
          color={new THREE.Color(clicked ? "#e74c3c" : "#ff6b35")} 
          attenuation={(t) => t * t}
        >
          <mesh 
            ref={mesh} 
            onClick={() => setClicked(!clicked)}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <icosahedronGeometry args={[2, 1]} />
            <meshBasicMaterial 
              color={clicked ? "#e74c3c" : hovered ? "#ffd700" : "#ff6b35"} 
              wireframe 
              transparent 
              opacity={hovered ? 0.8 : 0.4}
            />
          </mesh>
        </Trail>
        {(hovered || clicked) && <Sparkles count={30} scale={4} size={2} speed={1} color={clicked ? "#e74c3c" : "#ffd700"} />}
      </group>
    </Float>
  );
};

// Gradient Sphere with enhanced morphing
export const GradientSphere = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    if (clicked && meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1
      });
    }
  }, [clicked]);
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={2}>
      <group position={position}>
        <Sphere 
          ref={meshRef}
          args={[1.5, 64, 64]} 
          onClick={() => setClicked(!clicked)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={clicked ? "#ffd700" : "#9b59b6"}
            attach="material"
            distort={hovered ? 0.8 : 0.35}
            speed={clicked ? 4 : 1.5}
            roughness={0.15}
            metalness={0.9}
          />
        </Sphere>
        {hovered && <Sparkles count={40} scale={4} size={2} speed={1.5} color="#9b59b6" />}
      </group>
    </Float>
  );
};

// Interactive Cube with enhanced effects
export const FloatingCube = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (clicked && mesh.current) {
      gsap.to(mesh.current.rotation, {
        x: mesh.current.rotation.x + Math.PI * 4,
        y: mesh.current.rotation.y + Math.PI * 4,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (mesh.current) {
      const speed = clicked ? 0.8 : hovered ? 0.4 : 0.2;
      mesh.current.rotation.x = state.clock.elapsedTime * speed;
      mesh.current.rotation.y = state.clock.elapsedTime * speed * 1.5;
      
      // Pulsing scale on hover
      if (hovered) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
        mesh.current.scale.setScalar(pulse);
      }
    }
  });
  
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1.5}>
      <group position={position}>
        <Trail 
          width={hovered ? 1.5 : 0.5} 
          length={4} 
          color={new THREE.Color(clicked ? "#e74c3c" : "#ffd700")} 
          attenuation={(t) => t * t}
        >
          <Box 
            ref={mesh} 
            args={[1.2, 1.2, 1.2]} 
            onClick={() => setClicked(!clicked)}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <meshStandardMaterial
              color={clicked ? "#e74c3c" : "#ffd700"}
              transparent
              opacity={hovered ? 0.6 : 0.15}
              metalness={0.95}
              roughness={0.05}
              wireframe={clicked}
            />
          </Box>
        </Trail>
        {clicked && <Sparkles count={25} scale={3} size={2} speed={2} color="#e74c3c" />}
      </group>
    </Float>
  );
};

// Spinning Torus with enhanced effects
export const SpinningTorus = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (clicked && mesh.current) {
      gsap.to(mesh.current.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * (clicked ? 0.8 : 0.3);
      mesh.current.rotation.z = state.clock.elapsedTime * (clicked ? 0.6 : 0.2);
      
      if (clicked) {
        mesh.current.rotation.y += 0.08;
      }
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <group position={position}>
        <Torus
          ref={mesh}
          args={[1.4, 0.45, 16, 48]}
          onClick={() => setClicked(!clicked)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={clicked ? "#e74c3c" : "#ff6b35"}
            transparent
            opacity={hovered ? 0.7 : 0.25}
            metalness={0.85}
            roughness={0.15}
            wireframe
            emissive={clicked ? "#e74c3c" : "#ff6b35"}
            emissiveIntensity={clicked ? 0.3 : 0.1}
          />
        </Torus>
        {hovered && <Sparkles count={30} scale={4} size={2} speed={1} color="#ff6b35" />}
      </group>
    </Float>
  );
};

// Pulsing Octahedron with enhanced effects
export const PulsingOctahedron = ({ position }: { position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (clicked && mesh.current) {
      gsap.to(mesh.current.rotation, {
        y: mesh.current.rotation.y + Math.PI * 4,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (mesh.current) {
      const pulse = clicked 
        ? 1.6 + Math.sin(state.clock.elapsedTime * 6) * 0.4
        : hovered
        ? 1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.2
        : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      mesh.current.scale.setScalar(pulse);
      mesh.current.rotation.y = state.clock.elapsedTime * (clicked ? 1 : 0.5);
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <group position={position}>
        <Trail 
          width={clicked ? 2 : 1} 
          length={6} 
          color={new THREE.Color(clicked ? "#ffd700" : "#9b59b6")} 
          attenuation={(t) => t * t}
        >
          <Octahedron
            ref={mesh}
            args={[1.2]}
            onClick={() => setClicked(!clicked)}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          >
            <meshStandardMaterial
              color={clicked ? "#ffd700" : "#9b59b6"}
              transparent
              opacity={hovered ? 0.6 : 0.35}
              metalness={0.95}
              roughness={0.05}
              emissive={clicked ? "#ffd700" : "#9b59b6"}
              emissiveIntensity={0.2}
            />
          </Octahedron>
        </Trail>
        {(hovered || clicked) && <Sparkles count={35} scale={4} size={2.5} speed={1.5} color={clicked ? "#ffd700" : "#9b59b6"} />}
      </group>
    </Float>
  );
};

// Glowing Orb with enhanced effects
export const GlowingOrb = ({ position, color = "#00d4ff" }: { position: [number, number, number]; color?: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (clicked && mesh.current) {
      gsap.to(mesh.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.3,
        ease: "power4.out",
        yoyo: true,
        repeat: 1
      });
    }
  }, [clicked]);
  
  useFrame((state) => {
    if (mesh.current) {
      const intensity = clicked 
        ? 2.5 + Math.sin(state.clock.elapsedTime * 8) * 0.8
        : hovered
        ? 1.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3
        : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      mesh.current.scale.setScalar(intensity * 0.5);
      
      // Rotate glow
      if (glowRef.current) {
        glowRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        glowRef.current.scale.setScalar(intensity * 0.8);
      }
    }
  });
  
  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={2}>
      <group position={position}>
        <mesh
          ref={mesh}
          onClick={() => setClicked(!clicked)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshBasicMaterial color={clicked ? "#ff00ff" : color} transparent opacity={0.95} />
        </mesh>
        {/* Outer glow */}
        <mesh ref={glowRef} scale={1.5}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color={clicked ? "#ff00ff" : color} transparent opacity={0.2} side={THREE.BackSide} />
        </mesh>
        <pointLight position={[0, 0, 0]} color={clicked ? "#ff00ff" : color} intensity={clicked ? 4 : hovered ? 2 : 0.8} distance={8} />
        {(hovered || clicked) && <Sparkles count={20} scale={2} size={2} speed={2} color={clicked ? "#ff00ff" : color} />}
      </group>
    </Float>
  );
};
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import Galaxy from './3d/Galaxy';
import CosmicParticles from './3d/CosmicParticles';
import MouseFollower from './3d/MouseFollower';
import CameraController from './3d/CameraController';
import DNA from './3d/DNA';
import { FloatingCube, WireframeSphere } from './3d/FloatingGeometry';
import QuantumElements from './3d/QuantumElements';
import ScrollRing from './3d/ScrollRing';
import Universe from './3d/Universe';
import WaveGrid from './3d/WaveGrid';

const SceneContent = () => {
  return (
    <>
      {/* Deep black background */}
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 20, 150]} />
      {/* Minimal elegant lighting */}
      <ambientLight intensity={0.1} />
      
      {/* Key light - soft white */}
      <spotLight 
        position={[30, 30, 20]} 
        intensity={1} 
        color="#ffffff" 
        angle={0.4}
        penumbra={1}
      />
      <CosmicParticles count={800} />
      <CameraController />
      {/* Fill light - subtle */}
      <pointLight position={[-20, 10, 20]} intensity={0.4} color="#ffffff" />
      
      {/* Rim light */}
      <pointLight position={[0, -20, -30]} intensity={0.3} color="#888888" />
      
      {/* Multi-layer star field */}
      <Stars radius={300} depth={200} count={8000} factor={6} saturation={0} fade speed={0.3} />
      <Stars radius={150} depth={100} count={3000} factor={3} saturation={0} fade speed={0.5} />
      
      {/* Galaxy background */}
      <Galaxy />
      {/* <DNA /> */}
<ScrollRing />

<Universe />
<WaveGrid />
      <CosmicParticles count={600} />
      
      {/* Mouse follower */}
      <MouseFollower />
      
      {/* Camera controller */}
      <CameraController />
      {/* <FloatingCube position={[10, 5, -10]} /> */}
      <Preload all />
    </>
  );
};

const Scene = () => {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: 3,
          toneMappingExposure: 1
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
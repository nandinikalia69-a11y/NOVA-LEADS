'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

function Orb() {
  const sphereRef = useRef<any>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </Sphere>
  );
}

export function AIOrb({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
      
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 2, 2]} intensity={2} color="#ffffff" />
        <directionalLight position={[-2, -2, -2]} intensity={1} color="#ec4899" />
        <Orb />
      </Canvas>
    </div>
  );
}

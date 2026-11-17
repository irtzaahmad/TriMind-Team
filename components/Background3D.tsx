'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Interactive 3D Medical Cross that smoothly tilts with cursor
function InteractiveMedicalScene({ pointerRef }: { pointerRef: React.RefObject<{ x: number; y: number }> }) {
  const crossGroupRef = useRef<THREE.Group>(null);
  const capsuleRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = pointerRef.current || { x: 0, y: 0 };

    // Smooth gentle parallax tilt following mouse cursor (0 lag, smooth lerp)
    if (crossGroupRef.current) {
      const targetRotX = 0.2 + p.y * 0.3;
      const targetRotY = -0.3 + p.x * 0.4;
      crossGroupRef.current.rotation.x = THREE.MathUtils.lerp(crossGroupRef.current.rotation.x, targetRotX, 0.06);
      crossGroupRef.current.rotation.y = THREE.MathUtils.lerp(crossGroupRef.current.rotation.y, targetRotY, 0.06);
      crossGroupRef.current.position.y = THREE.MathUtils.lerp(crossGroupRef.current.position.y, 1.2 + p.y * 0.2, 0.05);
    }

    if (capsuleRef.current) {
      const targetCapsuleRotX = 0.4 - p.y * 0.35;
      const targetCapsuleRotY = 0.2 - p.x * 0.35;
      capsuleRef.current.rotation.x = THREE.MathUtils.lerp(capsuleRef.current.rotation.x, targetCapsuleRotX, 0.06);
      capsuleRef.current.rotation.y = THREE.MathUtils.lerp(capsuleRef.current.rotation.y, targetCapsuleRotY, 0.06);
      capsuleRef.current.position.y = THREE.MathUtils.lerp(capsuleRef.current.position.y, -2.5 - p.y * 0.25, 0.05);
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[10, 10, 8]} intensity={1.3} color="#f0fdfa" />
      <pointLight position={[-6, -4, 4]} intensity={0.9} color="#38bdf8" />

      {/* 3D Medical Cross - Smoothly tilts towards mouse cursor */}
      <group ref={crossGroupRef} position={[6.0, 1.2, -3.5]} scale={1.25}>
        {/* Vertical bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.72, 2.4, 0.45]} />
          <meshStandardMaterial
            color="#0d9488"
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
        {/* Horizontal bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.72, 0.45]} />
          <meshStandardMaterial
            color="#0d9488"
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
        {/* Glowing health pulse center */}
        <mesh position={[0, 0, 0.28]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* 3D Translucent Medicine Capsule - Floats and tilts with cursor */}
      <group ref={capsuleRef} position={[4.8, -2.5, -4]} scale={0.95}>
        {/* Blue half */}
        <mesh position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* White half */}
        <mesh position={[0, -0.5, 0]}>
          <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.9} />
        </mesh>
      </group>
    </>
  );
}

export default function Background3D() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    // Mousemove updates ref directly - NO React state re-renders, 0 lag!
    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!isMounted) return null;

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-sky-50/40 to-white"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle overlay ensures text is 100% legible */}
      <div className="absolute inset-0 bg-white/75 -z-0" />

      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 7], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        className="w-full h-full"
      >
        <InteractiveMedicalScene pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}

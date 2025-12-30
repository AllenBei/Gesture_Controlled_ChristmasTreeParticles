import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3, Quaternion, Color } from 'three';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GestureType } from '../types';
import { PARTICLE_COUNT, generateExplosionPositions, generateTreePositions, generateColors } from '../utils/geometry';

interface MagicSceneProps {
  gesture: GestureType;
}

const MagicScene: React.FC<MagicSceneProps> = ({ gesture }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const starRef = useRef<THREE.Group>(null);
  
  // Data for transitions
  const explosionPos = useMemo(() => generateExplosionPositions(PARTICLE_COUNT), []);
  const treePos = useMemo(() => generateTreePositions(PARTICLE_COUNT), []);
  const colors = useMemo(() => generateColors(PARTICLE_COUNT), []);
  
  // Current state of particles (interpolated)
  const currentPositions = useRef(new Float32Array(explosionPos)); // Start with explosion state

  // Dummy object for matrix calculations
  const dummy = useMemo(() => new Object3D(), []);

  // Internal state tracking
  const targetGestureRef = useRef<GestureType>(GestureType.OPEN);

  useEffect(() => {
    if (gesture !== GestureType.NONE) {
      targetGestureRef.current = gesture;
    }
  }, [gesture]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const isTree = targetGestureRef.current === GestureType.CLOSED;
    
    // Choose target array
    const targetArray = isTree ? treePos : explosionPos;
    
    // Lerp Speed - make it snappy but smooth
    const lerpFactor = THREE.MathUtils.clamp(delta * 4.0, 0, 1);

    // Update each particle
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      
      // Interpolate current position towards target
      currentPositions.current[idx] = THREE.MathUtils.lerp(currentPositions.current[idx], targetArray[idx], lerpFactor);
      currentPositions.current[idx+1] = THREE.MathUtils.lerp(currentPositions.current[idx+1], targetArray[idx+1], lerpFactor);
      currentPositions.current[idx+2] = THREE.MathUtils.lerp(currentPositions.current[idx+2], targetArray[idx+2], lerpFactor);

      // Set position
      dummy.position.set(
        currentPositions.current[idx],
        currentPositions.current[idx+1],
        currentPositions.current[idx+2]
      );

      // Rotate particles slightly for sparkling effect
      dummy.rotation.set(time * 0.2 + i, time * 0.1 + i, 0);
      
      // Scale pulse - Increased base scale for visibility
      let scale = 0.8;
      if (isTree) {
         // Twinkle effect on tree
         scale = 0.5 + Math.sin(time * 3 + i * 10) * 0.2;
      } else {
         // Larger particles in explosion
         scale = 0.9;
      }
      
      // Make spheres or cubes
      // We are using spheres in the geometry, maybe scale x/y/z to make some look like gems
      if (i % 2 === 0) {
        dummy.scale.set(scale, scale, scale); // Sphere
      } else {
        dummy.scale.set(scale * 0.8, scale * 0.8, scale * 0.8); // Smaller cubes effectively
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Animate the main group slightly
    if (!isTree) {
        // Slowly rotate nebula
        meshRef.current.rotation.y = time * 0.05;
    } else {
        // Stabilize tree rotation to front
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, delta * 2);
    }

    // Animate Star
    if (starRef.current) {
        // Star position logic
        const targetStarY = isTree ? 15.5 : 1000; // Hide star when exploding
        const targetScale = isTree ? 1.5 : 0;
        
        starRef.current.position.y = THREE.MathUtils.lerp(starRef.current.position.y, targetStarY, delta * 3);
        starRef.current.scale.setScalar(THREE.MathUtils.lerp(starRef.current.scale.x, targetScale, delta * 3));
        
        // Spin star
        starRef.current.rotation.y += delta * 1.5;
    }
  });

  // Set initial colors
  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const color = new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [colors]);

  return (
    <>
        <Environment preset="sunset" />
        
        <group>
            {/* The Particles */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial 
                    toneMapped={false} 
                    roughness={0.05}
                    metalness={1.0}
                    envMapIntensity={1.5}
                />
            </instancedMesh>

            {/* The Top Star */}
            <group ref={starRef} position={[0, 1000, 0]}>
                <mesh>
                    <octahedronGeometry args={[1.5, 0]} />
                    <meshBasicMaterial color="#FFD700" toneMapped={false} />
                </mesh>
                {/* Glow Halo for star */}
                <pointLight color="#FFD700" intensity={10} distance={30} decay={2} />
            </group>
        </group>
        
        {/* Lights */}
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={5} color="#ff4444" />
        <pointLight position={[0, 20, 0]} intensity={5} color="#ffcc00" />
    </>
  );
};

export default MagicScene;
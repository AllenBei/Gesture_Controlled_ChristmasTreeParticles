import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import MagicScene from './components/MagicScene';
import HandController from './components/HandController';
import WelcomeScreen from './components/WelcomeScreen';
import { GestureType } from './types';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [gesture, setGesture] = useState<GestureType>(GestureType.OPEN);

  const handleGestureChange = (newGesture: GestureType) => {
    // Only update if not NONE, or handle debouncing if needed.
    // For visual smoothness, we treat 'NONE' as keeping previous state usually, or default to OPEN.
    if (newGesture !== GestureType.NONE) {
      setGesture(newGesture);
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-sans select-none">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 40], fov: 45 }} gl={{ antialias: false }}>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 30, 100]} />
            
            <MagicScene gesture={gesture} />
            
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                rotateSpeed={0.5} 
                autoRotate={gesture === GestureType.OPEN} 
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />
            
            <EffectComposer disableNormalPass>
                <Bloom 
                    luminanceThreshold={0} 
                    luminanceSmoothing={0.9} 
                    intensity={1.5}
                    radius={0.6}
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      {hasStarted && (
        <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-12 flex flex-col justify-between">
          
          {/* Header */}
          <header className="w-full flex justify-center">
             <h1 className="font-christmas text-4xl md:text-6xl text-gold tracking-wider opacity-90 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
               MERRY CHRISTMAS
             </h1>
          </header>

          {/* Bottom Control Area */}
          <div className="flex flex-col md:flex-row items-end justify-between w-full">
            
            {/* Monitor & Status */}
            <div className="flex flex-col gap-4 pointer-events-auto">
                
                {/* Status Lights */}
                <div className="flex gap-4 mb-2">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded border transition-all duration-300 ${gesture === GestureType.OPEN ? 'border-red-500 bg-red-900/30 shadow-[0_0_15px_rgba(220,20,60,0.6)]' : 'border-white/10 bg-black/50 opacity-50'}`}>
                        <div className={`w-3 h-3 rounded-full ${gesture === GestureType.OPEN ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`}></div>
                        <span className="text-white font-mono text-sm tracking-widest">EXPLODE</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded border transition-all duration-300 ${gesture === GestureType.CLOSED ? 'border-green-500 bg-green-900/30 shadow-[0_0_15px_rgba(50,205,50,0.6)] scale-110' : 'border-white/10 bg-black/50 opacity-50'}`}>
                        <div className={`w-3 h-3 rounded-full ${gesture === GestureType.CLOSED ? 'bg-green-500 animate-pulse' : 'bg-green-900'}`}></div>
                        <span className="text-white font-mono text-sm tracking-widest">TREE</span>
                    </div>
                </div>

                {/* Camera View */}
                <HandController onGestureChange={handleGestureChange} active={hasStarted} />
                <p className="text-white/30 text-xs font-mono max-w-[200px]">
                    Use your hand to control the particles. 
                    <br/>Open Hand: Nebula
                    <br/>Fist: Christmas Tree
                </p>
            </div>

            {/* Credits / Footer */}
            <div className="text-white/20 font-mono text-xs text-right mt-4 md:mt-0">
                <p>INTERACTIVE WEBGL EXPERIENCE</p>
                <p>POWERED BY REACT THREE FIBER & MEDIAPIPE</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Screen */}
      {!hasStarted && <WelcomeScreen onStart={() => setHasStarted(true)} />}

    </div>
  );
}

export default App;
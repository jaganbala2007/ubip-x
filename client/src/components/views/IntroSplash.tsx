import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, PerspectiveCamera } from '@react-three/drei';
import { Shield, Fingerprint, Zap, ChevronDown, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProceduralTurbineRotor } from '../hero3d/HeroRotorScene';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

interface IntroSplashProps {
  onComplete: () => void;
}

// 3D Scene that reacts to scroll
const ScrollScene = () => {
  const scroll = useScroll();
  const rotorGroup = useRef<THREE.Group>(null);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const { isDark } = useTheme();

  useFrame(() => {
    const offset = scroll.offset;
    const targetProgress = Math.min(Math.max(offset * 3.33, 0), 1);
    setAssemblyProgress(targetProgress);

    if (rotorGroup.current) {
      rotorGroup.current.rotation.y = offset * Math.PI * 4;
      rotorGroup.current.position.x = THREE.MathUtils.lerp(0, 2.5, Math.sin(offset * Math.PI));
      rotorGroup.current.position.y = THREE.MathUtils.lerp(0, -1, offset);
      rotorGroup.current.position.z = THREE.MathUtils.lerp(0, 2, offset);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      
      {isDark ? (
        <>
          <ambientLight intensity={0.25} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2.2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#3B82F6" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
          <directionalLight position={[-8, 4, -6]} intensity={0.8} color="#93C5FD" />
          <pointLight position={[0, -4, 4]} intensity={0.5} color="#FDE68A" />
        </>
      )}
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={rotorGroup} rotation={[0.2, 0, -0.1]}>
          <ProceduralTurbineRotor 
            assemblyProgress={assemblyProgress} 
            isVerifying={scroll.offset > 0.5} 
          />
        </group>
      </Float>
    </>
  );
};

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { isDark } = useTheme();

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          className={`fixed inset-0 z-50 ${isDark ? 'bg-[#050505]' : 'bg-[#F4F4F6]'} overflow-hidden transition-colors duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Floating Controls: Theme Toggle & Quick Skip */}
          <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
            <ThemeToggle variant="compact" />
            
            <button
              onClick={handleStart}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all duration-200 ${
                isDark 
                  ? 'bg-[#1A1A1C]/80 hover:bg-[#27272A] border-white/10 text-zinc-300 hover:text-white backdrop-blur-md'
                  : 'bg-white/90 hover:bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 shadow-sm backdrop-blur-md'
              }`}
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vignette Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none z-10 ${
              isDark 
                ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80' 
                : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(244,244,246,0.85)_100%)] opacity-70'
            }`} 
          />
          
          <Canvas shadows dpr={[1, 2]}>
            <ScrollControls pages={4} damping={0.2}>
              <ScrollScene />
              
              <Scroll html style={{ width: '100%', height: '100%' }}>
                
                {/* SECTION 1: TITLE */}
                <div className="h-[100vh] w-full flex flex-col items-center justify-center text-center px-6 relative">
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-30">
                    <Shield className="w-16 h-16 text-[#D4A017]" />
                  </div>
                  
                  <h2 className="text-[#E8622C] uppercase tracking-[0.3em] text-sm font-semibold flex items-center justify-center gap-3 mb-4">
                    <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#E8622C]/50" />
                    National Sovereign Trust Fabric
                    <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#E8622C]/50" />
                  </h2>
                  <h1 className={`text-6xl md:text-9xl font-black ${isDark ? 'text-white' : 'text-[#09090B]'} tracking-tighter drop-shadow-2xl`}>
                    SETU <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#E8622C] to-[#D4A017]">DLT</span>
                  </h1>
                  
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-zinc-500">
                    <span className="text-xs uppercase tracking-widest mb-2">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>

                {/* SECTION 2: 5 PILLARS */}
                <div className="h-[100vh] w-full flex flex-col justify-center px-12 md:px-32 max-w-2xl relative z-20">
                  <div className={`backdrop-blur-md p-8 rounded-3xl border shadow-2xl transition-colors duration-300 ${
                    isDark 
                      ? 'bg-[#111113]/70 border-white/5' 
                      : 'bg-white/85 border-black/10'
                  }`}>
                    <Layers className="w-10 h-10 text-[#22C55E] mb-6" />
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#09090B]'}`}>5 Sovereign Pillars</h2>
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Securing critical infrastructure across Power Grid, Telecom, Healthcare, Agriculture, and Defence. One unified, interoperable layer eliminating data silos and fraud.
                    </p>
                  </div>
                </div>

                {/* SECTION 3: CRYPTOGRAPHIC LATTICE */}
                <div className="h-[100vh] w-full flex flex-col items-end justify-center px-12 md:px-32 text-right relative z-20">
                  <div className={`max-w-2xl backdrop-blur-md p-8 rounded-3xl border shadow-2xl transition-colors duration-300 ${
                    isDark 
                      ? 'bg-[#111113]/70 border-white/5' 
                      : 'bg-white/85 border-black/10'
                  }`}>
                    <ShieldCheck className="w-10 h-10 text-[#6366F1] mb-6 ml-auto" />
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#09090B]'}`}>Post-Quantum Security</h2>
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Powered by ML-DSA (Dilithium) and Zero-Knowledge Proofs (ZK-SNARKs). Every hardware asset is cryptographically bound to its digital twin in real-time.
                    </p>
                  </div>
                </div>

                {/* SECTION 4: CALL TO ACTION */}
                <div className="h-[100vh] w-full flex flex-col items-center justify-center text-center px-6 relative z-30">
                  <h2 className={`text-3xl md:text-5xl font-bold mb-12 ${isDark ? 'text-white' : 'text-[#09090B]'}`}>
                    Enter the Control Node
                  </h2>
                  
                  <button 
                    onClick={handleStart}
                    className="group relative overflow-hidden rounded-full p-[1px] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(232,98,44,0.3)] cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#E8622C] via-[#D4A017] to-[#E8622C] rounded-full animate-[spin_3s_linear_infinite] opacity-70" />
                    
                    <div className={`relative px-12 py-5 rounded-full flex items-center gap-4 border backdrop-blur-sm shadow-xl transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#09090B] border-white/5' 
                        : 'bg-white border-black/10'
                    }`}>
                      <Fingerprint className="w-6 h-6 text-[#E8622C] group-hover:animate-pulse" />
                      <span className={`font-semibold tracking-wider text-lg ${isDark ? 'text-white' : 'text-[#09090B]'}`}>Initialize Cockpit</span>
                      <Zap className="w-5 h-5 text-[#D4A017] ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </button>
                  
                  <div className="absolute bottom-12 flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SIH 2026 Ready
                    </span>
                    <span className="text-zinc-400">|</span>
                    <span>Team: Truth-First Engineering</span>
                  </div>
                </div>

              </Scroll>
            </ScrollControls>
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

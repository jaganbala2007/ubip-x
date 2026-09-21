import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

interface TurbineRotorProps {
  assemblyProgress: number; // 0 to 1
  isTampered?: boolean;
  isVerifying?: boolean;
  temperature?: number;
  vibration?: number;
}

// 1. Procedural High-Fidelity PBR Turbine Rotor
export const ProceduralTurbineRotor: React.FC<TurbineRotorProps> = ({
  assemblyProgress,
  isTampered = false,
  isVerifying = false,
  temperature = 41.2,
  vibration = 0.18
}) => {
  const rotorRef = useRef<THREE.Group>(null);
  const dataMeshRef = useRef<THREE.Group>(null);
  const latticePointsRef = useRef<THREE.Points>(null);

  // Generate cryptographic particle point cloud that assembles onto asset surface
  const particleCount = 280;
  const [initialPositions, surfacePositions] = useMemo(() => {
    const init = new Float32Array(particleCount * 3);
    const surf = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Surface position on multi-stage turbine cylinder/cones
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.2;
      const radius = 0.45 + (1 - Math.abs(height) / 2) * 0.7;

      surf[idx] = Math.cos(angle) * radius;
      surf[idx + 1] = height;
      surf[idx + 2] = Math.sin(angle) * radius;

      // Scattered exploded position during initial entrance
      const explodeDist = 3.5 + Math.random() * 4.0;
      init[idx] = Math.cos(angle) * explodeDist * (Math.random() * 2 - 1);
      init[idx + 1] = height * (2 + Math.random() * 2) + (Math.random() - 0.5) * 4;
      init[idx + 2] = Math.sin(angle) * explodeDist * (Math.random() * 2 - 1);
    }
    return [init, surf];
  }, [particleCount]);

  // Geometry for particle buffer
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return geo;
  }, [particleCount]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Slow, continuous, cinematic auto-rotation
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 0.25;
      
      // Subtle physical vibration kinematics based on sensor telemetry
      if (vibration > 0.4) {
        rotorRef.current.position.x = Math.sin(elapsed * 50) * (vibration * 0.015);
        rotorRef.current.position.z = Math.cos(elapsed * 45) * (vibration * 0.015);
      } else {
        rotorRef.current.position.x = 0;
        rotorRef.current.position.z = 0;
      }
    }

    // 2. Animate particle assembly from scattered cloud to asset shell
    if (latticePointsRef.current) {
      const posAttr = latticePointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const t = THREE.MathUtils.clamp(assemblyProgress, 0, 1);
      const easeT = t * t * (3 - 2 * t); // Smoothstep

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Interpolate between initial scattered cloud and surface position
        const targetX = THREE.MathUtils.lerp(initialPositions[idx], surfacePositions[idx], easeT);
        const targetY = THREE.MathUtils.lerp(initialPositions[idx + 1], surfacePositions[idx + 1], easeT);
        const targetZ = THREE.MathUtils.lerp(initialPositions[idx + 2], surfacePositions[idx + 2], easeT);

        // Add subtle shimmering drift when assembled
        const drift = Math.sin(elapsed * 2 + i) * 0.012;
        array[idx] = targetX + drift;
        array[idx + 1] = targetY + Math.cos(elapsed * 1.5 + i) * 0.012;
        array[idx + 2] = targetZ + drift;
      }
      posAttr.needsUpdate = true;
    }

    // 3. Cryptographic Lattice Mesh Pulse on verification
    if (dataMeshRef.current) {
      const pulse = isVerifying 
        ? 1.0 + Math.sin(elapsed * 8) * 0.05 
        : 1.0 + Math.sin(elapsed * 2) * 0.015;
      dataMeshRef.current.scale.setScalar(pulse);
    }
  });

  // Stage configurations: 4 Precision Inconel & Titanium Bladed Disks
  const stages = [
    { y: -1.0, radius: 1.15, blades: 18, bladeHeight: 0.52, pitch: 0.35 },
    { y: -0.35, radius: 1.0, blades: 20, bladeHeight: 0.48, pitch: 0.38 },
    { y: 0.35, radius: 0.85, blades: 22, bladeHeight: 0.42, pitch: 0.42 },
    { y: 0.95, radius: 0.72, blades: 24, bladeHeight: 0.38, pitch: 0.46 }
  ];

  return (
    <group ref={rotorRef}>
      {/* Central Solid Shaft (Machined Inconel PBR Surface) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 3.4, 48]} />
        <meshStandardMaterial
          color="#2A303C"
          roughness={0.22}
          metalness={0.92}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Shaft End Couplings */}
      <mesh castShadow position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.26, 0.34, 0.15, 32]} />
        <meshStandardMaterial color="#1E232D" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh castShadow position={[0, -1.75, 0]}>
        <cylinderGeometry args={[0.34, 0.26, 0.15, 32]} />
        <meshStandardMaterial color="#1E232D" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Aerodynamic Multi-Stage Blade Assemblies */}
      {stages.map((stg, sIdx) => (
        <group key={sIdx} position={[0, stg.y, 0]}>
          {/* Heavy Forged Hub Disk */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[stg.radius * 0.52, stg.radius * 0.52, 0.14, 36]} />
            <meshStandardMaterial
              color="#1C212B"
              roughness={0.28}
              metalness={0.88}
            />
          </mesh>

          {/* Retention Ring Lock */}
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[stg.radius * 0.52, 0.02, 16, 36]} />
            <meshStandardMaterial color="#3B82F6" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Radial Curved Aerofoil Blades */}
          {Array.from({ length: stg.blades }).map((_, bIdx) => {
            const angle = (bIdx / stg.blades) * Math.PI * 2;
            const dist = stg.radius * 0.52;
            return (
              <group
                key={bIdx}
                position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}
                rotation={[0, -angle + stg.pitch, 0.1]}
              >
                <mesh castShadow receiveShadow position={[0, 0, stg.bladeHeight * 0.45]}>
                  <boxGeometry args={[0.038, 0.11, stg.bladeHeight]} />
                  <meshStandardMaterial
                    color={isTampered ? '#991B1B' : '#4B5563'}
                    roughness={0.16}
                    metalness={0.95}
                    envMapIntensity={1.4}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* 2. Cryptographic Digital Twin Data-Mesh Shell (The Shimmering Lattice) */}
      <group ref={dataMeshRef} visible={assemblyProgress > 0.1}>
        {/* Lattice Node Point Cloud */}
        <points ref={latticePointsRef} geometry={particleGeo}>
          <pointsMaterial
            color={isTampered ? '#EF4444' : isVerifying ? '#60A5FA' : '#3B82F6'}
            size={0.038}
            transparent
            opacity={0.85 * assemblyProgress}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Faint Wireframe Hull Overlay (Cryptographic Bounding Envelope) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 3.4, 24, 8, true]} />
          <meshBasicMaterial
            color={isTampered ? '#EF4444' : '#2563EB'}
            wireframe
            transparent
            opacity={0.06 * assemblyProgress}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Outer Circular Provenance Orbit Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <ringGeometry args={[1.65, 1.66, 64]} />
          <meshBasicMaterial
            color={isTampered ? '#EF4444' : '#60A5FA'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.25 * assemblyProgress}
          />
        </mesh>
      </group>
    </group>
  );
};

// 2. Camera Rig with 2-Second Smooth Dolly-In Entrance
const CameraRig: React.FC<{ onAssemblyUpdate: (progress: number) => void }> = ({ onAssemblyUpdate }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!startTime.current) {
      startTime.current = state.clock.getElapsedTime();
    }
    const elapsed = state.clock.getElapsedTime() - startTime.current;
    
    // 2-second dolly-in ease curve
    const duration = 2.2;
    const progress = THREE.MathUtils.clamp(elapsed / duration, 0, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

    onAssemblyUpdate(progress);

    if (cameraRef.current) {
      // Start pulled back at z: 8.5, y: 3.2, ease in to z: 5.2, y: 1.6
      cameraRef.current.position.x = THREE.MathUtils.lerp(1.2, 0, easeOut);
      cameraRef.current.position.y = THREE.MathUtils.lerp(3.2, 1.4, easeOut);
      cameraRef.current.position.z = THREE.MathUtils.lerp(8.2, 4.8, easeOut);
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={38} position={[0, 3.2, 8.2]} />;
};

// 3. Complete Exportable Hero Canvas Scene
interface HeroRotorSceneProps {
  isTampered?: boolean;
  isVerifying?: boolean;
  temperature?: number;
  vibration?: number;
  className?: string;
}

export const HeroRotorScene: React.FC<HeroRotorSceneProps> = ({
  isTampered = false,
  isVerifying = false,
  temperature = 41.2,
  vibration = 0.18,
  className = ''
}) => {
  const [assemblyProgress, setAssemblyProgress] = React.useState(0);
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <CameraRig onAssemblyUpdate={setAssemblyProgress} />

        {/* Studio Lighting - Adaptive for Dark vs Light */}
        <ambientLight intensity={isDark ? 0.4 : 0.75} />
        
        {/* Soft Key Light */}
        <directionalLight
          castShadow
          position={[6, 8, 6]}
          intensity={isDark ? 1.8 : 1.5}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        {/* Cool Rim Light */}
        <directionalLight position={[-6, 2, -6]} intensity={isDark ? 1.2 : 0.8} color="#93C5FD" />

        {/* Subtle Warm Fill */}
        <directionalLight position={[0, -4, 4]} intensity={isDark ? 0.3 : 0.5} color="#FDE68A" />

        {/* Subtle Emissive Point Accent */}
        <pointLight
          position={[0, 0, 0]}
          intensity={isTampered ? 2.0 : (isDark ? 0.8 : 0.5)}
          color={isTampered ? '#EF4444' : '#3B82F6'}
          distance={4}
        />

        {/* Floating Asset Group */}
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          <ProceduralTurbineRotor
            assemblyProgress={assemblyProgress}
            isTampered={isTampered}
            isVerifying={isVerifying}
            temperature={temperature}
            vibration={vibration}
          />
        </Float>

        {/* Soft Studio Floor Contact Shadow */}
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={isDark ? 0.65 : 0.22}
          scale={7}
          blur={2.4}
          far={3.5}
          color="#000000"
        />

        {/* Interactive Smooth Orbit Controls with Limits */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI * 3) / 4}
          rotateSpeed={0.6}
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
};

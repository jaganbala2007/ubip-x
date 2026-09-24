import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';
import { DigitalTwinType } from '../../types';

// =========================================================================
// 1. PROCEDURAL INDUSTRIAL SUPERCRITICAL TURBINE ROTOR
// =========================================================================
interface TurbineRotorProps {
  assemblyProgress: number;
  isTampered?: boolean;
  isVerifying?: boolean;
  temperature?: number;
  vibration?: number;
}

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

  const particleCount = 240;
  const [initialPositions, surfacePositions] = useMemo(() => {
    const init = new Float32Array(particleCount * 3);
    const surf = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.2;
      const radius = 0.45 + (1 - Math.abs(height) / 2) * 0.7;

      surf[idx] = Math.cos(angle) * radius;
      surf[idx + 1] = height;
      surf[idx + 2] = Math.sin(angle) * radius;

      const explodeDist = 3.5 + Math.random() * 4.0;
      init[idx] = Math.cos(angle) * explodeDist * (Math.random() * 2 - 1);
      init[idx + 1] = height * (2 + Math.random() * 2) + (Math.random() - 0.5) * 4;
      init[idx + 2] = Math.sin(angle) * explodeDist * (Math.random() * 2 - 1);
    }
    return [init, surf];
  }, [particleCount]);

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return geo;
  }, [particleCount]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 0.4;
      if (vibration > 0.4) {
        rotorRef.current.position.x = Math.sin(elapsed * 50) * (vibration * 0.015);
        rotorRef.current.position.z = Math.cos(elapsed * 45) * (vibration * 0.015);
      } else {
        rotorRef.current.position.x = 0;
        rotorRef.current.position.z = 0;
      }
    }

    if (latticePointsRef.current) {
      const posAttr = latticePointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const t = THREE.MathUtils.clamp(assemblyProgress, 0, 1);
      const easeT = t * t * (3 - 2 * t);

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const targetX = THREE.MathUtils.lerp(initialPositions[idx], surfacePositions[idx], easeT);
        const targetY = THREE.MathUtils.lerp(initialPositions[idx + 1], surfacePositions[idx + 1], easeT);
        const targetZ = THREE.MathUtils.lerp(initialPositions[idx + 2], surfacePositions[idx + 2], easeT);
        const drift = Math.sin(elapsed * 2 + i) * 0.012;
        array[idx] = targetX + drift;
        array[idx + 1] = targetY + Math.cos(elapsed * 1.5 + i) * 0.012;
        array[idx + 2] = targetZ + drift;
      }
      posAttr.needsUpdate = true;
    }

    if (dataMeshRef.current) {
      const pulse = isVerifying 
        ? 1.0 + Math.sin(elapsed * 8) * 0.05 
        : 1.0 + Math.sin(elapsed * 2) * 0.015;
      dataMeshRef.current.scale.setScalar(pulse);
    }
  });

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
          color={isTampered ? '#7F1D1D' : '#2A303C'}
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
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[stg.radius * 0.52, stg.radius * 0.52, 0.14, 36]} />
            <meshStandardMaterial
              color="#1C212B"
              roughness={0.28}
              metalness={0.88}
            />
          </mesh>

          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[stg.radius * 0.52, 0.02, 16, 36]} />
            <meshStandardMaterial color={isTampered ? '#EF4444' : '#3B82F6'} metalness={0.9} roughness={0.2} />
          </mesh>

          {Array.from({ length: stg.blades }).map((_, bIdx) => {
            const angle = (bIdx / stg.blades) * Math.PI * 2;
            const dist = stg.radius * 0.52;
            let bladeColor = '#4B5563';
            if (isTampered) bladeColor = '#EF4444';
            else if (temperature > 65) bladeColor = '#F59E0B';

            return (
              <group
                key={bIdx}
                position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}
                rotation={[0, -angle + stg.pitch, 0.1]}
              >
                <mesh castShadow receiveShadow position={[0, 0, stg.bladeHeight * 0.45]}>
                  <boxGeometry args={[0.038, 0.11, stg.bladeHeight]} />
                  <meshStandardMaterial
                    color={bladeColor}
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

      {/* Cryptographic Digital Twin Data-Mesh Shell */}
      <group ref={dataMeshRef} visible={assemblyProgress > 0.1}>
        <points ref={latticePointsRef} geometry={particleGeo}>
          <pointsMaterial
            color={isTampered ? '#EF4444' : isVerifying ? '#60A5FA' : '#3B82F6'}
            size={0.038}
            transparent
            opacity={0.85 * assemblyProgress}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 3.4, 24, 8, true]} />
          <meshBasicMaterial
            color={isTampered ? '#EF4444' : '#2563EB'}
            wireframe
            transparent
            opacity={0.07 * assemblyProgress}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

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

// =========================================================================
// 2. PROCEDURAL HIGH-SPEED TRAIN BOGIE & AXLE ASSEMBLY (VANDE BHARAT)
// =========================================================================
export const ProceduralTrainBogie: React.FC<TurbineRotorProps> = ({
  isTampered = false,
  isVerifying = false,
  temperature = 38.6,
  vibration = 0.14
}) => {
  const wheelsetRef = useRef<THREE.Group>(null);
  const acousticPulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // Wheelset rapid forward rolling rotation (simulates 160 km/h)
    if (wheelsetRef.current) {
      wheelsetRef.current.rotation.x += delta * 4.8;
      if (vibration > 0.3) {
        wheelsetRef.current.position.y = Math.sin(elapsed * 45) * (vibration * 0.02);
      } else {
        wheelsetRef.current.position.y = 0;
      }
    }

    if (acousticPulseRef.current) {
      acousticPulseRef.current.scale.setScalar(1 + (Math.sin(elapsed * 6) + 1) * 0.08);
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* Ground Railway Track Rails and Ties */}
      <group position={[0, -1.05, 0]}>
        {/* Left Steel Rail */}
        <mesh position={[-1.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.16, 7.5]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Right Steel Rail */}
        <mesh position={[1.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.16, 7.5]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Concrete Railway Ties / Sleepers */}
        {[-3, -2, -1, 0, 1, 2, 3].map((zPos, idx) => (
          <mesh key={idx} position={[0, -0.12, zPos]}>
            <boxGeometry args={[3.4, 0.14, 0.32]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Rotating Wheelset Group */}
      <group ref={wheelsetRef} position={[0, 0, 0]}>
        {/* Heavy Forged Solid Axle Shaft */}
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 3.4, 32]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>

        {/* Left Railway Wheel Assembly */}
        <group position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Wheel Tread Disc */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.14, 40]} />
            <meshStandardMaterial
              color={isTampered ? '#991B1B' : '#475569'}
              metalness={0.96}
              roughness={0.15}
            />
          </mesh>
          {/* Outer Wheel Containment Flange */}
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[1.08, 1.08, 0.05, 40]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Recessed Wheel Center Web */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.65, 0.75, 0.06, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Center Lubrication Hub Cap */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.26, 0.28, 0.16, 24]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Railway Wheel Assembly */}
        <group position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          {/* Wheel Tread Disc */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.14, 40]} />
            <meshStandardMaterial
              color={isTampered ? '#991B1B' : '#475569'}
              metalness={0.96}
              roughness={0.15}
            />
          </mesh>
          {/* Outer Wheel Containment Flange */}
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[1.08, 1.08, 0.05, 40]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Recessed Wheel Center Web */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.65, 0.75, 0.06, 32]} />
            <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Center Lubrication Hub Cap */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.26, 0.28, 0.16, 24]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Inboard Ventilated Disc Brakes (Dual Discs on Axle) */}
        {[-0.65, 0.65].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.64, 0.64, 0.09, 32]} />
              <meshStandardMaterial
                color={isTampered || temperature > 60 ? '#EF4444' : '#64748B'}
                metalness={0.9}
                roughness={0.22}
              />
            </mesh>
            {/* Brake Ventilation Channels */}
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[0.48, 0.02, 12, 24]} />
              <meshStandardMaterial color="#3B82F6" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Central Traction Motor & Gearbox Diff Housing */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.62, 0.85]} />
          <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* Stationary Axle-Box Bearing Housings (With Sensors) */}
      <group position={[-1.72, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.44, 0.44]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Sensor Probe LED Indicator */}
        <mesh position={[-0.12, 0.12, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={isTampered ? '#EF4444' : '#22C55E'} />
        </mesh>
      </group>

      <group position={[1.72, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.44, 0.44]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, 0.12, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={isTampered ? '#EF4444' : '#22C55E'} />
        </mesh>
      </group>

      {/* Ultrasonic Acoustic Wave Rings (Safety Attestation Envelope) */}
      <mesh ref={acousticPulseRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.25, 0.015, 16, 48]} />
        <meshBasicMaterial
          color={isTampered ? '#EF4444' : isVerifying ? '#60A5FA' : '#00E599'}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

// =========================================================================
// 3. PROCEDURAL AIRPLANE TURBOFAN JET ENGINE (CFM LEAP-1A / LCA TEJAS)
// =========================================================================
export const ProceduralAirplaneJet: React.FC<TurbineRotorProps> = ({
  isTampered = false,
  isVerifying = false,
  temperature = 48.0,
  vibration = 0.12
}) => {
  const fanGroupRef = useRef<THREE.Group>(null);
  const coreSpoolRef = useRef<THREE.Group>(null);
  const jetPlumeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // High-speed fan blade rotation
    if (fanGroupRef.current) {
      fanGroupRef.current.rotation.z += delta * 6.5;
    }
    if (coreSpoolRef.current) {
      coreSpoolRef.current.rotation.z += delta * 9.0;
    }

    if (jetPlumeRef.current) {
      const pulse = 1 + Math.sin(elapsed * 12) * 0.12;
      jetPlumeRef.current.scale.set(pulse, pulse, 1 + Math.sin(elapsed * 8) * 0.2);
    }
  });

  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Outer Engine Nacelle Bypass Cowling (Semi-Transparent Cutaway Cowl) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.42, 1.35, 2.8, 36, 1, true]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Aerodynamic Nacelle Air Intake Lip Ring */}
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.08, 16, 36]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* Rear Convergent Exhaust Nozzle */}
      <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.05, 1.25, 0.6, 32, 1, true]} />
        <meshStandardMaterial
          color={isTampered ? '#EF4444' : '#334155'}
          metalness={0.95}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core Jet Plume Exhaust Glow Cone */}
      <mesh ref={jetPlumeRef} position={[0, 0, -2.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 1.8, 24]} />
        <meshBasicMaterial
          color={isTampered ? '#EF4444' : '#00D2FF'}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* High-Bypass Front Fan Group (Rotating Swept Blades + Spinner Nose) */}
      <group ref={fanGroupRef} position={[0, 0, 1.1]}>
        {/* Titanium Nose Spinner Cone with Aerodynamic Swirl */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.38, 0.9, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* 22 Wide-Chord Swept Carbon-Titanium Fan Blades */}
        {Array.from({ length: 22 }).map((_, i) => {
          const angle = (i / 22) * Math.PI * 2;
          const bladeLength = 0.92;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, bladeLength * 0.52 + 0.32, 0]} rotation={[0.25, 0.1, 0.2]}>
                <boxGeometry args={[0.035, bladeLength, 0.18]} />
                <meshStandardMaterial
                  color={isTampered ? '#991B1B' : '#64748B'}
                  metalness={0.92}
                  roughness={0.16}
                  envMapIntensity={1.3}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Bypass Stator Outlet Guide Vanes (Stationary Vanes Behind Fan) */}
      <group position={[0, 0, 0.6]}>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.88, 0]}>
                <boxGeometry args={[0.02, 0.55, 0.14]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Central Jet Core Engine Spool (High-Pressure Compressor & Turbine) */}
      <group ref={coreSpoolRef} position={[0, 0, -0.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.48, 1.8, 28]} />
          <meshStandardMaterial
            color={temperature > 500 || isTampered ? '#F59E0B' : '#1E293B'}
            metalness={0.92}
            roughness={0.25}
          />
        </mesh>
        {/* High-Pressure Core Turbine Discs */}
        {[-0.6, -0.2, 0.2, 0.6].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.03, 12, 32]} />
            <meshStandardMaterial color={isTampered ? '#EF4444' : '#00E599'} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Aviation Airworthiness Telemetry Bounding Ring */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.52, 1.54, 48]} />
        <meshBasicMaterial
          color={isTampered ? '#EF4444' : isVerifying ? '#60A5FA' : '#00E599'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// =========================================================================
// 4. PROCEDURAL MILITARY DEFENSE RADAR (DRDO TACTICAL AESA & AVIONICS)
// =========================================================================
export const ProceduralDefenseRadar: React.FC<TurbineRotorProps> = ({
  isTampered = false,
  isVerifying = false
}) => {
  const radarTurretRef = useRef<THREE.Group>(null);
  const radarBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();

    // 360-degree Azimuth Phased Array Scanning Rotation
    if (radarTurretRef.current) {
      radarTurretRef.current.rotation.y += delta * 1.5;
    }

    if (radarBeamRef.current) {
      radarBeamRef.current.scale.setScalar(1 + (Math.sin(elapsed * 8) + 1) * 0.15);
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Heavy Armored Pedestal Base */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[1.15, 1.35, 0.45, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Rotating Radar Turret Gimbal */}
      <group ref={radarTurretRef} position={[0, 0, 0]}>
        {/* Turret Yoke Support Arms */}
        <mesh position={[-0.85, -0.1, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.45]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.85, -0.1, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.45]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Planar AESA Phased Array Radar Face (Tilted Upward 15 deg) */}
        <group position={[0, 0.35, 0]} rotation={[-0.25, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.65, 1.25, 0.18]} />
            <meshStandardMaterial
              color={isTampered ? '#7F1D1D' : '#0F172A'}
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          {/* Hexagonal Phased Array Transceiver Array Tiles */}
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[1.45, 1.05]} />
            <meshStandardMaterial
              color={isTampered ? '#EF4444' : '#00E599'}
              wireframe
              emissive={isTampered ? '#EF4444' : '#00E599'}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Radiating Conical Energy Scan Wavefront */}
          <mesh ref={radarBeamRef} position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.4, 2.2, 16, 1, true]} />
            <meshBasicMaterial
              color={isTampered ? '#EF4444' : '#38BDF8'}
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Dual Tactical Missile Guidance Pods (DRDO Outriggers) */}
        {[-1.15, 1.15].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0.15, 0]}>
            {/* Missile Body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 1.8, 20]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Missile Seeker Nose Cone */}
            <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.12, 0.35, 20]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
            {/* Aerodynamic Guidance Fins */}
            {[-0.7, 0.3].map((zPos, fIdx) => (
              <mesh key={fIdx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.42, 0.02, 0.16]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};

// =========================================================================
// 5. CAMERA RIG WITH SMOOTH ENTRANCE
// =========================================================================
const CameraRig: React.FC<{ onAssemblyUpdate: (progress: number) => void }> = ({ onAssemblyUpdate }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!startTime.current) {
      startTime.current = state.clock.getElapsedTime();
    }
    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 2.0;
    const progress = THREE.MathUtils.clamp(elapsed / duration, 0, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);

    onAssemblyUpdate(progress);

    if (cameraRef.current) {
      cameraRef.current.position.x = THREE.MathUtils.lerp(1.2, 0, easeOut);
      cameraRef.current.position.y = THREE.MathUtils.lerp(3.2, 1.5, easeOut);
      cameraRef.current.position.z = THREE.MathUtils.lerp(8.2, 4.8, easeOut);
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={38} position={[0, 3.2, 8.2]} />;
};

// =========================================================================
// 6. MAIN EXPORTABLE HERO ROTOR SCENE WITH ALL 4 DIGITAL TWINS
// =========================================================================
export interface HeroRotorSceneProps {
  activeTwin?: DigitalTwinType;
  onSelectTwin?: (twin: DigitalTwinType) => void;
  isTampered?: boolean;
  isVerifying?: boolean;
  temperature?: number;
  vibration?: number;
  className?: string;
  showSelector?: boolean;
}

export const HeroRotorScene: React.FC<HeroRotorSceneProps> = ({
  activeTwin = 'industry',
  onSelectTwin,
  isTampered = false,
  isVerifying = false,
  temperature = 41.2,
  vibration = 0.18,
  className = '',
  showSelector = false
}) => {
  const [internalTwin, setInternalTwin] = useState<DigitalTwinType>(activeTwin);
  const currentTwin = onSelectTwin ? activeTwin : internalTwin;
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const { isDark } = useTheme();

  const handleSelect = (twin: DigitalTwinType) => {
    setInternalTwin(twin);
    if (onSelectTwin) onSelectTwin(twin);
  };

  return (
    <div className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none ${className}`}>
      {/* Optional Interactive Twin Switcher Overlay */}
      {showSelector && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-sans shadow-xl">
          <button
            onClick={() => handleSelect('industry')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              currentTwin === 'industry'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🏭 Industry</span>
          </button>
          <button
            onClick={() => handleSelect('train')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              currentTwin === 'train'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🚆 Train (Vande Bharat)</span>
          </button>
          <button
            onClick={() => handleSelect('airplane')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              currentTwin === 'airplane'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>✈️ Airplane (Turbofan)</span>
          </button>
          <button
            onClick={() => handleSelect('defense')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
              currentTwin === 'defense'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🛡️ DRDO Defense</span>
          </button>
        </div>
      )}

      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <CameraRig onAssemblyUpdate={setAssemblyProgress} />

        <ambientLight intensity={isDark ? 0.45 : 0.8} />
        
        <directionalLight
          castShadow
          position={[6, 8, 6]}
          intensity={isDark ? 1.8 : 1.5}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        <directionalLight position={[-6, 2, -6]} intensity={isDark ? 1.2 : 0.8} color="#93C5FD" />
        <directionalLight position={[0, -4, 4]} intensity={isDark ? 0.3 : 0.5} color="#FDE68A" />

        <pointLight
          position={[0, 0, 0]}
          intensity={isTampered ? 2.5 : (isDark ? 0.9 : 0.5)}
          color={isTampered ? '#EF4444' : currentTwin === 'train' ? '#3B82F6' : currentTwin === 'airplane' ? '#00D2FF' : '#E8622C'}
          distance={5}
        />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
          {currentTwin === 'industry' && (
            <ProceduralTurbineRotor
              assemblyProgress={assemblyProgress}
              isTampered={isTampered}
              isVerifying={isVerifying}
              temperature={temperature}
              vibration={vibration}
            />
          )}

          {currentTwin === 'train' && (
            <ProceduralTrainBogie
              assemblyProgress={assemblyProgress}
              isTampered={isTampered}
              isVerifying={isVerifying}
              temperature={temperature}
              vibration={vibration}
            />
          )}

          {currentTwin === 'airplane' && (
            <ProceduralAirplaneJet
              assemblyProgress={assemblyProgress}
              isTampered={isTampered}
              isVerifying={isVerifying}
              temperature={temperature}
              vibration={vibration}
            />
          )}

          {currentTwin === 'defense' && (
            <ProceduralDefenseRadar
              assemblyProgress={assemblyProgress}
              isTampered={isTampered}
              isVerifying={isVerifying}
              temperature={temperature}
              vibration={vibration}
            />
          )}
        </Float>

        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={isDark ? 0.65 : 0.22}
          scale={7}
          blur={2.4}
          far={3.5}
          color="#000000"
        />

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

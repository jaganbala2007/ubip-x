import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useUBIP } from '../../context/UBIPContext';
import { Thermometer, Activity, Wind, ShieldAlert, CheckCircle2, Lock, Radio, Eye, Layers } from 'lucide-react';

interface DigitalTwin3DProps {
  interactive?: boolean;
  explodedView?: boolean;
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ interactive = true, explodedView = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedAsset, latestEvent, triggerScenario } = useUBIP();
  const [wireframeMode, setWireframeMode] = useState(false);
  const [cameraMode, setCameraMode] = useState<'ORBIT' | 'TOP' | 'FRONT'>('ORBIT');

  const currentTelemetry = latestEvent?.telemetry || selectedAsset?.latest_telemetry || {
    temperature: 42.4,
    vibration: 0.21,
    gas_ppm: 112,
    humidity: 48.5,
    battery_voltage: 3.95,
    location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
  };

  const assetState = selectedAsset?.state || 'ACTIVE';
  const isHeld = selectedAsset?.is_held || false;
  const isTampered = latestEvent?.is_tampered || assetState === 'TAMPERED';

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 6.2);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Cinematic Cockpit Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 2.8);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const underGlow = new THREE.PointLight(isTampered ? 0xef4444 : 0x00f2fe, 4, 12);
    underGlow.position.set(0, -1.8, 0);
    scene.add(underGlow);

    // 4. Asset Geometry: High-Precision Multi-Stage Turbine Assembly
    const rotorGroup = new THREE.Group();

    // Central Precision Shaft (Inconel Alloy Material)
    const shaftGeo = new THREE.CylinderGeometry(0.38, 0.38, 3.6, 64);
    const shaftColor = isTampered ? 0xef4444 : (assetState === 'ANOMALY' ? 0xf59e0b : 0x1a294d);
    
    const shaftMat = new THREE.MeshPhysicalMaterial({
      color: shaftColor,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      wireframe: wireframeMode,
      emissive: isTampered ? 0x991b1b : (assetState === 'ANOMALY' ? 0xb45309 : 0x00d2ff),
      emissiveIntensity: isTampered ? 0.7 : (assetState === 'ANOMALY' ? 0.4 : 0.08)
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    rotorGroup.add(shaft);

    // 3 Aerodynamic Stages with Swept Curved Blades
    const stageCount = 3;
    const bladesPerStage = 16;
    const stageGroups: THREE.Group[] = [];

    for (let s = 0; s < stageCount; s++) {
      const stageGroup = new THREE.Group();
      const targetY = (s - 1) * (explodedView ? 1.6 : 0.95);
      stageGroup.position.y = targetY;

      const stageRadius = 1.05 - s * 0.18;

      // Hub Disk
      const hubGeo = new THREE.CylinderGeometry(stageRadius * 0.6, stageRadius * 0.6, 0.16, 48);
      const hubMat = new THREE.MeshStandardMaterial({
        color: isTampered ? 0x7f1d1d : 0x0f172a,
        metalness: 0.95,
        roughness: 0.2,
        wireframe: wireframeMode
      });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      stageGroup.add(hub);

      // Curved Radial Aerofoil Blades
      for (let i = 0; i < bladesPerStage; i++) {
        const angle = (i / bladesPerStage) * Math.PI * 2;
        const bladeGeo = new THREE.BoxGeometry(0.06, 0.45, stageRadius * 0.8);
        
        // Dynamic Thermal Color Gradient
        let bladeColor = 0x00d2ff;
        if (currentTelemetry.temperature > 65 || isTampered) {
          bladeColor = 0xef4444;
        } else if (currentTelemetry.temperature > 50) {
          bladeColor = 0xf59e0b;
        } else if (currentTelemetry.temperature < -40) {
          bladeColor = 0x38bdf8;
        }

        const bladeMat = new THREE.MeshPhysicalMaterial({
          color: bladeColor,
          metalness: 0.88,
          roughness: 0.15,
          reflectivity: 0.9,
          clearcoat: 1.0,
          wireframe: wireframeMode,
          emissive: isTampered ? 0xff0000 : (currentTelemetry.temperature > 65 ? 0xf97316 : 0x000000),
          emissiveIntensity: isTampered ? 0.6 : (currentTelemetry.temperature > 65 ? 0.4 : 0.0)
        });

        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(Math.cos(angle) * (stageRadius * 0.55), 0, Math.sin(angle) * (stageRadius * 0.55));
        blade.rotation.y = -angle + 0.4;
        blade.rotation.z = 0.2;
        stageGroup.add(blade);
      }

      rotorGroup.add(stageGroup);
      stageGroups.push(stageGroup);
    }

    // 5. Holographic Orbital Ring & Acoustic Waves
    const ringGeo = new THREE.RingGeometry(1.6, 1.63, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isTampered ? 0xef4444 : 0x00d2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    rotorGroup.add(ring);

    // Dynamic Particle Cloud (Ambient Sensor Particles)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const idx = i / 3;
      const angle = (idx / particleCount) * Math.PI * 4;
      const radius = 1.2 + (idx % 5) * 0.4;
      particlePos[i] = Math.cos(angle) * radius;
      particlePos[i + 1] = ((idx % 7) - 3) * 0.4;
      particlePos[i + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: isTampered ? 0xef4444 : 0x00f2fe,
      size: 0.04,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Holographic Cage Forcefield when Held
    if (isHeld || isTampered) {
      const shieldGeo = new THREE.IcosahedronGeometry(2.6, 2);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: isTampered ? 0xef4444 : 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      rotorGroup.add(shield);
    }

    // Cockpit Horizon Grid
    const gridHelper = new THREE.GridHelper(12, 24, isTampered ? 0xef4444 : 0x00d2ff, 0x111b33);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    scene.add(rotorGroup);

    // 7. Interactive Controls & Inertial Damping
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      velX = deltaX * 0.006;
      velY = deltaY * 0.006;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Inertial Rotation & Telemetry Kinematics
      if (isDragging) {
        rotorGroup.rotation.y += velX;
        rotorGroup.rotation.x += velY;
      } else {
        velX *= 0.95;
        velY *= 0.95;
        rotorGroup.rotation.y += velX + 0.008 + (assetState === 'ANOMALY' ? 0.025 : 0);
        rotorGroup.rotation.x += velY;
      }

      // Orbital Ring Wave Pulse
      ring.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08);
      particles.rotation.y = elapsed * 0.05;

      // Vibration Harmonic Jitter
      if (currentTelemetry.vibration > 0.4) {
        const jitterIntensity = currentTelemetry.vibration * 0.035;
        rotorGroup.position.x = Math.sin(elapsed * 45) * jitterIntensity;
        rotorGroup.position.y = Math.cos(elapsed * 40) * jitterIntensity;
      } else {
        rotorGroup.position.x = 0;
        rotorGroup.position.y = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      renderer.dispose();
    };
  }, [selectedAsset, latestEvent, explodedView, wireframeMode, isHeld, isTampered, assetState]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-3xl overflow-hidden glass-cockpit border border-cyan-500/30 flex flex-col shadow-2xl">
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Left Cockpit Asset Telemetry HUD */}
      <div className="absolute top-5 left-5 pointer-events-none space-y-2 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white">{selectedAsset?.name || 'High-Pressure Turbine Rotor Blade #A9'}</span>
            <span className="text-cyan-400">({selectedAsset?.asset_id || 'ASSET-001'})</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg ${
            isTampered 
              ? 'bg-red-500/30 text-red-300 border border-red-500/60 animate-pulse'
              : (assetState === 'ANOMALY' 
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/60' 
                  : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60')
          }`}>
            {isTampered ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{isTampered ? 'CRITICAL: TAMPER LOCK' : `STATUS: ${assetState}`}</span>
          </div>

          {isHeld && (
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Lock className="w-4 h-4" />
              <span>SMART CONTRACT HOLD</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-400 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/5 inline-block">
          Sensor Node: <span className="text-slate-200">ESP32-001</span> | RFID: <span className="text-cyan-300 font-bold">UBIP-ASSET-001</span> | Sector: <span className="text-purple-300 capitalize">{selectedAsset?.sector || 'Supply Chain'}</span>
        </div>
      </div>

      {/* Floating Cockpit Radar & Sensor Gauges */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 pointer-events-auto font-mono text-xs">
        {/* Radar Scanner Pill */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/40 flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-full border border-cyan-400/60 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-transparent animate-radar" />
            <Radio className="w-4 h-4 text-cyan-400 z-10" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Orbital Mesh Stream</div>
            <div className="text-xs font-extrabold text-cyan-300">50 Hz Real-Time</div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/30 flex items-center gap-3 shadow-xl">
          <div className={`p-2 rounded-xl ${currentTelemetry.temperature > 65 ? 'bg-red-500/30 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Thermal Core</div>
            <div className={`text-sm font-extrabold ${currentTelemetry.temperature > 65 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              {currentTelemetry.temperature.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Vibration Kinematics Gauge */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/30 flex items-center gap-3 shadow-xl">
          <div className={`p-2 rounded-xl ${currentTelemetry.vibration > 1.0 ? 'bg-red-500/30 text-red-400' : 'bg-purple-500/20 text-purple-400'}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Harmonic Vibration</div>
            <div className={`text-sm font-extrabold ${currentTelemetry.vibration > 1.0 ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              {currentTelemetry.vibration.toFixed(3)} G
            </div>
          </div>
        </div>

        {/* Gas PPM Gauge */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/30 flex items-center gap-3 shadow-xl">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Gas PPM</div>
            <div className="text-sm font-extrabold text-slate-100">
              {currentTelemetry.gas_ppm} PPM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cockpit Quick Bar */}
      <div className="p-3.5 bg-black/80 backdrop-blur-md border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>WebGL 2.0 ACES Filmic Shaders Active</span>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{wireframeMode ? 'Solid Shader' : 'Holographic Wireframe'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button 
            onClick={() => triggerScenario('NORMAL')}
            className="px-3 py-1 rounded-lg bg-ubip-800 hover:bg-ubip-700 text-slate-200 text-[11px] font-bold transition-colors"
          >
            Nominal
          </button>
          <button 
            onClick={() => triggerScenario('ANOMALY')}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors"
          >
            Vibration Spike
          </button>
          <button 
            onClick={() => triggerScenario('TAMPER')}
            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-bold transition-colors"
          >
            Tamper Attack
          </button>
        </div>
      </div>
    </div>
  );
};

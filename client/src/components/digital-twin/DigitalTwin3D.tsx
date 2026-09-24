import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useUBIP } from '../../context/UBIPContext';
import { DigitalTwinType } from '../../types';
import { 
  Thermometer, Activity, Wind, ShieldAlert, CheckCircle2, Lock, Radio, Eye, Layers, 
  RotateCcw, Compass, Zap, Truck, Plane, Shield
} from 'lucide-react';

interface DigitalTwin3DProps {
  interactive?: boolean;
  explodedView?: boolean;
  activeTwin?: DigitalTwinType;
  onSelectTwin?: (twin: DigitalTwinType) => void;
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({ 
  interactive = true, 
  explodedView = false,
  activeTwin: externalActiveTwin,
  onSelectTwin
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedAsset, latestEvent, triggerScenario } = useUBIP();
  const [wireframeMode, setWireframeMode] = useState(false);
  const [internalTwin, setInternalTwin] = useState<DigitalTwinType>(externalActiveTwin || 'industry');
  const currentTwin = externalActiveTwin || internalTwin;

  const handleSelectTwin = (twin: DigitalTwinType) => {
    setInternalTwin(twin);
    if (onSelectTwin) onSelectTwin(twin);
  };

  const currentTelemetry = latestEvent?.telemetry || selectedAsset?.latest_telemetry || {
    temperature: currentTwin === 'airplane' ? 592.0 : currentTwin === 'train' ? 38.6 : 42.4,
    vibration: currentTwin === 'defense' ? 0.08 : currentTwin === 'train' ? 0.14 : 0.21,
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
    const height = container.clientHeight || 520;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070e, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 2.5);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const underGlow = new THREE.PointLight(isTampered ? 0xef4444 : 0x00f2fe, 4, 12);
    underGlow.position.set(0, -1.8, 0);
    scene.add(underGlow);

    // Master Group for Current Digital Twin
    const twinMasterGroup = new THREE.Group();
    scene.add(twinMasterGroup);

    // References for dynamic animations
    let rotatingComponent: THREE.Object3D | null = null;
    let secondaryRotatingComponent: THREE.Object3D | null = null;
    let acousticPulseRing: THREE.Mesh | null = null;

    // =====================================================================
    // BUILD MODEL 1: INDUSTRY (SUPERCRITICAL TURBINE ROTOR)
    // =====================================================================
    if (currentTwin === 'industry') {
      const rotorGroup = new THREE.Group();
      rotatingComponent = rotorGroup;

      const shaftGeo = new THREE.CylinderGeometry(0.36, 0.36, 3.6, 64);
      const shaftColor = isTampered ? 0xef4444 : (assetState === 'ANOMALY' ? 0xf59e0b : 0x1a294d);
      
      const shaftMat = new THREE.MeshPhysicalMaterial({
        color: shaftColor,
        metalness: 0.92,
        roughness: 0.18,
        clearcoat: 0.8,
        wireframe: wireframeMode,
        emissive: isTampered ? 0x991b1b : 0x000000
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      rotorGroup.add(shaft);

      const stageCount = 3;
      const bladesPerStage = 16;

      for (let s = 0; s < stageCount; s++) {
        const stageGroup = new THREE.Group();
        const targetY = (s - 1) * (explodedView ? 1.6 : 0.95);
        stageGroup.position.y = targetY;

        const stageRadius = 1.05 - s * 0.18;

        const hubGeo = new THREE.CylinderGeometry(stageRadius * 0.6, stageRadius * 0.6, 0.16, 48);
        const hubMat = new THREE.MeshStandardMaterial({
          color: isTampered ? 0x7f1d1d : 0x0f172a,
          metalness: 0.95,
          roughness: 0.2,
          wireframe: wireframeMode
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        stageGroup.add(hub);

        for (let i = 0; i < bladesPerStage; i++) {
          const angle = (i / bladesPerStage) * Math.PI * 2;
          const bladeGeo = new THREE.BoxGeometry(0.06, 0.45, stageRadius * 0.8);
          
          let bladeColor = 0x00d2ff;
          if (currentTelemetry.temperature > 65 || isTampered) {
            bladeColor = 0xef4444;
          } else if (currentTelemetry.temperature > 50) {
            bladeColor = 0xf59e0b;
          }

          const bladeMat = new THREE.MeshPhysicalMaterial({
            color: bladeColor,
            metalness: 0.88,
            roughness: 0.15,
            reflectivity: 0.9,
            clearcoat: 1.0,
            wireframe: wireframeMode,
            emissive: isTampered ? 0xff0000 : 0x000000
          });

          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(Math.cos(angle) * (stageRadius * 0.55), 0, Math.sin(angle) * (stageRadius * 0.55));
          blade.rotation.y = -angle + 0.4;
          blade.rotation.z = 0.2;
          stageGroup.add(blade);
        }

        rotorGroup.add(stageGroup);
      }

      // Orbital Ring
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
      acousticPulseRing = ring;

      twinMasterGroup.add(rotorGroup);
    }

    // =====================================================================
    // BUILD MODEL 2: TRAIN (VANDE BHARAT BOGIE & AXLE ASSEMBLY)
    // =====================================================================
    else if (currentTwin === 'train') {
      const trainGroup = new THREE.Group();
      const wheelsetGroup = new THREE.Group();
      rotatingComponent = wheelsetGroup;

      const explodeX = explodedView ? 0.7 : 0.0;
      const explodeY = explodedView ? 0.5 : 0.0;

      // Ground Rails & Ties
      const trackGroup = new THREE.Group();
      trackGroup.position.y = -1.1;

      const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2, wireframe: wireframeMode });
      const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 8), railMat);
      leftRail.position.x = -1.4;
      const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 8), railMat);
      rightRail.position.x = 1.4;
      trackGroup.add(leftRail, rightRail);

      for (let z = -3; z <= 3; z += 1.2) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.28), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, wireframe: wireframeMode }));
        tie.position.set(0, -0.1, z);
        trackGroup.add(tie);
      }
      trainGroup.add(trackGroup);

      // Solid Axle Shaft
      const axleGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.4, 32);
      const axleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.2, wireframe: wireframeMode });
      const axle = new THREE.Mesh(axleGeo, axleMat);
      axle.rotation.z = Math.PI / 2;
      wheelsetGroup.add(axle);

      // Left & Right Railway Wheels
      [-1, 1].forEach((side) => {
        const posX = side * (1.4 + explodeX);
        const wheelSub = new THREE.Group();
        wheelSub.position.x = posX;
        wheelSub.rotation.z = Math.PI / 2;

        const wheelDisc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.14, 40),
          new THREE.MeshStandardMaterial({ color: isTampered ? 0x991b1b : 0x475569, metalness: 0.95, roughness: 0.18, wireframe: wireframeMode })
        );
        const flange = new THREE.Mesh(
          new THREE.CylinderGeometry(1.08, 1.08, 0.05, 40),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25, wireframe: wireframeMode })
        );
        flange.position.y = -side * 0.08;

        const hubCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.26, 0.28, 0.18, 24),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2, wireframe: wireframeMode })
        );
        hubCap.position.y = side * 0.1;

        wheelSub.add(wheelDisc, flange, hubCap);
        wheelsetGroup.add(wheelSub);

        // Ventilated Brake Disc
        const discPos = side * (0.65 + explodeX * 0.5);
        const brakeDisc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.64, 0.64, 0.09, 32),
          new THREE.MeshStandardMaterial({ color: isTampered ? 0xef4444 : 0x64748b, metalness: 0.9, roughness: 0.2, wireframe: wireframeMode })
        );
        brakeDisc.position.x = discPos;
        brakeDisc.rotation.z = Math.PI / 2;
        wheelsetGroup.add(brakeDisc);
      });

      // Gearbox / Traction Diff
      const gearbox = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.62, 0.85),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3, wireframe: wireframeMode })
      );
      wheelsetGroup.add(gearbox);

      trainGroup.add(wheelsetGroup);

      // Stationary Axle Boxes
      [-1, 1].forEach((side) => {
        const boxX = side * (1.75 + explodeX * 1.4);
        const axleBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.46, 0.46),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, wireframe: wireframeMode })
        );
        axleBox.position.set(boxX, explodeY, 0);

        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 16, 16),
          new THREE.MeshBasicMaterial({ color: isTampered ? 0xef4444 : 0x22c55e })
        );
        led.position.set(side * 0.14, 0.12, 0);
        axleBox.add(led);
        trainGroup.add(axleBox);
      });

      // Ultrasonic Acoustic Ring
      const acousticRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.25, 0.015, 16, 48),
        new THREE.MeshBasicMaterial({ color: isTampered ? 0xef4444 : 0x00e599, transparent: true, opacity: 0.6 })
      );
      acousticRing.rotation.y = Math.PI / 2;
      trainGroup.add(acousticRing);
      acousticPulseRing = acousticRing;

      twinMasterGroup.add(trainGroup);
    }

    // =====================================================================
    // BUILD MODEL 3: AIRPLANE (TURBOFAN JET ENGINE CFM LEAP-1A)
    // =====================================================================
    else if (currentTwin === 'airplane') {
      const jetGroup = new THREE.Group();
      const fanGroup = new THREE.Group();
      const coreGroup = new THREE.Group();
      rotatingComponent = fanGroup;
      secondaryRotatingComponent = coreGroup;

      const explodeZ = explodedView ? 0.8 : 0.0;

      // Outer Bypass Cowl (Cutaway translucent)
      const cowlGeo = new THREE.CylinderGeometry(1.45, 1.38, 2.8, 36, 1, true);
      const cowlMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: explodedView ? 0.2 : 0.4,
        side: THREE.DoubleSide,
        wireframe: wireframeMode
      });
      const cowl = new THREE.Mesh(cowlGeo, cowlMat);
      cowl.rotation.x = Math.PI / 2;
      jetGroup.add(cowl);

      // Intake Lip
      const lip = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.08, 16, 36),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.12, wireframe: wireframeMode })
      );
      lip.position.z = 1.4 + explodeZ * 0.4;
      jetGroup.add(lip);

      // Front Fan Group
      fanGroup.position.z = 1.1 + explodeZ * 0.8;
      const noseCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 0.9, 32),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95, roughness: 0.15, wireframe: wireframeMode })
      );
      noseCone.rotation.x = Math.PI / 2;
      fanGroup.add(noseCone);

      // 22 Wide-Chord Swept Fan Blades
      for (let i = 0; i < 22; i++) {
        const angle = (i / 22) * Math.PI * 2;
        const bladeArm = new THREE.Group();
        bladeArm.rotation.z = angle;

        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.92, 0.18),
          new THREE.MeshStandardMaterial({
            color: isTampered ? 0x991b1b : 0x64748b,
            metalness: 0.92,
            roughness: 0.16,
            wireframe: wireframeMode
          })
        );
        blade.position.set(0, 0.46 + 0.32, 0);
        blade.rotation.set(0.25, 0.1, 0.2);
        bladeArm.add(blade);
        fanGroup.add(bladeArm);
      }
      jetGroup.add(fanGroup);

      // Core Spool
      coreGroup.position.z = -0.4;
      const coreSpool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.48, 1.8, 28),
        new THREE.MeshStandardMaterial({ color: isTampered ? 0xef4444 : 0x1e293b, metalness: 0.9, roughness: 0.25, wireframe: wireframeMode })
      );
      coreSpool.rotation.x = Math.PI / 2;
      coreGroup.add(coreSpool);
      jetGroup.add(coreGroup);

      // Rear Nozzle
      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.25, 0.6, 32, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.25, side: THREE.DoubleSide, wireframe: wireframeMode })
      );
      nozzle.position.z = -1.5 - explodeZ * 0.7;
      nozzle.rotation.x = Math.PI / 2;
      jetGroup.add(nozzle);

      // Exhaust Plume
      const plume = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 1.8, 24),
        new THREE.MeshBasicMaterial({ color: isTampered ? 0xef4444 : 0x00d2ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
      );
      plume.position.z = -2.4 - explodeZ * 0.7;
      plume.rotation.x = -Math.PI / 2;
      jetGroup.add(plume);
      acousticPulseRing = plume;

      twinMasterGroup.add(jetGroup);
    }

    // =====================================================================
    // BUILD MODEL 4: DEFENSE (DRDO TACTICAL AESA RADAR & AVIONICS)
    // =====================================================================
    else if (currentTwin === 'defense') {
      const defGroup = new THREE.Group();
      defGroup.position.y = -0.3;

      const explodeR = explodedView ? 0.6 : 0.0;

      // Base Pedestal
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.35, 0.45, 32),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.3, wireframe: wireframeMode })
      );
      pedestal.position.y = -0.7;
      defGroup.add(pedestal);

      // Rotating Turret Gimbal
      const turretGroup = new THREE.Group();
      rotatingComponent = turretGroup;

      [-0.85, 0.85].forEach((x) => {
        const yokeArm = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.9, 0.45),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.3, wireframe: wireframeMode })
        );
        yokeArm.position.set(x, -0.1, 0);
        turretGroup.add(yokeArm);
      });

      // AESA Radar Face
      const aesaBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 1.25, 0.18),
        new THREE.MeshStandardMaterial({ color: isTampered ? 0x7f1d1d : 0x0f172a, metalness: 0.92, roughness: 0.2, wireframe: wireframeMode })
      );
      aesaBox.position.set(0, 0.35 + explodeR * 0.4, 0);
      aesaBox.rotation.x = -0.25;

      const aesaTiles = new THREE.Mesh(
        new THREE.PlaneGeometry(1.45, 1.05),
        new THREE.MeshStandardMaterial({ color: isTampered ? 0xef4444 : 0x00e599, wireframe: true, emissive: isTampered ? 0xef4444 : 0x00e599, emissiveIntensity: 0.6 })
      );
      aesaTiles.position.z = 0.1;
      aesaBox.add(aesaTiles);
      turretGroup.add(aesaBox);

      // Missile Guidance Pods
      [-1, 1].forEach((side) => {
        const podX = side * (1.15 + explodeR);
        const pod = new THREE.Group();
        pod.position.set(podX, 0.15, 0);

        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 1.8, 20),
          new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2, wireframe: wireframeMode })
        );
        body.rotation.x = Math.PI / 2;

        const seeker = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.35, 20),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, wireframe: wireframeMode })
        );
        seeker.position.z = 1.05;
        seeker.rotation.x = Math.PI / 2;

        pod.add(body, seeker);
        turretGroup.add(pod);
      });

      defGroup.add(turretGroup);
      twinMasterGroup.add(defGroup);
    }

    // 5. Holographic Forcefield when Held/Tampered
    if (isHeld || isTampered) {
      const shieldGeo = new THREE.IcosahedronGeometry(2.7, 2);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: isTampered ? 0xef4444 : 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      twinMasterGroup.add(shield);
    }

    // Cockpit Horizon Grid
    const gridColor = isTampered ? 0xef4444 : currentTwin === 'train' ? 0x3b82f6 : currentTwin === 'airplane' ? 0x00d2ff : 0x00e599;
    const gridHelper = new THREE.GridHelper(12, 24, gridColor, 0x111b33);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // 6. Interactive Mouse Orbit & Damping
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

      // Drag inertia
      if (isDragging) {
        twinMasterGroup.rotation.y += velX;
        twinMasterGroup.rotation.x += velY;
      } else {
        velX *= 0.95;
        velY *= 0.95;
        twinMasterGroup.rotation.y += velX + (currentTwin === 'industry' ? 0.008 : 0.004);
        twinMasterGroup.rotation.x += velY;
      }

      // Model-specific internal kinematic rotation
      if (rotatingComponent) {
        if (currentTwin === 'industry') {
          rotatingComponent.rotation.y += delta * 1.5;
        } else if (currentTwin === 'train') {
          rotatingComponent.rotation.x += delta * 4.5;
        } else if (currentTwin === 'airplane') {
          rotatingComponent.rotation.z += delta * 6.5;
        } else if (currentTwin === 'defense') {
          rotatingComponent.rotation.y += delta * 1.2;
        }
      }

      if (secondaryRotatingComponent && currentTwin === 'airplane') {
        secondaryRotatingComponent.rotation.z += delta * 9.0;
      }

      if (acousticPulseRing) {
        const s = 1 + Math.sin(elapsed * 4) * 0.08;
        acousticPulseRing.scale.set(s, s, s);
      }

      // Vibration jitter
      if (currentTelemetry.vibration > 0.4) {
        const jitter = currentTelemetry.vibration * 0.035;
        twinMasterGroup.position.x = Math.sin(elapsed * 45) * jitter;
        twinMasterGroup.position.y = Math.cos(elapsed * 40) * jitter;
      } else {
        twinMasterGroup.position.x = 0;
        twinMasterGroup.position.y = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 520;
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
  }, [currentTwin, explodedView, wireframeMode, isHeld, isTampered, assetState]);

  // Model-specific descriptive labels
  const twinInfo = {
    industry: {
      name: 'Supercritical Turbine Rotor Unit-4',
      code: 'NTPC-660MW-ROT-4',
      sector: 'Energy & National Power Grid',
      spec: 'Inconel 718 Alloy • 3,000 RPM Synchronous Speed'
    },
    train: {
      name: 'Vande Bharat High-Speed Bogie & Axle',
      code: 'RDSO-VB-204-AXLE',
      sector: 'Indian Railways Rolling Stock',
      spec: 'Forged Railway Steel • 160 km/h Track Locked'
    },
    airplane: {
      name: 'CFM LEAP-1A High-Bypass Turbofan',
      code: 'DGCA-CFM-LEAP-902',
      sector: 'Civil Aviation Fleet Registry',
      spec: 'Carbon-Titanium 3D Fan • Mach 0.82 Cruising FL360'
    },
    defense: {
      name: 'DRDO UTTAM AESA Radar & Tactical Pod',
      code: 'DRDO-AESA-UTM-992',
      sector: 'Defense Systems & Tactical Avionics',
      spec: 'X-Band Phased Array • IFF Mode-5 Level-2 Authenticated'
    }
  }[currentTwin];

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden glass-cockpit border border-cyan-500/30 flex flex-col shadow-2xl">
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Twin Selector Pills */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl">
        <button
          onClick={() => handleSelectTwin('industry')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            currentTwin === 'industry'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>🏭 Industry</span>
        </button>

        <button
          onClick={() => handleSelectTwin('train')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            currentTwin === 'train'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>🚆 Train (Vande Bharat)</span>
        </button>

        <button
          onClick={() => handleSelectTwin('airplane')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            currentTwin === 'airplane'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>✈️ Airplane (Turbofan)</span>
        </button>

        <button
          onClick={() => handleSelectTwin('defense')}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
            currentTwin === 'defense'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>🛡️ Military DRDO</span>
        </button>
      </div>

      {/* Top Left Cockpit Asset Telemetry HUD */}
      <div className="absolute top-16 left-5 pointer-events-none space-y-2 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-500/40 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white">{twinInfo.name}</span>
            <span className="text-cyan-400">({twinInfo.code})</span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg ${
            isTampered 
              ? 'bg-red-500/30 text-red-300 border border-red-500/60 animate-pulse'
              : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60'
          }`}>
            {isTampered ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{isTampered ? 'CRITICAL: TAMPER LOCK' : 'STATUS: NOMINAL'}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/5 inline-block">
          Sector: <span className="text-purple-300 font-bold">{twinInfo.sector}</span> | Spec: <span className="text-slate-200">{twinInfo.spec}</span>
        </div>
      </div>

      {/* Floating Cockpit Sensor Gauges */}
      <div className="absolute top-16 right-5 flex flex-col gap-2 pointer-events-auto font-mono text-xs">
        {/* Radar Scanner Pill */}
        <div className="px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/40 flex items-center gap-3 shadow-xl">
          <div className="w-7 h-7 rounded-full border border-cyan-400/60 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-transparent animate-radar" />
            <Radio className="w-3.5 h-3.5 text-cyan-400 z-10" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Kinematic Sync</div>
            <div className="text-xs font-extrabold text-cyan-300">50 Hz Telemetry</div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/30 flex items-center gap-3 shadow-xl">
          <div className={`p-1.5 rounded-lg ${currentTelemetry.temperature > 65 ? 'bg-red-500/30 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Thermometer className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Thermal Core</div>
            <div className="text-xs font-extrabold text-slate-100">
              {currentTelemetry.temperature.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Vibration Kinematics Gauge */}
        <div className="px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-xl border border-cyan-500/30 flex items-center gap-3 shadow-xl">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-bold">Dynamic Impact</div>
            <div className="text-xs font-extrabold text-slate-100">
              {currentTelemetry.vibration.toFixed(3)} G
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cockpit Quick Bar */}
      <div className="p-3 bg-black/80 backdrop-blur-md border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>WebGL 2.0 ACES PBR Shaders</span>
          </span>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{wireframeMode ? 'Solid Mode' : 'Holographic Wireframe'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button 
            onClick={() => triggerScenario('nominal')}
            className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-colors"
          >
            Nominal
          </button>
          <button 
            onClick={() => triggerScenario('thermal-anomaly')}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition-colors"
          >
            Thermal Ramp
          </button>
          <button 
            onClick={() => triggerScenario('tamper-attack')}
            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] font-bold transition-colors"
          >
            Tamper Alert
          </button>
        </div>
      </div>
    </div>
  );
};

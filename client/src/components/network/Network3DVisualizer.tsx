import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSetu } from '../../context/SetuContext';
import { ValidatorNode } from '../../types';
import { Shield, Zap, Cpu, Server, Activity, CheckCircle2, RefreshCw } from 'lucide-react';

export const Network3DVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, selectedNode, setSelectedNode, consensusType, setConsensusType } = useSetu();
  const [viewMode, setViewMode] = useState<'3D' | '2D_MAP'>('3D');

  useEffect(() => {
    if (!containerRef.current || viewMode !== '3D') return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 3, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf97316, 1.5, 50);
    pointLight3.position.set(0, 10, -10);
    scene.add(pointLight3);

    // Group for all rotating objects
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Central Wireframe Globe (Bharat Ledger Sphere)
    const globeGeo = new THREE.SphereGeometry(2.8, 36, 36);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(2.4, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.85
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(core);

    // 2. Orbital Rings (Sovereign Consensus Rings)
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.63, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(3.9, 3.92, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    globeGroup.add(ring2);

    // 3. Particle Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 30;
      starPos[i + 1] = (Math.random() - 0.5) * 30;
      starPos[i + 2] = (Math.random() - 0.5) * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 4. Position Node Meshes on the Globe
    const nodeMeshes: { mesh: THREE.Mesh; nodeData: ValidatorNode }[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);

    nodes.forEach(node => {
      // Map lat/lng to 3D Sphere surface
      const phi = (90 - node.lat) * (Math.PI / 180);
      const theta = (node.lng + 180) * (Math.PI / 180);
      const radius = 2.85;

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const isMaster = node.role === 'Master Validator';
      const nodeColor = isMaster ? 0xf97316 : 0x3b82f6;

      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      globeGroup.add(nodeMesh);

      // Add a subtle pulsing glow halo around master nodes
      const haloGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(x, y, z);
      globeGroup.add(haloMesh);

      nodeMeshes.push({ mesh: nodeMesh, nodeData: node });
    });

    // 5. Connect Nodes with Dynamic Glowing Transaction Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });

    for (let i = 0; i < nodeMeshes.length; i++) {
      for (let j = i + 1; j < nodeMeshes.length; j++) {
        // Connect nearby nodes
        const dist = nodeMeshes[i].mesh.position.distanceTo(nodeMeshes[j].mesh.position);
        if (dist < 2.5) {
          const points = [nodeMeshes[i].mesh.position, nodeMeshes[j].mesh.position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          globeGroup.add(line);
        }
      }
    }

    // Interactive Raycasting for Click / Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const match = nodeMeshes.find(n => n.mesh === clickedMesh);
        if (match) {
          setSelectedNode(match.nodeData);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    let animationFrameId: number;
    let autoRotate = true;

    // Mouse drag for manual rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        globeGroup.rotation.y += 0.002;
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [nodes, viewMode, setSelectedNode]);

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Bharat Sovereign Consensus Network (10 National Enclaves)
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Byzantine Fault Tolerant topology spanning MeitY NIC, C-DAC, NPCI, IIITs, IITs & State Data Centres.
          </p>
        </div>

        {/* Controls: Consensus Mechanism & View Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Consensus Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setConsensusType('IBFT2')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                consensusType === 'IBFT2'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              IBFT 2.0 (Istanbul BFT)
            </button>
            <button
              onClick={() => setConsensusType('POA')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                consensusType === 'POA'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PoA (Sovereign Enclave)
            </button>
            <button
              onClick={() => setConsensusType('POS_ZKP')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                consensusType === 'POS_ZKP'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hybrid PoS-ZKP
            </button>
          </div>

          {/* 3D / 2D Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === '3D' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Globe Mesh
            </button>
            <button
              onClick={() => setViewMode('2D_MAP')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === '2D_MAP' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D State Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Visualization + Node Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Canvas / 2D View */}
        <div className="lg:col-span-8 bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden relative min-h-[550px] flex flex-col items-center justify-center p-4">
          {viewMode === '3D' ? (
            <>
              <div ref={containerRef} className="w-full h-[540px] cursor-grab active:cursor-grabbing" />
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Master Enclave (NIC / NPCI)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Regional Validator (CDAC / IIT)
                </span>
                <span className="text-slate-500">| Drag to rotate • Click node to inspect</span>
              </div>
            </>
          ) : (
            /* 2D Geographic State Matrix */
            <div className="w-full h-full p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nodes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedNode?.id === n.id
                      ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400">{n.city}, {n.state}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      {n.uptime}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{n.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <span>Latency: <strong className="text-slate-200">{n.latencyMs}ms</strong></span>
                    <span>Blocks: <strong className="text-slate-200">{n.blocksValidated.toLocaleString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Node Telemetry Inspector */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between backdrop-blur-xl space-y-6">
          {selectedNode ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-400 border border-blue-800/50">
                    {selectedNode.id}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedNode.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-3 leading-tight">
                  {selectedNode.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedNode.organization} • {selectedNode.city}, {selectedNode.state}
                </p>

                {/* Hardware Spec Badges */}
                <div className="mt-5 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>Confidential Computing Enclave</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      {selectedNode.enclaveType}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Server className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Host Hardware Architecture</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      {selectedNode.hardware}
                    </div>
                  </div>
                </div>

                {/* Consensus Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">P2P Latency</span>
                    <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                      {selectedNode.latencyMs} ms
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Vote Quorum</span>
                    <p className="text-base font-bold text-blue-400 font-mono mt-0.5">
                      {selectedNode.currentVote} (2F+1)
                    </p>
                  </div>
                </div>

                {/* Latest Block Hash */}
                <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Last Attested Block Hash
                  </span>
                  <p className="text-xs font-mono text-slate-300 mt-1 truncate">
                    {selectedNode.lastBlockHash}e8849b2011bc94
                  </p>
                </div>
              </div>

              {/* Consensus Workflow Explainer */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-orange-400" />
                  Active {consensusType} Pipeline
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 relative">
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-blue-900/60 border border-blue-500 flex items-center justify-center text-blue-300 font-bold mx-auto mb-1">
                      1
                    </div>
                    <span>Propose</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-blue-900/60 border border-blue-500 flex items-center justify-center text-blue-300 font-bold mx-auto mb-1">
                      2
                    </div>
                    <span>Pre-Prepare</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold mx-auto mb-1">
                      3
                    </div>
                    <span>Commit</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold mx-auto mb-1">
                      ✓
                    </div>
                    <span>Finality &lt;450ms</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 my-auto">
              Select a node from the 3D map to view hardware and consensus telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

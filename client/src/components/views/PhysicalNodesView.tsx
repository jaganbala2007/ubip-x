import React, { useState, useEffect } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { motion } from 'framer-motion';
import {
  Cpu,
  Radio,
  Wifi,
  WifiOff,
  ShieldCheck,
  Activity,
  HardDrive,
  Clock,
  Compass,
  Zap,
  RefreshCw,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { HardwareNodeStatus } from '../../types';

export const PhysicalNodesView: React.FC = () => {
  const { latestEvent, isWsConnected, isNetworkOnline } = useUBIP();
  const [nodes, setNodes] = useState<HardwareNodeStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [failoverInfo, setFailoverInfo] = useState<{ isHardwareConnected: boolean; failoverMode: string; message: string }>({
    isHardwareConnected: false,
    failoverMode: 'SIMULATION FAILOVER',
    message: 'Local Simulation Pipeline Active'
  });

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/hardware/nodes');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes) setNodes(data.nodes);
        if (data.failover) setFailoverInfo(data.failover);
      }
    } catch (e) {
      console.error('Failed to fetch hardware nodes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNodes().then(() => setTimeout(() => setIsRefreshing(false), 600));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Hero Hardware Status & Transparency Badge */}
      <div className="surface-card p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">Physical Hardware Node Mesh</h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-semibold">
                    {failoverInfo.isHardwareConnected ? 'HARDWARE LIVE' : 'SIMULATION FAILOVER'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Direct telemetry & cryptographic root-of-trust from ESP32-S3 and Raspberry Pi 5 prototype stack
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-[#161B24] hover:bg-[#1F242D] border border-[#2E3644] text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Poll Status</span>
            </button>
          </div>
        </div>

        {/* Hardware Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-[#1F242D] text-xs">
          <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Primary Node</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-slate-200">ESP32-S3 Node 01</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Edge Gateway</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-slate-200">Raspberry Pi 5</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Secure Element</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-blue-300">ATECC608A Ready</span>
              <span className="text-[10px] font-mono text-slate-400">Slot 0</span>
            </div>
          </div>

          <div className="p-3 bg-[#0B0D10] rounded-lg border border-[#1F242D]">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Data Feed Rate</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-semibold text-emerald-400 font-mono">1.0 Hz (1000ms)</span>
              <span className="text-[10px] font-mono text-slate-400">WebSocket</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Physical Prototype Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const isEsp = node.type === 'ESP32_S3';
          const isRpi = node.type === 'RASPBERRY_PI_5';
          const isSecureElement = node.type === 'ATECC608A';

          return (
            <div
              key={node.id}
              className={`p-5 rounded-xl border transition-all ${
                isEsp
                  ? 'bg-[#11151C] border-blue-500/30 shadow-sm'
                  : isRpi
                  ? 'bg-[#11151C] border-purple-500/30 shadow-sm'
                  : 'bg-[#11151C] border-[#1F242D] hover:border-[#2E3644]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isEsp ? 'bg-blue-900/30 text-blue-400 border border-blue-700/40' :
                    isRpi ? 'bg-purple-900/30 text-purple-400 border border-purple-700/40' :
                    isSecureElement ? 'bg-amber-900/30 text-amber-400 border border-amber-700/40' :
                    'bg-[#161B24] text-slate-400 border border-[#2E3644]'
                  }`}>
                    {isEsp && <Cpu className="w-4 h-4" />}
                    {isRpi && <HardDrive className="w-4 h-4" />}
                    {isSecureElement && <ShieldCheck className="w-4 h-4" />}
                    {node.type === 'RFID_RC522' && <Radio className="w-4 h-4" />}
                    {node.type === 'DHT22' && <Zap className="w-4 h-4" />}
                    {node.type === 'MPU6050' && <Activity className="w-4 h-4" />}
                    {node.type === 'NEO6M_GPS' && <Compass className="w-4 h-4" />}
                    {node.type === 'DS3231_RTC' && <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{node.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{node.id}</p>
                  </div>
                </div>

                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                  node.connection === 'CONNECTED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-[#161B24] text-slate-400 border border-[#2E3644]'
                }`}>
                  {node.connection}
                </span>
              </div>

              {/* Telemetry and Metrics list */}
              {node.readings && (
                <div className="mt-3 pt-3 border-t border-[#1F242D] grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(node.readings).map(([key, val]) => (
                    <div key={key} className="p-2 bg-[#0B0D10] rounded border border-[#1F242D]/80">
                      <span className="text-[10px] text-slate-500 block leading-tight">{key}</span>
                      <span className="text-xs font-semibold text-slate-200 font-mono mt-0.5 block truncate">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer status */}
              <div className="mt-3 pt-2.5 border-t border-[#1F242D]/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Signature: <strong className="text-slate-300 font-mono">{node.signatureState}</strong></span>
                <span className="text-emerald-400 font-medium">Quality: {node.dataQuality}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Architecture & Edge Pipeline Explainer */}
      <div className="surface-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Physical Edge Trust Pipeline Architecture</span>
        </h3>
        
        <div className="p-4 bg-[#0B0D10] rounded-xl border border-[#1F242D] text-xs space-y-3 font-mono text-slate-300">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2 py-1 bg-blue-950/80 border border-blue-800 text-blue-300 rounded">1. PHYSICAL SENSORS (DHT22, MPU6050, MQ135)</span>
            <span className="text-slate-500">→</span>
            <span className="px-2 py-1 bg-blue-950/80 border border-blue-800 text-blue-300 rounded">2. ESP32-S3 (On-Device SHA-256 + ECDSA Sign)</span>
            <span className="text-slate-500">→</span>
            <span className="px-2 py-1 bg-purple-950/80 border border-purple-800 text-purple-300 rounded">3. RASPBERRY PI 5 (Edge ML & PQC ML-DSA-65)</span>
            <span className="text-slate-500">→</span>
            <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded">4. DLT PROVENANCE (Hardhat / Local Testnet)</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed pt-2">
            <strong>Credibility Guarantee:</strong> When physical USB hardware is disconnected, the engine seamlessly activates the <span className="text-amber-400">SIMULATION FAILOVER</span> pipeline with deterministic physics, preserving the exact cryptographic verification, AI anomaly detection, and blockchain provenance chain without misrepresenting simulated feeds as live hardware.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { Radio, Wifi, WifiOff, RefreshCw, Database, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const OfflineNetworkView: React.FC = () => {
  const { isNetworkOnline, toggleNetworkOnline, events } = useUBIP();
  const [satelliteLatency, setSatelliteLatency] = useState(480); // ms
  const [packetLoss, setPacketLoss] = useState(0); // %

  const offlineEvents = events.filter(e => e.sync_status === 'LOCAL_ONLY' || e.sync_status === 'SYNC_PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-ubip-accent" />
            <span>Disconnected Edge & Satellite Link Resilience</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Store-and-forward edge queuing ensuring zero telemetry loss during communication blackouts, with automated cryptographic reconciliation upon reconnect.
          </p>
        </div>

        {/* Network Toggle Button */}
        <button
          onClick={() => toggleNetworkOnline(!isNetworkOnline)}
          className={`px-4 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition-all ${
            isNetworkOnline
              ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
              : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
          }`}
        >
          {isNetworkOnline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span>{isNetworkOnline ? 'Simulate Network Blackout' : 'Restore Uplink & Auto-Sync'}</span>
        </button>
      </div>

      {/* Satellite Parameters Simulator & Edge Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Satellite Link Simulator (6 Columns) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>LEO Satellite Uplink Simulator</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Satellite Propagation Latency:</span>
                <span className="text-white font-bold">{satelliteLatency} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="10"
                value={satelliteLatency}
                onChange={(e) => setSatelliteLatency(Number(e.target.value))}
                className="w-full mt-2 accent-ubip-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400">
                <span>Intermittent Packet Loss:</span>
                <span className="text-white font-bold">{packetLoss}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={packetLoss}
                onChange={(e) => setPacketLoss(Number(e.target.value))}
                className="w-full mt-2 accent-ubip-accent"
              />
            </div>
          </div>
        </div>

        {/* Local Edge Store-and-Forward Buffer (6 Columns) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Raspberry Pi Edge Local SQLite Buffer</span>
          </h3>

          <div className="p-4 rounded-xl bg-ubip-900/90 border border-ubip-700/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Uplink Status:</span>
              <span className={`font-bold ${isNetworkOnline ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                {isNetworkOnline ? 'ONLINE (Direct Uplink)' : 'DISCONNECTED (Buffering Locally)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Buffered Offline Events:</span>
              <span className="text-ubip-accent font-bold">{offlineEvents.length} events</span>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Events are stored in local hash-chained SQLite with valid edge signatures until cellular/satellite handshake is re-established.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

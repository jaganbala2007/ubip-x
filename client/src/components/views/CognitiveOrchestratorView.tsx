import React from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { Bot, ShieldCheck, Activity, Scale, Blocks, Radio, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CognitiveOrchestratorView: React.FC = () => {
  const { incidents } = useUBIP();

  const currentIncident = incidents[0] || {
    incident_id: 'INC-104821',
    event_id: 'EVT-000102',
    asset_id: 'ASSET-001',
    timestamp: new Date().toISOString(),
    trigger: 'Physical Ingestion Pipeline',
    decision: 'APPROVE_PROVENANCE',
    explanation: 'Asset operating safely within cryptographic and physical parameters. Provenance recorded on-chain.',
    agent_steps: [
      {
        agent_name: 'Asset Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'Physical telemetry strictly nominal across vibration (0.210G) and thermal (42.4°C) channels.',
        evidence_ref: 'EVT-000102'
      },
      {
        agent_name: 'Security Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'ECDSA secp256k1 signature authentic. Node ESP32-001 DID credential active.',
        evidence_ref: '0x03d98c...201e'
      },
      {
        agent_name: 'Compliance Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'Operating parameters comply with active sector regulatory envelope.',
        evidence_ref: 'UBIP-SEC-STD-101'
      },
      {
        agent_name: 'Blockchain Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'Genesis provenance parent hash verified. Ready to append block and award 15 UBIP tokens.',
        evidence_ref: '0x4d8a1e2f3...'
      },
      {
        agent_name: 'Communication Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'WebSocket / MQTT real-time uplink verified with 12ms latency.',
        evidence_ref: 'SyncState: SYNCED'
      },
      {
        agent_name: 'Explainability Agent',
        timestamp: new Date().toISOString(),
        status: 'INFO',
        statement: 'Multi-factor composite trust index evaluated at 98.4/100.',
        evidence_ref: 'Score: 98.4%'
      },
      {
        agent_name: 'Cognitive Orchestrator',
        timestamp: new Date().toISOString(),
        status: 'ACTION_TAKEN',
        statement: 'FINAL DIRECTIVE: [APPROVE_PROVENANCE]. Telemetry committed to local blockchain.',
        evidence_ref: 'Block #104821'
      }
    ]
  };

  const getAgentIcon = (name: string) => {
    switch (name) {
      case 'Asset Agent': return Activity;
      case 'Security Agent': return ShieldCheck;
      case 'Compliance Agent': return Scale;
      case 'Blockchain Agent': return Blocks;
      case 'Communication Agent': return Radio;
      case 'Explainability Agent': return HelpCircle;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-extrabold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span>Autonomous Cognitive Trust Orchestrator</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            7-Agent collaborative consensus coordinating physical kinematics, cryptographic signatures, sector SLAs, and on-chain emergency containment.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
          Decision: {currentIncident.decision}
        </span>
      </div>

      {/* Incident Trace Detail Card */}
      <div className="p-6 rounded-2xl bg-ubip-850 border border-ubip-700/60 space-y-6 font-mono text-xs">
        {/* Incident Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ubip-700/50">
          <div>
            <span className="text-[10px] text-slate-400 uppercase">Active Incident Trace:</span>
            <div className="text-sm font-bold text-white mt-0.5">{currentIncident.incident_id} ({currentIncident.trigger})</div>
          </div>
          <div className="text-slate-400 text-[11px]">
            Target: <span className="text-ubip-accent">{currentIncident.asset_id}</span> ({currentIncident.event_id})
          </div>
        </div>

        {/* 7 Agents Step-by-Step Chain */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Multi-Agent Step-by-Step Reasoning Trace:
          </h3>

          <div className="space-y-2.5">
            {currentIncident.agent_steps.map((step, idx) => {
              const Icon = getAgentIcon(step.agent_name);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    step.status === 'ALERT' 
                      ? 'bg-red-950/30 border-red-500/50 text-red-200' 
                      : step.status === 'ACTION_TAKEN'
                      ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                      : 'bg-ubip-900/80 border-ubip-700/40 text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    step.status === 'ALERT' ? 'bg-red-500/20 text-red-400' :
                    step.status === 'ACTION_TAKEN' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{step.agent_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Ref: {step.evidence_ref}</span>
                    </div>
                    <p className="text-xs text-slate-300">{step.statement}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

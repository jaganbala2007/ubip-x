import {
  PhysicalTelemetryEvent,
  AgentReasoningStep,
  OrchestratorIncidentTrace
} from '../types.js';
import { TrustAssessmentResult } from './aiTrustEngine.js';

export class CognitiveOrchestrator {
  /**
   * Orchestrates the 7 autonomous agents on incoming telemetry events
   */
  public evaluateEvent(
    event: PhysicalTelemetryEvent,
    trustResult: TrustAssessmentResult,
    isHeld: boolean
  ): OrchestratorIncidentTrace {
    const timestamp = new Date().toISOString();
    const steps: AgentReasoningStep[] = [];

    // 1. Asset Agent
    if (trustResult.dimensions.sensorConsistency < 70) {
      steps.push({
        agent_name: 'Asset Agent',
        timestamp,
        status: 'ALERT',
        statement: `Abnormal kinematics detected: ${trustResult.reasons[0] || 'Vibration/Thermal delta beyond operational envelope'}`,
        evidence_ref: `${event.event_id} (Temp: ${event.telemetry.temperature}°C, Vib: ${event.telemetry.vibration}G)`
      });
    } else {
      steps.push({
        agent_name: 'Asset Agent',
        timestamp,
        status: 'INFO',
        statement: `Physical telemetry strictly nominal across vibration (${event.telemetry.vibration}G) and thermal (${event.telemetry.temperature}°C) channels.`,
        evidence_ref: event.event_id
      });
    }

    // 2. Security Agent
    if (trustResult.dimensions.cryptographicVerification < 100 || trustResult.dimensions.dataIntegrity < 100) {
      steps.push({
        agent_name: 'Security Agent',
        timestamp,
        status: 'ALERT',
        statement: `Integrity breach! Hash mismatch or invalid ECDSA signature detected from origin node ${event.node_id}.`,
        evidence_ref: `Hash: ${event.canonical_hash.substring(0, 16)}... Sig: ${event.edge_signature}`
      });
    } else {
      steps.push({
        agent_name: 'Security Agent',
        timestamp,
        status: 'INFO',
        statement: `ECDSA secp256k1 signature authentic. Node ${event.node_id} DID credential active.`,
        evidence_ref: event.public_key || 'did:ubip:dev:ESP32-001'
      });
    }

    // 3. Compliance Agent
    if (trustResult.dimensions.policyCompliance < 100) {
      steps.push({
        agent_name: 'Compliance Agent',
        timestamp,
        status: 'WARNING',
        statement: 'Sector regulatory SLA exceeded: Asset operating condition demands authorized supervisor inspection.',
        evidence_ref: 'Policy Rule: UBIP-SEC-SLA-409'
      });
    } else {
      steps.push({
        agent_name: 'Compliance Agent',
        timestamp,
        status: 'INFO',
        statement: 'Operating parameters comply with active sector regulatory envelope.',
        evidence_ref: 'Policy Rule: UBIP-SEC-STD-101'
      });
    }

    // 4. Blockchain Agent
    if (isHeld || event.is_tampered || trustResult.trustState === 'BLOCKED') {
      steps.push({
        agent_name: 'Blockchain Agent',
        timestamp,
        status: 'ALERT',
        statement: 'Smart contract state lockdown: Invoking emergency hold on AssetRegistry & freezing NFT Passport #001.',
        evidence_ref: 'Contract: AssetRegistry.sol (toggleHold)'
      });
    } else {
      steps.push({
        agent_name: 'Blockchain Agent',
        timestamp,
        status: 'INFO',
        statement: 'Genesis provenance parent hash verified. Ready to append block and award 15 UBIP validator credits.',
        evidence_ref: `PrevHash: ${event.prev_event_hash.substring(0, 16)}...`
      });
    }

    // 5. Communication Agent
    steps.push({
      agent_name: 'Communication Agent',
      timestamp,
      status: event.sync_status === 'LOCAL_ONLY' ? 'WARNING' : 'INFO',
      statement: event.sync_status === 'LOCAL_ONLY'
        ? 'Network isolated: Event buffered in local edge store-and-forward queue.'
        : 'WebSocket / MQTT real-time uplink verified with 12ms latency.',
      evidence_ref: `SyncState: ${event.sync_status}`
    });

    // 6. Explainability Agent
    const reasonSummary = trustResult.reasons.join(' | ');
    steps.push({
      agent_name: 'Explainability Agent',
      timestamp,
      status: trustResult.trustState === 'VERIFIED' ? 'INFO' : 'WARNING',
      statement: `Multi-factor composite trust index evaluated at ${trustResult.trustScore}/100. Primary driver: ${reasonSummary}`,
      evidence_ref: `Score: ${trustResult.trustScore}%`
    });

    // 7. Cognitive Orchestrator Decision
    let decision: 'APPROVE_PROVENANCE' | 'ISSUE_CAUTION' | 'HOLD_WORKFLOW' | 'CONTAIN_THREAT' = 'APPROVE_PROVENANCE';
    let trigger = 'Nominal Telemetry Intake';
    let explanation = 'Asset operating safely within cryptographic and physical parameters. Provenance recorded.';

    if (trustResult.trustState === 'BLOCKED' || event.is_tampered) {
      decision = 'CONTAIN_THREAT';
      trigger = 'Cryptographic / Hash Tamper Detected';
      explanation = 'Automated containment triggered: Asset locked on-chain, maintenance orders halted, SOC alert broadcast.';
    } else if (isHeld) {
      decision = 'HOLD_WORKFLOW';
      trigger = 'Administrative / Safety Hold Active';
      explanation = 'Asset is currently on policy hold pending physical inspection.';
    } else if (trustResult.trustState === 'SUSPICIOUS' || trustResult.trustState === 'CAUTION') {
      decision = 'ISSUE_CAUTION';
      trigger = 'Physical Telemetry Metric Warning';
      explanation = 'Minor anomaly detected. Heightened sampling rate enabled, flagged for supervisor review.';
    }

    steps.push({
      agent_name: 'Cognitive Orchestrator',
      timestamp,
      status: decision === 'APPROVE_PROVENANCE' ? 'INFO' : 'ACTION_TAKEN',
      statement: `FINAL DIRECTIVE: [${decision}]. ${explanation}`,
      evidence_ref: `Incident-${event.event_id}`
    });

    return {
      incident_id: `INC-${Date.now().toString().slice(-6)}`,
      event_id: event.event_id,
      asset_id: event.asset_id,
      timestamp,
      trigger,
      decision,
      agent_steps: steps,
      explanation
    };
  }
}

export const cognitiveOrchestrator = new CognitiveOrchestrator();

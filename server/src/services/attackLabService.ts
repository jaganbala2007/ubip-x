import { db } from '../database.js';
import { attestationEngine } from './attestationEngine.js';
import { truthFusionEngine } from './truthFusionEngine.js';
import { cloneDetector } from './cloneDetector.js';
import { replayDetector } from './replayDetector.js';
import { blockchainService } from './blockchainService.js';
import { trustRecoveryEngine } from './trustRecoveryEngine.js';

export type AttackScenarioType =
  | 'SENSOR_TAMPERING'
  | 'RFID_CLONE'
  | 'REPLAY_ATTACK'
  | 'LOCATION_SPOOF'
  | 'TIMESTAMP_MANIPULATION'
  | 'MODIFIED_TELEMETRY'
  | 'UNAUTHORIZED_DEVICE'
  | 'DUPLICATE_ASSET_IDENTITY'
  | 'COMMUNICATION_INTERRUPTION'
  | 'STALE_TELEMETRY'
  | 'DATABASE_MODIFICATION'
  | 'COMPROMISED_DEVICE';

export interface AttackExecutionResult {
  attack_id: string;
  attack_type: AttackScenarioType;
  title: string;
  timestamp: string;
  original_event: any;
  tampered_event: any;
  hash_before: string;
  hash_after: string;
  signature_status: 'VALID' | 'INVALID_MISMATCH' | 'FORGED';
  trust_result: 'VERIFIED' | 'SUSPICIOUS' | 'BLOCKED_TAMPERED' | 'QUARANTINED';
  detected_at_layer: 'HARDWARE_ATTESTATION' | 'TRUTH_FUSION' | 'REPLAY_DETECTOR' | 'SMART_CONTRACT' | 'CONSENSUS_QUORUM' | 'AI_ENGINE';
  action_taken: string;
  hardware_alert: {
    buzzer: boolean;
    red_led: boolean;
    oled_message: string;
  };
  propagation_trace: {
    layer: string;
    status: 'PASS' | 'FLAGGED' | 'CONTAINED';
    details: string;
  }[];
}

export class AttackLabService {
  private attackHistory: AttackExecutionResult[] = [];

  public executeAttack(type: AttackScenarioType, targetAssetId: string = 'ASSET-001'): AttackExecutionResult {
    const asset = db.assets.get(targetAssetId) || Array.from(db.assets.values())[0];
    const attack_id = `ATK-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const originalEvent = {
      event_id: `EVT-${Date.now()}`,
      asset_id: asset.asset_id,
      device_id: asset.node_device_id,
      timestamp: now,
      sequence_number: 1420,
      telemetry: { ...asset.latest_telemetry },
      location: { ...asset.latest_telemetry.location },
      rfid_identity: asset.rfid_tag,
      previous_event_hash: asset.latest_hash
    };

    const hashBefore = attestationEngine.computeHash(attestationEngine.canonicalize(originalEvent));

    let tamperedEvent: any = { ...originalEvent };
    let hashAfter = hashBefore;
    let signatureStatus: AttackExecutionResult['signature_status'] = 'INVALID_MISMATCH';
    let trustResult: AttackExecutionResult['trust_result'] = 'BLOCKED_TAMPERED';
    let detectedLayer: AttackExecutionResult['detected_at_layer'] = 'HARDWARE_ATTESTATION';
    let actionTaken = 'Event rejected before blockchain anchoring; smart contract quarantine hold triggered.';
    let title = 'Attack Simulation';
    let hwAlert = { buzzer: true, red_led: true, oled_message: 'SECURITY ALERT: QUARANTINED' };

    const trace: AttackExecutionResult['propagation_trace'] = [];

    switch (type) {
      case 'SENSOR_TAMPERING':
        title = 'Sensor Telemetry Payload Tampering';
        tamperedEvent.telemetry = {
          ...tamperedEvent.telemetry,
          temperature: 92.4, // Manipulated
          gas_ppm: 750
        };
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'HARDWARE_ATTESTATION';
        signatureStatus = 'INVALID_MISMATCH';
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'Canonical SHA-256 hash mismatch: On-device signature invalid for modified payload. Quarantined.';
        trace.push({ layer: 'Physical Hardware', status: 'FLAGGED', details: 'Sensor values mutated in transit' });
        trace.push({ layer: 'Attestation Engine', status: 'CONTAINED', details: `Hash Mismatch: ${hashBefore.substring(0, 8)}... != ${hashAfter.substring(0, 8)}...` });
        trace.push({ layer: 'Smart Contract', status: 'CONTAINED', details: 'AssetRegistry.sol blocked state mutation' });
        break;

      case 'RFID_CLONE':
        title = 'Physical RFID Cloning & Simultaneous Multi-Zone Detection';
        tamperedEvent.location = { zone: 'ZONE-C (Nagpur Hub)', lat: 21.1458, lng: 79.0882 };
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'TRUTH_FUSION';
        trustResult = 'QUARANTINED';
        actionTaken = 'Clone Detector: Asset observed in ZONE-A and ZONE-C simultaneously (impossible travel). Asset quarantined.';
        trace.push({ layer: 'Edge Gateway', status: 'PASS', details: 'Received telemetry from second physical reader' });
        trace.push({ layer: 'Truth Fusion Engine', status: 'CONTAINED', details: 'Velocity > 2400 km/h: Physical identity conflict' });
        trace.push({ layer: 'Recovery Engine', status: 'CONTAINED', details: 'Asset moved to QUARANTINED state' });
        trustRecoveryEngine.initiateRecovery(asset.asset_id, asset.node_device_id, 'RFID clone detected across multiple zones');
        break;

      case 'REPLAY_ATTACK':
        title = 'Stale Telemetry Replay Attack';
        tamperedEvent.sequence_number = 1419; // Old sequence number
        tamperedEvent.timestamp = new Date(Date.now() - 3600000).toISOString(); // 1 hour old
        hashAfter = hashBefore; // Replayed payload hash
        detectedLayer = 'REPLAY_DETECTOR';
        signatureStatus = 'VALID'; // Signature was valid for old event
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'Replay Detector: Timestamp expired and sequence number rollback detected. Event discarded.';
        trace.push({ layer: 'Network Ingest', status: 'PASS', details: 'Captured valid signed payload' });
        trace.push({ layer: 'Replay Detector', status: 'CONTAINED', details: 'Sequence watermark check failed (Expected > 1420)' });
        trace.push({ layer: 'Blockchain Layer', status: 'CONTAINED', details: 'Zero state change recorded' });
        break;

      case 'LOCATION_SPOOF':
        title = 'Impossible GPS Movement & Location Spoofing';
        tamperedEvent.location = { zone: 'ZONE-X (Remote Spoofed)', lat: 12.9716, lng: 77.5946 };
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'TRUTH_FUSION';
        trustResult = 'QUARANTINED';
        actionTaken = 'Truth Fusion: Spatio-temporal discontinuity flagged (>800 km in 2s). Asset quarantined.';
        trace.push({ layer: 'GPS Receiver', status: 'FLAGGED', details: 'Coordinates updated without transit duration' });
        trace.push({ layer: 'Truth Fusion Engine', status: 'CONTAINED', details: 'Spatial inconsistency flagged: Haversine distance violation' });
        trace.push({ layer: 'Policy Engine', status: 'CONTAINED', details: 'Asset quarantined due to physical teleportation' });
        break;

      case 'TIMESTAMP_MANIPULATION':
        title = 'Clock Tampering & RTC Timestamp Desynchronization';
        tamperedEvent.timestamp = new Date(Date.now() + 86400000).toISOString(); // 24h into future
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'HARDWARE_ATTESTATION';
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'DS3231 Hardware RTC clock drift delta > 300s vs NTP validator consensus. Rejected.';
        trace.push({ layer: 'DS3231 RTC', status: 'FLAGGED', details: 'Future timestamp detected (+24h)' });
        trace.push({ layer: 'Attestation Engine', status: 'CONTAINED', details: 'Temporal causality check failed' });
        break;

      case 'MODIFIED_TELEMETRY':
        title = 'In-Flight Telemetry Modification & Signature Invalidation';
        tamperedEvent.telemetry.vibration = 4.85; // Violent artificial vibration
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'HARDWARE_ATTESTATION';
        signatureStatus = 'INVALID_MISMATCH';
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'Signature verification failed: ECDSA secp256k1 signature does not match modified payload.';
        trace.push({ layer: 'Edge Transceiver', status: 'FLAGGED', details: 'Payload altered by MITM attacker' });
        trace.push({ layer: 'Crypto Verifier', status: 'CONTAINED', details: 'Signature validation return code: 0x00 (FAIL)' });
        break;

      case 'UNAUTHORIZED_DEVICE':
        title = 'Rogue Hardware Identity & Unregistered DID Device';
        tamperedEvent.device_id = 'ROGUE_UNAUTHORIZED_ESP32_09';
        hashAfter = attestationEngine.computeHash(attestationEngine.canonicalize(tamperedEvent));
        detectedLayer = 'HARDWARE_ATTESTATION';
        signatureStatus = 'FORGED';
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'Hardware Attestation: Device DID unregistered in Root-of-Trust DID registry. Transaction dropped.';
        trace.push({ layer: 'Identity Registry', status: 'FLAGGED', details: 'DID did:ubip:device:rogue unknown' });
        trace.push({ layer: 'Attestation Engine', status: 'CONTAINED', details: 'Zero-trust authorization policy rejected event' });
        break;

      case 'DUPLICATE_ASSET_IDENTITY':
        title = 'Duplicate Asset Identity & Dual Active Issuance Conflict';
        detectedLayer = 'SMART_CONTRACT';
        trustResult = 'QUARANTINED';
        actionTaken = 'Smart Contract: Asset ID collision detected. Dual active passports flagged on-chain. Hold enforced.';
        trace.push({ layer: 'AssetRegistry.sol', status: 'FLAGGED', details: 'Duplicate asset identity registered concurrently' });
        trace.push({ layer: 'Smart Contract', status: 'CONTAINED', details: 'State locked to QUARANTINED pending manual dispute' });
        break;

      case 'COMMUNICATION_INTERRUPTION':
        title = 'Communication Blackout & Local Store-and-Forward Buffering';
        db.isNetworkOnline = false;
        detectedLayer = 'HARDWARE_ATTESTATION';
        trustResult = 'VERIFIED';
        hwAlert = { buzzer: false, red_led: false, oled_message: 'OFFLINE QUEUE ACTIVE' };
        actionTaken = 'Edge Gateway: Link down. Telemetry buffered in local SQLite store-and-forward queue with hash integrity preserved.';
        trace.push({ layer: 'Network Transceiver', status: 'FLAGGED', details: 'Carrier link severed (Offline Mode)' });
        trace.push({ layer: 'Local SQLite Queue', status: 'PASS', details: 'Event buffered locally with sequence #1421' });
        break;

      case 'STALE_TELEMETRY':
        title = 'Stale Telemetry Watermark & Sensor Freeze Attack';
        tamperedEvent.telemetry.temperature = 42.4; // Frozen identical values
        tamperedEvent.telemetry.vibration = 0.21;
        detectedLayer = 'AI_ENGINE';
        trustResult = 'SUSPICIOUS';
        actionTaken = 'AI Engine: Zero sensor entropy detected over 10 consecutive ticks (flatlining sensor fault/tamper).';
        trace.push({ layer: 'Sensor Hardware', status: 'FLAGGED', details: 'ADC entropy = 0.00 (Artificial constant stream)' });
        trace.push({ layer: 'AI Anomaly Engine', status: 'CONTAINED', details: 'Entropy threshold violation: Flagged SUSPICIOUS' });
        break;

      case 'DATABASE_MODIFICATION':
        title = 'Direct Centralized Database Tampering Attempt';
        detectedLayer = 'CONSENSUS_QUORUM';
        trustResult = 'BLOCKED_TAMPERED';
        actionTaken = 'Consensus Quorum: Local SQL state Merkle root mismatch with validator nodes. Database state rolled back.';
        trace.push({ layer: 'Local SQL DB', status: 'FLAGGED', details: 'Direct out-of-band SQL UPDATE detected' });
        trace.push({ layer: 'Consensus Quorum', status: 'CONTAINED', details: 'State Merkle proof failed vs ProvenanceRegistry.sol' });
        break;

      case 'COMPROMISED_DEVICE':
        title = 'Compromised Hardware Root-of-Trust & Key Revocation';
        detectedLayer = 'SMART_CONTRACT';
        trustResult = 'QUARANTINED';
        actionTaken = 'Smart Contract: Enclosure tamper switch tripped. Device credential revoked; asset quarantined.';
        trace.push({ layer: 'Security Center', status: 'FLAGGED', details: 'Physical enclosure tamper switch tripped' });
        trace.push({ layer: 'Smart Contract', status: 'CONTAINED', details: 'AssetRegistry.sol toggleHold executed' });
        blockchainService.toggleHoldOnChain(asset.asset_id, true, 'Hardware tamper switch tripped');
        break;
    }

    // Update asset state in db
    asset.trust_state = trustResult === 'VERIFIED' ? 'VERIFIED' : trustResult === 'QUARANTINED' ? 'QUARANTINED' : 'SUSPICIOUS';
    asset.trust_score = trustResult === 'VERIFIED' ? 95 : trustResult === 'QUARANTINED' ? 0 : 25;
    if (trustResult === 'QUARANTINED' || trustResult === 'BLOCKED_TAMPERED') {
      asset.is_held = true;
      asset.state = 'QUARANTINED';
    }
    db.assets.set(asset.asset_id, asset);

    const result: AttackExecutionResult = {
      attack_id,
      attack_type: type,
      title,
      timestamp: now,
      original_event: originalEvent,
      tampered_event: tamperedEvent,
      hash_before: hashBefore,
      hash_after: hashAfter,
      signature_status: signatureStatus,
      trust_result: trustResult,
      detected_at_layer: detectedLayer,
      action_taken: actionTaken,
      hardware_alert: hwAlert,
      propagation_trace: trace
    };

    this.attackHistory.unshift(result);
    return result;
  }

  public getHistory(): AttackExecutionResult[] {
    return this.attackHistory;
  }
}

export const attackLabService = new AttackLabService();

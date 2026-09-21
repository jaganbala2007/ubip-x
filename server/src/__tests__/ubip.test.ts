import { describe, it, expect } from 'vitest';
import { aiTrustEngine } from '../services/aiTrustEngine.js';
import { hardwareManager } from '../services/hardwareManager.js';
import { pqcService } from '../services/pqcService.js';
import { zkpService } from '../services/zkpService.js';
import { dnaService } from '../services/dnaService.js';
import { federatedLearningService } from '../services/federatedLearningService.js';
import { sectorService } from '../services/sectorService.js';
import { attestationEngine } from '../services/attestationEngine.js';
import { truthFusionEngine } from '../services/truthFusionEngine.js';
import { cloneDetector } from '../services/cloneDetector.js';
import { replayDetector } from '../services/replayDetector.js';
import { w3cCredentialService } from '../services/w3cCredentialService.js';
import { disputeEngine } from '../services/disputeEngine.js';
import { trustRecoveryEngine } from '../services/trustRecoveryEngine.js';
import { attackLabService } from '../services/attackLabService.js';

describe('UBIP-X Core Engine Unit Tests', () => {
  it('1. Computes deterministic SHA-256 canonical hash', () => {
    const hash1 = hardwareManager.computeCanonicalHash({
      event_id: 'EVT-000001',
      asset_id: 'ASSET-001',
      rfid_tag: 'UBIP-ASSET-001',
      node_id: 'ESP32-001',
      sequence_number: 1,
      telemetry: {
        temperature: 42.4,
        vibration: 0.21,
        gas_ppm: 112,
        humidity: 48.5,
        battery_voltage: 3.95,
        location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
      },
      prev_event_hash: '0000000000000000000000000000000000000000000000000000000000000000'
    });

    const hash2 = hardwareManager.computeCanonicalHash({
      event_id: 'EVT-000001',
      asset_id: 'ASSET-001',
      rfid_tag: 'UBIP-ASSET-001',
      node_id: 'ESP32-001',
      sequence_number: 1,
      telemetry: {
        temperature: 42.4,
        vibration: 0.21,
        gas_ppm: 112,
        humidity: 48.5,
        battery_voltage: 3.95,
        location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
      },
      prev_event_hash: '0000000000000000000000000000000000000000000000000000000000000000'
    });

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });

  it('2. Detects thermal and vibration anomaly via EWMA and Z-score', () => {
    const normalTelemetry = {
      temperature: 42.1,
      vibration: 0.21,
      gas_ppm: 110,
      humidity: 50.0,
      battery_voltage: 4.0,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    };
    const normalResult = aiTrustEngine.analyzeTelemetry(normalTelemetry);
    expect(normalResult.isAnomaly).toBe(false);
    expect(normalResult.severity).toBe('NORMAL');

    const anomalyTelemetry = {
      temperature: 88.5,
      vibration: 2.85,
      gas_ppm: 450,
      humidity: 50.0,
      battery_voltage: 4.0,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    };
    const anomalyResult = aiTrustEngine.analyzeTelemetry(anomalyTelemetry);
    expect(anomalyResult.isAnomaly).toBe(true);
    expect(anomalyResult.severity).toBe('CRITICAL');
    expect(anomalyResult.reasons.length).toBeGreaterThan(0);
  });

  it('3. Runs PQC benchmark measuring ML-KEM and ML-DSA', () => {
    const benchmarks = pqcService.runLiveBenchmark();
    expect(benchmarks.length).toBe(4);
    
    const mlkem = benchmarks.find(b => b.algorithm === 'ML-KEM-768');
    const mldsa = benchmarks.find(b => b.algorithm === 'ML-DSA-65');
    const ecdsa = benchmarks.find(b => b.algorithm === 'ECDSA-secp256k1');

    expect(mlkem?.quantumResistant).toBe(true);
    expect(mldsa?.quantumResistant).toBe(true);
    expect(ecdsa?.quantumResistant).toBe(false);
  });

  it('4. Generates and verifies Zero-Knowledge Proof', () => {
    const proof = zkpService.generateAndVerifyProof(3, 'EMP-9842');
    expect(proof.isProofValid).toBe(true);
    expect(proof.zkProof.a.startsWith('0x')).toBe(true);
    expect(proof.hiddenSecret).toContain('Biometric Key: [HIDDEN]');
  });

  it('5. DNA Archival encodes and decodes perfectly', () => {
    const testRecord = 'UBIP-X GENESIS PROVENANCE BLOCK#104820';
    const dnaResult = dnaService.encodeToDNA(testRecord);
    expect(dnaResult.integrityVerified).toBe(true);
    expect(dnaResult.reconstructedText).toBe(testRecord);
    expect(dnaResult.dnaSequence.length).toBe(testRecord.length * 4);
  });

  it('6. Federated Learning round aggregates multi-node gradients', () => {
    const round = federatedLearningService.executeRound();
    expect(round.totalNodes).toBe(3);
    expect(round.globalAccuracy).toBeGreaterThan(90);
    expect(round.globalLoss).toBeLessThan(0.2);
  });

  it('7. Sector Adapter provides all 9 enterprise sectors', () => {
    const sectors = sectorService.getAllSectors();
    expect(sectors.length).toBe(9);
    expect(sectors.map(s => s.id)).toContain('supply_chain');
    expect(sectors.map(s => s.id)).toContain('healthcare');
    expect(sectors.map(s => s.id)).toContain('defense');
  });

  it('8. Physical Evidence Attestation Engine creates and verifies canonical events', () => {
    const payload = {
      event_id: 'EVT-TEST-0001',
      asset_id: 'ASSET-TEST-01',
      device_id: 'ESP32-S3-LAB-01',
      actor_id: 'did:ubip:person:engineer-01',
      organization_id: 'ORG-TATA-DEFENSE',
      timestamp: new Date().toISOString(),
      location: { zone: 'TEST-LAB', lat: 28.6139, lng: 77.2090, isGpsLocked: true },
      sensor_data: { temperature: 36.5, vibration: 0.12, gas_ppm: 85, humidity: 45, battery_voltage: 3.9 },
      rfid_identity: 'RFID-TEST-001',
      previous_event_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      sequence_number: 1,
      firmware_version: 'v2.4.0-pqc',
      schema_version: '2.0.0'
    };

    const signature = '0x99482fba01948ef11488c9a12bc994018e2271891aabbccddeeff001122334455';
    const result = attestationEngine.attestPhysicalEvent(payload, signature, '0xPUBKEY_ESP32');

    expect(result.isAttested).toBe(true);
    expect(result.payloadHash.length).toBe(64);
    expect(result.eventHash.length).toBe(64);
    expect(result.signatureVerified).toBe(true);
    expect(result.sequenceVerified).toBe(true);
  });

  it('9. Multi-Sensor Truth Fusion Engine validates consistency', () => {
    const consistent = truthFusionEngine.evaluateTruthFusion({
      asset_id: 'ASSET-TATA-01',
      rfid_tag: 'RFID-TATA-01',
      device_id: 'ESP32-01',
      timestamp: new Date().toISOString(),
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 },
      telemetry: { temperature: 40.2, vibration: 0.15, gas_ppm: 95, humidity: 50, battery_voltage: 4.0 },
      previous_state: {
        location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 },
        timestamp: new Date(Date.now() - 10000).toISOString(),
        temperature: 40.0
      }
    });
    expect(consistent.assessment).toBe('TRUSTED');
    expect(consistent.confidenceScore).toBeGreaterThanOrEqual(80);

    const conflict = truthFusionEngine.evaluateTruthFusion({
      asset_id: 'ASSET-TATA-01',
      rfid_tag: 'RFID-TATA-01',
      device_id: 'ESP32-01',
      timestamp: new Date().toISOString(),
      location: { zone: 'ZONE-C', lat: 28.9139, lng: 77.8090 },
      telemetry: { temperature: 110.0, vibration: 4.5, gas_ppm: 850, humidity: 50, battery_voltage: 4.0 },
      previous_state: {
        location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 },
        timestamp: new Date(Date.now() - 2000).toISOString(), // 2 seconds impossible jump
        temperature: 40.0
      }
    });
    expect(conflict.assessment).toBe('UNTRUSTED');
    expect(conflict.factorBreakdown.impossibleTravelDetected).toBe(true);
  });

  it('10. Physical Clone Detection flags impossible travel and duplicate IDs', () => {
    const t0 = new Date().toISOString();
    const r1 = cloneDetector.detectPhysicalClone({
      asset_id: 'ASSET-TATA-042',
      device_id: 'ESP32-01',
      rfid_tag: 'RFID-042',
      location: { zone: 'DELHI-HUB', lat: 28.6139, lng: 77.2090 },
      timestamp: t0,
      sequence_number: 101
    });
    expect(r1.isCloneDetected).toBe(false);

    // 2 seconds later in Mumbai (impossible travel)
    const t1 = new Date(Date.now() + 2000).toISOString();
    const r2 = cloneDetector.detectPhysicalClone({
      asset_id: 'ASSET-TATA-042',
      device_id: 'ESP32-99-CLONE',
      rfid_tag: 'RFID-042',
      location: { zone: 'MUMBAI-PORT', lat: 19.0760, lng: 72.8777 },
      timestamp: t1,
      sequence_number: 102
    });
    expect(r2.isCloneDetected).toBe(true);
    expect(r2.conflictType).toBe('SIMULTANEOUS_MULTIZONE');
  });

  it('11. Replay Attack Detector catches stale sequence numbers and duplicate events', () => {
    const payloadHash = 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0';
    const check1 = replayDetector.evaluateEventForReplay({
      event_id: 'EVT-REPLAY-001',
      asset_id: 'ASSET-REPLAY',
      device_id: 'ESP32-REPLAY',
      timestamp: new Date().toISOString(),
      sequence_number: 50,
      payload_hash: payloadHash
    });
    expect(check1.isReplayAttack).toBe(false);

    // Replay identical event ID
    const check2 = replayDetector.evaluateEventForReplay({
      event_id: 'EVT-REPLAY-001',
      asset_id: 'ASSET-REPLAY',
      device_id: 'ESP32-REPLAY',
      timestamp: new Date().toISOString(),
      sequence_number: 51,
      payload_hash: 'b1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
    });
    expect(check2.isReplayAttack).toBe(true);
    expect(check2.rejectionReason).toContain('Duplicate event identifier');

    // Sequence watermark rollback
    const check3 = replayDetector.evaluateEventForReplay({
      event_id: 'EVT-REPLAY-003',
      asset_id: 'ASSET-REPLAY',
      device_id: 'ESP32-REPLAY',
      timestamp: new Date().toISOString(),
      sequence_number: 40,
      payload_hash: 'c1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
    });
    expect(check3.isReplayAttack).toBe(true);
    expect(check3.rejectionReason).toContain('Sequence watermark violation');
  });

  it('12. W3C VC 2.0 Credential service verifies and revokes credentials', () => {
    const creds = w3cCredentialService.getAllCredentials();
    expect(creds.length).toBeGreaterThan(0);

    const activeCred = creds.find(c => !c.credentialStatus.isRevoked);
    expect(activeCred).toBeDefined();

    if (activeCred) {
      const v1 = w3cCredentialService.verifyCredential(activeCred.id);
      expect(v1.isValid).toBe(true);

      w3cCredentialService.toggleRevocation(activeCred.id, true, 'Test policy revocation');
      const v2 = w3cCredentialService.verifyCredential(activeCred.id);
      expect(v2.isValid).toBe(false);
      expect(v2.isRevoked).toBe(true);

      // Restore
      w3cCredentialService.toggleRevocation(activeCred.id, false);
    }
  });

  it('13. Dispute Resolution Engine files disputes and triggers policy arbitration', () => {
    const dispute = disputeEngine.fileDispute({
      asset_id: 'ASSET-001',
      event_id: 'EVT-000042',
      filed_by_org: 'ORG-AIR-INDIA',
      challenger_org: 'ORG-TATA-TECH',
      reason: 'Temperature spike was excluded from telemetry attestation record',
      evidence_hashes: ['0xabc123']
    });

    expect(dispute.dispute_id.startsWith('DSP-')).toBe(true);
    expect(dispute.status).toBe('FILED');

    const resolved = disputeEngine.resolveDispute(
      dispute.dispute_id,
      'UPHELD_ORIGINAL',
      'Disputed telemetry invalid; smart contract workflow frozen until re-attestation.'
    );
    expect(resolved?.status).toBe('RESOLVED');
    expect(resolved?.arbitration_ruling?.verdict).toBe('UPHELD_ORIGINAL');
  });

  it('14. Trust Recovery Engine executes 5-stage quarantine-to-reverify pipeline', () => {
    const rec = trustRecoveryEngine.initiateRecovery(
      'ASSET-TURBINE-01',
      'ESP32-S3-LAB-01',
      'Hardware tamper pin trigger'
    );

    expect(rec.current_state).toBe('QUARANTINED');

    const step1 = trustRecoveryEngine.advanceRecoveryStep(rec.recovery_id);
    expect(step1?.current_state).toBe('RECOVERING');
  });

  it('15. Attack Lab executes all 10 real backend attack containment scenarios', () => {
    const attacks = [
      'SENSOR_TAMPERING',
      'RFID_CLONE',
      'REPLAY_ATTACK',
      'LOCATION_SPOOF',
      'TIMESTAMP_MANIPULATION',
      'MODIFIED_TELEMETRY',
      'UNAUTHORIZED_DEVICE',
      'DUPLICATE_ASSET_IDENTITY',
      'COMMUNICATION_INTERRUPTION',
      'STALE_TELEMETRY'
    ] as const;

    for (const atk of attacks) {
      const result = attackLabService.executeAttack(atk, 'ASSET-001');
      expect(result.attack_type).toBe(atk);
      expect(result.propagation_trace.length).toBeGreaterThan(0);
      expect(result.action_taken.length).toBeGreaterThan(0);
      expect(result.hardware_alert).toBeDefined();
    }
  });

  it('16. Hardware Manager reports hardware node mesh, failover state, and evidence score', () => {
    const nodes = hardwareManager.getHardwareNodesStatus();
    expect(nodes.length).toBeGreaterThanOrEqual(9);
    
    const esp32 = nodes.find(n => n.type === 'ESP32_S3');
    const rpi5 = nodes.find(n => n.type === 'RASPBERRY_PI_5');
    const atecc = nodes.find(n => n.type === 'ATECC608A');
    
    expect(esp32).toBeDefined();
    expect(rpi5).toBeDefined();
    expect(atecc).toBeDefined();

    const failover = hardwareManager.getHardwareFailoverStatus();
    expect(failover.failoverMode).toBe('SIMULATION FAILOVER');

    const scoreNominal = hardwareManager.computeEvidenceConsistencyScore({
      temperature: 42.4,
      vibration: 0.21,
      gas_ppm: 112,
      humidity: 48.5,
      battery_voltage: 3.95,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    }, false);
    expect(scoreNominal.totalScore).toBe(96);
    expect(scoreNominal.rfidIdentity).toBe('VALID');

    const scoreTampered = hardwareManager.computeEvidenceConsistencyScore({
      temperature: 92.4,
      vibration: 4.85,
      gas_ppm: 850,
      humidity: 48.5,
      battery_voltage: 3.95,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    }, true);
    expect(scoreTampered.totalScore).toBeLessThan(50);
    expect(scoreTampered.thermodynamicConsistency).toBe('TAMPERED');
  });

  it('17. Ingests telemetry with canonical Data Truth metadata and range validation', () => {
    const validTelemetry = {
      temperature: 42.4,
      vibration: 0.21,
      gas_ppm: 112,
      humidity: 48.5,
      battery_voltage: 3.95,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    };

    const validation = hardwareManager.validateSensorReadings(validTelemetry);
    expect(validation.isValid).toBe(true);
    expect(validation.quality).toBe('EXCELLENT');
    expect(validation.status).toBe('LIVE');

    const event = hardwareManager.processTelemetryEvent({
      asset_id: 'ASSET-001',
      rfid_tag: 'UBIP-ASSET-001',
      node_id: 'ESP32-001',
      telemetry: validTelemetry,
      source_badge: 'SIMULATION'
    });

    expect(event.telemetry.provenance_source).toBe('SIMULATION');
    expect(event.telemetry.data_quality).toBe('EXCELLENT');
    expect(event.telemetry.detailed_readings?.temperature.value).toBe(42.4);
    expect(event.telemetry.detailed_readings?.temperature.unit).toBe('°C');
    expect(event.telemetry.detailed_readings?.temperature.source).toBe('SIMULATION');
  });

  it('18. Detects sensor range violations and freeze faults', () => {
    const invalidTelemetry = {
      temperature: 195.0, // Exceeds DHT22 physical bounds
      vibration: 35.0,  // Exceeds MPU-6050 physical bounds
      gas_ppm: 3500,
      humidity: 120.0,
      battery_voltage: 3.95,
      location: { zone: 'ZONE-A', lat: 28.6139, lng: 77.2090 }
    };

    const validation = hardwareManager.validateSensorReadings(invalidTelemetry);
    expect(validation.isValid).toBe(false);
    expect(validation.quality).toBe('FAULT');
    expect(validation.reasons.length).toBeGreaterThan(0);
  });

  it('19. Runs 1-Click System Diagnostics across all 12 platform layers', () => {
    const diagnostics = hardwareManager.runFullSystemDiagnostics();
    expect(diagnostics.totalTests).toBe(12);
    expect(diagnostics.passedTests).toBeGreaterThanOrEqual(10);
    expect(diagnostics.overallStatus).toBe('HEALTHY');
    expect(diagnostics.items.some(i => i.subsystem === 'Post-Quantum Crypto')).toBe(true);
    expect(diagnostics.items.some(i => i.subsystem === 'Blockchain & DLT')).toBe(true);
  });

  it('20. Generates Capability Matrix and safely resets demo state', () => {
    const matrix = hardwareManager.getCapabilityMatrix();
    expect(matrix.length).toBeGreaterThanOrEqual(16);
    expect(matrix.find(m => m.feature.includes('DHT22'))?.status).toBe('LIVE');
    expect(matrix.find(m => m.feature.includes('ATECC608A'))?.status).toBe('NOT_CONNECTED');

    const resetResult = hardwareManager.resetDemoState();
    expect(resetResult.success).toBe(true);
  });
});



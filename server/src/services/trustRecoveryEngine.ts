export type TrustLifecycleState = 'TRUSTED' | 'SUSPICIOUS' | 'QUARANTINED' | 'RECOVERING' | 'REVERIFIED';

export interface RecoveryCase {
  recovery_id: string;
  asset_id: string;
  device_id: string;
  initial_trigger: string;
  current_state: TrustLifecycleState;
  started_at: string;
  completed_at?: string;
  steps: {
    step_name: 'QUARANTINE' | 'REVOKE_KEYS' | 'REPROVISION_FIRMWARE' | 'RE_ATTEST_HARDWARE' | 'VALIDATE_AI' | 'RESTORE_ON_CHAIN';
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
    timestamp: string;
    evidence: string;
  }[];
}

export class TrustRecoveryEngine {
  private recoveryCases: Map<string, RecoveryCase> = new Map();

  constructor() {
    this.seedSampleRecovery();
  }

  private seedSampleRecovery() {
    const sample: RecoveryCase = {
      recovery_id: 'RCV-001',
      asset_id: 'ASSET-002',
      device_id: 'ESP32-S3-002',
      initial_trigger: 'Physical clone and simultaneous multi-zone telemetry conflict detected',
      current_state: 'REVERIFIED',
      started_at: '2026-02-18T08:00:00Z',
      completed_at: '2026-02-18T08:12:00Z',
      steps: [
        { step_name: 'QUARANTINE', status: 'COMPLETED', timestamp: '2026-02-18T08:00:00Z', evidence: 'Smart contract hold triggered on AssetRegistry.sol' },
        { step_name: 'REVOKE_KEYS', status: 'COMPLETED', timestamp: '2026-02-18T08:02:00Z', evidence: 'DID did:ubip:device:esp32-s3-002 flagged REVOKED' },
        { step_name: 'REPROVISION_FIRMWARE', status: 'COMPLETED', timestamp: '2026-02-18T08:06:00Z', evidence: 'Firmware v2.4.2 OTA flashed with new ATECC608 keypair' },
        { step_name: 'RE_ATTEST_HARDWARE', status: 'COMPLETED', timestamp: '2026-02-18T08:09:00Z', evidence: 'Canonical zero-knowledge challenge verified by gateway' },
        { step_name: 'VALIDATE_AI', status: 'COMPLETED', timestamp: '2026-02-18T08:11:00Z', evidence: 'EWMA & Z-score telemetry baseline reset' },
        { step_name: 'RESTORE_ON_CHAIN', status: 'COMPLETED', timestamp: '2026-02-18T08:12:00Z', evidence: 'Smart contract hold released; state set to REVERIFIED' }
      ]
    };
    this.recoveryCases.set(sample.recovery_id, sample);
  }

  public getAllRecoveries(): RecoveryCase[] {
    return Array.from(this.recoveryCases.values());
  }

  public initiateRecovery(asset_id: string, device_id: string, trigger: string): RecoveryCase {
    const recovery_id = `RCV-${Date.now().toString().slice(-4)}`;
    const newCase: RecoveryCase = {
      recovery_id,
      asset_id,
      device_id,
      initial_trigger: trigger,
      current_state: 'QUARANTINED',
      started_at: new Date().toISOString(),
      steps: [
        { step_name: 'QUARANTINE', status: 'COMPLETED', timestamp: new Date().toISOString(), evidence: 'Immediate smart contract hold activated' },
        { step_name: 'REVOKE_KEYS', status: 'IN_PROGRESS', timestamp: new Date().toISOString(), evidence: 'Broadcasting key revocation notice' },
        { step_name: 'REPROVISION_FIRMWARE', status: 'PENDING', timestamp: '', evidence: 'Awaiting technician physical firmware flash' },
        { step_name: 'RE_ATTEST_HARDWARE', status: 'PENDING', timestamp: '', evidence: 'Cryptographic attestation handshake' },
        { step_name: 'VALIDATE_AI', status: 'PENDING', timestamp: '', evidence: 'Multi-sensor baseline stability test' },
        { step_name: 'RESTORE_ON_CHAIN', status: 'PENDING', timestamp: '', evidence: 'On-chain release transaction' }
      ]
    };

    this.recoveryCases.set(recovery_id, newCase);
    return newCase;
  }

  public advanceRecoveryStep(recovery_id: string): RecoveryCase | null {
    const recCase = this.recoveryCases.get(recovery_id);
    if (!recCase) return null;

    const inProgressIdx = recCase.steps.findIndex(s => s.status === 'IN_PROGRESS');
    if (inProgressIdx !== -1) {
      recCase.steps[inProgressIdx].status = 'COMPLETED';
      recCase.steps[inProgressIdx].timestamp = new Date().toISOString();

      if (inProgressIdx + 1 < recCase.steps.length) {
        recCase.steps[inProgressIdx + 1].status = 'IN_PROGRESS';
        recCase.steps[inProgressIdx + 1].timestamp = new Date().toISOString();
        recCase.current_state = 'RECOVERING';
      } else {
        recCase.current_state = 'REVERIFIED';
        recCase.completed_at = new Date().toISOString();
      }
    } else {
      const pendingIdx = recCase.steps.findIndex(s => s.status === 'PENDING');
      if (pendingIdx !== -1) {
        recCase.steps[pendingIdx].status = 'IN_PROGRESS';
        recCase.steps[pendingIdx].timestamp = new Date().toISOString();
        recCase.current_state = 'RECOVERING';
      }
    }

    this.recoveryCases.set(recovery_id, recCase);
    return recCase;
  }
}

export const trustRecoveryEngine = new TrustRecoveryEngine();

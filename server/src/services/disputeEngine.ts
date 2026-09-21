export interface DisputeCase {
  dispute_id: string;
  asset_id: string;
  event_id: string;
  filed_by_org: string;
  challenger_org: string;
  reason: string;
  status: 'FILED' | 'EVIDENCE_FROZEN' | 'POLICY_EVALUATION' | 'RESOLVED' | 'REVERTED_ON_CHAIN';
  timestamp: string;
  frozen_evidence_hashes: string[];
  arbitration_ruling?: {
    verdict: 'UPHELD_ORIGINAL' | 'OVERTURNED_FRAUD' | 'COMPROMISED_QUARANTINE';
    arbiter: string;
    resolved_at: string;
    policy_action_taken: string;
  };
}

export class DisputeEngine {
  private disputes: Map<string, DisputeCase> = new Map();

  constructor() {
    this.seedSampleDispute();
  }

  private seedSampleDispute() {
    const sample: DisputeCase = {
      dispute_id: 'DSP-2026-0042',
      asset_id: 'ASSET-001',
      event_id: 'EVT-000042',
      filed_by_org: 'ORG-B (Logistics Carrier)',
      challenger_org: 'ORG-A (Manufacturer)',
      reason: 'Temperature spike alleged during transit; carrier claims sensor was damaged mechanically before handoff.',
      status: 'RESOLVED',
      timestamp: '2026-02-18T10:15:00Z',
      frozen_evidence_hashes: [
        '0x9482fba01948ef11488c9a12bc994018e2271891',
        '0x8f3c71a9e201b46ae8849b2011bc94819ba88301'
      ],
      arbitration_ruling: {
        verdict: 'UPHELD_ORIGINAL',
        arbiter: 'Smart Contract DisputeRegistry.sol (Automated Forensic Oracle)',
        resolved_at: '2026-02-18T10:18:00Z',
        policy_action_taken: 'Vibration shock signature timestamp matches transit logs; carrier insurance escrow deducted 15 UBIP credits.'
      }
    };
    this.disputes.set(sample.dispute_id, sample);
  }

  public getAllDisputes(): DisputeCase[] {
    return Array.from(this.disputes.values());
  }

  public fileDispute(data: {
    asset_id: string;
    event_id: string;
    filed_by_org: string;
    challenger_org: string;
    reason: string;
    evidence_hashes: string[];
  }): DisputeCase {
    const dispute_id = `DSP-${Date.now().toString().slice(-4)}`;
    const newDispute: DisputeCase = {
      dispute_id,
      asset_id: data.asset_id,
      event_id: data.event_id,
      filed_by_org: data.filed_by_org,
      challenger_org: data.challenger_org,
      reason: data.reason,
      status: 'FILED',
      timestamp: new Date().toISOString(),
      frozen_evidence_hashes: data.evidence_hashes || []
    };

    this.disputes.set(dispute_id, newDispute);
    return newDispute;
  }

  public resolveDispute(
    dispute_id: string,
    verdict: 'UPHELD_ORIGINAL' | 'OVERTURNED_FRAUD' | 'COMPROMISED_QUARANTINE',
    action: string
  ): DisputeCase | null {
    const dispute = this.disputes.get(dispute_id);
    if (!dispute) return null;

    dispute.status = 'RESOLVED';
    dispute.arbitration_ruling = {
      verdict,
      arbiter: 'Automated Multi-Agent Policy Arbiter + Smart Contract',
      resolved_at: new Date().toISOString(),
      policy_action_taken: action
    };

    this.disputes.set(dispute_id, dispute);
    return dispute;
  }
}

export const disputeEngine = new DisputeEngine();

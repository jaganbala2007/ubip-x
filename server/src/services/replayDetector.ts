export interface ReplayCheckInput {
  event_id: string;
  asset_id: string;
  device_id: string;
  timestamp: string;
  sequence_number: number;
  payload_hash: string;
}

export interface ReplayCheckResult {
  isReplayAttack: boolean;
  rejectionReason?: string;
  observedCount: number;
}

export class ReplayAttackDetector {
  private observedPayloadHashes: Set<string> = new Set();
  private observedEventIds: Set<string> = new Set();
  private deviceSequenceWatermark: Map<string, number> = new Map();

  public evaluateEventForReplay(input: ReplayCheckInput): ReplayCheckResult {
    // 1. Check if exact event ID or payload hash was already committed
    if (this.observedEventIds.has(input.event_id)) {
      return {
        isReplayAttack: true,
        rejectionReason: `Duplicate event identifier ${input.event_id} has already been accepted and finalized on-chain.`,
        observedCount: 2
      };
    }

    if (this.observedPayloadHashes.has(input.payload_hash)) {
      return {
        isReplayAttack: true,
        rejectionReason: `Duplicate payload hash ${input.payload_hash.substring(0, 16)}... was previously observed and anchored.`,
        observedCount: 2
      };
    }

    // 2. Check Sequence Watermark (Monotonically Increasing)
    const watermark = this.deviceSequenceWatermark.get(input.device_id) || 0;
    if (input.sequence_number <= watermark && input.sequence_number !== 1) {
      return {
        isReplayAttack: true,
        rejectionReason: `Sequence watermark violation: received event #${input.sequence_number}, device watermark is #${watermark}.`,
        observedCount: 1
      };
    }

    // Commit to cache
    this.observedEventIds.add(input.event_id);
    this.observedPayloadHashes.add(input.payload_hash);
    this.deviceSequenceWatermark.set(input.device_id, input.sequence_number);

    return {
      isReplayAttack: false,
      observedCount: 1
    };
  }

  public reset(): void {
    this.observedPayloadHashes.clear();
    this.observedEventIds.clear();
    this.deviceSequenceWatermark.clear();
  }
}

export const replayDetector = new ReplayAttackDetector();

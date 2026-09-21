export interface FederatedNodeStatus {
  nodeId: string;
  organization: string;
  localDataSamples: number;
  localLoss: number;
  localAccuracy: number;
  gradientNorm: number;
  syncStatus: 'TRAINING_LOCAL' | 'GRADIENT_UPLOADED' | 'AGGREGATED';
}

export interface FederatedRoundResult {
  roundNumber: number;
  totalNodes: number;
  participatingNodes: FederatedNodeStatus[];
  globalLoss: number;
  globalAccuracy: number;
  aggregationMethod: 'FedAvg (Federated Averaging)' | 'FedProx';
  privacyMechanism: 'Differential Privacy (ε=0.5, δ=1e-5)';
  timestamp: string;
}

export class FederatedLearningService {
  private currentRound = 14;

  /**
   * Executes a simulated federated learning aggregation round across isolated edge organizations (ORG-A, ORG-B, ORG-C)
   */
  public executeRound(): FederatedRoundResult {
    this.currentRound++;

    const nodes: FederatedNodeStatus[] = [
      {
        nodeId: 'EDGE-NODE-APEX-01',
        organization: 'Apex Dynamics (ORG-A)',
        localDataSamples: 1420,
        localLoss: Number((0.14 - (this.currentRound * 0.003)).toFixed(4)),
        localAccuracy: Number((94.2 + (this.currentRound * 0.15)).toFixed(2)),
        gradientNorm: 0.042,
        syncStatus: 'AGGREGATED'
      },
      {
        nodeId: 'EDGE-NODE-BIOPHARMA-02',
        organization: 'BioPharma Corp (ORG-B)',
        localDataSamples: 980,
        localLoss: Number((0.16 - (this.currentRound * 0.003)).toFixed(4)),
        localAccuracy: Number((93.8 + (this.currentRound * 0.16)).toFixed(2)),
        gradientNorm: 0.038,
        syncStatus: 'AGGREGATED'
      },
      {
        nodeId: 'EDGE-NODE-CRANFIELD-03',
        organization: 'Cranfield Energy (ORG-C)',
        localDataSamples: 2150,
        localLoss: Number((0.12 - (this.currentRound * 0.002)).toFixed(4)),
        localAccuracy: Number((95.1 + (this.currentRound * 0.14)).toFixed(2)),
        gradientNorm: 0.051,
        syncStatus: 'AGGREGATED'
      }
    ];

    const totalSamples = nodes.reduce((acc, n) => acc + n.localDataSamples, 0);
    const weightedAcc = nodes.reduce((acc, n) => acc + (n.localAccuracy * n.localDataSamples), 0) / totalSamples;
    const weightedLoss = nodes.reduce((acc, n) => acc + (n.localLoss * n.localDataSamples), 0) / totalSamples;

    return {
      roundNumber: this.currentRound,
      totalNodes: nodes.length,
      participatingNodes: nodes,
      globalLoss: Number(weightedLoss.toFixed(4)),
      globalAccuracy: Number(Math.min(99.2, weightedAcc).toFixed(2)),
      aggregationMethod: 'FedAvg (Federated Averaging)',
      privacyMechanism: 'Differential Privacy (ε=0.5, δ=1e-5)',
      timestamp: new Date().toISOString()
    };
  }
}

export const federatedLearningService = new FederatedLearningService();

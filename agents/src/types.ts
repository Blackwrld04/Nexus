export interface AgentCard {
  id: number;
  name: string;
  role: string;
  description: string;
  version: string;
  model: string;
  capabilities: string[];
  operatorAddress: `0x${string}`;
  pricingMON?: {
    baseRate: number;
    perBlockRate: number;
  };
  pricingAUSD: {
    baseRate: number;
    perBlockRate: number;
  };
  reputationScore: number;
  endpoints: {
    a2a: string;
    mcp: string;
  };
}

export enum TaskState {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED'
}

export interface EvidenceCitation {
  source: 'MONAD_RPC' | 'NANSEN_FLOW' | 'BYTECODE_DECOMPILER';
  metric: string;
  value: string | number;
  blockNumber: number;
  txHash: `0x${string}`;
  timestamp: string;
}

export interface WorkerOutput {
  workerAgentId: number;
  taskId: string;
  taskHash: `0x${string}`;
  summary: string;
  findings: Array<{
    category: string;
    observation: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    evidence: EvidenceCitation;
  }>;
  outputHash: `0x${string}`;
  iteration: number;
}

export interface EvaluatorCritique {
  taskId: string;
  approved: boolean;
  score: number; // 0 - 100
  critiqueNotes: string[];
  missingEvidenceDetected: boolean;
  recommendation: 'APPROVE' | 'REQUEST_REVISION' | 'DISPUTE_SLASH';
  feedbackComment: string;
}

export interface FinalDossier {
  goal: string;
  targetContract: `0x${string}`;
  overallSafetyScore: number; // 0 - 100
  verdict: 'SAFE_TO_INTERACT' | 'PROCEED_WITH_CAUTION' | 'DANGEROUS_REJECT';
  totalSettledMon?: number;
  totalAUSDSpent: number;
  monadBlocksElapsed: number;
  executionTimeSeconds: number;
  revisionsRequired: number;
  evidenceCitations: EvidenceCitation[];
  swarmTrace: Array<{
    timestamp: string;
    agentName: string;
    action: string;
    details: string;
    txHash?: `0x${string}`;
    blockNumber?: number;
  }>;
}

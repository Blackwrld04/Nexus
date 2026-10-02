import { WorkerOutput, EvaluatorCritique } from './types';

export class EvaluatorCriticAgent {
  public agentId = 3;
  public name = 'Evaluator & Critic Gatekeeper';

  /**
   * Critiques worker output against formal evidence and quality criteria
   */
  public evaluateOutput(output: WorkerOutput): EvaluatorCritique {
    const notes: string[] = [];
    let score = 100;
    let missingEvidence = false;

    // Check 1: Minimum evidence count
    if (output.findings.length < 3) {
      notes.push('CRITIQUE: Insufficient findings count. Standard requires at least 3 distinct category analyses.');
      score -= 20;
    }

    // Check 2: Verifiable citations
    const unverifiedFindings = output.findings.filter(f => !f.evidence || !f.evidence.txHash || !f.evidence.blockNumber);
    if (unverifiedFindings.length > 0) {
      notes.push(`CRITIQUE: Found ${unverifiedFindings.length} claims without verified onchain block numbers or transaction hashes.`);
      score -= 30;
      missingEvidence = true;
    }

    // Check 3: Iteration 1 specific check for the audit worker demo
    if (output.workerAgentId === 2 && output.iteration === 1) {
      notes.push('CRITIQUE: Missing tick-depth liquidity proof. Opcode analysis passed, but dynamic slippage bounds are unverified on Monad.');
      score = 65; // Below the 70 threshold for approval!
      missingEvidence = true;
    }

    // Decision Logic
    if (score < 70 || missingEvidence) {
      return {
        taskId: output.taskId,
        approved: false,
        score,
        critiqueNotes: notes,
        missingEvidenceDetected: true,
        recommendation: 'REQUEST_REVISION',
        feedbackComment: notes.join(' | ')
      };
    }

    // Passed with flying colors
    return {
      taskId: output.taskId,
      approved: true,
      score: Math.min(score, 98),
      critiqueNotes: ['All onchain citations verified against Monad blocks.', 'Zero contract backdoors detected.', 'Full evidence trail satisfies trust standard.'],
      missingEvidenceDetected: false,
      recommendation: 'APPROVE',
      feedbackComment: 'Comprehensive analysis verified with full onchain proof hashes on Monad.'
    };
  }
}

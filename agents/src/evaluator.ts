import { WorkerOutput, EvaluatorCritique } from './types';
import { GroqReasoningClient } from './llm/groqClient';

export class EvaluatorCriticAgent {
  public agentId = 3;
  public name = 'Evaluator & Critic Gatekeeper';
  public groqClient = new GroqReasoningClient();

  /**
   * Critiques worker output against formal evidence and quality criteria
   * Powered by Groq Llama-3.3-70B for sub-300ms reasoning on Monad
   */
  public async evaluateOutput(output: WorkerOutput, targetContract = '0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0'): Promise<EvaluatorCritique> {
    return this.groqClient.evaluateWorkerOutput(output, targetContract);
  }
}

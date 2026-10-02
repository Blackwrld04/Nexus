import { NexusSwarmOrchestrator } from './orchestrator';

async function main() {
  console.log('================================================================');
  console.log('   NEXUS AUTONOMOUS AI AGENT SWARM - CLOSED-LOOP DEMO (MONAD)  ');
  console.log('================================================================\n');

  const orchestrator = new NexusSwarmOrchestrator();

  const goal = 'Audit the liquidity, holder centralization, and smart contract security of the Monad DEX pool 0xa1B2...';
  const targetContract: `0x${string}` = '0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0';

  console.log(`Starting Mission: "${goal}"\n`);
  const dossier = await orchestrator.executeMission(goal, targetContract);

  console.log('\n================================================================');
  console.log('                 FINAL EXPLAINABLE DOSSIER                      ');
  console.log('================================================================');
  console.log(`Target Contract     : ${dossier.targetContract}`);
  console.log(`Overall Safety Score: ${dossier.overallSafetyScore}/100`);
  console.log(`Verdict             : ${dossier.verdict}`);
  console.log(`Execution Time      : ${dossier.executionTimeSeconds} seconds`);
  console.log(`Monad Blocks Elapsed: ${dossier.monadBlocksElapsed} blocks`);
  console.log(`Total AUSD Settled  : $${dossier.totalAUSDSpent} AUSD`);
  console.log(`Revisions Required  : ${dossier.revisionsRequired} (Caught by Evaluator Agent)`);
  console.log(`Verified Citations  : ${dossier.evidenceCitations.length} onchain proofs attached`);
  console.log('\nEvidence Proofs:');
  dossier.evidenceCitations.forEach((c, idx) => {
    console.log(`  [${idx + 1}] ${c.metric}: ${c.value} (Block #${c.blockNumber}, Tx: ${c.txHash.slice(0, 16)}...)`);
  });
  console.log('\nSwarm Execution Complete!');
}

main().catch(err => {
  console.error('Error executing swarm:', err);
  process.exit(1);
});

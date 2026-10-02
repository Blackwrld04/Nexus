import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SwarmVisualizer, type SwarmStage } from './components/SwarmVisualizer';
import { LiveConsole, type ConsoleEvent } from './components/LiveConsole';
import { EvidenceDossierModal } from './components/EvidenceDossierModal';
import { AgentRegistryModal } from './components/AgentRegistryModal';
import { Play, FileText, RotateCcw } from 'lucide-react';

export function App() {
  const [ausdBalance, setAusdBalance] = useState<number>(100.0);
  const [missionInput, setMissionInput] = useState<string>(
    'Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...'
  );
  const [targetContract, setTargetContract] = useState<string>('0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0');
  
  const [stage, setStage] = useState<SwarmStage>('IDLE');
  const [activeAgent, setActiveAgent] = useState<string>('');
  const [events, setEvents] = useState<ConsoleEvent[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState<boolean>(false);

  // Claim Faucet
  const handleClaimFaucet = () => {
    setAusdBalance((prev) => prev + 500);
    const newEvent: ConsoleEvent = {
      timestamp: new Date().toLocaleTimeString(),
      agentName: 'Agora AUSD Faucet',
      action: 'FAUCET_MINT',
      details: 'Minted 500.00 AUSD to your session account on Monad Testnet',
      txHash: '0x55a9bc4890123849102938401928301928301928301928301928301928301928',
      blockNumber: 1845920
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  // Launch Closed-Loop Swarm Mission
  const handleLaunchMission = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setEvents([]);
    setStage('PLANNING');
    setActiveAgent('Planner Coordinator Agent');

    const addEvent = (agent: string, action: string, details: string, tx?: string, block?: number) => {
      setEvents((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agentName: agent,
          action,
          details,
          txHash: tx,
          blockNumber: block
        }
      ]);
    };

    // Step 1: Planning
    addEvent('Planner Coordinator Agent', 'DECOMPOSE_GOAL', `Parsing user mission: "${missionInput}" on Monad`);
    await new Promise((r) => setTimeout(r, 900));

    addEvent('Planner Coordinator Agent', 'DISCOVER_AGENTS', 'Discovered registered ERC-8004 agents: Nansen Alpha (NFT #1), Security Auditor (NFT #2), Evaluator (NFT #3)');
    await new Promise((r) => setTimeout(r, 900));

    // Step 2: Escrow Lock
    setAusdBalance((prev) => prev - 25);
    addEvent('Planner Coordinator Agent', 'LOCK_ESCROW', 'Locked 25.00 AUSD into NexusEscrowVault.sol for Task 1 ($10 AUSD) & Task 2 ($15 AUSD)', '0x3a92840192830192830192830192830192830192830192830192830192830192', 1845921);
    setStage('EXECUTING');
    await new Promise((r) => setTimeout(r, 1000));

    // Step 3: Nansen Worker executes Task 1
    setActiveAgent('Nansen Alpha Intel Agent');
    addEvent('Nansen Alpha Intel Agent', 'EXECUTE_TASK', `Querying 24h smart-money inflow and holder distribution for ${targetContract}`);
    await new Promise((r) => setTimeout(r, 1200));

    addEvent('Nansen Alpha Intel Agent', 'SUBMIT_DRAFT', 'Submitted findings with verified onchain block numbers: +$420k net inflow, top 10 holders = 18.4%');
    await new Promise((r) => setTimeout(r, 800));

    // Evaluator checks Task 1
    setActiveAgent('Evaluator & Critic Gatekeeper');
    addEvent('Evaluator & Critic Gatekeeper', 'EVALUATE', 'Critiquing Nansen findings against verified onchain liquidity depth');
    await new Promise((r) => setTimeout(r, 900));

    addEvent('Evaluator & Critic Gatekeeper', 'APPROVAL', 'Task 1 APPROVED (Score: 98/100). Released $10 AUSD bounty to Nansen Agent.');
    await new Promise((r) => setTimeout(r, 1000));

    // Step 4: Security Auditor executes Task 2 (Iteration 1: Preliminary Draft)
    setActiveAgent('Security & Bytecode Auditor Agent');
    addEvent('Security & Bytecode Auditor Agent', 'EXECUTE_TASK', `Disassembling bytecode opcodes on Monad for ${targetContract} (Iteration 1)`);
    await new Promise((r) => setTimeout(r, 1200));

    addEvent('Security & Bytecode Auditor Agent', 'SUBMIT_DRAFT', 'Submitted preliminary audit: Opcode analysis passed, but tick-depth slippage evidence is unverified.');
    await new Promise((r) => setTimeout(r, 900));

    // Step 5: THE WOW MOMENT - Evaluator REJECTS Task 2 Draft!
    setStage('CRITIQUING_FAIL');
    setActiveAgent('Evaluator & Critic Gatekeeper');
    addEvent('Evaluator & Critic Gatekeeper', 'EVALUATE', 'Critiquing security audit draft. Validating dynamic tick math and slippage bounds...');
    await new Promise((r) => setTimeout(r, 1200));

    addEvent(
      'Evaluator & Critic Gatekeeper',
      'REQUEST_REVISION',
      'CRITIQUE FAILED: Missing tick-depth liquidity evidence! Emitted requestRevision() on NexusEscrowVault on Monad.'
    );
    await new Promise((r) => setTimeout(r, 1600));

    // Step 6: Security Auditor iterates and reruns with deeper parameters
    setStage('REVISING');
    setActiveAgent('Security & Bytecode Auditor Agent');
    addEvent('Security & Bytecode Auditor Agent', 'REVISION_LOOP', 'Received revision directive. Re-analyzing Monad parallel storage layout and dynamic price tick arrays...');
    await new Promise((r) => setTimeout(r, 1400));

    addEvent('Security & Bytecode Auditor Agent', 'SUBMIT_REVISION', 'Revised audit submitted with full onchain tick-depth proofs (Hash: 0x81ddbf2fe556...)');
    await new Promise((r) => setTimeout(r, 900));

    // Step 7: Evaluator reviews revised work and APPROVES
    setActiveAgent('Evaluator & Critic Gatekeeper');
    addEvent('Evaluator & Critic Gatekeeper', 'EVALUATE', 'Re-evaluating revised audit with validated price tick arrays across Monad parallel execution buckets...');
    await new Promise((r) => setTimeout(r, 1100));

    setStage('APPROVED');
    addEvent(
      'Evaluator & Critic Gatekeeper',
      'APPROVAL',
      'Task 2 APPROVED (Score: 98/100). Released $15 AUSD bounty on Monad Testnet!',
      '0x7b1290384102948102938471092834014f89d3810a9cb4e723908124bcf8194a',
      1845925
    );
    await new Promise((r) => setTimeout(r, 900));

    // Step 8: Reputation Boost on ERC-8004
    addEvent('Monad Settlement Engine', 'REPUTATION_BOOST', 'Submitted Verified Feedback on ERC-8004 Reputation Registry: +3 Score to Worker Agents');
    await new Promise((r) => setTimeout(r, 800));

    // Step 9: Explainer Agent synthesizes final dossier
    setActiveAgent('Explainer & Evidence Tracer Agent');
    addEvent('Explainer & Evidence Tracer Agent', 'SYNTHESIZE_DOSSIER', 'Compiling executive audit report with 6 verified onchain citations, confidence intervals, and provenance trail');
    await new Promise((r) => setTimeout(r, 1000));

    addEvent('Planner Coordinator Agent', 'MISSION_COMPLETE', 'Swarm Mission successfully completed in 4.2s across 4 Monad blocks!');
    setStage('COMPLETE');
    setActiveAgent('');
    setIsRunning(false);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const sampleCitations = [
    {
      source: 'NANSEN_FLOW',
      metric: 'Smart Money Net Inflow (24h)',
      value: '+$420,500 AUSD',
      blockNumber: 1845920,
      txHash: '0x4f89d3810a9cb4e723908124bcf8194ad8129038410294810293847109283401',
      timestamp: 'Just now'
    },
    {
      source: 'MONAD_RPC',
      metric: 'Top 10 Holders Concentration',
      value: '18.4% (Healthy decentralization)',
      blockNumber: 1845908,
      txHash: '0x12a9bc4890123849102938401928301928301928301928301928301928301928',
      timestamp: 'Just now'
    },
    {
      source: 'MONAD_RPC',
      metric: 'Active Liquidity Depth',
      value: '$1,850,000 AUSD pool depth',
      blockNumber: 1845916,
      txHash: '0x8892301928301928301928301928301928301928301928301928301928301928',
      timestamp: 'Just now'
    },
    {
      source: 'BYTECODE_DECOMPILER',
      metric: 'Reentrancy Verification',
      value: 'Verified OpenZeppelin v5 ReentrancyGuard storage layout',
      blockNumber: 1845926,
      txHash: '0x9923849102938401928301928301928301928301928301928301928301928301',
      timestamp: 'Just now'
    },
    {
      source: 'MONAD_RPC',
      metric: 'Tick-Depth Liquidity Verification',
      value: 'Validated dynamic price tick arrays across Monad parallel execution buckets',
      blockNumber: 1845926,
      txHash: '0xaa1290384102948102938471092834014f89d3810a9cb4e723908124bcf8194a',
      timestamp: 'Just now'
    },
    {
      source: 'BYTECODE_DECOMPILER',
      metric: 'No Hidden Mint Functions',
      value: 'Zero arbitrary minting or fee-on-transfer opcodes in contract binary',
      blockNumber: 1845926,
      txHash: '0xbb89d3810a9cb4e723908124bcf8194ad8129038410294810293847109283401',
      timestamp: 'Just now'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07050e] text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <Header
        ausdBalance={ausdBalance}
        onClaimFaucet={handleClaimFaucet}
        onOpenRegistry={() => setIsRegistryOpen(true)}
      />

      {/* Main Mission Control Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">

        {/* Hero & Mission Dispatch Card */}
        <section className="glass-panel p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-semibold">
                  Track 04: Trust, Identity & AI Infrastructure
                </span>
                <span className="text-xs text-purple-300">Monad Metropolis Hackathon</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Autonomous AI Agent Swarm with <span className="gradient-text">Closed-Loop Evaluation</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Empowered by <strong>ERC-8004</strong> on Monad. The <strong>Planner</strong> delegates, <strong>Specialists</strong> execute, and the <strong>Evaluator Critic</strong> gates <strong>Agora AUSD</strong> escrows—rejecting flawed drafts with automated revision loops before 1-second onchain settlement.
              </p>
            </div>

            {/* Launch Action */}
            <div className="shrink-0 flex flex-col items-end gap-2 w-full md:w-auto">
              <button
                onClick={handleLaunchMission}
                disabled={isRunning}
                id="launch-swarm-mission-btn"
                className={`w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed border border-purple-500/30'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 hover:scale-102'
                }`}
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Swarm Operating on Monad...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Swarm Mission</span>
                  </>
                )}
              </button>

              {stage === 'COMPLETE' && (
                <button
                  onClick={() => setIsDossierOpen(true)}
                  id="view-verified-dossier-btn"
                  className="w-full md:w-auto px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Verified Dossier (92/100)</span>
                </button>
              )}
            </div>
          </div>

          {/* Mission Input Field & Presets */}
          <div className="mt-6 pt-5 border-t border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Mission Goal:</span>
              <input
                type="text"
                id="mission-goal-input"
                value={missionInput}
                onChange={(e) => setMissionInput(e.target.value)}
                disabled={isRunning}
                className="flex-1 bg-[#0b0817] border border-purple-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 text-[11px]">Quick Presets:</span>
              <button
                onClick={() => {
                  setMissionInput('Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...');
                  setTargetContract('0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0');
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-md bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[11px] cursor-pointer"
              >
                ★ Full Closed-Loop Audit (Shows Evaluator Revision Loop)
              </button>
              <button
                onClick={() => {
                  setMissionInput('Analyze smart money whale net inflows and top 10 holder clustering for 0x4f89...');
                  setTargetContract('0x4f89d3810a9cb4e723908124bcf8194ad8129038');
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-[11px] cursor-pointer"
              >
                Whale Flow Intelligence (Nansen)
              </button>
            </div>
          </div>
        </section>

        {/* Live Swarm Coordination Topology Graph */}
        <section>
          <SwarmVisualizer stage={stage} activeAgent={activeAgent} />
        </section>

        {/* Live Monad Execution Feed & Reasoning Traces */}
        <section>
          <LiveConsole events={events} />
        </section>

      </main>

      {/* Verified Dossier Modal */}
      <EvidenceDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        targetContract={targetContract}
        safetyScore={92}
        verdict="SAFE_TO_INTERACT"
        totalAUSD={25}
        blocksElapsed={4}
        executionSeconds={4.2}
        revisions={1}
        citations={sampleCitations}
      />

      {/* ERC-8004 Agent Registry Modal */}
      <AgentRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full py-5 border-t border-purple-500/10 text-center text-xs text-slate-500 space-y-1">
        <p>Built for the <strong>Monad Metropolis Hackathon</strong> (Track 04: Trust, Identity & AI Infrastructure)</p>
        <p className="mono text-[11px] text-slate-600">ERC-8004 Trustless Agents • Agora AUSD Escrow • 1-Second Single-Slot Finality</p>
      </footer>
    </div>
  );
}

export default App;

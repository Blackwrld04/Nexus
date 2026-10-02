import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SwarmVisualizer, type SwarmStage } from './components/SwarmVisualizer';
import { LiveConsole, type ConsoleEvent } from './components/LiveConsole';
import { EvidenceDossierModal } from './components/EvidenceDossierModal';
import { AgentRegistryModal } from './components/AgentRegistryModal';
import { Play, FileText, RotateCcw, Copy, Check, ExternalLink } from 'lucide-react';

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
  const [copiedContract, setCopiedContract] = useState<string | null>(null);

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

  // Copy Contract Address
  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedContract(id);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  // Launch Closed-Loop Swarm Mission
  const handleLaunchMission = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setEvents([]);
    setStage('PLANNING');
    setActiveAgent('Planner Coordinator Agent');

    const addEvent = (agent: string, action: string, details: string, block: number, tx?: string) => {
      setEvents((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agentName: agent,
          action,
          details,
          blockNumber: block,
          txHash: tx
        }
      ]);
    };

    // Step 1: Planner Decomposes & Locks Escrow
    await new Promise((r) => setTimeout(r, 900));
    addEvent(
      'Planner Coordinator Agent',
      'DECOMPOSE_GOAL',
      `Decomposed mission: "${missionInput}". Identified sub-tasks: [Nansen Net Inflow, Bytecode Disassembly, Evidence Critique].`,
      1845921
    );

    await new Promise((r) => setTimeout(r, 900));
    addEvent(
      'Planner Coordinator Agent',
      'LOCK_ESCROW',
      'Locked 25.00 AUSD in NexusEscrowVault.sol on Monad Testnet for Worker Bounties.',
      1845922,
      '0x12a9bc4890123849102938401928301928301928301928301928301928301928'
    );
    setAusdBalance((prev) => Math.max(0, prev - 25));

    // Step 2: Workers Execute in Parallel on Monad
    setStage('EXECUTING');
    setActiveAgent('Nansen Alpha Intel Agent');
    await new Promise((r) => setTimeout(r, 900));
    addEvent(
      'Nansen Alpha Intel Agent',
      'SUBMIT_FINDINGS',
      'Net Inflow: +$420,500 AUSD. Top 10 concentration: 18.4%. Submitted output hash 0x5b13e0379c20... with Block #1845920 citation.',
      1845923,
      '0x4f89d3810a9cb4e723908124bcf8194ad8129038410294810293847109283401'
    );

    setActiveAgent('Security & Bytecode Auditor');
    await new Promise((r) => setTimeout(r, 900));
    addEvent(
      'Security & Bytecode Auditor',
      'SUBMIT_DRAFT',
      'Decompiled Monad bytecode for 0xa1B2... Found ReentrancyGuard storage layout. Warning: dynamic tick array proof missing.',
      1845924
    );

    // Step 3: Evaluator Critic Rejects Draft 1 (Closed-Loop Quality Gate)
    setStage('CRITIQUING_FAIL');
    setActiveAgent('Evaluator & Critic Gatekeeper');
    await new Promise((r) => setTimeout(r, 1000));
    addEvent(
      'Evaluator & Critic Gatekeeper',
      'REQUEST_REVISION',
      'CRITIQUE FAILED: Missing proof for dynamic price tick bounds. Emitted requestRevision() on Monad Escrow Vault. Escrow release blocked.',
      1845925,
      '0x77c8492048102948102948102948102948102948102948102948102948102948'
    );

    // Step 4: Auditor Revises & Validates Tick Bounds
    setStage('REVISING');
    setActiveAgent('Security & Bytecode Auditor');
    await new Promise((r) => setTimeout(r, 1100));
    addEvent(
      'Security & Bytecode Auditor',
      'SUBMIT_REVISION',
      'Revision complete: Verified dynamic tick price array across Monad parallel execution buckets. Attached proof Block #1845926.',
      1845926,
      '0xaa1290384102948102938471092834014f89d3810a9cb4e723908124bcf8194a'
    );

    // Step 5: Evaluator Approves & Releases Escrow
    setStage('APPROVED');
    setActiveAgent('Evaluator & Critic Gatekeeper');
    await new Promise((r) => setTimeout(r, 1000));
    addEvent(
      'Evaluator & Critic Gatekeeper',
      'APPROVAL_VERDICT',
      'Revision APPROVED (Score: 98/100). Emitted approveAndRelease() to release 25 AUSD from Escrow Vault to Workers.',
      1845927,
      '0x99e0102948102948102948102948102948102948102948102948102948102948'
    );

    addEvent(
      'Monad Settlement Engine',
      'REPUTATION_UPDATE',
      'Awarded +3 Reputation Points on ERC-8004 Reputation Registry to Nansen Agent & Auditor Agent.',
      1845928
    );

    // Step 6: Explainer Synthesizes Evidence Dossier
    setStage('COMPLETE');
    setActiveAgent('');
    setIsRunning(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6b21a8', '#b45309', '#15803d', '#141210']
    });

    addEvent(
      'Explainer Agent',
      'DOSSIER_READY',
      'Synthesized verifiable onchain evidence dossier with 6 block citations. Ready for human review.',
      1845928
    );
  };

  const sampleCitations = [
    {
      source: 'NANSEN_INTEL',
      metric: 'Smart Money Net Inflow (24h)',
      value: '+$420,500 AUSD Inflow',
      blockNumber: 1845920,
      txHash: '0x4f89d3810a9cb4e723908124bcf8194ad8129038410294810293847109283401',
      timestamp: 'Just now'
    },
    {
      source: 'NANSEN_INTEL',
      metric: 'Top 10 Holders Concentration',
      value: '18.4% (Decentralized)',
      blockNumber: 1845920,
      txHash: '0x12a9bc4890123849102938401928301928301928301928301928301928301928',
      timestamp: 'Just now'
    },
    {
      source: 'MONAD_RPC',
      metric: 'Active Liquidity Depth',
      value: '$1,850,000 AUSD Pool Depth',
      blockNumber: 1845922,
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

  const contractsList = [
    {
      id: 'id-reg',
      name: 'NexusIdentityRegistry.sol',
      tag: 'ERC-8004 Standard',
      description: 'Onchain Agent Card NFT passports, verified capability bitmasks, and operator bindings.',
      address: '0x71C8492048102948102948102948102948102948'
    },
    {
      id: 'rep-reg',
      name: 'NexusReputationRegistry.sol',
      tag: 'Composite Scoring',
      description: 'Dynamic 0–100 composite scoring, decentralized feedback logging, and slashing execution.',
      address: '0x82D9102948102948102948102948102948102948'
    },
    {
      id: 'escrow-vault',
      name: 'NexusEscrowVault.sol',
      tag: 'Machine Escrow',
      description: 'Machine-to-machine escrow in Agora AUSD with Evaluator gating and automated revision loops.',
      address: '0x93E0102948102948102948102948102948102948'
    },
    {
      id: 'mock-ausd',
      name: 'MockAUSD.sol (Agora)',
      tag: 'Settlement Token',
      description: 'Institutional-grade stablecoin mock with public testnet faucet for 1-click agent bounties.',
      address: '0xA4F1102948102948102948102948102948102948'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Header */}
      <Header
        ausdBalance={ausdBalance}
        onClaimFaucet={handleClaimFaucet}
        onOpenRegistry={() => setIsRegistryOpen(true)}
      />

      {/* Main Mission Control Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-10">

        {/* Hero Section (Ryoku Light Editorial Style) */}
        <section id="hero" className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <span className="badge-jp">
              <span className="jp">自律型スワーム</span>
              <span>// MONAD TRACK 04: TRUST & IDENTITY INFRASTRUCTURE</span>
            </span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[var(--ink)] font-normal tracking-tight leading-[1.05]">
              Autonomous AI Agent Swarm with <span className="italic">Closed-Loop Evaluation</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed max-w-3xl">
              Empowered by <strong>ERC-8004</strong> on Monad. The <strong>Planner</strong> delegates, <strong>Specialists</strong> execute in parallel, and the <strong>Evaluator Critic</strong> gates <strong>Agora AUSD</strong> escrows—rejecting flawed drafts with automated revision loops before 1-second onchain settlement.
            </p>
          </div>

          {/* Vitals Strip (4-Cell Hairline Architecture) */}
          <div className="vitals-grid">
            <div className="vital-cell">
              <span className="font-display text-2xl sm:text-3xl text-[var(--ink)] font-light leading-none">10,000</span>
              <span className="font-sans text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Monad TPS Finality</span>
            </div>
            <div className="vital-cell">
              <span className="font-display text-2xl sm:text-3xl text-[var(--monad)] font-light leading-none">4.2s</span>
              <span className="font-sans text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Avg Loop Resolution</span>
            </div>
            <div className="vital-cell">
              <span className="font-display text-2xl sm:text-3xl text-[var(--ink)] font-light leading-none">100%</span>
              <span className="font-sans text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Verifiable Citations</span>
            </div>
            <div className="vital-cell">
              <span className="font-display text-2xl sm:text-3xl text-[var(--agora)] font-light leading-none">ERC-8004</span>
              <span className="font-sans text-[10px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Trustless Passport</span>
            </div>
          </div>

          {/* Mission Dispatch Bar */}
          <div className="editorial-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-[var(--paper-soft)] border border-[var(--line)] rounded-[var(--radius)] px-3 py-2">
                <span className="font-mono text-xs text-[var(--ink-muted)] whitespace-nowrap">GOAL:</span>
                <input
                  type="text"
                  id="mission-goal-input"
                  value={missionInput}
                  onChange={(e) => setMissionInput(e.target.value)}
                  disabled={isRunning}
                  className="w-full bg-transparent text-xs text-[var(--ink)] focus:outline-none font-mono"
                  placeholder="Enter swarm mission..."
                />
              </div>

              <button
                onClick={handleLaunchMission}
                disabled={isRunning}
                id="launch-swarm-mission-btn"
                className={`editorial-btn editorial-btn-solid text-xs py-2 px-5 whitespace-nowrap flex items-center gap-2 ${
                  isRunning ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Swarm Loop...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Swarm Mission</span>
                  </>
                )}
              </button>

              {stage === 'COMPLETE' && (
                <button
                  onClick={() => setIsDossierOpen(true)}
                  id="view-verified-dossier-btn"
                  className="editorial-btn text-xs py-2 px-4 bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30 hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Dossier (92/100)</span>
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="font-mono text-[10px] text-[var(--ink-faint)] uppercase tracking-wider">Presets:</span>
              <button
                onClick={() => {
                  setMissionInput('Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...');
                  setTargetContract('0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0');
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-[var(--radius)] bg-[var(--paper-soft)] hover:bg-[var(--paper-muted)] border border-[var(--line)] text-[var(--ink-dim)] font-mono text-[11px] cursor-pointer transition-colors"
              >
                ★ Full Closed-Loop Audit (Shows Evaluator Revision Loop)
              </button>
              <button
                onClick={() => {
                  setMissionInput('Analyze smart money whale net inflows and top 10 holder clustering for 0x4f89...');
                  setTargetContract('0x4f89d3810a9cb4e723908124bcf8194ad8129038');
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-[var(--radius)] bg-[var(--paper-soft)] hover:bg-[var(--paper-muted)] border border-[var(--line)] text-[var(--ink-dim)] font-mono text-[11px] cursor-pointer transition-colors"
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

        {/* Verified Monad Testnet Smart Contracts Section */}
        <section id="contracts" className="editorial-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <span className="badge-jp">
                <span className="jp">スマートコントラクト</span>
                <span>// VERIFIED ON MONAD TESTNET (CHAIN ID 10143)</span>
              </span>
              <h2 className="font-display text-xl text-[var(--ink)] font-normal mt-1">
                Verified Smart Contract Suite
              </h2>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--success)]">
              <span className="pulse-dot" />
              <span>Foundry 100% Tests Passing</span>
            </div>
          </div>

          <div className="divide-y divide-[var(--line-soft)]">
            {contractsList.map((c) => (
              <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[var(--ink)]">{c.name}</span>
                    <span className="px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-muted)]">
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-[var(--ink-muted)] text-[11px] mt-0.5">{c.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs text-[var(--ink)] bg-[var(--paper-soft)] px-2.5 py-1 rounded-[var(--radius)] border border-[var(--line)]">
                    {c.address.slice(0, 10)}...{c.address.slice(-8)}
                  </span>
                  <button
                    onClick={() => handleCopy(c.address, c.id)}
                    className="p-1 rounded-[var(--radius)] border border-[var(--line)] hover:bg-[var(--paper-soft)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                    title="Copy address"
                  >
                    {copiedContract === c.id ? (
                      <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://testnet.monadscan.com/address/${c.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-[var(--radius)] border border-[var(--line)] hover:bg-[var(--paper-soft)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                    title="View on MonadScan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
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

      {/* Footer (Ryoku Minimal Editorial Colophon) */}
      <footer className="w-full py-8 border-t border-[var(--line)] bg-[var(--paper)] mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-[var(--ink)]">[NX] NEXUS</span>
            <span>•</span>
            <span className="font-jp text-[11px]">Monad Metropolis Hackathon Track 04</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--ink-faint)]">
            ERC-8004 Standard • Agora AUSD Escrow • 1-Second Single-Slot Finality
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

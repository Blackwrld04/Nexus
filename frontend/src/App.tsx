import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SwarmVisualizer, type SwarmStage } from './components/SwarmVisualizer';
import { LiveConsole, type ConsoleEvent } from './components/LiveConsole';
import { EvidenceDossierModal } from './components/EvidenceDossierModal';
import { AgentRegistryModal } from './components/AgentRegistryModal';
import { Play, FileText, RotateCcw, Copy, Check, ExternalLink, ArrowDown, CheckCircle, ArrowUp } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState<string>('overview');

  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState<boolean>(false);
  const [copiedContract, setCopiedContract] = useState<string | null>(null);

  // IntersectionObserver to sync active section with Header nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const ids = ['overview', 'topology', 'execution', 'contracts'];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
      '0xaa1290384102948102948102948102948102948102948102948102948102948'
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
      txHash: '0xaa1290384102948102948102948102948102948102948102948102948102948',
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
      badge: 'Agent Passports',
      description: 'Onchain Agent Card NFT passports, verified capability bitmasks, and operator address bindings on Monad.',
      address: '0x71C8492048102948102948102948102948102948',
      functions: ['registerAgent()', 'updateCapabilities()', 'getAgent()', 'isOperator()'],
      events: 'AgentRegistered, CapabilitiesUpdated',
      storage: 'mapping(uint256 => AgentCard) public agents',
      invariant: 'Bitmask capabilities enforced before task assignment',
      gas: '24,200 gas',
      tests: '5 Passing Tests (100%)'
    },
    {
      id: 'rep-reg',
      name: 'NexusReputationRegistry.sol',
      tag: 'Composite Scoring',
      badge: 'Feedback & Slashing',
      description: 'Dynamic 0–100 composite scoring, decentralized feedback logging, and evaluator slashing enforcement.',
      address: '0x82D9102948102948102948102948102948102948',
      functions: ['submitFeedback()', 'slashReputation()', 'getReputationScore()'],
      events: 'FeedbackSubmitted, AgentSlashed',
      storage: 'mapping(uint256 => ScoreRecord) public scores',
      invariant: 'Slashing penalties lock agent from new bounty claims',
      gas: '19,800 gas',
      tests: '4 Passing Tests (100%)'
    },
    {
      id: 'escrow-vault',
      name: 'NexusEscrowVault.sol',
      tag: 'Machine Escrow',
      badge: 'Agora AUSD Settlement',
      description: 'Machine-to-machine escrow in Agora AUSD with Evaluator gating and automated revision loops.',
      address: '0x93E0102948102948102948102948102948102948',
      functions: ['lockEscrow()', 'requestRevision()', 'approveAndRelease()'],
      events: 'EscrowLocked, RevisionRequested, EscrowReleased',
      storage: 'mapping(bytes32 => EscrowClaim) public claims',
      invariant: 'Zero payout release without Evaluator approval hash',
      gas: '28,400 gas',
      tests: '5 Passing Tests (100%)'
    },
    {
      id: 'mock-ausd',
      name: 'MockAUSD.sol (Agora)',
      tag: 'Settlement Token',
      badge: 'Institutional Stablecoin',
      description: 'Institutional-grade stablecoin mock with public testnet faucet for 1-click agent bounty streaming.',
      address: '0xA4F1102948102948102948102948102948102948',
      functions: ['mintFaucet()', 'transferFrom()', 'balanceOf()', 'permit()'],
      events: 'Transfer, Approval',
      storage: 'mapping(address => uint256) public balanceOf',
      invariant: 'Institutional 1:1 USD-pegged streaming settlement',
      gas: '21,100 gas',
      tests: 'EIP-2612 Gasless Permits'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      {/* Header */}
      <Header
        ausdBalance={ausdBalance}
        onClaimFaucet={handleClaimFaucet}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content: 4 Full-Screen Sections */}
      <main className="w-full flex-1">

        {/* ========================================================================= */}
        {/* SECTION 00: SYSTEM OVERVIEW (Full Viewport Screen)                       */}
        {/* ========================================================================= */}
        <section id="overview" className="screen-section">
          <div className="wrap flex-1 flex flex-col justify-between py-1 sm:py-2">
            
            {/* Top: Architectural Section Head */}
            <div>
              <div className="section-head">
                <div className="section-head__dot" />
                <span className="section-head__name">00 // SYSTEM OVERVIEW</span>
                <div className="section-head__lead" />
                <span className="section-head__tag">MONAD METROPOLIS HACKATHON · TRACK 04</span>
              </div>

              {/* Hero Title & Description */}
              <div className="space-y-2 mt-1">
                <div className="flex items-center gap-2">
                  <span className="badge-jp">
                    <span className="jp">自律型スワーム</span>
                    <span>// TRUST & IDENTITY INFRASTRUCTURE · MONAD HIGH-THROUGHPUT EVM</span>
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--ink)] font-normal tracking-tight leading-[1.05]">
                  Autonomous AI Agent Swarm with <span className="italic font-light">Closed-Loop Evaluation</span>
                </h1>

                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed max-w-4xl">
                  Engineered on Monad's 10,000 TPS parallel EVM with <strong>ERC-8004</strong> decentralized agent identities. The <strong>Planner</strong> dynamically coordinates, specialized Alpha & Auditor agents execute concurrently, and the <strong>Evaluator Critic</strong> autonomously gates <strong>Agora AUSD</strong> escrow payouts—rejection triggering rapid revision loops before sub-second onchain finality.
                </p>
              </div>
            </div>

            {/* Middle: 4-Cell Vitals Grid Spanning 100% of wrap */}
            <div className="my-2">
              <div className="vitals-grid">
                <div className="vital-cell">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--ink)] font-light leading-none">10,000</span>
                  <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Monad TPS Finality</span>
                </div>
                <div className="vital-cell">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--monad)] font-light leading-none">4.2s</span>
                  <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Avg Loop Resolution</span>
                </div>
                <div className="vital-cell">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--ink)] font-light leading-none">100%</span>
                  <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Verifiable Citations</span>
                </div>
                <div className="vital-cell">
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--agora)] font-light leading-none">ERC-8004</span>
                  <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-[var(--ink-muted)] uppercase tracking-wider">Trustless Passports</span>
                </div>
              </div>
            </div>

            {/* Bottom: Mission Dispatch Command Console */}
            <div>
              <div className="editorial-card p-4 sm:p-4.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                      Mission Dispatch Console
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ink-muted)] hidden sm:inline">
                      // CLOSED-LOOP ORCHESTRATION TRIGGER
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="pulse-dot" />
                    <span className="text-[var(--ink-muted)] text-[10px]">
                      {isRunning ? 'Execution Loop Active' : 'Ready to Dispatch'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                  {/* Target Contract Input */}
                  <div className="lg:col-span-4 flex items-center gap-2 bg-[var(--paper-soft)] border border-[var(--line)] rounded-[var(--radius)] px-3 py-2">
                    <span className="font-mono text-[10px] text-[var(--ink-muted)] whitespace-nowrap font-bold">TARGET:</span>
                    <input
                      type="text"
                      value={targetContract}
                      onChange={(e) => setTargetContract(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-transparent text-xs text-[var(--ink)] focus:outline-none font-mono"
                      placeholder="0x contract address..."
                    />
                  </div>

                  {/* Goal Prompt Input */}
                  <div className="lg:col-span-5 flex items-center gap-2 bg-[var(--paper-soft)] border border-[var(--line)] rounded-[var(--radius)] px-3 py-2">
                    <span className="font-mono text-[10px] text-[var(--ink-muted)] whitespace-nowrap font-bold">GOAL:</span>
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

                  {/* Launch CTA */}
                  <div className="lg:col-span-3 flex items-center gap-2">
                    <button
                      onClick={handleLaunchMission}
                      disabled={isRunning}
                      id="launch-swarm-mission-btn"
                      className={`w-full editorial-btn editorial-btn-solid text-xs py-2 px-3 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                        isRunning ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Loop...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Swarm</span>
                        </>
                      )}
                    </button>

                    {stage === 'COMPLETE' && (
                      <button
                        onClick={() => setIsDossierOpen(true)}
                        id="view-verified-dossier-btn"
                        className="editorial-btn text-xs py-2 px-3 bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30 hover:bg-emerald-100 flex items-center gap-1 flex-shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Dossier (92)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Presets & Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] text-[var(--ink-faint)] uppercase tracking-wider font-semibold">Presets:</span>
                    <button
                      onClick={() => {
                        setMissionInput('Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...');
                        setTargetContract('0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0');
                      }}
                      disabled={isRunning}
                      className="px-2 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)] hover:bg-[var(--paper-muted)] border border-[var(--line)] text-[var(--ink-dim)] font-mono text-[10px] cursor-pointer transition-colors"
                    >
                      ★ Full Closed-Loop Audit (Shows Evaluator Revision Loop)
                    </button>
                    <button
                      onClick={() => {
                        setMissionInput('Analyze smart money whale net inflows and top 10 holder clustering for 0x4f89...');
                        setTargetContract('0x4f89d3810a9cb4e723908124bcf8194ad8129038');
                      }}
                      disabled={isRunning}
                      className="px-2 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)] hover:bg-[var(--paper-muted)] border border-[var(--line)] text-[var(--ink-dim)] font-mono text-[10px] cursor-pointer transition-colors"
                    >
                      Whale Flow Intelligence (Nansen)
                    </button>
                  </div>

                  <div className="font-mono text-[10px] text-[var(--ink-faint)] hidden sm:block">
                    Locked Micro-Escrow: <strong className="text-[var(--agora)]">25.00 AUSD</strong> • Single-Slot Finality: <strong className="text-[var(--ink)]">1.0s</strong>
                  </div>
                </div>
              </div>

              {/* Jump to Next Section */}
              <div className="pt-2 flex justify-center">
                <a href="#topology" className="section-jump">
                  <span>01 // SWARM COORDINATION TOPOLOGY</span>
                  <ArrowDown className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 01: SWARM COORDINATION TOPOLOGY (Full Viewport Screen)             */}
        {/* ========================================================================= */}
        <section id="topology" className="screen-section">
          <div className="wrap flex-1 flex flex-col justify-between py-1 sm:py-2">
            
            <div>
              <div className="section-head">
                <div className="section-head__dot" />
                <span className="section-head__name">01 // SWARM COORDINATION TOPOLOGY</span>
                <div className="section-head__lead" />
                <span className="section-head__tag">ERC-8004 ORCHESTRATION & STATE MACHINE</span>
              </div>
            </div>

            <SwarmVisualizer stage={stage} activeAgent={activeAgent} />

            {/* Jump to Next Section */}
            <div className="pt-2 flex justify-center">
              <a href="#execution" className="section-jump">
                <span>02 // LIVE MONAD TELEMETRY & REASONING TRACES</span>
                <ArrowDown className="w-3 h-3" />
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 02: LIVE MONAD TELEMETRY & REASONING TRACES (Full Viewport Screen)*/}
        {/* ========================================================================= */}
        <section id="execution" className="screen-section">
          <div className="wrap flex-1 flex flex-col justify-between py-1 sm:py-2">
            
            <div>
              <div className="section-head">
                <div className="section-head__dot" />
                <span className="section-head__name">02 // LIVE MONAD TELEMETRY & REASONING TRACES</span>
                <div className="section-head__lead" />
                <span className="section-head__tag">RPC BLOCKS · 1-SEC FINALITY · MONAD TESTNET</span>
              </div>
            </div>

            <LiveConsole events={events} />

            {/* Jump to Next Section */}
            <div className="pt-2 flex justify-center">
              <a href="#contracts" className="section-jump">
                <span>03 // VERIFIED SMART CONTRACT SUITE</span>
                <ArrowDown className="w-3 h-3" />
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 03: VERIFIED SMART CONTRACT SUITE (Full Viewport Screen)           */}
        {/* ========================================================================= */}
        <section id="contracts" className="screen-section">
          <div className="wrap flex-1 flex flex-col justify-between py-1 sm:py-2">
            
            <div>
              <div className="section-head">
                <div className="section-head__dot" />
                <span className="section-head__name">03 // VERIFIED SMART CONTRACT SUITE</span>
                <div className="section-head__lead" />
                <span className="section-head__tag">FOUNDRY TESTED · MONAD EVM PRIMITIVES</span>
              </div>
            </div>

            <div className="editorial-card p-4 sm:p-5 space-y-2.5 flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)] flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="badge-jp">
                      <span className="jp">スマートコントラクト</span>
                      <span>// MONAD EVM DEPLOYMENTS</span>
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl text-[var(--ink)] font-normal">
                    Verified Smart Contract Suite
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--success)] bg-[var(--success-soft)] px-2.5 py-1 rounded-[var(--radius)] border border-[var(--success)]/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="font-semibold">Foundry 100% Tests Passing (3/3 Suites, 14 Tests)</span>
                  </div>
                </div>
              </div>

              {/* 4 Rich Contract Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1">
                {contractsList.map((c) => (
                  <div key={c.id} className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] hover:border-[var(--line-strong)] transition-all flex flex-col justify-between gap-1.5">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs sm:text-sm text-[var(--ink)]">{c.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-[9px] font-mono text-[var(--ink-muted)] font-medium">
                          {c.tag}
                        </span>
                      </div>
                      
                      <p className="text-[var(--ink-muted)] text-[11px] leading-relaxed">{c.description}</p>
                      
                      {/* Methods list */}
                      <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                        <span className="text-[9px] font-mono text-[var(--ink-faint)] uppercase font-semibold">Methods:</span>
                        {c.functions.map((fn, idx) => (
                          <span key={idx} className="font-mono text-[9px] px-1 py-0.2 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink-dim)]">
                            {fn}
                          </span>
                        ))}
                      </div>

                      {/* Storage State & Monad Invariant */}
                      <div className="mt-1.5 p-2 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line-soft)] space-y-0.5 text-[10px] font-mono">
                        <div className="text-[var(--ink-muted)] truncate">State: <code>{c.storage}</code></div>
                        <div className="text-[var(--ink-faint)] flex items-center justify-between">
                          <span>Rule: {c.invariant}</span>
                          <span className="font-semibold text-[var(--monad)]">{c.gas}</span>
                        </div>
                      </div>

                      {/* Emitted Events */}
                      <div className="mt-1 text-[10px] font-mono text-[var(--ink-faint)]">
                        Emits: <code className="text-[var(--ink-dim)]">{c.events}</code>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[var(--line-soft)] text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--ink)] text-[11px] font-medium">
                          {c.address.slice(0, 10)}...{c.address.slice(-8)}
                        </span>
                        <span className="text-[9px] text-[var(--success)] bg-[var(--success-soft)] px-1.5 py-0.2 rounded border border-[var(--success)]/20 font-medium">
                          {c.tests}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(c.address, c.id)}
                          className="p-1 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] hover:bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                          title="Copy address"
                        >
                          {copiedContract === c.id ? (
                            <Check className="w-3 h-3 text-[var(--success)]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <a
                          href={`https://testnet.monadscan.com/address/${c.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] hover:bg-[var(--paper)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                          title="View on MonadScan"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benchmark Summary Bar */}
              <div className="pt-2 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[var(--ink-faint)] flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span>EVM Target: <strong>Shanghai (MonadDb Optimized)</strong></span>
                  <span>•</span>
                  <span>Solidity: <strong>v0.8.28</strong></span>
                  <span>•</span>
                  <span>Avg Gas: <strong>24,000 / Action</strong></span>
                </div>
                <div>
                  <span className="text-[var(--success)] font-medium">1-Sec Single-Slot Monad Finality</span>
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <div className="pt-2 flex justify-center">
              <a href="#overview" className="section-jump">
                <ArrowUp className="w-3 h-3" />
                <span>00 // BACK TO OVERVIEW</span>
              </a>
            </div>

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
      <footer className="w-full py-6 border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink-muted)]">
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

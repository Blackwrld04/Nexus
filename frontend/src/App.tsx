import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SwarmVisualizer, type SwarmStage } from './components/SwarmVisualizer';
import { LiveConsole, type ConsoleEvent } from './components/LiveConsole';
import { EvidenceDossierModal } from './components/EvidenceDossierModal';
import { AgentRegistryModal } from './components/AgentRegistryModal';
import { AgentDirectoryView } from './components/AgentDirectoryView';
import { DocumentationView } from './components/DocumentationView';
import { Play, FileText, RotateCcw, ArrowRight } from 'lucide-react';

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
  const [currentView, setCurrentView] = useState<'app' | 'agents' | 'docs'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#docs') return 'docs';
      if (window.location.hash === '#agents') return 'agents';
    }
    return 'app';
  });

  // Handle URL hash for direct /#docs, /#agents, and /#dossier navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#docs') {
        setCurrentView('docs');
      } else if (window.location.hash === '#agents') {
        setCurrentView('agents');
      } else if (window.location.hash === '#dossier') {
        setCurrentView('app');
        setIsDossierOpen(true);
      } else if (window.location.hash === '#registry') {
        setCurrentView('app');
        setIsRegistryOpen(true);
      } else {
        setCurrentView('app');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
      particleCount: 90,
      spread: 75,
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

  // Render dedicated documentation view when on docs page (matching useora.site 1:1)
  if (currentView === 'docs') {
    return (
      <>
        <DocumentationView
          onBackToApp={() => {
            setCurrentView('app');
            window.location.hash = '';
          }}
          onOpenAgents={() => {
            setCurrentView('agents');
            window.location.hash = '#agents';
          }}
          onLaunchSwarm={() => {
            setCurrentView('app');
            window.location.hash = '#demo';
            setTimeout(handleLaunchMission, 100);
          }}
        />
        <AgentRegistryModal isOpen={isRegistryOpen} onClose={() => setIsRegistryOpen(false)} />
        <EvidenceDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          targetContract={targetContract}
          safetyScore={92}
          verdict="APPROVED WITH VERIFIED PROOFS"
          totalAUSD={25.0}
          blocksElapsed={4}
          executionSeconds={4.2}
          revisions={1}
          citations={sampleCitations}
        />
      </>
    );
  }

  // Render dedicated Agent Directory view when on agents page (#agents)
  if (currentView === 'agents') {
    return (
      <div className="min-h-screen w-full flex flex-col bg-[#f8f9fd] text-[#101075] selection:bg-blue-600 selection:text-white relative">
        <div className="grain-page-ambient pointer-events-none" />
        <Header
          ausdBalance={ausdBalance}
          activeView="agents"
          onClaimFaucet={handleClaimFaucet}
          onOpenRegistry={() => {
            setCurrentView('agents');
            window.location.hash = '#agents';
          }}
          onOpenDocs={() => {
            setCurrentView('docs');
            window.location.hash = '#docs';
          }}
          onOpenTerminal={() => {
            setCurrentView('app');
            window.location.hash = '';
          }}
        />
        <AgentDirectoryView
          onBackToTerminal={() => {
            setCurrentView('app');
            window.location.hash = '';
          }}
          onLaunchMissionWithPreset={(prompt, contract) => {
            setMissionInput(prompt);
            setTargetContract(contract);
            setCurrentView('app');
            window.location.hash = '#demo';
            setTimeout(handleLaunchMission, 150);
          }}
        />
        <AgentRegistryModal isOpen={isRegistryOpen} onClose={() => setIsRegistryOpen(false)} />
        <EvidenceDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          targetContract={targetContract}
          safetyScore={92}
          verdict="APPROVED WITH VERIFIED PROOFS"
          totalAUSD={25.0}
          blocksElapsed={4}
          executionSeconds={4.2}
          revisions={1}
          citations={sampleCitations}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8f9fd] text-[#101075] selection:bg-blue-600 selection:text-white relative">
      {/* Ambient subtle grain texture overlay */}
      <div className="grain-page-ambient pointer-events-none" />

      {/* 1. Header (PriorLabs exact navbar) */}
      <Header
        ausdBalance={ausdBalance}
        activeView="app"
        onClaimFaucet={handleClaimFaucet}
        onOpenRegistry={() => {
          setCurrentView('agents');
          window.location.hash = '#agents';
        }}
        onOpenDocs={() => {
          setCurrentView('docs');
          window.location.hash = '#docs';
        }}
        onOpenTerminal={() => {
          setCurrentView('app');
          window.location.hash = '';
        }}
      />

      {/* 2. Main Page Layout with Centered Flow & 6.5rem (104px) Section Gaps */}
      <main className="prior-main-flow flex-1">

        {/* HERO SECTION (PriorLabs Screenshot 2) */}
        <section className="prior-container-narrow">
          <h1 className="prior-hero-headline">
            One Swarm, <br className="hidden sm:inline" />Infinite Verifications
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Pre-trained autonomous AI agent swarm for executing onchain research and security audits on Monad. Get verifiable cryptographic proofs in seconds — no hallucinations, no manual review.
          </p>

          {/* Action Buttons (PriorLabs Talk To Sales & Try TabPFN) */}
          <div className="prior-hero-buttons">
            <button
              onClick={() => {
                setCurrentView('agents');
                window.location.hash = '#agents';
              }}
              className="prior-btn-secondary cursor-pointer"
            >
              Agent Passports
            </button>

            <a
              href="#demo"
              className="prior-btn-primary"
            >
              <span>Launch Swarm</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* INTERACTIVE DEMO CONTAINER (PriorLabs Prediction Table in Screenshot 2) */}
        <section id="demo" className="prior-dark-card">
          {/* PriorLabs Signature Tactile Grain Overlay */}
          <div className="grain-overlay-dark pointer-events-none" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Mission Directive (Human Prompt)
              </span>
              <span className="text-[11px] font-mono text-blue-400">
                Session Escrow: $25.00 AUSD locked upon launch
              </span>
            </div>

            <div className="prior-demo-row">
              <input
                type="text"
                id="mission-goal-input"
                value={missionInput}
                onChange={(e) => setMissionInput(e.target.value)}
                disabled={isRunning}
                className="prior-input"
                placeholder="Enter audit mission..."
              />

              {/* PriorLabs Signature Predict Button */}
              <button
                onClick={handleLaunchMission}
                disabled={isRunning}
                id="launch-swarm-mission-btn"
                className={`prior-predict-btn ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>Swarm Executing on Monad...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Swarm Mission</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets & Status */}
          <div className="prior-demo-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <span className="text-slate-400 text-xs font-mono">Quick Presets:</span>
              <button
                onClick={() => {
                  setMissionInput('Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...');
                  setTargetContract('0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0');
                }}
                disabled={isRunning}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:border-white/40 text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                ★ Full Closed-Loop Audit (Triggers Evaluator Revision)
              </button>
              <button
                onClick={() => {
                  setMissionInput('Analyze smart money whale net inflows and top 10 holder clustering for 0x4f89...');
                  setTargetContract('0x4f89d3810a9cb4e723908124bcf8194ad8129038');
                }}
                disabled={isRunning}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:border-white/40 text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Whale Flow Intelligence (Nansen)
              </button>
            </div>

            {stage === 'COMPLETE' && (
              <button
                onClick={() => setIsDossierOpen(true)}
                id="view-verified-dossier-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#101075] text-[#101075] hover:bg-[#f1f2fa] font-medium text-xs cursor-pointer shadow-md animate-pulse whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>View Verified Dossier (92/100)</span>
              </button>
            )}
          </div>
        </section>

        {/* SIGNATURE DATA FLOW SECTION (PriorLabs Screenshot 3) */}
        <section id="topology" className="w-full">
          <SwarmVisualizer stage={stage} activeAgent={activeAgent} />
        </section>

        {/* LIVE EXECUTION FEED SECTION (PriorLabs Industry / Case Study Clean Section) */}
        <section id="execution" className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600">
                Autonomous Execution Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0a0e2a] tracking-tight">
                Live Swarm Reasoning & Settlement
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Single-Slot Finality (1.0s Blocks) • Parallel Telemetry
            </p>
          </div>

          <LiveConsole events={events} />
        </section>

        {/* BOTTOM CTA BANNER (PriorLabs Screenshot 1) */}
        <section className="prior-cta-section">
          {/* PriorLabs Signature Tactile Grain Overlay */}
          <div className="grain-overlay-blue pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            Start building with Nexus on Monad today
          </h2>
          <p className="text-white/85 max-w-xl mx-auto text-sm sm:text-base leading-relaxed relative z-10">
            Eliminate prompt hallucinations. Experience autonomous closed-loop agent coordination with Agora AUSD escrows and 1-second block finality.
          </p>
          <div className="prior-cta-buttons">
            <button
              onClick={() => setIsRegistryOpen(true)}
              className="prior-btn-cta-outline"
            >
              Agent Passports
            </button>
            <button
              onClick={handleLaunchMission}
              disabled={isRunning}
              className="prior-btn-cta-white"
            >
              <span>Launch Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* 3. PRIORLABS ARCHITECTURAL FULL-WIDTH FOOTER (Exact 1:1 with PriorLabs Image) */}
      <footer className="prior-footer-full mt-auto">
        <div className="prior-footer-split-container">
          
          {/* Left Column: Links & Giant NEXUS wordmark */}
          <div className="prior-footer-col-left">
            <div>
              <div className="flex flex-col gap-2.5 text-sm font-medium text-slate-600">
                <a href="#topology" className="hover:text-[#101075] transition-colors">Topology</a>
                <a href="#demo" className="hover:text-[#101075] transition-colors">Mission Playground</a>
                <button onClick={() => setIsRegistryOpen(true)} className="text-left hover:text-[#101075] transition-colors cursor-pointer font-medium">
                  Agent Capabilities
                </button>
                <button onClick={() => { setCurrentView('docs'); window.location.hash = '#docs'; }} className="text-left hover:text-[#101075] transition-colors cursor-pointer font-medium">
                  Documentation
                </button>
                <a href="https://testnet.monadscan.com" target="_blank" rel="noreferrer" className="hover:text-[#101075] transition-colors">
                  Monad Explorer
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#101075] transition-colors">
                  Contract Repositories
                </a>
              </div>
            </div>

            {/* Giant NEXUS Brand Wordmark */}
            <div>
              <div className="prior-giant-logo">
                NEXUS
              </div>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed mt-3 font-normal">
                Autonomous machine-to-machine coordination and labor marketplace where AI agents discover, hire, validate, and settle on Monad.
              </p>
            </div>
          </div>

          {/* Right Column: 2x2 Architectural Grid Spanning the full right side */}
          <div className="prior-footer-col-right">
            <div className="prior-footer-quad-grid">
              
              {/* Cell 1: Agents Directory */}
              <div className="prior-footer-quad-cell">
                <h4 
                  onClick={() => {
                    setCurrentView('agents');
                    window.location.hash = '#agents';
                  }}
                  className="font-bold text-[#0a0e2a] text-sm mb-7 sm:mb-8 tracking-tight font-sans cursor-pointer hover:text-blue-600 transition-colors"
                >
                  Agents Directory →
                </h4>
                <ul className="space-y-2 text-slate-500 font-mono text-xs">
                  <li onClick={() => { setCurrentView('agents'); window.location.hash = '#agents'; }} className="hover:text-blue-600 cursor-pointer">Planner Coordinator</li>
                  <li onClick={() => { setCurrentView('agents'); window.location.hash = '#agents'; }} className="hover:text-blue-600 cursor-pointer">Nansen Alpha Intel</li>
                  <li onClick={() => { setCurrentView('agents'); window.location.hash = '#agents'; }} className="hover:text-blue-600 cursor-pointer">Security Bytecode Auditor</li>
                  <li onClick={() => { setCurrentView('agents'); window.location.hash = '#agents'; }} className="hover:text-blue-600 cursor-pointer">Evaluator Gatekeeper</li>
                  <li onClick={() => { setCurrentView('agents'); window.location.hash = '#agents'; }} className="hover:text-blue-600 cursor-pointer">Explainer Tracer</li>
                </ul>
              </div>

              {/* Cell 2: Contracts */}
              <div className="prior-footer-quad-cell">
                <h4 className="font-bold text-[#0a0e2a] text-sm mb-7 sm:mb-8 tracking-tight font-sans">
                  Contracts
                </h4>
                <ul className="space-y-2 text-slate-500 font-mono text-xs">
                  <li>NexusIdentityRegistry</li>
                  <li>NexusReputationRegistry</li>
                  <li>NexusEscrowVault</li>
                  <li>MockAUSD</li>
                </ul>
              </div>

              {/* Cell 3: Developers */}
              <div className="prior-footer-quad-cell">
                <h4 className="font-bold text-[#0a0e2a] text-sm mb-7 sm:mb-8 tracking-tight font-sans">
                  Developers
                </h4>
                <ul className="space-y-2 text-slate-500 font-mono text-xs">
                  <li 
                    onClick={() => {
                      setCurrentView('docs');
                      window.location.hash = '#docs';
                    }}
                    className="hover:text-blue-600 cursor-pointer font-semibold text-[#101075]"
                  >
                    Protocol Documentation →
                  </li>
                  <li>Contract Interfaces (ABIs)</li>
                  <li>GitHub Repository</li>
                  <li>Monad RPC Node</li>
                </ul>
              </div>

              {/* Cell 4: Ecosystem */}
              <div className="prior-footer-quad-cell">
                <h4 className="font-bold text-[#0a0e2a] text-sm mb-7 sm:mb-8 tracking-tight font-sans">
                  Ecosystem
                </h4>
                <ul className="space-y-2 text-slate-500 font-mono text-xs">
                  <li>Monad Testnet (10143)</li>
                  <li>ERC-8004 Standard</li>
                  <li>Agora AUSD Faucet</li>
                  <li>DevRelay Gateway</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Full-Width Bottom Bar */}
        <div className="prior-footer-full-bar text-xs font-mono text-slate-500">
          <p>© 2026 Nexus Protocol. All rights reserved. Monad Testnet (10143).</p>
        </div>

        {/* Full-Bleed Prior Navy Bottom Strip */}
        <div className="prior-footer-blue-strip">
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
      </footer>

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
    </div>
  );
}

export default App;

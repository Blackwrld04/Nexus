import { Search, ShieldAlert, CheckCircle2, RotateCcw, Award, Network } from 'lucide-react';

export type SwarmStage = 'IDLE' | 'PLANNING' | 'EXECUTING' | 'CRITIQUING_FAIL' | 'REVISING' | 'APPROVED' | 'COMPLETE';

interface SwarmVisualizerProps {
  stage: SwarmStage;
  activeAgent: string;
}

export const SwarmVisualizer = ({ stage, activeAgent }: SwarmVisualizerProps) => {
  const isAgentActive = (name: string) => activeAgent.toLowerCase().includes(name.toLowerCase());

  const steps = [
    { label: '1. Plan & Escrow', active: stage === 'PLANNING', done: stage !== 'IDLE' && stage !== 'PLANNING' },
    { label: '2. Parallel Execution', active: stage === 'EXECUTING', done: ['CRITIQUING_FAIL', 'REVISING', 'APPROVED', 'COMPLETE'].includes(stage) },
    { label: '3. Quality Gate (Reject)', active: stage === 'CRITIQUING_FAIL', done: ['REVISING', 'APPROVED', 'COMPLETE'].includes(stage), alert: stage === 'CRITIQUING_FAIL' },
    { label: '4. Evidence Revision', active: stage === 'REVISING', done: ['APPROVED', 'COMPLETE'].includes(stage) },
    { label: '5. Escrow Release', active: stage === 'APPROVED', done: stage === 'COMPLETE' },
    { label: '6. Reputation Boost', active: stage === 'COMPLETE', done: stage === 'COMPLETE' }
  ];

  return (
    <div className="section-capable p-6 md:p-10 w-full relative flex flex-col gap-6">
      {/* PriorLabs Signature Tactile Grain Texture Overlay */}
      <div className="grain-overlay-blue pointer-events-none" />

      {/* Background Decorative Grid Lines (PriorLabs subtle texture) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-white/20 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Live Swarm Coordination Topology
          </h2>
          <p className="text-xs md:text-sm text-white/85 mt-1 max-w-2xl font-normal leading-relaxed">
            Planner coordinates sub-tasks, specialized workers execute in parallel on Monad, and the Evaluator Gatekeeper enforces mathematical proofs before releasing Monad micro-escrows.
          </p>
        </div>

        {/* Phase Pill (Visible during active swarm execution) */}
        {stage !== 'IDLE' && (
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-white/70 uppercase tracking-wider font-mono">Current Phase</div>
              <div className="text-xs text-white font-semibold">
                {stage === 'CRITIQUING_FAIL' ? 'Critique & Revision' : stage}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-mono font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-lg backdrop-blur-md border whitespace-nowrap shrink-0 ${
              stage === 'PLANNING' ? 'bg-white/25 text-white border-white/50 animate-pulse ring-2 ring-white/30' :
              stage === 'EXECUTING' ? 'bg-cyan-400/25 text-cyan-100 border-cyan-300 animate-pulse ring-2 ring-cyan-400/30' :
              stage === 'CRITIQUING_FAIL' ? 'bg-rose-500/40 text-white border-rose-300 shadow-rose-500/50 animate-bounce ring-2 ring-rose-400' :
              stage === 'REVISING' ? 'bg-amber-400/30 text-amber-100 border-amber-300 animate-pulse ring-2 ring-amber-400/30' :
              'bg-emerald-400/30 text-emerald-100 border-emerald-300 shadow-emerald-500/30'
            }`}>
              {stage === 'CRITIQUING_FAIL' ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Revision Requested</span>
                </>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Verdict Approved</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{stage}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Architecture Flow Banner */}
      <div className="relative z-10 py-2.5 px-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-between text-xs font-mono text-white/90 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white">[CLOSED-LOOP FLOW]:</span>
          <span>1. Planner Decomposes</span>
          <span>➔</span>
          <span>2. Parallel Execution</span>
          <span>➔</span>
          <span className="text-amber-200 font-semibold">3. Evaluator Critique & Revision</span>
          <span>➔</span>
          <span className="text-emerald-200 font-semibold">4. Monad Escrow Settlement</span>
        </div>
      </div>

      {/* 3. Main Coordination Diagram (Original Arranged Stack) */}
      <div className="relative z-10 flex flex-col gap-4">
        
        {/* NODE 01: COORDINATOR / PLANNER NODE */}
        <div className={`capable_card w-full p-4 md:p-5 transition-all duration-300 ${
          isAgentActive('Planner') || stage === 'PLANNING'
            ? 'is-active ring-2 ring-white/60 bg-white/20'
            : ''
        }`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-white/60">NODE 01 /</span>
                <span className="font-bold text-white text-base">Planner Coordinator Agent</span>
              </div>
              <p className="text-xs text-white/85 mt-1 leading-relaxed max-w-3xl">
                Decomposes user missions into dependency DAGs, queries onchain capabilities in <code>NexusIdentityRegistry.sol</code>, and locks <strong>0.05 MON</strong> into <code>NexusEscrowVault.sol</code>.
              </p>
            </div>
          </div>
        </div>

        {/* FLOW CONNECTOR 1: Planner -> Workers */}
        <div className="relative w-full h-14 -my-2 flex items-center justify-center pointer-events-none">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 56" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flowGradPlannerLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowGradPlannerRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Static background track lines */}
            <path d="M 500,0 C 500,28 250,28 250,56" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />
            <path d="M 500,0 C 500,28 750,28 750,56" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />

            {/* Animated Flowing Streams */}
            <path
              d="M 500,0 C 500,28 250,28 250,56"
              stroke="url(#flowGradPlannerLeft)"
              strokeWidth="2.5"
              fill="none"
              className={stage !== 'IDLE' ? "animate-flow-line" : ""}
              strokeDasharray="6 10"
            />
            <path
              d="M 500,0 C 500,28 750,28 750,56"
              stroke="url(#flowGradPlannerRight)"
              strokeWidth="2.5"
              fill="none"
              className={stage !== 'IDLE' ? "animate-flow-line" : ""}
              strokeDasharray="6 10"
            />

            {/* Connection anchor nodes */}
            <circle cx="500" cy="2" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 6px rgba(255,255,255,0.9))" />
            <circle cx="250" cy="54" r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px rgba(56,189,248,0.9))" />
            <circle cx="750" cy="54" r="3.5" fill="#c084fc" filter="drop-shadow(0 0 6px rgba(192,132,252,0.9))" />
          </svg>
        </div>

        {/* NODE 02 & 03: PARALLEL WORKERS LAYER (2-Column Grid) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nansen Alpha Intel */}
          <div className={`capable_card p-4 md:p-5 flex flex-col justify-between transition-all duration-300 ${
            isAgentActive('Nansen')
              ? 'is-active ring-2 ring-cyan-300/80 bg-white/20'
              : ''
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-200 shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Nansen Alpha Intel</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-cyan-200 bg-cyan-950/70 border border-cyan-400/40 whitespace-nowrap shrink-0 shadow-2xs">
                  0.02 MON Bounty
                </span>
              </div>

              <p className="text-xs text-white/85 leading-relaxed">
                Streams live DEX pool liquidity depth, 24h smart money net inflows, and top holder clustering for targeted Monad contract.
              </p>

              <div className="mt-3 space-y-1 text-[11px] font-mono text-white/80">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/60">Net Smart-Money Inflow:</span>
                  <span className="font-semibold text-emerald-300">+420,500 MON</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/60">Top 10 Concentration:</span>
                  <span className="font-semibold text-cyan-200">18.4% (Decentralized)</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-white/60">Onchain Block Citation:</span>
                  <span className="text-white/80">Monad #1845920</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/60">STATUS</span>
              {stage !== 'IDLE' && stage !== 'PLANNING' ? (
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Citations Verified
                </span>
              ) : (
                <span className="text-white/60">Standby (Indexed)</span>
              )}
            </div>
          </div>

          {/* Security & Bytecode Auditor */}
          <div className={`capable_card p-4 md:p-5 flex flex-col justify-between transition-all duration-300 ${
            stage === 'CRITIQUING_FAIL'
              ? 'ring-2 ring-rose-400 bg-rose-950/40 shadow-xl shadow-rose-500/30'
              : stage === 'REVISING'
              ? 'ring-2 ring-amber-400 bg-amber-950/40 shadow-xl shadow-amber-500/30'
              : isAgentActive('Security') || isAgentActive('Auditor')
              ? 'is-active ring-2 ring-purple-300/80 bg-white/20'
              : ''
          }`}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    stage === 'CRITIQUING_FAIL'
                      ? 'bg-rose-500/30 border-rose-300 text-rose-200 animate-pulse'
                      : stage === 'REVISING'
                      ? 'bg-amber-500/30 border-amber-300 text-amber-200'
                      : 'bg-purple-400/20 border-purple-300/40 text-purple-200'
                  }`}>
                    {stage === 'CRITIQUING_FAIL' || stage === 'REVISING' ? (
                      <RotateCcw className="w-4 h-4 animate-spin text-rose-300" />
                    ) : (
                      <ShieldAlert className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">Security Auditor</span>
                      {(stage === 'CRITIQUING_FAIL' || stage === 'REVISING') && (
                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap shrink-0 border shadow-2xs ${
                          stage === 'CRITIQUING_FAIL'
                            ? 'bg-rose-500/40 border-rose-300 text-rose-100'
                            : 'bg-amber-500/40 border-amber-300 text-amber-100'
                        }`}>
                          REVISING
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-purple-200 bg-purple-950/70 border border-purple-400/40 whitespace-nowrap shrink-0 shadow-2xs">
                  0.03 MON Bounty
                </span>
              </div>

              <p className="text-xs text-white/85 leading-relaxed">
                Disassembles raw EVM opcodes on Monad. ReentrancyGuard verified. Dynamically recalculates price tick bounds upon critique revision.
              </p>

              <div className="mt-3 space-y-1 text-[11px] font-mono text-white/80">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/60">Reentrancy Storage:</span>
                  <span className="font-semibold text-emerald-300">Slot 0 (PASS)</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/60">Monad Parallel Storage:</span>
                  <span className="font-semibold text-cyan-200">Validated</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-white/60">Tick-Depth Proof:</span>
                  <span className={`${stage === 'CRITIQUING_FAIL' ? 'text-rose-300 font-bold' : 'text-white/80'}`}>
                    {stage === 'CRITIQUING_FAIL' ? 'UNVERIFIED (Critiqued)' : 'Monad #1845926'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono">
              <span className="text-white/60">AUDIT WORKFLOW</span>
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-rose-200 font-bold flex items-center gap-1 bg-rose-500/30 px-2 py-0.5 rounded border border-rose-400">
                  <RotateCcw className="w-3 h-3 animate-spin" /> Revision Required
                </span>
              ) : stage === 'REVISING' ? (
                <span className="text-amber-200 font-semibold flex items-center gap-1 animate-pulse">
                  <RotateCcw className="w-3 h-3 animate-spin" /> Re-computing Ticks...
                </span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Re-audit Approved
                </span>
              ) : (
                <span className="text-white/60">Standby (Indexed)</span>
              )}
            </div>
          </div>

        </div>

        {/* FLOW CONNECTOR 2: Workers -> Evaluator */}
        <div className="relative w-full h-14 -my-2 flex items-center justify-center pointer-events-none">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 56" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flowGradWorkerLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="flowGradWorkerRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={stage === 'CRITIQUING_FAIL' ? "#f43f5e" : "#c084fc"} stopOpacity="0.9" />
                <stop offset="100%" stopColor={stage === 'CRITIQUING_FAIL' ? "#fb7185" : "#ffffff"} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Static background track lines */}
            <path d="M 250,0 C 250,28 500,28 500,56" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />
            <path d="M 750,0 C 750,28 500,28 500,56" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />

            {/* Animated Flowing Streams */}
            <path
              d="M 250,0 C 250,28 500,28 500,56"
              stroke="url(#flowGradWorkerLeft)"
              strokeWidth="2.5"
              fill="none"
              className={stage === 'EXECUTING' || stage === 'APPROVED' || stage === 'COMPLETE' ? "animate-flow-line" : ""}
              strokeDasharray="6 10"
            />

            {/* Right worker flow: In critique fail, flows in REVERSE (Evaluator rejects back to Auditor) */}
            <path
              d="M 750,0 C 750,28 500,28 500,56"
              stroke={
                stage === 'CRITIQUING_FAIL'
                  ? "#f43f5e"
                  : stage === 'REVISING'
                  ? "#fbbf24"
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? "#34d399"
                  : "url(#flowGradWorkerRight)"
              }
              strokeWidth={stage === 'CRITIQUING_FAIL' ? "3.5" : "2.5"}
              fill="none"
              className={
                stage === 'CRITIQUING_FAIL'
                  ? "animate-flow-reverse"
                  : stage !== 'IDLE'
                  ? "animate-flow-line"
                  : ""
              }
              strokeDasharray="6 10"
              filter={stage === 'CRITIQUING_FAIL' ? "drop-shadow(0 0 8px rgba(244,63,94,0.8))" : undefined}
            />

            {/* Connection anchor nodes */}
            <circle cx="250" cy="2" r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px rgba(56,189,248,0.9))" />
            <circle
              cx="750"
              cy="2"
              r="3.5"
              fill={stage === 'CRITIQUING_FAIL' ? "#f43f5e" : "#c084fc"}
              filter="drop-shadow(0 0 6px rgba(255,255,255,0.9))"
            />
            <circle
              cx="500"
              cy="54"
              r="3.5"
              fill={
                stage === 'CRITIQUING_FAIL'
                  ? "#f43f5e"
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? "#34d399"
                  : "#ffffff"
              }
              filter="drop-shadow(0 0 6px rgba(255,255,255,0.9))"
            />
          </svg>

          {/* Central Pill Badge (Dynamic state feedback during execution) */}
          {stage !== 'IDLE' && (
            <div className={`relative z-10 px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-2 pointer-events-auto transition-all whitespace-nowrap shrink-0 ${
              stage === 'CRITIQUING_FAIL'
                ? 'bg-rose-900/90 border-rose-400 text-rose-100 ring-2 ring-rose-500/50 animate-bounce'
                : stage === 'REVISING'
                ? 'bg-amber-900/90 border-amber-400 text-amber-100 ring-2 ring-amber-500/50 animate-pulse'
                : stage === 'APPROVED' || stage === 'COMPLETE'
                ? 'bg-emerald-900/90 border-emerald-400 text-emerald-100'
                : 'bg-[#061cf4]/90 border-white/30 text-white'
            }`}>
              {stage === 'CRITIQUING_FAIL' ? (
                <>
                  <RotateCcw className="w-3 h-3 animate-spin text-rose-300" />
                  <span>REVISION DIRECTIVE: MISSING PROOFS ↻</span>
                </>
              ) : stage === 'REVISING' ? (
                <>
                  <RotateCcw className="w-3 h-3 animate-spin text-amber-300" />
                  <span>RE-VERIFYING TICK DEPTH SLIPPAGE...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>CRYPTOGRAPHIC CONSENSUS VERIFIED ↓</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* NODE 04: EVALUATOR / CRITIC GATEKEEPER */}
        <div className={`capable_card w-full p-4 md:p-5 transition-all duration-300 ${
          stage === 'CRITIQUING_FAIL'
            ? 'ring-2 ring-rose-400 bg-rose-950/40 shadow-xl shadow-rose-500/40'
            : stage === 'APPROVED' || stage === 'COMPLETE'
            ? 'ring-2 ring-emerald-400 bg-emerald-950/30 shadow-xl shadow-emerald-500/20'
            : isAgentActive('Evaluator')
            ? 'is-active ring-2 ring-white/60 bg-white/20'
            : ''
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                stage === 'CRITIQUING_FAIL'
                  ? 'bg-rose-500/30 border-rose-300 text-rose-200'
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? 'bg-emerald-400/25 border-emerald-300 text-emerald-200'
                  : 'bg-white/15 border-white/30 text-white'
              }`}>
                {stage === 'CRITIQUING_FAIL' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-300 animate-pulse" />
                ) : (
                  <Award className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-white/60">NODE 04 /</span>
                  <span className="font-bold text-white text-base">Evaluator & Critic Gatekeeper</span>
                </div>
                <p className="text-xs text-white/85 mt-1 leading-relaxed max-w-3xl">
                  Enforces verifiable evidence proof standards. Rejects unsubstantiated claims via <code>requestRevision()</code> on Monad Escrow Vault. Approves release only upon complete cryptographic consensus.
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-white/90 flex-wrap">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/15 border border-white/25 whitespace-nowrap shrink-0">Approval Threshold: 90/100</span>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/15 border border-white/25 whitespace-nowrap shrink-0">Vault Callback: requestRevision() / approveAndRelease()</span>
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-400/25 text-emerald-100 border border-emerald-400/40 font-bold whitespace-nowrap shrink-0">Reputation Impact: +3 Rep</span>
                </div>
              </div>
            </div>

            {/* Live Verdict Pill */}
            {(stage === 'CRITIQUING_FAIL' || stage === 'APPROVED' || stage === 'COMPLETE') && (
              <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                {stage === 'CRITIQUING_FAIL' ? (
                  <span className="text-xs font-mono font-bold text-white bg-rose-600/90 px-4 py-2 rounded-xl border border-rose-300 flex items-center gap-2 shadow-lg shadow-rose-600/40 animate-pulse whitespace-nowrap shrink-0">
                    <RotateCcw className="w-4 h-4 animate-spin shrink-0" />
                    <span>REVISION REQUIRED (SCORE: FAIL)</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-100 bg-emerald-600/90 px-4 py-2 rounded-xl border border-emerald-300 flex items-center gap-2 shadow-lg shadow-emerald-600/30 whitespace-nowrap shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>VERIFIED & RELEASED (SCORE: 98/100)</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Closed-Loop Workflow Stepper */}
      <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
        {steps.map((st, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap shrink-0 flex items-center gap-2 text-xs font-mono font-semibold ${
              st.alert
                ? 'bg-rose-500/40 border-rose-300 text-white font-bold animate-pulse'
                : st.active
                ? 'bg-white/25 border-white text-white font-bold ring-2 ring-white/30'
                : st.done
                ? 'bg-emerald-500/25 border-emerald-300 text-emerald-100'
                : 'bg-white/5 border-white/15 text-white/60'
            }`}
          >
            {st.done && !st.alert && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
            {st.alert && <RotateCcw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />}
            <span>{st.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

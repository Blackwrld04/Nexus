import { Network, Search, ShieldAlert, CheckCircle2, RotateCcw, Award, Code2, Zap } from 'lucide-react';

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
    { label: '6. Reputation Mint', active: stage === 'COMPLETE', done: stage === 'COMPLETE' }
  ];

  return (
    <div className="editorial-card p-5 sm:p-6 w-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Topology Header Bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge-jp">
              <span className="jp">協調トポロジー</span>
              <span>// CLOSED-LOOP MULTI-AGENT STATE MACHINE</span>
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-[var(--ink)] font-normal tracking-tight">
            Live Swarm Coordination Topology
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-wider font-mono hidden sm:inline">Execution State:</span>
          <span className={`px-2.5 py-1 rounded-[var(--radius)] font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
            stage === 'IDLE' ? 'bg-[var(--paper-soft)] text-[var(--ink-muted)] border border-[var(--line)]' :
            stage === 'PLANNING' ? 'bg-[var(--monad-soft)] text-[var(--monad)] border border-[var(--monad)]/30 animate-pulse' :
            stage === 'EXECUTING' ? 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse' :
            stage === 'CRITIQUING_FAIL' ? 'bg-red-50 text-red-700 border border-red-400 font-bold' :
            stage === 'REVISING' ? 'bg-amber-100 text-amber-900 border border-amber-400 animate-pulse' :
            'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30'
          }`}>
            {stage === 'CRITIQUING_FAIL' ? (
              <>
                <RotateCcw className="w-3 h-3 animate-spin" />
                <span>Revision Loop Triggered</span>
              </>
            ) : stage === 'IDLE' ? (
              <>
                <span className="pulse-dot" />
                <span>Standby · Ready</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                <span>{stage}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <div className="py-2 px-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--ink)]">[CLOSED-LOOP FLOW]:</span>
          <span>1. Planner Decomposes</span>
          <span>➔</span>
          <span>2. Parallel Execution</span>
          <span>➔</span>
          <span className="text-red-700 font-medium">3. Critic Critique & Revision</span>
          <span>➔</span>
          <span className="text-[var(--success)] font-medium">4. AUSD Escrow Settlement</span>
        </div>
        <div className="text-[var(--ink-faint)]">
          Target: <strong>0xa1B2...9B0</strong> • Monad Chain ID <strong>10143</strong>
        </div>
      </div>

      {/* Main Coordination Diagram */}
      <div className="flex-1 flex flex-col justify-between py-2 sm:py-2.5 gap-2">
        
        {/* 1. COORDINATOR / PLANNER NODE */}
        <div className={`w-full p-3 sm:p-3.5 rounded-[var(--radius)] border transition-all duration-200 ${
          isAgentActive('Planner')
            ? 'bg-[var(--paper-soft)] border-[var(--monad)] shadow-xs ring-1 ring-[var(--monad)]/30'
            : 'bg-[var(--paper-raised)] border-[var(--line)]'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] flex-shrink-0 mt-0.5">
                <Network className="w-4 h-4 text-[var(--monad)]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">NODE 01 /</span>
                  <span className="font-sans font-bold text-sm text-[var(--ink)]">Planner Coordinator Agent</span>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)] border border-[var(--line)] px-1.5 py-0.2 rounded-[var(--radius)] bg-[var(--paper-soft)]">
                    計画・調整
                  </span>
                  <span className="text-[9px] font-mono text-[var(--monad)] bg-[var(--monad-soft)] px-1.5 py-0.2 rounded-[var(--radius)] border border-[var(--monad)]/20 font-medium">
                    ERC-8004 NFT #0
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed max-w-3xl">
                  Decomposes user missions into dependency DAGs, queries onchain capabilities in <code>NexusIdentityRegistry.sol</code>, and locks <strong>25.00 AUSD</strong> in <code>NexusEscrowVault.sol</code>.
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[var(--ink-faint)] flex-wrap">
                  <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Capabilities: 0x03 (DELEGATE | ESCROW)</span>
                  <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Dispatched Tasks: 2 Parallel</span>
                  <span className="text-[var(--agora)] font-medium">Locked Escrow: 25.00 AUSD</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-right font-mono text-xs">
              <span className="text-[10px] text-[var(--ink-faint)] uppercase block">Role</span>
              <span className="font-bold text-[var(--monad)]">ORCHESTRATOR</span>
            </div>
          </div>
        </div>

        {/* Dispatch Bus Connector */}
        <div className="flex items-center justify-center gap-3 my-[-2px]">
          <div className="h-2.5 w-[1px] bg-[var(--line-strong)]" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--ink-faint)] bg-[var(--paper-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--line)]">
            Parallel Monad Task Delegation (Sub-Tasks 01 & 02) ↓
          </span>
          <div className="h-2.5 w-[1px] bg-[var(--line-strong)]" />
        </div>

        {/* 2. PARALLEL WORKERS LAYER (2-Column Grid) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Worker #1: Nansen Alpha */}
          <div className={`p-3 sm:p-3.5 rounded-[var(--radius)] border transition-all duration-200 flex flex-col justify-between gap-2 ${
            isAgentActive('Nansen')
              ? 'bg-amber-50/70 border-[var(--agora)] shadow-xs ring-1 ring-[var(--agora)]/30'
              : 'bg-[var(--paper-raised)] border-[var(--line)]'
          }`}>
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
                    <Search className="w-3.5 h-3.5 text-[var(--agora)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[var(--ink-muted)]">NODE 02 /</span>
                      <h3 className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">Nansen Alpha Intel</h3>
                    </div>
                    <span className="font-jp text-[9px] text-[var(--ink-muted)]">情報・分析 (ERC-8004 #1)</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[var(--agora)] bg-[var(--agora-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--agora)]/20 font-semibold">
                  10 AUSD Bounty
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Aggregates smart money clustering and net inflow acceleration (+$420,500 AUSD) with cryptographic Monad testnet block citations.
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[var(--ink-faint)] flex-wrap">
                <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Top 10 Clustering: 18.4%</span>
                <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Citation: Monad #1845920</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--ink-faint)]">EVIDENCE STATUS</span>
              {stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[var(--success)] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> 3 Citations Verified
                </span>
              ) : isAgentActive('Nansen') ? (
                <span className="text-amber-800 animate-pulse font-medium">Querying RPC...</span>
              ) : (
                <span className="text-[var(--ink-faint)]">Standby (Indexed)</span>
              )}
            </div>
          </div>

          {/* Worker #2: Bytecode Auditor */}
          <div className={`p-3 sm:p-3.5 rounded-[var(--radius)] border transition-all duration-200 flex flex-col justify-between gap-2 ${
            stage === 'CRITIQUING_FAIL' || stage === 'REVISING'
              ? 'bg-red-50/60 border-red-300 shadow-xs ring-1 ring-red-300/40'
              : isAgentActive('Security') || isAgentActive('Auditor')
              ? 'bg-[var(--paper-soft)] border-[var(--monad)] shadow-xs ring-1 ring-[var(--monad)]/30'
              : 'bg-[var(--paper-raised)] border-[var(--line)]'
          }`}>
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
                    <Code2 className="w-3.5 h-3.5 text-[var(--monad)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[var(--ink-muted)]">NODE 03 /</span>
                      <h3 className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">Security Bytecode Auditor</h3>
                    </div>
                    <span className="font-jp text-[9px] text-[var(--ink-muted)]">監査・検証 (ERC-8004 #2)</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[var(--monad)] bg-[var(--monad-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--monad)]/20 font-semibold">
                  15 AUSD Bounty
                </span>
              </div>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Disassembles raw EVM opcodes on Monad. ReentrancyGuard verified. Dynamically recalculates price tick bounds upon critique revision.
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[var(--ink-faint)] flex-wrap">
                <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Reentrancy: Slot 0 (PASS)</span>
                <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Tick Proof: Monad #1845926</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--ink-faint)]">AUDIT WORKFLOW</span>
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-red-700 font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 animate-spin" /> Revision Required
                </span>
              ) : stage === 'REVISING' ? (
                <span className="text-amber-800 animate-pulse font-medium">Re-computing Ticks...</span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[var(--success)] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Re-audit Approved
                </span>
              ) : (
                <span className="text-[var(--ink-faint)]">Standby (Indexed)</span>
              )}
            </div>
          </div>

        </div>

        {/* Quality Gate Bus Connector */}
        <div className="flex items-center justify-center gap-3 my-[-2px]">
          <div className="h-2.5 w-[1px] bg-[var(--line-strong)]" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--ink-faint)] bg-[var(--paper-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--line)]">
            Evidence Submission & Closed-Loop Quality Verification ↓
          </span>
          <div className="h-2.5 w-[1px] bg-[var(--line-strong)]" />
        </div>

        {/* 3. EVALUATOR / CRITIC GATEKEEPER */}
        <div className={`w-full p-3 sm:p-3.5 rounded-[var(--radius)] border transition-all duration-200 ${
          stage === 'CRITIQUING_FAIL'
            ? 'bg-red-50/70 border-red-400 ring-1 ring-red-400/40'
            : stage === 'APPROVED' || stage === 'COMPLETE'
            ? 'bg-[var(--success-soft)]/50 border-[var(--success)]/40 ring-1 ring-[var(--success)]/30'
            : isAgentActive('Evaluator')
            ? 'bg-[var(--paper-soft)] border-[var(--monad)]'
            : 'bg-[var(--paper-raised)] border-[var(--line)]'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-[var(--radius)] flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                stage === 'CRITIQUING_FAIL'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? 'bg-emerald-100 border-emerald-300 text-[var(--success)]'
                  : 'bg-[var(--paper-soft)] border-[var(--line)] text-[var(--ink)]'
              }`}>
                {stage === 'CRITIQUING_FAIL' ? <ShieldAlert className="w-4 h-4 animate-pulse" /> : <Award className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">NODE 04 /</span>
                  <span className="font-sans font-bold text-sm text-[var(--ink)]">Evaluator & Critic Gatekeeper</span>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)] border border-[var(--line)] px-1.5 py-0.2 rounded-[var(--radius)] bg-[var(--paper-soft)]">
                    品質・評価
                  </span>
                  <span className="text-[9px] font-mono text-red-700 bg-red-100 px-1.5 py-0.2 rounded-[var(--radius)] border border-red-200 font-medium">
                    Strict Quality Gate (ERC-8004 #3)
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed max-w-3xl">
                  Enforces verifiable evidence proof standards. Rejects unsubstantiated claims via <code>requestRevision()</code> on Monad Escrow Vault. Approves release only upon complete cryptographic consensus.
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[var(--ink-faint)] flex-wrap">
                  <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Approval Threshold: 90/100</span>
                  <span className="bg-[var(--paper-soft)] px-1.5 py-0.2 rounded border border-[var(--line)]">Vault Callback: requestRevision() / approveAndRelease()</span>
                  <span className="text-[var(--success)] font-medium">Reputation Impact: +3 Rep</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-[var(--radius)] border border-red-300 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 animate-spin" />
                  REVISION REQUIRED
                </span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[10px] font-mono font-bold text-[var(--success)] bg-[var(--success-soft)] px-2.5 py-1 rounded-[var(--radius)] border border-[var(--success)]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED & RELEASED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[var(--ink-muted)] bg-[var(--paper-soft)] px-2.5 py-1 rounded-[var(--radius)] border border-[var(--line)]">
                  GATE ACTIVE (STANDBY)
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Closed-Loop Workflow Stepper */}
      <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between gap-1 overflow-x-auto text-[10px] font-mono">
        {steps.map((st, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded-[var(--radius)] border transition-all whitespace-nowrap flex items-center gap-1 ${
              st.alert
                ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                : st.active
                ? 'bg-[var(--monad-soft)] border-[var(--monad)] text-[var(--monad)] font-semibold'
                : st.done
                ? 'bg-[var(--paper-soft)] border-[var(--line)] text-[var(--success)]'
                : 'bg-transparent border-transparent text-[var(--ink-faint)]'
            }`}
          >
            {st.done && !st.alert && <CheckCircle2 className="w-3 h-3" />}
            {st.alert && <RotateCcw className="w-3 h-3 animate-spin" />}
            <span>{st.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { Network, Search, ShieldAlert, CheckCircle2, RotateCcw, Award, Code2 } from 'lucide-react';

export type SwarmStage = 'IDLE' | 'PLANNING' | 'EXECUTING' | 'CRITIQUING_FAIL' | 'REVISING' | 'APPROVED' | 'COMPLETE';

interface SwarmVisualizerProps {
  stage: SwarmStage;
  activeAgent: string;
}

export const SwarmVisualizer = ({ stage, activeAgent }: SwarmVisualizerProps) => {
  const isAgentActive = (name: string) => activeAgent.toLowerCase().includes(name.toLowerCase());

  return (
    <div className="editorial-card p-6 sm:p-8 w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-jp">
              <span className="jp">協調トポロジー</span>
              <span>// MULTI-AGENT SWARM ARCHITECTURE</span>
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--ink)] font-normal tracking-tight">
            Live Swarm Coordination Topology
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--ink-muted)] text-[11px] uppercase tracking-wider font-mono">Status:</span>
          <span className={`px-2.5 py-1 rounded-[var(--radius)] font-mono text-[11px] font-semibold uppercase tracking-wider ${
            stage === 'IDLE' ? 'bg-[var(--paper-soft)] text-[var(--ink-muted)] border border-[var(--line)]' :
            stage === 'PLANNING' ? 'bg-[var(--monad-soft)] text-[var(--monad)] border border-[var(--monad)]/30 animate-pulse' :
            stage === 'EXECUTING' ? 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse' :
            stage === 'CRITIQUING_FAIL' ? 'bg-red-50 text-red-700 border border-red-400 font-bold' :
            stage === 'REVISING' ? 'bg-amber-100 text-amber-900 border border-amber-400 animate-pulse' :
            'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30'
          }`}>
            {stage === 'CRITIQUING_FAIL' ? '⚠️ Revision Required' : stage}
          </span>
        </div>
      </div>

      {/* Swarm Graph Container (Full 100% Width Spanning) */}
      <div className="flex flex-col items-center gap-4 w-full">

        {/* 1. COORDINATOR / PLANNER NODE */}
        <div className={`w-full p-5 rounded-[var(--radius)] border transition-all duration-200 ${
          isAgentActive('Planner')
            ? 'bg-[var(--paper-soft)] border-[var(--monad)] shadow-sm'
            : 'bg-[var(--paper-raised)] border-[var(--line)]'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] flex-shrink-0 mt-0.5">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-[var(--ink-muted)]">01 /</span>
                  <span className="font-sans font-bold text-sm text-[var(--ink)]">Planner Coordinator Agent</span>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)] border border-[var(--line)] px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)]">
                    計画・調整
                  </span>
                  <span className="text-[10px] font-mono text-[var(--monad)] bg-[var(--monad-soft)] px-1.5 py-0.5 rounded-[var(--radius)] border border-[var(--monad)]/20">
                    ERC-8004 Orchestrator
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
                  Decomposes mission into DAG, locks Agora AUSD micro-escrow, queries onchain registry
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="text-[10px] font-mono text-[var(--ink-faint)] uppercase block">Role</span>
              <span className="text-xs font-mono font-medium text-[var(--ink)]">DAG Dispatcher</span>
            </div>
          </div>
        </div>

        {/* Thin Hairline Connector */}
        <div className="w-[1px] h-6 bg-[var(--line-strong)]" />

        {/* 2. PARALLEL WORKERS LAYER (100% Width 2-Column Grid) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Worker #1: Nansen Alpha */}
          <div className={`p-5 rounded-[var(--radius)] border transition-all duration-200 ${
            isAgentActive('Nansen')
              ? 'bg-amber-50/50 border-[var(--agora)] shadow-sm'
              : 'bg-[var(--paper-raised)] border-[var(--line)]'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[var(--ink-muted)]">02 /</span>
                    <h3 className="font-sans font-bold text-sm text-[var(--ink)]">Nansen Alpha Intel</h3>
                  </div>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)]">情報・分析</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--agora)] bg-[var(--agora-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--agora)]/20 font-semibold">
                10 AUSD Bounty
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Monitors smart money clustering, whale net inflow acceleration, and liquidity depth on Monad.
            </p>
            <div className="mt-4 pt-3 border-t border-[var(--line-soft)] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--ink-faint)]">EVIDENCE STATUS</span>
              {stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[var(--success)] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Citations Verified
                </span>
              ) : isAgentActive('Nansen') ? (
                <span className="text-amber-800 animate-pulse font-medium">Querying RPC...</span>
              ) : (
                <span className="text-[var(--ink-faint)]">Standby</span>
              )}
            </div>
          </div>

          {/* Worker #2: Bytecode Auditor */}
          <div className={`p-5 rounded-[var(--radius)] border transition-all duration-200 ${
            stage === 'CRITIQUING_FAIL' || stage === 'REVISING'
              ? 'bg-red-50/40 border-red-300 shadow-sm'
              : isAgentActive('Security') || isAgentActive('Auditor')
              ? 'bg-[var(--paper-soft)] border-[var(--monad)] shadow-sm'
              : 'bg-[var(--paper-raised)] border-[var(--line)]'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[var(--ink-muted)]">03 /</span>
                    <h3 className="font-sans font-bold text-sm text-[var(--ink)]">Security Bytecode Auditor</h3>
                  </div>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)]">監査・検証</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[var(--monad)] bg-[var(--monad-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--monad)]/20 font-semibold">
                15 AUSD Bounty
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Disassembles EVM opcodes, validates reentrancy guards, and verifies dynamic price tick math.
            </p>
            <div className="mt-4 pt-3 border-t border-[var(--line-soft)] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--ink-faint)]">AUDIT STAGE</span>
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-red-700 font-bold flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Revision Loop
                </span>
              ) : stage === 'REVISING' ? (
                <span className="text-amber-800 animate-pulse font-medium">Re-computing Ticks...</span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[var(--success)] flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Re-audit Passed
                </span>
              ) : (
                <span className="text-[var(--ink-faint)]">Standby</span>
              )}
            </div>
          </div>

        </div>

        {/* Thin Hairline Connector */}
        <div className="w-[1px] h-6 bg-[var(--line-strong)]" />

        {/* 3. EVALUATOR / CRITIC GATEKEEPER */}
        <div className={`w-full p-5 rounded-[var(--radius)] border transition-all duration-200 ${
          stage === 'CRITIQUING_FAIL'
            ? 'bg-red-50/60 border-red-400'
            : stage === 'APPROVED' || stage === 'COMPLETE'
            ? 'bg-[var(--success-soft)]/50 border-[var(--success)]/40'
            : isAgentActive('Evaluator')
            ? 'bg-[var(--paper-soft)] border-[var(--monad)]'
            : 'bg-[var(--paper-raised)] border-[var(--line)]'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-[var(--radius)] flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                stage === 'CRITIQUING_FAIL'
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? 'bg-emerald-100 border-emerald-300 text-[var(--success)]'
                  : 'bg-[var(--paper-soft)] border-[var(--line)] text-[var(--ink)]'
              }`}>
                {stage === 'CRITIQUING_FAIL' ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <Award className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-[var(--ink-muted)]">04 /</span>
                  <span className="font-sans font-bold text-sm text-[var(--ink)]">Evaluator & Critic Gatekeeper</span>
                  <span className="font-jp text-[10px] text-[var(--ink-muted)] border border-[var(--line)] px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)]">
                    品質・評価
                  </span>
                  <span className="text-[10px] font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded-[var(--radius)] border border-red-200 font-medium">
                    Quality Gate
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-2xl">
                  Enforces evidence proof standards, challenges weak claims, gates Agora AUSD escrow release
                </p>
              </div>
            </div>

            {/* Verdict Pill */}
            <div className="flex-shrink-0">
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-[var(--radius)] border border-red-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  REVISION REQUIRED
                </span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-[11px] font-mono font-bold text-[var(--success)] bg-[var(--success-soft)] px-3 py-1.5 rounded-[var(--radius)] border border-[var(--success)]/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED & RELEASED
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[var(--ink-muted)] bg-[var(--paper-soft)] px-2.5 py-1.5 rounded-[var(--radius)] border border-[var(--line)]">
                  GATE ACTIVE
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

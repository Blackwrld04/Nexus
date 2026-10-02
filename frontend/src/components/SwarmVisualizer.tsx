import { Network, Search, ShieldAlert, CheckCircle2, RotateCcw, Award } from 'lucide-react';

export type SwarmStage = 'IDLE' | 'PLANNING' | 'EXECUTING' | 'CRITIQUING_FAIL' | 'REVISING' | 'APPROVED' | 'COMPLETE';

interface SwarmVisualizerProps {
  stage: SwarmStage;
  activeAgent: string;
}

export const SwarmVisualizer = ({ stage, activeAgent }: SwarmVisualizerProps) => {
  const isAgentActive = (name: string) => activeAgent.toLowerCase().includes(name.toLowerCase());

  return (
    <div className="glass-panel p-6 w-full relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133d15_1px,transparent_1px),linear-gradient(to_bottom,#1f133d15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-base text-white tracking-wide">Live Swarm Coordination Topology</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Phase:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-semibold mono uppercase ${
            stage === 'IDLE' ? 'bg-slate-800 text-slate-400' :
            stage === 'PLANNING' ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40 animate-pulse' :
            stage === 'EXECUTING' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 animate-pulse' :
            stage === 'CRITIQUING_FAIL' ? 'bg-pink-950/80 text-pink-300 border border-pink-500/60 animate-bounce' :
            stage === 'REVISING' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse' :
            'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
          }`}>
            {stage === 'CRITIQUING_FAIL' ? '⚠️ Revision Requested' : stage}
          </span>
        </div>
      </div>

      {/* Swarm Graph Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 py-4">

        {/* 1. COORDINATOR / PLANNER NODE */}
        <div className={`relative px-6 py-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 shadow-xl ${
          isAgentActive('Planner')
            ? 'bg-purple-900/40 border-purple-400 shadow-purple-500/30 scale-105'
            : 'bg-[#120b24]/80 border-purple-500/20'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Planner Coordinator Agent</span>
              <span className="text-[10px] text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/20">ERC-8004 Orchestrator</span>
            </div>
            <p className="text-xs text-slate-400">Decomposes goal, locks AUSD escrow, queries registry</p>
          </div>
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500 to-cyan-400" />

        {/* 2. SPECIALIST WORKERS (PARALLEL MONAD EXECUTION LAYER) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          
          {/* Worker A: Nansen Alpha */}
          <div className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
            isAgentActive('Nansen')
              ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-102'
              : 'bg-[#0f0b1c]/80 border-purple-500/20'
          }`}>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Nansen Alpha Intel</span>
                <span className="text-[10px] text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  Worker #1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Smart money net flows & holder clustering</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Onchain Citations Verified</span>
              </div>
            </div>
          </div>

          {/* Worker B: Security Auditor */}
          <div className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
            stage === 'CRITIQUING_FAIL'
              ? 'bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-500/30 ring-2 ring-pink-500/40 scale-102'
              : isAgentActive('Security') || isAgentActive('Auditor')
              ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/20 scale-102'
              : 'bg-[#0f0b1c]/80 border-purple-500/20'
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              stage === 'CRITIQUING_FAIL'
                ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                : 'bg-purple-500/20 border-purple-400 text-purple-300'
            }`}>
              {stage === 'CRITIQUING_FAIL' ? <RotateCcw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Security & Bytecode Auditor</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  stage === 'CRITIQUING_FAIL'
                    ? 'bg-pink-900/60 text-pink-300 border-pink-600'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  {stage === 'CRITIQUING_FAIL' ? 'REVISING' : 'Worker #2'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Disassembles opcodes & verifies tick depth</p>
              {stage === 'CRITIQUING_FAIL' && (
                <div className="mt-2 text-[11px] text-pink-300 font-semibold flex items-center gap-1.5 bg-pink-950/60 p-1.5 rounded border border-pink-500/30">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Iterating with tick-depth parameters...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connector Line to Evaluator */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-pink-500" />

        {/* 3. EVALUATOR / CRITIC GATEKEEPER */}
        <div className={`max-w-xl w-full p-4 rounded-2xl border transition-all duration-300 ${
          stage === 'CRITIQUING_FAIL'
            ? 'bg-gradient-to-r from-pink-950/60 to-purple-950/60 border-pink-500 shadow-xl shadow-pink-500/30 scale-105'
            : stage === 'APPROVED' || stage === 'COMPLETE'
            ? 'bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border-emerald-400 shadow-xl shadow-emerald-500/20'
            : isAgentActive('Evaluator')
            ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-500/30'
            : 'bg-[#120b24]/80 border-purple-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                stage === 'CRITIQUING_FAIL'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                  : stage === 'APPROVED' || stage === 'COMPLETE'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
              }`}>
                {stage === 'CRITIQUING_FAIL' ? <ShieldAlert className="w-5 h-5 text-pink-400 animate-pulse" /> : <Award className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Evaluator & Critic Gatekeeper</span>
                  <span className="text-[10px] text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/30">
                    Quality Gate
                  </span>
                </div>
                <p className="text-xs text-slate-400">Enforces evidence proof standards, challenges weak claims, gates AUSD escrow</p>
              </div>
            </div>
            
            {/* Live Verdict Pill */}
            <div>
              {stage === 'CRITIQUING_FAIL' ? (
                <span className="text-xs font-bold text-pink-300 bg-pink-900/60 px-3 py-1.5 rounded-lg border border-pink-500 flex items-center gap-1.5 shadow-md shadow-pink-500/30">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  REVISION REQUIRED
                </span>
              ) : stage === 'APPROVED' || stage === 'COMPLETE' ? (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  APPROVED & RELEASED
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md mono">
                  STANDBY
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

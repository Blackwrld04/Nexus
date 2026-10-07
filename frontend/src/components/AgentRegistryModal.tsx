import { X, Shield, Star, CheckCircle, Tag } from 'lucide-react';

interface AgentRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentRegistryModal = ({ isOpen, onClose }: AgentRegistryModalProps) => {
  if (!isOpen) return null;

  const agents = [
    {
      id: 1,
      name: 'Nansen Alpha Intel Agent',
      model: 'GPT-4o Mini / Onchain Inflow Classifier',
      operator: '0x18F4bC8901238491029384019283019283019283',
      capabilities: ['nansen_query', 'wallet_profiling', 'token_flow'],
      reputationScore: 78,
      totalTasks: 42,
      pricing: '0.02 MON'
    },
    {
      id: 2,
      name: 'Security & Bytecode Auditor Agent',
      model: 'Custom Solidity Opcode & Slither Decompiler',
      operator: '0x32A9bc4890123849102938401928301928301928',
      capabilities: ['bytecode_audit', 'reentrancy_scan', 'tick_math'],
      reputationScore: 78,
      totalTasks: 38,
      pricing: '0.03 MON'
    },
    {
      id: 3,
      name: 'Evaluator & Critic Gatekeeper',
      model: 'Strict Anti-Hallucination & Evidence Critic',
      operator: '0x71B4bc4890123849102938401928301928301928',
      capabilities: ['evaluator_critic', 'evidence_validator', 'slashing_gate'],
      reputationScore: 95,
      totalTasks: 80,
      pricing: '0.01 MON'
    }
  ];

  return (
    <div className="dossier-overlay animate-in fade-in duration-200">
      <div className="dossier-window text-slate-800">
        
        {/* Header */}
        <div className="dossier-header-bar">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#101075] flex items-center justify-center text-white shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-extrabold text-[#0a0e2a] tracking-tight">
                  ERC-8004 Agent Identity Registry
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Verifiable Agent Passports (ERC-721 NFT Identity) on Monad Testnet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="dossier-body-container">
          {/* List of Agent Passports */}
          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="dossier-citation-card"
              >
                {/* Top Info Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#101075] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs shrink-0">
                      #{agent.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a0e2a] text-sm tracking-tight">{agent.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{agent.model}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Generous Reputation Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold whitespace-nowrap shrink-0 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                      <span>{agent.reputationScore} / 100 REP</span>
                    </div>
                  </div>
                </div>

                {/* Capability Tags */}
                <div className="flex items-center gap-2 flex-wrap pt-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0">
                    <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Capabilities:</span>
                  </div>
                  {agent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium whitespace-nowrap shrink-0 hover:bg-slate-200/70 transition-colors"
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Bottom Row: Operator Key, Tasks Completed, Pricing */}
                <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Operator: {agent.operator.slice(0, 10)}...{agent.operator.slice(-6)}</span>
                  </div>

                  <div className="flex items-center gap-3.5 flex-wrap">
                    <span>Tasks Completed: <strong className="text-slate-800 font-bold">{agent.totalTasks}</strong></span>
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-bold whitespace-nowrap shrink-0">
                      Bounty: {agent.pricing}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="dossier-footer-bar">
          <span className="text-xs text-slate-500 font-mono">
            Compliant with Monad Track 04 ERC-8004 Standard
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#101075] border border-[#101075] hover:bg-[#00004c] text-white text-xs font-medium transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            Close Registry
          </button>
        </div>

      </div>
    </div>
  );
};

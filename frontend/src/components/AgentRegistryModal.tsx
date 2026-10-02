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
      pricing: '10 AUSD',
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Security & Bytecode Auditor Agent',
      model: 'Custom Solidity Opcode & Slither Decompiler',
      operator: '0x32A9bc4890123849102938401928301928301928',
      capabilities: ['bytecode_audit', 'reentrancy_scan', 'tick_math'],
      reputationScore: 78,
      totalTasks: 38,
      pricing: '15 AUSD',
      status: 'ACTIVE'
    },
    {
      id: 3,
      name: 'Evaluator & Critic Gatekeeper',
      model: 'Strict Anti-Hallucination & Evidence Critic',
      operator: '0x71B4bc4890123849102938401928301928301928',
      capabilities: ['evaluator_critic', 'evidence_validator', 'slashing_gate'],
      reputationScore: 95,
      totalTasks: 80,
      pricing: '5 AUSD',
      status: 'ACTIVE'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-purple-500/40 shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-[#120b24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">ERC-8004 Agent Identity Registry</h2>
                <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800 font-mono">
                  Monad Singleton
                </span>
              </div>
              <p className="text-xs text-slate-400">Onchain Passport, Capabilities & Verifiable Reputation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Agents */}
        <div className="p-6 overflow-y-auto space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-xl bg-[#0e0a1b]/90 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-300 mono bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      NFT #{agent.id}
                    </span>
                    <h3 className="font-bold text-sm text-white">{agent.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{agent.model}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{agent.reputationScore}/100</span>
                  </div>
                  <span className="text-xs text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold mono">
                    {agent.pricing}
                  </span>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Capabilities:</span>
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 font-mono flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {cap}
                  </span>
                ))}
              </div>

              {/* Operator Wallet */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-purple-500/10">
                <span>Operator: <span className="mono text-slate-400">{agent.operator.slice(0, 14)}...</span></span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  {agent.totalTasks} Tasks Verified on Monad
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-[#120b24] flex items-center justify-between">
          <span className="text-xs text-slate-400">Deployed on Monad Testnet (Chain ID 10143)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs cursor-pointer"
          >
            Close Registry
          </button>
        </div>

      </div>
    </div>
  );
};

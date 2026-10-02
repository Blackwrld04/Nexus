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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--paper-raised)] border border-[var(--line-strong)] rounded-[var(--radius)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--paper)]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[var(--ink)]" />
            <div>
              <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block">
                [ ID登録台帳 // IDENTITY & REPUTATION ]
              </span>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg text-[var(--ink)] font-normal">
                  ERC-8004 Agent Identity Registry
                </h2>
                <span className="text-[10px] text-[var(--monad)] bg-[var(--monad-soft)] px-1.5 py-0.5 rounded-[var(--radius)] border border-[var(--monad)]/20 font-mono">
                  Monad Singleton
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius)] hover:bg-[var(--paper-soft)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Agents */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-[var(--radius)] bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--line-strong)] transition-all flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--monad)] font-mono bg-[var(--monad-soft)] px-1.5 py-0.5 rounded-[var(--radius)] border border-[var(--monad)]/20">
                      NFT #{agent.id}
                    </span>
                    <h3 className="font-sans font-bold text-sm text-[var(--ink)]">{agent.name}</h3>
                  </div>
                  <p className="text-xs text-[var(--ink-muted)] mt-0.5">{agent.model}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-[var(--agora)] font-mono font-medium bg-[var(--agora-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--agora)]/20">
                    <Star className="w-3 h-3 fill-[var(--agora)] text-[var(--agora)]" />
                    <span>{agent.reputationScore}/100</span>
                  </div>
                  <span className="text-xs text-[var(--ink)] bg-[var(--paper-soft)] px-2 py-0.5 rounded-[var(--radius)] border border-[var(--line)] font-mono font-semibold">
                    {agent.pricing}
                  </span>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[var(--ink-faint)] font-mono">Capabilities:</span>
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink-dim)] font-mono flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-[var(--ink-faint)]" />
                    {cap}
                  </span>
                ))}
              </div>

              {/* Operator Wallet */}
              <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] pt-2 border-t border-[var(--line-soft)] font-mono">
                <span>Operator: <span className="text-[var(--ink)]">{agent.operator.slice(0, 16)}...</span></span>
                <span className="text-[var(--success)] flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  {agent.totalTasks} Tasks Verified on Monad
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--line)] bg-[var(--paper)] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[var(--ink-muted)]">Deployed on Monad Testnet (Chain ID 10143)</span>
          <button
            onClick={onClose}
            className="editorial-btn editorial-btn-solid text-xs py-1.5 px-4 cursor-pointer"
          >
            Close Registry
          </button>
        </div>

      </div>
    </div>
  );
};

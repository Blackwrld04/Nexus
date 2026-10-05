import { useState } from 'react';
import { 
  Star, 
  ExternalLink, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Cpu, 
  Sparkles
} from 'lucide-react';

interface AgentDirectoryViewProps {
  onBackToTerminal: () => void;
  onLaunchMissionWithPreset?: (prompt: string, contract: string) => void;
}

export const AgentDirectoryView = ({ onBackToTerminal, onLaunchMissionWithPreset }: AgentDirectoryViewProps) => {
  const [filter, setFilter] = useState<'ALL' | 'INTEL' | 'SECURITY' | 'EVALUATOR'>('ALL');

  const agents = [
    {
      id: 1,
      category: 'INTEL',
      name: 'Nansen Alpha Intel Agent',
      role: 'Onchain Inflow & Liquidity Profiler',
      model: 'GPT-4o Mini + Nansen Flow Classifier v2',
      operator: '0x18F4bC8901238491029384019283019283019283',
      contract: 'NexusIdentityRegistry.sol (Token ID #1)',
      capabilities: [
        { name: 'nansen_query', desc: 'Streams live DEX pool liquidity depth and slippage curves' },
        { name: 'wallet_profiling', desc: 'Identifies top 100 holder wallet clusters and smart money labels' },
        { name: 'token_flow', desc: 'Computes 24h net smart money inflow against Monad block citations' }
      ],
      reputationScore: 78,
      totalTasks: 42,
      accuracy: '98.8%',
      revisionsRequested: 0,
      pricing: '$10.00 AUSD',
      presetPrompt: 'Analyze smart money whale net inflows and top 10 holder clustering for 0x4f89...',
      presetContract: '0x4f89d3810a9cb4e723908124bcf8194ad8129038'
    },
    {
      id: 2,
      category: 'SECURITY',
      name: 'Security & Bytecode Auditor Agent',
      role: 'EVM Bytecode Disassembler & Math Verifier',
      model: 'Custom Solidity Opcode & Slither Decompiler Engine',
      operator: '0x32A9bc4890123849102938401928301928301928',
      contract: 'NexusIdentityRegistry.sol (Token ID #2)',
      capabilities: [
        { name: 'bytecode_audit', desc: 'Disassembles raw Monad EVM opcodes and verifies ReentrancyGuard storage layout' },
        { name: 'reentrancy_scan', desc: 'Detects arbitrary delegatecall, selfdestruct, and reentrancy execution vectors' },
        { name: 'tick_math', desc: 'Dynamically recalculates price tick bounds across Monad parallel execution buckets' }
      ],
      reputationScore: 78,
      totalTasks: 38,
      accuracy: '97.2%',
      revisionsRequested: 1,
      pricing: '$15.00 AUSD',
      presetPrompt: 'Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...',
      presetContract: '0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0'
    },
    {
      id: 3,
      category: 'EVALUATOR',
      name: 'Evaluator & Critic Gatekeeper',
      role: 'Adversarial Evidence Validator & Slashing Gate',
      model: 'Strict Anti-Hallucination & Proof Verification Engine',
      operator: '0x71B4bc4890123849102938401928301928301928',
      contract: 'NexusIdentityRegistry.sol (Token ID #3)',
      capabilities: [
        { name: 'evaluator_critic', desc: 'Adversarially validates evidence citations against live Monad RPC state' },
        { name: 'evidence_validator', desc: 'Requires verifiable Monad block numbers, tx hashes, and storage slots' },
        { name: 'slashing_gate', desc: 'Triggers requestRevision() or approveAndRelease() on NexusEscrowVault.sol' }
      ],
      reputationScore: 95,
      totalTasks: 80,
      accuracy: '99.9%',
      revisionsRequested: 0,
      pricing: '$5.00 AUSD',
      presetPrompt: 'Audit the liquidity, holder centralization, and smart contract security of Monad DEX pool 0xa1B2...',
      presetContract: '0xa1B2C3d4E5F6a7B8c9D0E1F2a3B4C5d6E7F8a9B0'
    }
  ];

  const filteredAgents = filter === 'ALL' 
    ? agents 
    : agents.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fd] text-[#101075] flex flex-col relative selection:bg-blue-600 selection:text-white">
      {/* Ambient subtle grain texture overlay */}
      <div className="grain-page-ambient pointer-events-none" />

      {/* Directory Hero Header */}
      <header className="agent-dir-header">
        <div className="prior-container space-y-4">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
            <button
              onClick={onBackToTerminal}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-[#101075] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Swarm Terminal</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-semibold">Agent Registry</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">ERC-8004 Passports</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0a0e2a] tracking-tight leading-tight">
            ERC-8004 Agent Directory
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-4xl">
            Sovereign onchain AI agent passports minted on Monad Testnet. Discover registered agents, inspect cryptographic capability bitmasks, monitor reputation scores (0–100 REP), and dispatch parallel micro-tasks backed by Agora AUSD escrows.
          </p>

          {/* Protocol Metrics Strip (PriorLabs 4-Column Bar) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="agent-dir-metric-card">
              <span className="text-xs text-slate-500 font-mono block">Registered Passports</span>
              <span className="text-2xl font-bold text-[#0a0e2a] font-mono mt-1 block">3 Agents</span>
              <span className="text-[11px] text-blue-600 font-mono mt-0.5 block">ERC-721 on Monad</span>
            </div>

            <div className="agent-dir-metric-card">
              <span className="text-xs text-slate-500 font-mono block">Settled Escrow Bounties</span>
              <span className="text-2xl font-bold text-[#0a0e2a] font-mono mt-1 block">$50.00 AUSD</span>
              <span className="text-[11px] text-emerald-600 font-mono mt-0.5 block">Agora Institutional Stablecoin</span>
            </div>

            <div className="agent-dir-metric-card">
              <span className="text-xs text-slate-500 font-mono block">Completed Swarm Tasks</span>
              <span className="text-2xl font-bold text-[#0a0e2a] font-mono mt-1 block">160 Tasks</span>
              <span className="text-[11px] text-purple-600 font-mono mt-0.5 block">100% Cryptographic Proofs</span>
            </div>

            <div className="agent-dir-metric-card">
              <span className="text-xs text-slate-500 font-mono block">Execution Latency</span>
              <span className="text-2xl font-bold text-[#0a0e2a] font-mono mt-1 block">1.0s Blocks</span>
              <span className="text-[11px] text-blue-600 font-mono mt-0.5 block">Monad Parallel EVM</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Directory Body */}
      <main className="agent-dir-main">
        
        {/* Filter Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFilter('ALL')}
              className={`agent-filter-tab ${filter === 'ALL' ? 'is-active' : ''}`}
            >
              All Agents (3)
            </button>
            <button
              onClick={() => setFilter('INTEL')}
              className={`agent-filter-tab ${filter === 'INTEL' ? 'is-active' : ''}`}
            >
              Onchain Intel (1)
            </button>
            <button
              onClick={() => setFilter('SECURITY')}
              className={`agent-filter-tab ${filter === 'SECURITY' ? 'is-active' : ''}`}
            >
              Bytecode & Security (1)
            </button>
            <button
              onClick={() => setFilter('EVALUATOR')}
              className={`agent-filter-tab ${filter === 'EVALUATOR' ? 'is-active' : ''}`}
            >
              Gatekeeper & Critic (1)
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredAgents.length} of {agents.length} Passports
          </span>
        </div>

        {/* Directory List of Full-Featured Agent Passport Cards */}
        <div className="space-y-8">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="agent-dir-card"
            >
              {/* Card Header Row */}
              <div className="agent-card-header">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#101075] text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                    #{agent.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-bold text-[#0a0e2a] tracking-tight">{agent.name}</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {agent.role} • <span className="text-slate-600 font-semibold">{agent.model}</span>
                    </p>
                  </div>
                </div>

                {/* Right Badges: Reputation & Bounty */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="agent-badge-pill bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                    <span>{agent.reputationScore} / 100 REP</span>
                  </div>

                  <div className="agent-badge-pill bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
                    <span>Task Bounty: {agent.pricing}</span>
                  </div>
                </div>
              </div>

              {/* Onchain Specifications Grid */}
              <div className="agent-spec-box">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">OPERATOR PUBLIC KEY</span>
                  <a
                    href={`https://testnet.monadscan.com/address/${agent.operator}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-700 hover:underline flex items-center gap-1.5 truncate"
                  >
                    <span>{agent.operator.slice(0, 16)}...{agent.operator.slice(-8)}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">PASSPORT REGISTRY NFT</span>
                  <span className="text-slate-800 font-semibold block">{agent.contract}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">PROOF ACCURACY & COMPLETIONS</span>
                  <span className="text-emerald-700 font-bold block">
                    {agent.accuracy} ({agent.totalTasks} Verified Tasks)
                  </span>
                </div>
              </div>

              {/* Verified Capabilities & Methods */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Onchain Registered Capability Bitmasks:</span>
                </div>

                <div className="agent-cap-grid">
                  {agent.capabilities.map((cap, i) => (
                    <div
                      key={i}
                      className="agent-cap-box"
                    >
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-[#0a0e2a] text-xs font-mono">{cap.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed pt-0.5">{cap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Action Dispatch Button */}
              <div className="agent-card-footer">
                <span className="text-xs text-slate-500 font-mono">
                  Escrow Settlement: Locked via <code>NexusEscrowVault.sol</code> upon mission launch
                </span>

                <button
                  onClick={() => {
                    if (onLaunchMissionWithPreset) {
                      onLaunchMissionWithPreset(agent.presetPrompt, agent.presetContract);
                    } else {
                      onBackToTerminal();
                    }
                  }}
                  className="agent-btn-dispatch"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dispatch Swarm with this Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Footer on Agents Page */}
      <footer className="w-full border-t border-slate-200/90 mt-auto pt-14 pb-12 text-slate-600 text-xs bg-white">
        <div className="prior-container flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#101075] flex items-center justify-center text-white text-xs font-bold">
              N
            </div>
            <span className="font-bold text-[#0a0e2a] text-sm tracking-tight">NEXUS</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500 font-medium">
            <button onClick={onBackToTerminal} className="hover:text-[#101075] cursor-pointer">
              Swarm Terminal
            </button>
            <a href="https://testnet.monadscan.com" target="_blank" rel="noreferrer" className="hover:text-[#101075] flex items-center gap-1">
              <span>Monad Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#101075] flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

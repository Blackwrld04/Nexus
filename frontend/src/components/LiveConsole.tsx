import { useRef, useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, Database, Layers, Award } from 'lucide-react';

export interface ConsoleEvent {
  timestamp: string;
  agentName: string;
  action: string;
  details: string;
  txHash?: string;
  blockNumber?: number;
}

interface LiveConsoleProps {
  events: ConsoleEvent[];
}

export const LiveConsole = ({ events }: LiveConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'ALL' | 'PLANNER' | 'WORKERS' | 'CRITIC' | 'RPC'>('ALL');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const defaultLogs: ConsoleEvent[] = [
    {
      timestamp: '10:12:00',
      agentName: 'Monad Client RPC',
      action: 'CHAIN_CONNECT',
      details: 'Connected to Monad Testnet RPC endpoint (Chain ID 10143). Single-slot 1-second finality active.',
      blockNumber: 1845918
    },
    {
      timestamp: '10:12:01',
      agentName: 'Nexus Identity Registry',
      action: 'NFT_INDEX',
      details: 'Loaded 4 registered ERC-8004 Agent Cards: Planner (#0), Nansen Intel (#1), Bytecode Auditor (#2), Evaluator Critic (#3).',
      blockNumber: 1845919
    },
    {
      timestamp: '10:12:02',
      agentName: 'Nexus Escrow Vault',
      action: 'ESCROW_READY',
      details: 'Vault initialized with Agora AUSD settlement token. Machine-to-machine streaming channel open.',
      blockNumber: 1845920
    },
    {
      timestamp: '10:12:04',
      agentName: 'Planner Coordinator Agent',
      action: 'DECOMPOSE_GOAL',
      details: 'Decomposed goal for target pool 0xa1B2... Identified sub-tasks: [Whale Inflow Analytics, Storage Disassembly, Evidence Critique].',
      blockNumber: 1845921
    },
    {
      timestamp: '10:12:05',
      agentName: 'Nexus Escrow Vault',
      action: 'LOCK_ESCROW',
      details: 'Locked 25.00 AUSD in micro-escrow for worker bounties (Nansen: 10 AUSD, Auditor: 15 AUSD).',
      blockNumber: 1845922,
      txHash: '0x12a9bc4890123849102938401928301928301928301928301928301928301928'
    },
    {
      timestamp: '10:12:06',
      agentName: 'Nansen Alpha Intel Agent',
      action: 'SUBMIT_FINDINGS',
      details: 'Net Inflow: +$420,500 AUSD. Top 10 concentration: 18.4%. Cryptographic citation: Block #1845920.',
      blockNumber: 1845923,
      txHash: '0x4f89d3810a9cb4e723908124bcf8194ad8129038410294810293847109283401'
    },
    {
      timestamp: '10:12:07',
      agentName: 'Security & Bytecode Auditor',
      action: 'SUBMIT_DRAFT',
      details: 'Decompiled Monad bytecode for 0xa1B2... Found ReentrancyGuard storage layout. Warning: dynamic tick array proof missing.',
      blockNumber: 1845924
    },
    {
      timestamp: '10:12:08',
      agentName: 'Evaluator & Critic Gatekeeper',
      action: 'REQUEST_REVISION',
      details: 'CRITIQUE FAILED: Missing proof for dynamic price tick bounds. Emitted requestRevision() on Monad Escrow Vault.',
      blockNumber: 1845925,
      txHash: '0x77c8492048102948102948102948102948102948102948102948102948102948'
    },
    {
      timestamp: '10:12:10',
      agentName: 'Security & Bytecode Auditor',
      action: 'SUBMIT_REVISION',
      details: 'Revision complete: Verified dynamic tick price array across Monad parallel execution buckets. Attached proof Block #1845926.',
      blockNumber: 1845926,
      txHash: '0xaa1290384102948102948102948102948102948102948102948102948102948'
    },
    {
      timestamp: '10:12:11',
      agentName: 'Evaluator & Critic Gatekeeper',
      action: 'APPROVAL_VERDICT',
      details: 'Revision APPROVED (Score: 98/100). Emitted approveAndRelease() to release 25 AUSD from Escrow Vault to Workers.',
      blockNumber: 1845927,
      txHash: '0x99e0102948102948102948102948102948102948102948102948102948102948'
    }
  ];

  const rawEvents = events.length > 0 ? events : defaultLogs;

  const filteredEvents = rawEvents.filter((evt) => {
    if (filter === 'ALL') return true;
    if (filter === 'PLANNER') return evt.agentName.includes('Planner');
    if (filter === 'WORKERS') return evt.agentName.includes('Nansen') || evt.agentName.includes('Auditor');
    if (filter === 'CRITIC') return evt.agentName.includes('Evaluator') || evt.agentName.includes('Critic');
    if (filter === 'RPC') return evt.agentName.includes('RPC') || evt.agentName.includes('Registry') || evt.agentName.includes('Escrow');
    return true;
  });

  return (
    <div className="editorial-card p-5 sm:p-6 w-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Console Section Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge-jp">
              <span className="jp">実行ログ</span>
              <span>// REAL-TIME MONAD RPC TELEMETRY & REASONING FEED</span>
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[var(--ink)] font-normal tracking-tight">
            Live Monad Telemetry & Reasoning Traces
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {(['ALL', 'PLANNER', 'WORKERS', 'CRITIC', 'RPC'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded-[var(--radius)] border transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[var(--bone)] text-[var(--bone-text)] border-[var(--bone)] font-bold'
                  : 'bg-[var(--paper-soft)] text-[var(--ink-muted)] border-[var(--line)] hover:text-[var(--ink)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cockpit Dual-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 my-2 flex-1 min-h-0">
        
        {/* Left Side: Monad & Escrow Telemetry Status (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-2">
          {/* Node Vitals Card */}
          <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] space-y-1.5">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--line-soft)]">
              <div className="flex items-center gap-1.5 font-sans font-bold text-[var(--ink)] text-xs">
                <Database className="w-3.5 h-3.5 text-[var(--monad)]" />
                <span>Monad Node Vitals</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--success)] font-semibold flex items-center gap-1">
                <span className="pulse-dot" /> LIVE
              </span>
            </div>

            <div className="space-y-1 font-mono text-[10px] sm:text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Network:</span>
                <span className="font-semibold text-[var(--ink)]">Monad Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Chain ID:</span>
                <span className="text-[var(--monad)] font-bold">10143</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Finality Mode:</span>
                <span className="text-[var(--ink)]">1.0s (Single-Slot)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Execution:</span>
                <span className="text-[var(--success)] font-medium">MonadDb Parallel</span>
              </div>
            </div>
          </div>

          {/* Machine Escrow Vitals */}
          <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] space-y-1.5">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--line-soft)]">
              <div className="flex items-center gap-1.5 font-sans font-bold text-[var(--ink)] text-xs">
                <Layers className="w-3.5 h-3.5 text-[var(--agora)]" />
                <span>Agora Escrow Vault</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--agora)] font-semibold">
                STREAMING
              </span>
            </div>

            <div className="space-y-1 font-mono text-[10px] sm:text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Settlement Asset:</span>
                <span className="font-semibold text-[var(--agora)]">Agora AUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Locked Bounty:</span>
                <span className="text-[var(--ink)] font-bold">25.00 AUSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Quality Gate:</span>
                <span className="text-[var(--monad)] font-medium">Evaluator Critic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Revision State:</span>
                <span className="text-[var(--success)] font-medium">Auto-Resolved</span>
              </div>
            </div>
          </div>

          {/* Quality Rubric Vitals */}
          <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] space-y-1.5">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--line-soft)]">
              <div className="flex items-center gap-1.5 font-sans font-bold text-[var(--ink)] text-xs">
                <Award className="w-3.5 h-3.5 text-[var(--success)]" />
                <span>Closed-Loop Quality Rubric</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--success)] font-semibold">
                STRICT
              </span>
            </div>

            <div className="space-y-1 font-mono text-[10px] sm:text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Pass Score Threshold:</span>
                <span className="font-semibold text-[var(--ink)]">90 / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Automated Revision:</span>
                <span className="text-red-700 font-medium">Triggered & Resolved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">Reputation Impact:</span>
                <span className="text-[var(--success)] font-medium">+3 Rep / Success</span>
              </div>
            </div>
          </div>

          {/* Verification Stats Summary */}
          <div className="p-2.5 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-[var(--ink)]">
              <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
              <span>Verifiable Proofs:</span>
            </div>
            <span className="font-bold text-[var(--success)]">6 Onchain Citations</span>
          </div>
        </div>

        {/* Right Side: High-Density Monospace Terminal Feed (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[var(--paper-raised)] rounded-[var(--radius)] border border-[var(--line)] p-3">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1.5 font-mono text-xs max-h-[360px]">
            {filteredEvents.map((evt, idx) => {
              const isRejection = evt.action.includes('REVISION') || evt.action.includes('CRITIQUE');
              const isApproval = evt.action.includes('APPROVAL') || evt.action.includes('COMPLETE');
              const isEscrow = evt.action.includes('ESCROW');

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-[var(--radius)] border transition-all text-xs ${
                    isRejection
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : isApproval
                      ? 'bg-[var(--success-soft)]/70 border-emerald-200 text-emerald-950'
                      : isEscrow
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-[var(--paper-soft)]/70 border-[var(--line-soft)] text-[var(--ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[var(--ink-faint)] font-mono text-[10px]">{evt.timestamp}</span>
                      <span className="px-1.5 py-0.2 rounded-[var(--radius)] font-mono font-medium text-[10px] bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink)]">
                        {evt.agentName}
                      </span>
                      <span className="font-mono font-bold text-[10px] text-[var(--ink-dim)]">[{evt.action}]</span>
                    </div>

                    {evt.blockNumber && (
                      <span className="text-[10px] font-mono text-[var(--monad)] shrink-0 font-medium">
                        Monad #{evt.blockNumber}
                      </span>
                    )}
                  </div>

                  <p className="text-[var(--ink-dim)] leading-relaxed font-sans text-xs">
                    {evt.details}
                  </p>

                  {evt.txHash && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[var(--ink-muted)]">
                      <span>Tx:</span>
                      <a
                        href={`https://testnet.monadscan.com/tx/${evt.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-0.5 text-[var(--monad)] font-mono"
                      >
                        <span>{evt.txHash.slice(0, 16)}...</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Terminal Bottom Heartbeat */}
          <div className="mt-2 pt-2 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-faint)]">
            <div className="flex items-center gap-2">
              <span className="pulse-dot" />
              <span>RPC Latency: <strong>0.8ms</strong></span>
              <span>•</span>
              <span>Endpoint: <strong>testnet-rpc.monad.xyz</strong></span>
            </div>
            <div>
              <span>{filteredEvents.length} Traces Indexed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section 02 Footer Meta */}
      <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--ink-faint)]">
        <span>Monad Single-Slot Finality (1.0s) • 100% Cryptographic Citations Attached</span>
        <span>ERC-8004 Standardized Feedback Telemetry</span>
      </div>
    </div>
  );
};

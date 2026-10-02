import { useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="editorial-card p-6 sm:p-8 w-full flex flex-col h-[480px]">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-jp">
              <span className="jp">実行ログ</span>
              <span>// REAL-TIME MONAD RPC FEED</span>
            </span>
          </div>
          <h3 className="font-display text-2xl text-[var(--ink)] font-normal tracking-tight">
            Live Execution Feed & Reasoning Traces
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="pulse-dot" />
          <span className="font-mono text-[11px] text-[var(--ink-muted)] hidden sm:inline">Active Telemetry</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--ink-faint)] text-xs italic gap-1.5 text-center px-4">
            <span className="font-mono text-xs">No active telemetry streams.</span>
            <span className="text-xs">Click "Launch Swarm Mission" above to observe the closed-loop evaluation cycle.</span>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isRejection = evt.action.includes('REVISION') || evt.action.includes('CRITIQUE');
            const isApproval = evt.action.includes('APPROVAL') || evt.action.includes('COMPLETE');
            const isEscrow = evt.action.includes('ESCROW');

            return (
              <div
                key={idx}
                className={`p-3 rounded-[var(--radius)] border transition-all text-xs ${
                  isRejection
                    ? 'bg-red-50/70 border-red-200 text-red-950'
                    : isApproval
                    ? 'bg-[var(--success-soft)]/60 border-emerald-200 text-emerald-950'
                    : isEscrow
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                    : 'bg-[var(--paper-soft)]/60 border-[var(--line-soft)] text-[var(--ink)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[var(--ink-faint)] font-mono">{evt.timestamp}</span>
                    <span className="px-2 py-0.5 rounded-[var(--radius)] font-mono font-medium text-[10px] bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink)]">
                      {evt.agentName}
                    </span>
                    <span className="font-mono font-bold text-[10px] text-[var(--ink-dim)]">[{evt.action}]</span>
                  </div>

                  {evt.blockNumber && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--monad)] shrink-0">
                      <span>Monad #{evt.blockNumber}</span>
                    </div>
                  )}
                </div>

                <p className="text-[var(--ink-dim)] leading-relaxed font-sans text-xs">
                  {evt.details}
                </p>

                {evt.txHash && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-[var(--ink-muted)]">
                    <span>Tx Hash:</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${evt.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5 text-[var(--monad)] font-mono"
                    >
                      <span>{evt.txHash.slice(0, 18)}...</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

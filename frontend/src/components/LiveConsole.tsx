import { useRef, useEffect } from 'react';
import { Terminal, ExternalLink } from 'lucide-react';

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
    <div id="execution" className="editorial-card p-5 w-full flex flex-col h-[420px]">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--ink)]" />
          <h3 className="font-sans font-bold text-sm text-[var(--ink)] tracking-tight">
            Live Monad Execution Feed & Reasoning Traces
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="pulse-dot" />
          <span className="font-mono text-[11px] text-[var(--ink-muted)]">Real-Time Monad Telemetry</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[var(--ink-faint)] text-xs italic gap-1.5">
            <span className="font-mono text-[11px]">No active telemetry streams.</span>
            <span className="text-[11px]">Click "Launch Swarm Mission" above to observe the closed-loop evaluation cycle.</span>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isRejection = evt.action.includes('REVISION') || evt.action.includes('CRITIQUE');
            const isApproval = evt.action.includes('APPROVAL') || evt.action.includes('COMPLETE');
            const isEscrow = evt.action.includes('ESCROW');

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-[var(--radius)] border transition-all text-xs ${
                  isRejection
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : isApproval
                    ? 'bg-[var(--success-soft)]/60 border-emerald-200 text-emerald-950'
                    : isEscrow
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                    : 'bg-[var(--paper-soft)]/60 border-[var(--line-soft)] text-[var(--ink)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[var(--ink-faint)] font-mono">{evt.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded-[var(--radius)] font-mono font-medium text-[10px] bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--ink)]">
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
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[var(--ink-muted)]">
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

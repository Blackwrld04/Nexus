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
    <div className="console-card">
      {/* Console Header */}
      <div className="console-header-bar">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0a0e2a] tracking-tight">
              Live Monad Execution Feed & Reasoning Traces
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Real-time onchain telemetry, critique loops, and escrow settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Monad Testnet RPC Active</span>
        </div>
      </div>

      {/* Terminal Output Rows */}
      <div ref={scrollRef} className="console-scroll-area">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic gap-2.5">
            <p>Awaiting swarm mission launch...</p>
            <p className="text-[11px] text-slate-500 font-sans">
              Click &ldquo;Launch Swarm Mission&rdquo; above to stream parallel agent reasoning and 1-second Monad blocks.
            </p>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isRejection = evt.action.includes('REVISION') || evt.action.includes('CRITIQUE');
            const isApproval = evt.action.includes('APPROVAL') || evt.action.includes('COMPLETE');
            const isEscrow = evt.action.includes('ESCROW');

            const bubbleClass = isRejection
              ? 'console-event-bubble rejection'
              : isApproval
              ? 'console-event-bubble approval'
              : isEscrow
              ? 'console-event-bubble escrow'
              : 'console-event-bubble default';

            return (
              <div key={idx} className={bubbleClass}>
                <div className="console-event-meta">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-slate-400 font-mono text-xs">{evt.timestamp}</span>
                    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap shrink-0 border ${
                      evt.agentName.includes('Planner') ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      evt.agentName.includes('Nansen') ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                      evt.agentName.includes('Security') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      evt.agentName.includes('Evaluator') ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      'bg-slate-200 text-slate-800 border-slate-300'
                    }`}>
                      {evt.agentName}
                    </span>
                    <span className="text-slate-700 font-bold font-mono text-xs">[{evt.action}]</span>
                  </div>

                  {evt.blockNumber && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-mono font-bold shrink-0 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 whitespace-nowrap">
                      <span>Monad #{evt.blockNumber}</span>
                    </div>
                  )}
                </div>

                <p className="console-event-desc">
                  {evt.details}
                </p>

                {evt.txHash && (
                  <div className="console-event-tx">
                    <span className="text-slate-400 font-mono">Onchain Transaction:</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${evt.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1.5 text-blue-700 font-mono font-semibold"
                    >
                      <span>{evt.txHash.slice(0, 24)}...</span>
                      <ExternalLink className="w-3 h-3" />
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

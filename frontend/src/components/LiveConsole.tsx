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
    <div className="glass-panel p-5 w-full flex flex-col h-[400px]">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-white">Live Monad Execution Feed & Reasoning Traces</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Monad Telemetry</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
            Waiting for swarm mission launch... Select a preset or type a goal above.
          </div>
        ) : (
          events.map((evt, idx) => {
            const isRejection = evt.action.includes('REVISION') || evt.action.includes('CRITIQUE');
            const isApproval = evt.action.includes('APPROVAL') || evt.action.includes('COMPLETE');
            const isEscrow = evt.action.includes('ESCROW');

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all ${
                  isRejection
                    ? 'bg-pink-950/30 border-pink-500/50 text-pink-200'
                    : isApproval
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : isEscrow
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500">{evt.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      evt.agentName.includes('Planner') ? 'bg-purple-900/60 text-purple-300 border border-purple-700' :
                      evt.agentName.includes('Nansen') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      evt.agentName.includes('Security') ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      evt.agentName.includes('Evaluator') ? 'bg-pink-950 text-pink-300 border border-pink-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.agentName}
                    </span>
                    <span className="text-slate-400 font-bold">[{evt.action}]</span>
                  </div>

                  {evt.blockNumber && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 shrink-0">
                      <span>Monad #{evt.blockNumber}</span>
                    </div>
                  )}
                </div>

                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {evt.details}
                </p>

                {evt.txHash && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-purple-300">
                    <span>Tx Hash:</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${evt.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-cyan-300"
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

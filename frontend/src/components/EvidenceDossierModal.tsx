import React from 'react';
import { X, CheckCircle, ShieldCheck, ExternalLink, Zap, Clock, Coins, RefreshCw } from 'lucide-react';

interface EvidenceItem {
  source: string;
  metric: string;
  value: string | number;
  blockNumber: number;
  txHash: string;
  timestamp: string;
}

interface EvidenceDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContract: string;
  safetyScore: number;
  verdict: string;
  totalAUSD: number;
  blocksElapsed: number;
  executionSeconds: number;
  revisions: number;
  citations: EvidenceItem[];
}

export const EvidenceDossierModal: React.FC<EvidenceDossierModalProps> = ({
  isOpen,
  onClose,
  targetContract,
  safetyScore,
  verdict,
  totalAUSD,
  blocksElapsed,
  executionSeconds,
  revisions,
  citations
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--paper-raised)] border border-[var(--line-strong)] rounded-[var(--radius)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--paper)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[var(--ink)]" />
            <div>
              <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider block">
                [ 証拠ドシエ // VERIFICATION PROOF ]
              </span>
              <h2 className="font-display text-lg text-[var(--ink)] font-normal">
                Verifiable Swarm Audit Dossier
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[var(--radius)] hover:bg-[var(--paper-soft)] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Target Contract Banner */}
          <div className="p-3.5 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[var(--ink-muted)] font-mono">TARGET CONTRACT:</span>
            <span className="font-mono text-[var(--ink)] font-bold">{targetContract}</span>
          </div>

          {/* Verdict Scorecard */}
          <div className="p-4 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-mono text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
                Closed-Loop Verdict
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl text-[var(--ink)] font-normal">
                  {verdict === 'SAFE_TO_INTERACT' ? 'Safe to Interact' : verdict}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-[var(--radius)] bg-[var(--success-soft)] text-[var(--success)] font-mono font-medium border border-[var(--success)]/20">
                  {safetyScore}/100 Score
                </span>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-[var(--ink-muted)]">
              <div>Monad Testnet Finality</div>
              <div className="text-[var(--ink)] font-semibold mt-0.5">1-Second Slot</div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] text-center">
              <Clock className="w-3.5 h-3.5 text-[var(--ink-muted)] mx-auto mb-1" />
              <div className="text-base font-bold text-[var(--ink)] font-mono">{executionSeconds}s</div>
              <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider font-mono">Execution Time</span>
            </div>
            <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] text-center">
              <Zap className="w-3.5 h-3.5 text-[var(--monad)] mx-auto mb-1" />
              <div className="text-base font-bold text-[var(--monad)] font-mono">{blocksElapsed} Blocks</div>
              <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider font-mono">Monad Blocks</span>
            </div>
            <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] text-center">
              <Coins className="w-3.5 h-3.5 text-[var(--agora)] mx-auto mb-1" />
              <div className="text-base font-bold text-[var(--agora)] font-mono">${totalAUSD} AUSD</div>
              <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider font-mono">Escrow Settled</span>
            </div>
            <div className="p-3 rounded-[var(--radius)] bg-[var(--paper-soft)] border border-[var(--line)] text-center">
              <RefreshCw className="w-3.5 h-3.5 text-red-700 mx-auto mb-1" />
              <div className="text-base font-bold text-red-700 font-mono">{revisions} Round</div>
              <span className="text-[10px] text-[var(--ink-muted)] uppercase tracking-wider font-mono">Revisions Caught</span>
            </div>
          </div>

          {/* Verifiable Onchain Citations */}
          <div>
            <h3 className="font-sans font-bold text-xs text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Verifiable Evidence Citations ({citations.length} Onchain Proofs)</span>
            </h3>

            <div className="space-y-2">
              {citations.map((c, i) => (
                <div key={i} className="p-3 rounded-[var(--radius)] bg-[var(--paper)] border border-[var(--line)] text-xs">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--paper-soft)] text-[var(--ink-muted)] text-[10px] font-mono border border-[var(--line)]">
                        {c.source}
                      </span>
                      <strong className="text-[var(--ink)] text-xs">{c.metric}</strong>
                    </div>
                    <span className="text-[var(--success)] font-mono font-semibold">{c.value}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)] pt-1.5 border-t border-[var(--line-soft)] font-mono">
                    <span>Block #{c.blockNumber}</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${c.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-[var(--monad)]"
                    >
                      <span>Tx: {c.txHash.slice(0, 16)}...</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--line)] bg-[var(--paper)] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[var(--ink-muted)]">Verified on Monad Testnet</span>
          <button
            onClick={onClose}
            className="editorial-btn editorial-btn-solid text-xs py-1.5 px-4 cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

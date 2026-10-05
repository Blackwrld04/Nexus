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
    <div className="dossier-overlay animate-in fade-in duration-200">
      <div className="dossier-window text-slate-800">
        
        {/* Modal Header */}
        <div className="dossier-header-bar">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-extrabold text-[#0a0e2a] tracking-tight">
                  Verified Onchain Audit Dossier
                </h2>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 whitespace-nowrap shrink-0">
                  Proof-Gated Evidence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Synthesized by Explainer Agent with Onchain Monad Block Citations
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

        {/* Modal Body */}
        <div className="dossier-body-container">

          {/* Executive Verdict Banner */}
          <div className="dossier-verdict-card shadow-xs">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-9 h-9 text-emerald-600 shrink-0" />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-bold text-emerald-950 font-mono uppercase tracking-wider">{verdict}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-300 whitespace-nowrap shrink-0">
                    Quality Gate Passed
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-mono mt-1.5 break-all">Target: {targetContract}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-[#0a0e2a] font-mono">{safetyScore} / 100</div>
              <div className="text-xs text-emerald-700 uppercase tracking-wider font-mono font-semibold mt-0.5">Composite Security Score</div>
            </div>
          </div>

          {/* Monad Metropolis Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="dossier-stat-tile">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-mono">Execution Time</span>
              </div>
              <div className="text-xl font-bold text-[#0a0e2a] font-mono">{executionSeconds}s</div>
              <div className="text-[11px] text-blue-600 font-mono mt-0.5">1.0s Monad Blocks</div>
            </div>

            <div className="dossier-stat-tile">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-mono">Blocks Elapsed</span>
              </div>
              <div className="text-xl font-bold text-[#0a0e2a] font-mono">{blocksElapsed} Blocks</div>
              <div className="text-[11px] text-purple-600 font-mono mt-0.5">Single-Slot Finality</div>
            </div>

            <div className="dossier-stat-tile">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono">Total Settled</span>
              </div>
              <div className="text-xl font-bold text-[#0a0e2a] font-mono">${totalAUSD} AUSD</div>
              <div className="text-[11px] text-emerald-600 font-mono mt-0.5">NexusEscrowVault</div>
            </div>

            <div className="dossier-stat-tile">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono">Revision Loops</span>
              </div>
              <div className="text-xl font-bold text-[#0a0e2a] font-mono">{revisions} Round</div>
              <div className="text-[11px] text-amber-600 font-mono mt-0.5">Closed-Loop Evaluator</div>
            </div>
          </div>

          {/* Citations & Evidence Trail */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Cryptographic Evidence Proofs (6 Citations Attached)
              </h3>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 whitespace-nowrap shrink-0">
                ERC-8004 Standard
              </span>
            </div>

            <div className="space-y-3.5">
              {citations.map((cite, index) => (
                <div key={index} className="dossier-citation-card">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-[#0a0e2a] text-sm font-sans">{cite.metric}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium whitespace-nowrap shrink-0">
                      {cite.source}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-mono leading-relaxed pt-0.5">{cite.value}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-mono">
                    <span>Monad Block #{cite.blockNumber}</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${cite.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1.5 text-blue-600 font-medium"
                    >
                      <span>Tx: {cite.txHash.slice(0, 16)}...</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="dossier-footer-bar">
          <span className="text-xs text-slate-500 font-mono">
            Nexus ERC-8004 Trustless Verification Engine
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#101075] border border-[#101075] hover:bg-[#00004c] text-white text-xs font-medium transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

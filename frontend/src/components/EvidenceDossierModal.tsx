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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-purple-500/40 shadow-2xl shadow-purple-900/50">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 flex items-center justify-between bg-[#120b24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Verified Onchain Audit Dossier</h2>
              <p className="text-xs text-slate-400">Synthesized by Explainer Agent with Proof-Gated Evidence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Top Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-emerald-950/60 border border-purple-500/30 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Target Contract Analyzed:</span>
              <span className="mono text-sm text-cyan-300 font-semibold">{targetContract}</span>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {verdict}
                </span>
                <span className="text-xs text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30">
                  ERC-8004 Verified
                </span>
              </div>
            </div>

            {/* Score Radial Box */}
            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-1">Composite Safety Score</span>
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                {safetyScore}<span className="text-xl text-slate-500">/100</span>
              </div>
            </div>
          </div>

          {/* Monad Performance Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-center">
              <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white mono">{executionSeconds}s</div>
              <span className="text-[11px] text-slate-400">Total Run Time</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-center">
              <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-cyan-300 mono">{blocksElapsed} Blocks</div>
              <span className="text-[11px] text-slate-400">Monad 1s Blocks</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
              <Coins className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-emerald-300 mono">${totalAUSD} AUSD</div>
              <span className="text-[11px] text-slate-400">Agora Escrow Paid</span>
            </div>
            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/20 text-center">
              <RefreshCw className="w-4 h-4 text-pink-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-pink-300 mono">{revisions} Round</div>
              <span className="text-[11px] text-slate-400">Evaluator Revision</span>
            </div>
          </div>

          {/* Verifiable Onchain Citations (The Explainer Proofs) */}
          <div>
            <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Verifiable Onchain Evidence Citations ({citations.length} Verified Proofs)</span>
            </h3>

            <div className="space-y-2.5">
              {citations.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#0f0b1c]/90 border border-purple-500/20 text-xs">
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px] font-bold">
                        {c.source}
                      </span>
                      <strong className="text-white text-xs">{c.metric}</strong>
                    </div>
                    <span className="text-emerald-400 font-semibold">{c.value}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-purple-500/10">
                    <span>Block #{c.blockNumber}</span>
                    <a
                      href={`https://testnet.monadscan.com/tx/${c.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono"
                    >
                      <span>Tx: {c.txHash.slice(0, 16)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-[#120b24] flex items-center justify-between">
          <span className="text-xs text-slate-400">Verified and signed on Monad Testnet</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Coins, Sparkles } from 'lucide-react';

interface HeaderProps {
  ausdBalance: number;
  onClaimFaucet: () => void;
  onOpenRegistry: () => void;
}

export const Header = ({ ausdBalance, onClaimFaucet, onOpenRegistry }: HeaderProps) => {
  const [currentBlock, setCurrentBlock] = useState(1845920);
  const [blockCountdown, setBlockCountdown] = useState(1.0);

  // Simulate Monad's 1-second block production
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockCountdown((prev) => {
        if (prev <= 0.1) {
          setCurrentBlock((b) => b + 1);
          return 1.0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full px-6 py-4 border-b border-purple-500/20 bg-[#07050e]/80 backdrop-blur-md sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Narrative */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/30">
          <div className="w-full h-full bg-[#0d091a] rounded-[10px] flex items-center justify-center">
            <Cpu className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-wider text-white">NEXUS</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              ERC-8004
            </span>
          </div>
          <p className="text-xs text-slate-400">Autonomous Closed-Loop Multi-Agent Swarm on Monad</p>
        </div>
      </div>

      {/* Network & Wallet Telemetry */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Monad Testnet Live Block Tracker */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">Monad Testnet</span>
          <span className="text-purple-300 mono font-semibold">#{currentBlock}</span>
          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            {blockCountdown}s
          </span>
        </div>

        {/* Agora AUSD Balance (Session Key) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>Session Escrow:</span>
          <strong className="mono text-white text-sm">${ausdBalance.toFixed(2)} AUSD</strong>
        </div>

        {/* Faucet Claim Button */}
        <button
          onClick={onClaimFaucet}
          id="claim-ausd-faucet-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Claim AUSD</span>
        </button>

        {/* ERC-8004 Agent Registry */}
        <button
          onClick={onOpenRegistry}
          id="view-erc8004-registry-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Agent Passport (ERC-8004)</span>
        </button>
      </div>
    </header>
  );
};

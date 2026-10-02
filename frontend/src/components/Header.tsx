import { useState, useEffect } from 'react';
import { ShieldCheck, Coins, Sparkles } from 'lucide-react';

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
    <header className="w-full px-6 py-3.5 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between gap-4">
      {/* Brand & Narrative */}
      <div className="flex items-center gap-3">
        <a href="#hero" className="flex items-center gap-2.5 text-[var(--ink)] no-underline group">
          <div className="w-8 h-8 rounded-[var(--radius)] bg-[var(--ink)] text-[var(--paper)] font-mono text-xs font-bold flex items-center justify-center tracking-tighter group-hover:bg-[#2c2824] transition-colors">
            NX
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-sm tracking-wider uppercase">NEXUS</span>
              <span className="font-jp text-[10px] text-[var(--ink-muted)] tracking-wider">自律型スワーム</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--monad-soft)] text-[var(--monad)] font-mono font-medium border border-[var(--monad)]/20">
                ERC-8004
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)] hidden sm:block">Autonomous Closed-Loop Multi-Agent Swarm on Monad</p>
          </div>
        </a>
      </div>

      {/* Center Nav Links (Ryoku Style) */}
      <nav className="hidden md:flex items-center gap-6 font-sans text-[11px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
        <a href="#topology" className="hover:text-[var(--ink)] transition-colors">Topology</a>
        <a href="#execution" className="hover:text-[var(--ink)] transition-colors">Telemetry</a>
        <a href="#contracts" className="hover:text-[var(--ink)] transition-colors">Contracts</a>
      </nav>

      {/* Network & Wallet Telemetry */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Monad Testnet Live Block Tracker */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-xs">
          <span className="pulse-dot" />
          <span className="text-[var(--ink-muted)] font-medium text-[11px] hidden sm:inline">Monad Testnet</span>
          <span className="text-[var(--ink)] font-mono text-[11px] font-medium">#{currentBlock}</span>
          <span className="text-[10px] text-[var(--monad)] font-mono bg-[var(--monad-soft)] px-1 py-0.2 rounded border border-[var(--monad)]/20">
            {blockCountdown}s
          </span>
        </div>

        {/* Agora AUSD Balance (Session Key) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--ink)]">
          <Coins className="w-3.5 h-3.5 text-[var(--agora)]" />
          <span className="text-[var(--ink-muted)] text-[11px] hidden sm:inline">Escrow:</span>
          <strong className="font-mono text-xs font-semibold">${ausdBalance.toFixed(2)} AUSD</strong>
        </div>

        {/* Faucet Claim Button */}
        <button
          onClick={onClaimFaucet}
          id="claim-ausd-faucet-btn"
          className="editorial-btn editorial-btn-outline text-[11px] py-1 px-2.5 flex items-center gap-1.5"
          title="Mint 500 testnet Agora AUSD"
        >
          <Sparkles className="w-3 h-3 text-[var(--agora)]" />
          <span>Claim AUSD</span>
        </button>

        {/* ERC-8004 Agent Registry */}
        <button
          onClick={onOpenRegistry}
          id="view-erc8004-registry-btn"
          className="editorial-btn editorial-btn-solid text-[11px] py-1 px-3 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Agent Passports</span>
        </button>
      </div>
    </header>
  );
};

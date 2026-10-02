import { useState, useEffect } from 'react';
import { ShieldCheck, Coins, Sparkles } from 'lucide-react';

interface HeaderProps {
  ausdBalance: number;
  onClaimFaucet: () => void;
  onOpenRegistry: () => void;
  activeSection?: string;
}

export const Header = ({ ausdBalance, onClaimFaucet, onOpenRegistry, activeSection = 'overview' }: HeaderProps) => {
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

  const navItems = [
    { id: 'overview', label: '00 // Overview' },
    { id: 'topology', label: '01 // Topology' },
    { id: 'execution', label: '02 // Telemetry' },
    { id: 'contracts', label: '03 // Contracts' }
  ];

  return (
    <header className="w-full border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="wrap flex items-center justify-between h-[62px] gap-2">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <a href="#overview" className="flex items-center gap-2 text-[var(--ink)] no-underline group">
            <div className="w-7 h-7 rounded-[var(--radius)] bg-[var(--ink)] text-[var(--paper)] font-mono text-xs font-bold flex items-center justify-center tracking-tighter group-hover:bg-[#2c2824] transition-colors flex-shrink-0">
              NX
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-bold text-sm tracking-wider uppercase">NEXUS</span>
              <span className="font-jp text-[10px] text-[var(--ink-muted)] hidden sm:inline">自律型スワーム</span>
              <span className="text-[9px] px-1 py-0.2 rounded-[var(--radius)] bg-[var(--monad-soft)] text-[var(--monad)] font-mono font-medium border border-[var(--monad)]/20">
                ERC-8004
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links to the 4 Full-Screen Sections */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3 font-mono text-[11px] uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-2.5 py-1 rounded-[var(--radius)] transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[var(--bone)] text-[var(--bone-text)] font-semibold shadow-xs'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-soft)]'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Network & Wallet Telemetry (Strictly flex-nowrap) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap flex-shrink-0">
          {/* Monad Testnet Live Block Tracker */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-xs flex-shrink-0">
            <span className="pulse-dot" />
            <span className="text-[var(--ink)] font-mono text-[11px] font-medium hidden lg:inline">Monad</span>
            <span className="text-[var(--ink)] font-mono text-[11px] font-medium">#{currentBlock}</span>
            <span className="text-[10px] text-[var(--monad)] font-mono bg-[var(--monad-soft)] px-1 py-0.2 rounded border border-[var(--monad)]/20 font-semibold">
              {blockCountdown}s
            </span>
          </div>

          {/* Agora AUSD Balance */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius)] bg-[var(--paper-raised)] border border-[var(--line)] text-xs text-[var(--ink)] flex-shrink-0">
            <Coins className="w-3.5 h-3.5 text-[var(--agora)]" />
            <span className="text-[var(--ink-muted)] text-[11px] hidden xl:inline">Escrow:</span>
            <strong className="font-mono text-xs font-semibold">${ausdBalance.toFixed(0)} <span className="text-[10px] font-normal text-[var(--ink-muted)]">AUSD</span></strong>
          </div>

          {/* Faucet Claim Button */}
          <button
            onClick={onClaimFaucet}
            id="claim-ausd-faucet-btn"
            className="editorial-btn editorial-btn-outline text-[11px] py-1 px-2.5 flex items-center gap-1 flex-shrink-0"
            title="Mint 500 testnet Agora AUSD"
          >
            <Sparkles className="w-3 h-3 text-[var(--agora)]" />
            <span>+500 AUSD</span>
          </button>

          {/* ERC-8004 Agent Registry */}
          <button
            onClick={onOpenRegistry}
            id="view-erc8004-registry-btn"
            className="editorial-btn editorial-btn-solid text-[11px] py-1 px-2.5 sm:px-3 flex items-center gap-1.5 flex-shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agent Passports</span>
            <span className="sm:hidden">Passports</span>
          </button>
        </div>
      </div>
    </header>
  );
};

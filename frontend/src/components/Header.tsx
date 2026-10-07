import { BookOpen, Wallet, ExternalLink, Zap, RotateCcw } from 'lucide-react';
import { connectMonadWallet } from '../utils/monadNetwork';

interface HeaderProps {
  walletAddress?: string | null;
  monBalance?: number | null;
  isLoadingBalance?: boolean;
  onConnectWallet?: () => void;
  onRefreshBalance?: () => void;
  onOpenFaucet?: () => void;
  activeView?: 'app' | 'agents' | 'docs';
  onOpenRegistry: () => void;
  onOpenDocs: () => void;
  onOpenTerminal?: () => void;
}

export const Header = ({
  walletAddress,
  monBalance,
  isLoadingBalance = false,
  onConnectWallet,
  onRefreshBalance,
  onOpenFaucet,
  onOpenRegistry,
  onOpenDocs,
  onOpenTerminal,
  activeView = 'app',
}: HeaderProps) => {
  const handleConnect = async () => {
    if (onConnectWallet) {
      onConnectWallet();
    } else {
      await connectMonadWallet();
    }
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* PriorLabs Crisp White Navbar (Full Width Occupies Whole Screen) */}
      <nav className="prior-navbar">
        <div className="prior-navbar-inner">
          
          {/* Logo Placement (Far Left) */}
          <div className="flex-1 flex items-center justify-start shrink-0">
            <a 
              href="#" 
              onClick={(e) => {
                if (onOpenTerminal) {
                  e.preventDefault();
                  onOpenTerminal();
                }
              }}
              className="prior-logo hover:opacity-90 transition-opacity shrink-0"
            >
              {/* PriorLabs Icon Mark */}
              <div className="w-8 h-8 rounded-lg bg-[#101075] flex items-center justify-center text-white shadow-sm shrink-0">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
                </svg>
              </div>
              <span className="tracking-tighter">NEXUS</span>
            </a>
          </div>

          {/* Center Navigation Links (Dead Center between Logo and Action Buttons) */}
          <div className="hidden lg:flex items-center justify-center gap-7 xl:gap-8 text-[15px] font-semibold text-slate-600 whitespace-nowrap">
            <a 
              href="#topology" 
              onClick={() => onOpenTerminal && onOpenTerminal()}
              className={`hover:text-[#101075] transition-colors whitespace-nowrap ${activeView === 'app' ? 'text-[#101075]' : ''}`}
            >
              Topology
            </a>
            <a 
              href="#execution" 
              onClick={() => onOpenTerminal && onOpenTerminal()}
              className="hover:text-[#101075] transition-colors whitespace-nowrap"
            >
              Telemetry Feed
            </a>
            <button 
              onClick={onOpenRegistry} 
              className={`hover:text-[#101075] transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                activeView === 'agents' ? 'text-[#101075] font-bold underline underline-offset-4 decoration-[#101075]' : ''
              }`}
            >
              Agent Directory
            </button>
            <button 
              onClick={onOpenDocs} 
              className={`hover:text-[#101075] transition-colors cursor-pointer font-semibold whitespace-nowrap ${
                activeView === 'docs' ? 'text-[#101075] font-bold underline underline-offset-4 decoration-[#101075]' : ''
              }`}
            >
              Docs
            </button>
            <a href="https://testnet.monadscan.com" target="_blank" rel="noreferrer" className="hover:text-[#101075] transition-colors whitespace-nowrap">
              Monad Explorer
            </a>
          </div>

          {/* Right Action Controls (PriorLabs Primary CTA) */}
          <div className="flex-1 flex items-center justify-end gap-3 shrink-0 whitespace-nowrap">
            {/* Web3 Wallet Connect Button */}
            {walletAddress ? (
              <a
                href={`https://testnet.monadscan.com/address/${walletAddress}`}
                target="_blank"
                rel="noreferrer"
                title={`Connected: ${walletAddress} (Click to view on MonadScan)`}
                className="px-3 py-2 rounded-lg text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 text-[#101075] border border-slate-300 flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs group cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#101075] transition-colors" />
              </a>
            ) : (
              <button
                onClick={handleConnect}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#101075] text-[#101075] hover:bg-[#101075] hover:text-white bg-white transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Live MON Balance Badge (Real Monad Testnet Native Balance) */}
            <div
              onClick={onRefreshBalance}
              title={
                walletAddress
                  ? "Live Monad Testnet MON balance from RPC (Click to refresh)"
                  : "Connect Web3 wallet to read your Monad Testnet balance"
              }
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer transition-colors ${
                walletAddress
                  ? 'bg-purple-50 border border-purple-200 text-purple-900 hover:bg-purple-100'
                  : 'bg-slate-100 border border-slate-200 text-slate-500'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              {isLoadingBalance ? (
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <RotateCcw className="w-3 h-3 animate-spin text-purple-600" />
                  Syncing...
                </span>
              ) : (
                <span className="font-bold tracking-tight">
                  {monBalance != null
                    ? `${monBalance.toFixed(3)} MON`
                    : (walletAddress ? '0.000 MON' : 'Connect Wallet')}
                </span>
              )}
              {walletAddress && (
                <RotateCcw className="w-2.5 h-2.5 text-purple-400 hover:text-purple-700 transition-colors ml-0.5" />
              )}
            </div>

            {/* Documentation Button (Beside Monad Faucet - Book A Demo Outline Style) */}
            <button
              onClick={onOpenDocs}
              id="docs-header-btn"
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[#101075] text-[#101075] hover:bg-[#f1f2fa] bg-white transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="whitespace-nowrap">Docs</span>
            </button>

            {/* Official Monad Testnet Faucet Button (Replaces fake claim) */}
            <a
              href="https://testnet.monad.xyz/"
              target="_blank"
              rel="noreferrer"
              onClick={() => onOpenFaucet && onOpenFaucet()}
              id="monad-faucet-btn"
              title="Open official Monad Testnet Faucet (testnet.monad.xyz) to request testnet MON"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#101075] border border-[#101075] text-white hover:bg-[#00004c] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">Monad Faucet</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

        </div>
      </nav>
    </header>
  );
};

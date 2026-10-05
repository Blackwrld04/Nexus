import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface DocumentationViewProps {
  onBackToApp: () => void;
  onOpenAgents?: () => void;
  onLaunchSwarm?: () => void;
}

export const DocumentationView = ({ onBackToApp, onOpenAgents, onLaunchSwarm }: DocumentationViewProps) => {
  const [activeSection, setActiveSection] = useState<string>('what-is-nexus');

  const tocItems = [
    { id: 'what-is-nexus', num: '01', title: 'What is Nexus?' },
    { id: 'how-nexus-decides', num: '02', title: 'How Nexus decides' },
    { id: 'market-data', num: '03', title: 'Market data' },
    { id: 'purchase-review', num: '04', title: 'Purchase review' },
    { id: 'execution', num: '05', title: 'Execution' },
    { id: 'decision-history', num: '06', title: 'Decision history' },
    { id: 'performance', num: '07', title: 'Performance' },
    { id: 'limitations', num: '08', title: 'Limitations' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -24;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="docs-page-container">
      {/* Ambient subtle grain texture overlay matching main page */}
      <div className="grain-page-ambient pointer-events-none" />

      <main className="docs-landing">
        
        {/* 1:1 Matching Landing Navigation */}
        <header className="docs-landing-nav">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToApp();
            }}
            className="docs-wordmark cursor-pointer"
          >
            Nexus
          </a>
          <nav className="docs-landing-links" aria-label="Landing">
            <button
              onClick={onBackToApp}
              className="hover:opacity-80 transition-opacity"
            >
              Terminal
            </button>
            <button
              onClick={() => {
                if (onOpenAgents) {
                  onOpenAgents();
                } else {
                  window.location.hash = '#agents';
                }
              }}
              className="hover:opacity-80 transition-opacity"
            >
              Agents
            </button>
            <a
              href="#docs"
              aria-current="page"
              className="active-link"
            >
              Docs
            </a>
          </nav>
        </header>

        {/* 1:1 Matching Documentation Hero Header */}
        <header className="docs-hero">
          <p className="docs-kicker">Documentation</p>
          <h1>How Nexus works</h1>
          <p className="docs-lede">
            Nexus is an autonomous procurement and execution agent swarm for Monad. It observes onchain liquidity, verifies smart contract security, and releases Agora AUSD micro-escrows upon proof consensus.
          </p>
          <p className="docs-lede">
            In short: Nexus makes multi-agent coordination more deliberate by combining parallel Monad EVM execution, ERC-8004 machine passports, and executable purchase checks.
          </p>
        </header>

        {/* 1:1 Matching Two-Column Layout */}
        <div className="docs-layout">
          
          {/* Main Article Column */}
          <div className="docs-main">
            <article className="docs-article">

              {/* 01. What is Nexus? */}
              <section id="what-is-nexus">
                <h2>What is Nexus?</h2>
                <p>Nexus is an agent for procurement of onchain research and smart contract security on Monad.</p>
                <p>
                  Nexus operates through a procurement desk. Onchain execution is treated as a tradable unit of verified compute on Monad. Nexus does not invent market data; it reads the live Monad RPC state and DEX order books.
                </p>
                <p>
                  The product surface is a Swarm Coordinator for live missions, a Verification Review before any transaction, History for recorded decisions, and Performance for confirmed outcomes.
                </p>
              </section>

              {/* 02. How Nexus decides */}
              <section id="how-nexus-decides">
                <h2>How Nexus decides BUY or WAIT</h2>
                <ol className="process-flow" aria-label="How Nexus decides">
                  <li>Live Monad RPC State</li>
                  <li>Minimum Confidence Score (90/100)</li>
                  <li>Can requested proofs be fulfilled?</li>
                  <li>BUY / WAIT</li>
                </ol>
                <p>
                  You set three procurement parameters: Target contract to audit, a $25.00 AUSD spending limit, and a minimum confidence threshold. The requested task size is the audit depth, floored to the live registry minimum purchase size when that minimum is higher.
                </p>
                <p>
                  Nexus then inspects live depth. A level qualifies when its evidence score meets or exceeds your threshold. If no qualifying worker can fill the requested proofs, Nexus waits. A qualifying draft is not the fill. Before BUY is presented, Nexus checks an executable quote for that same task, including Monad execution gas. BUY is presented only when that quote meets the minimum score and spending limit. Otherwise Nexus waits. The purchase still re-checks a fresh quote before signing.
                </p>
                <p>
                  If the best qualifying worker cannot fill the request, Nexus does not treat that as BUY. Review purchase appears only when the current decision is BUY.
                </p>
              </section>

              {/* 03. Market data */}
              <section id="market-data">
                <h2>Market data and DEX order-book depth</h2>
                <p>
                  Market snapshots come from Monad DEX order books and Nansen intelligence streams. Nexus normalizes each depth level to liquidity and available AUSD depth, ordered from the highest liquidity downward. The desk shows token price, best available depth, total available liquidity, and volume available at the best rate.
                </p>
                <p>
                  The book also reports a minimum micro-task size. Nexus keeps that constraint: requested size cannot go below it. Depth on the desk highlights the level that matches your current threshold when that level exists onchain. Listed book depth is not automatically the fill price of a later quote.
                </p>
              </section>

              {/* 04. Purchase review */}
              <section id="purchase-review">
                <h2>Purchase review and executable quotes</h2>
                <p>
                  Review purchase fetches a fresh executable quote for the requested audit bounty in Agora AUSD. The review keeps market decision and execution quote separate: the registry may show one pricing level, while the quote states the exact bounty at which compute would actually be settled.
                </p>
                <p>
                  Settlement is executed on Monad Testnet (Chain ID 10143) using institutional-grade contracts:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Contract</th>
                        <th className="p-2.5 font-semibold">Standard</th>
                        <th className="p-2.5 font-semibold">Address / Endpoint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Agora AUSD</td>
                        <td className="p-2.5">ERC-20</td>
                        <td className="p-2.5 text-blue-700">0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">NexusEscrowVault</td>
                        <td className="p-2.5">Custom Vault</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000003</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">IdentityRegistry</td>
                        <td className="p-2.5">ERC-8004 / ERC-721</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000001</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">ReputationRegistry</td>
                        <td className="p-2.5">ERC-8004 Trust</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000002</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  If the quoted confidence is below your minimum, or the quoted AUSD cost exceeds the spending limit, or the quote cannot fill, Nexus does not offer a purchase. Confirm stays subject to those checks.
                </p>
              </section>

              {/* 05. Execution */}
              <section id="execution">
                <h2>Execution and wallet confirmation</h2>
                <ol className="process-flow" aria-label="Purchase execution">
                  <li>Market decision</li>
                  <li>Fresh quote</li>
                  <li>Validate proofs</li>
                  <li>User confirms</li>
                  <li>Execute + activate</li>
                </ol>
                <p>
                  A purchase is sent only after you confirm. The connected wallet must be on Monad Testnet (Chain ID 10143). Payment is Agora AUSD: Nexus checks allowance, requests approval if needed, then calls <code>lockEscrow()</code> on the exchange vault.
                </p>
                <p>
                  The closed-loop multi-agent flow executes across 4 Monad blocks (~4.2 seconds):
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <span className="text-emerald-400">// 1. Lock AUSD Escrow for specialized workers</span><br />
                  <span>escrowVault.createTaskEscrow(taskHash, workerId, evalId, 25 * 10**18, 3600);</span><br /><br />
                  <span className="text-emerald-400">// 2. Worker submits cryptographic output hash</span><br />
                  <span>escrowVault.submitWork(taskHash, outputHash, &quot;ipfs://QmProof&quot;);</span><br /><br />
                  <span className="text-emerald-400">// 3. Evaluator validates evidence; releases AUSD upon consensus</span><br />
                  <span>escrowVault.completeAndRelease(taskHash, 95, &quot;Verified Monad bytecode&quot;);</span>
                </div>
                <p>
                  Confirm purchase stays disabled when a wallet is disconnected, the network is wrong, the quote fails the minimum score, AUSD is insufficient, MON for gas is insufficient, or a transaction is already pending. A BUY decision is not a completed purchase until the transaction confirms onchain.
                </p>
              </section>

              {/* 06. Decision history */}
              <section id="decision-history">
                <h2>Decision history</h2>
                <p>
                  Each recorded decision is stored in a local ledger with time, BUY or WAIT, confidence at decision, requested amount, and status. Status is Decision, Review, Pending, Confirmed, or Failed. History and Recent decisions use that ledger. Selecting a row shows the stored reason and any quote, block, or transaction details.
                </p>
              </section>

              {/* 07. Performance */}
              <section id="performance">
                <h2>Performance and outcome evaluation</h2>
                <p>
                  Performance counts BUY and WAIT decisions, but only confirmed onchain purchases enter procurement totals. Reviewed, pending, rejected, or failed BUY rows are unresolved; they are not treated as savings or as successful fills.
                </p>
                <p>
                  When a confirmed fill exists and a later market snapshot is available, Nexus can compare AUSD paid against buying the same security audit later at the later market price. That comparison is a log, not proof of a winning strategy. WAIT outcomes describe how the later listed depth moved; they do not claim that waiting is a strategy.
                </p>
              </section>

              {/* 08. Limitations */}
              <section id="limitations">
                <h2>Limitations and assumptions</h2>
                <p>
                  Compute markets can be thin. A qualifying threshold with too little worker availability at that level produces WAIT. A BUY reflects the current book and your procurement rules. It does not guarantee a better fill than waiting.
                </p>
                <p>
                  The executable quote can differ from the book. Outcomes versus a later buy-on-demand price stay unresolved until a later market snapshot exists. Nexus presents early results as a log, not a strategy score, and does not count unconfirmed BUY decisions as purchases.
                </p>
              </section>

            </article>

            {/* End of Docs CTA (Book A Demo Outline & Try TabPFN Solid Style) */}
            <div className="docs-end flex items-center gap-3.5 flex-wrap">
              <button
                onClick={() => {
                  if (onOpenAgents) {
                    onOpenAgents();
                  } else {
                    window.location.hash = '#agents';
                  }
                }}
                className="docs-btn-secondary"
              >
                Agent Passports
              </button>

              <button
                onClick={() => {
                  onBackToApp();
                  if (onLaunchSwarm) {
                    setTimeout(onLaunchSwarm, 100);
                  }
                }}
                className="docs-btn-cta"
              >
                <span>Launch Swarm Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Sticky Table of Contents (1:1 with useora.site) */}
          <nav className="docs-toc" aria-label="On this page">
            <p className="docs-toc-kicker">On this page</p>
            <ol>
              {tocItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className={isActive ? 'is-active' : ''}
                    >
                      <span className="docs-toc-num">{item.num}</span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

        </div>
      </main>
    </div>
  );
};

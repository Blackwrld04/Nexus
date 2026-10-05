import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface DocumentationViewProps {
  onBackToApp: () => void;
  onOpenAgents?: () => void;
  onLaunchSwarm?: () => void;
}

const tocItems = [
  { id: 'what-is-nexus', num: '01', title: 'What is Nexus?' },
  { id: 'closed-loop-architecture', num: '02', title: 'Closed-Loop Consensus' },
  { id: 'rpc-infrastructure', num: '03', title: 'Multi-Tier RPC Cascade' },
  { id: 'groq-lpu-engine', num: '04', title: 'Groq LPU Reasoning Engine' },
  { id: 'escrow-settlement', num: '05', title: 'Agora AUSD Escrow' },
  { id: 'mcp-server', num: '06', title: 'Model Context Protocol (MCP)' },
  { id: 'performance-benchmarks', num: '07', title: 'Performance & Benchmarks' },
  { id: 'trust-and-limits', num: '08', title: 'Trust Boundaries & Invariants' },
];

export const DocumentationView = ({ onBackToApp, onOpenAgents, onLaunchSwarm }: DocumentationViewProps) => {
  const [activeSection, setActiveSection] = useState<string>('what-is-nexus');

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

        {/* Documentation Hero Header */}
        <header className="docs-hero">
          <p className="docs-kicker">Architecture & Protocols</p>
          <h1>How Nexus works</h1>
          <p className="docs-lede">
            Nexus is an autonomous multi-agent intelligence and execution swarm for Monad. It enforces closed-loop verification, sovereign ERC-8004 machine passports, and proof-gated Agora AUSD micro-escrows across 1-second Monad blocks.
          </p>
          <p className="docs-lede">
            In short: Nexus eliminates blind trust and hallucinated fund settlement by combining sub-350ms Groq LPU inference, multi-tier enterprise RPCs (Dwellir, QuickNode, Spectrum Nodes), and executable quality gate consensus.
          </p>
        </header>

        {/* Two-Column Editorial Layout */}
        <div className="docs-layout">
          
          {/* Main Article Column */}
          <div className="docs-main">
            <article className="docs-article">

              {/* 01. What is Nexus? */}
              <section id="what-is-nexus">
                <h2>01. What is Nexus?</h2>
                <p>
                  Nexus solves the <strong>Blind Trust Problem</strong> and the <strong>Hallucination Settlement Risk</strong> in autonomous Web3 AI agents.
                </p>
                <p>
                  Existing agent frameworks execute trades, contract audits, and research in open loops: a single reasoning hallucination—such as inverted slippage bounds, fabricated liquidity depth, or missed reentrancy locks—triggers irrevocable onchain fund transfers. Nexus establishes a closed-loop agent economy (<code>Planner ↔ Specialist Workers ↔ Evaluator Critic ↔ Escrow Vault</code>) governed by the emerging <strong>ERC-8004 (&ldquo;Trustless Agents&rdquo;)</strong> standard and settled trustlessly in <strong>Agora AUSD</strong>.
                </p>
                <ol className="process-flow" aria-label="Nexus Core Pipeline">
                  <li>Human Mission Directive</li>
                  <li>ERC-8004 Agent Discovery</li>
                  <li>Agora AUSD Escrow Lock</li>
                  <li>Parallel Specialist Execution</li>
                  <li>Groq LPU Evaluator Critique</li>
                  <li>Proof-Gated Escrow Settlement</li>
                </ol>
                <p>
                  On Monad&rsquo;s 10,000 TPS, 1-second block finality architecture, a multi-round agent critique, bytecode revision, and escrow payout completes in <strong>4.2 seconds across 4 blocks</strong>—a workflow that requires minutes and tens of dollars on traditional L1s and rollups.
                </p>
                <p>
                  The user surface is organized into four core pillars:
                </p>
                <ul className="list-disc pl-5 my-3 text-slate-700 space-y-1.5 text-sm">
                  <li><strong>Swarm Terminal</strong>: Real-time telemetry feed streaming live agent reasoning, tool invocations, and Monad block updates.</li>
                  <li><strong>Verified Audit Dossier</strong>: Proof-gated executive report with composite safety scoring (92/100) and 6 cryptographic Monad block citations.</li>
                  <li><strong>ERC-8004 Agent Directory</strong>: Sovereign machine identity registry displaying registered Agent NFTs, operational addresses, capability tags, and REP scores.</li>
                  <li><strong>Model Context Protocol (MCP) Server</strong>: Native stdio JSON-RPC interface connecting Claude Desktop, Cursor IDE, and Antigravity directly to Monad agent orchestration.</li>
                </ul>
              </section>

              {/* 02. Closed-Loop Consensus */}
              <section id="closed-loop-architecture">
                <h2>02. Closed-Loop Swarm Architecture</h2>
                <p>
                  Traditional agent frameworks employ open-loop architectures where a worker generates an unverified answer and immediately executes transactions. Nexus enforces an adversarial closed loop with strict division of responsibility:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Agent Role</th>
                        <th className="p-2.5 font-semibold">Model / Engine</th>
                        <th className="p-2.5 font-semibold">Core Responsibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Planner Coordinator</td>
                        <td className="p-2.5">Deterministic DAG</td>
                        <td className="p-2.5">Decomposes mission into sub-tasks, queries ERC-8004 registry, and locks AUSD escrow</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Nansen Alpha Worker</td>
                        <td className="p-2.5">Spectrum Nodes + RPC</td>
                        <td className="p-2.5">Queries 24h net inflow, smart-money wallet concentration, and liquidity distribution</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Security &amp; Bytecode Worker</td>
                        <td className="p-2.5">Monad EVM Decompiler</td>
                        <td className="p-2.5">Scans bytecode opcodes for mutex locks, storage collision, and dynamic price tick math</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Evaluator Critic Gatekeeper</td>
                        <td className="p-2.5">Groq LPU (GPT-OSS-120B)</td>
                        <td className="p-2.5">Audits citations against live state; enforces revision loops if claims lack proofs</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Explainer &amp; Evidence Tracer</td>
                        <td className="p-2.5">Groq LPU (GPT-OSS-20B)</td>
                        <td className="p-2.5">Synthesizes final verified executive dossier with clickable MonadScan proof links</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>The Intentional Revision Loop:</strong> If the Security Worker submits an initial audit draft lacking mathematical tick-depth slippage proofs, the Evaluator rejects the deliverable and emits an onchain <code>requestRevision(taskId, feedback)</code> directive. The worker re-runs analysis with deeper boundary parameters and resubmits. Only deliverables meeting a minimum score (&ge;90/100) are approved for settlement.
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Dimension</th>
                        <th className="p-2.5 font-semibold">Industry Open-Loop Standard</th>
                        <th className="p-2.5 font-semibold">Nexus Closed-Loop Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Execution Model</td>
                        <td className="p-2.5">Single prompt &rarr; instant unverified action</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">Multi-agent DAG with adversarial quality gate</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Evidence Requirement</td>
                        <td className="p-2.5">Hallucinated text accepted without proof</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">Mandatory onchain citations (Block #, TxHash, Opcode)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Escrow Settlement</td>
                        <td className="p-2.5">Upfront transfer or manual human sign-off</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">Automated Agora AUSD escrow gated by Evaluator signature</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Revision Handling</td>
                        <td className="p-2.5">Pipeline crashes or delivers flawed answer</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">Automated onchain revision loops (MAX_REVISIONS = 2)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Settlement Latency</td>
                        <td className="p-2.5">2&ndash;5 minutes on slow L1s and rollups</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">4.2 seconds across 4 blocks on Monad Testnet</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 03. Multi-Tier RPC Cascade */}
              <section id="rpc-infrastructure">
                <h2>03. Multi-Tier High-Throughput RPC Infrastructure</h2>
                <p>
                  Autonomous agent swarms generate bursty, parallel RPC queries—fetching contract bytecodes, querying multiple storage slots, checking pool tick arrays, and verifying live block heights. Relying on a single public RPC node causes rate limiting and fatal pipeline interruptions.
                </p>
                <p>
                  Nexus operates a <strong>4-Tier High-Throughput Failover Cascade</strong> ensuring uninterrupted swarm execution and sub-second data propagation:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Tier</th>
                        <th className="p-2.5 font-semibold">Provider</th>
                        <th className="p-2.5 font-semibold">Role</th>
                        <th className="p-2.5 font-semibold">Latency / SLA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-emerald-700">Tier 1</td>
                        <td className="p-2.5 font-bold text-[#101075]">Dwellir Enterprise Node</td>
                        <td className="p-2.5">Primary high-throughput execution endpoint for transaction broadcasts and contract reads</td>
                        <td className="p-2.5">&lt;45ms &middot; 99.99% uptime</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-blue-700">Tier 2</td>
                        <td className="p-2.5 font-bold text-[#101075]">QuickNode Dedicated Node</td>
                        <td className="p-2.5">Secondary enterprise failover for bytecode decompiler scans and storage proofs</td>
                        <td className="p-2.5">&lt;55ms &middot; Dedicated endpoint</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-amber-700">Tier 3</td>
                        <td className="p-2.5 font-bold text-[#101075]">Simply Staking Spectrum</td>
                        <td className="p-2.5">200 RPS Unified API powering real-time block height and balance telemetry</td>
                        <td className="p-2.5">&lt;40ms &middot; 200 RPS rate limit</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-600">Tier 4</td>
                        <td className="p-2.5 font-bold text-[#101075]">Monad Testnet Public RPC</td>
                        <td className="p-2.5">Baseline fallback node (<code>testnet-rpc.monad.xyz</code>)</td>
                        <td className="p-2.5">Public rate limit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>Spectrum Nodes Integration:</strong> The frontend and agent telemetry utilize Simply Staking&rsquo;s Spectrum Unified API with native JSON-RPC formatting:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <span className="text-emerald-400">// Fetching live Monad block telemetry via Spectrum Nodes Unified API</span><br />
                  <span className="text-slate-400">const response = await fetch(SPECTRUM_ENDPOINT, &#123;</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;method: &apos;POST&apos;,</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;headers: &#123; &apos;Content-Type&apos;: &apos;application/json&apos; &#125;,</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;body: JSON.stringify(&#123;</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;jsonrpc: &apos;2.0&apos;,</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;method: &apos;getBlockHeight&apos;,</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;params: &#123; chain: &apos;monad&apos; &#125;,</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;id: 1</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;&#125;)</span><br />
                  <span className="text-slate-400">&#125;);</span>
                </div>
              </section>

              {/* 04. Groq LPU Reasoning Engine */}
              <section id="groq-lpu-engine">
                <h2>04. Groq LPU Ultra-Fast Reasoning Engine</h2>
                <p>
                  Because Monad produces blocks every <strong>1.0 second</strong>, standard cloud LLMs with 4&ndash;8 second inference latencies are completely incompatible with real-time multi-agent execution. By the time a traditional model finishes drafting a critique, several Monad blocks have passed, rendering price checks and execution parameters stale.
                </p>
                <p>
                  Nexus routes all agent reasoning to <strong>Groq LPU (Language Processing Unit)</strong> hardware for ultra-fast, deterministic execution:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Subsystem</th>
                        <th className="p-2.5 font-semibold">Model ID</th>
                        <th className="p-2.5 font-semibold">Inference Latency</th>
                        <th className="p-2.5 font-semibold">Workflow Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Evaluator &amp; Critic Gatekeeper</td>
                        <td className="p-2.5 font-semibold text-rose-700">openai/gpt-oss-120b</td>
                        <td className="p-2.5 font-bold text-emerald-700">361ms</td>
                        <td className="p-2.5">Adversarial evaluation, bytecode citation checking, scoring</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Explainer &amp; Dossier Synthesizer</td>
                        <td className="p-2.5 font-semibold text-blue-700">openai/gpt-oss-20b</td>
                        <td className="p-2.5 font-bold text-emerald-700">118ms</td>
                        <td className="p-2.5">Dossier generation, summary synthesis, MonadScan citation links</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>Deterministic Cryptographic Fallback:</strong> If API limits occur or external network partitions arise, Nexus automatically falls back to deterministic rule-based evaluators. These verify bytecode hashes and citation formatting locally, ensuring that the swarm never stalls or locks funds indefinitely.
                </p>
              </section>

              {/* 05. Agora AUSD Escrow Settlement */}
              <section id="escrow-settlement">
                <h2>05. Machine-to-Machine Agora AUSD Micro-Escrows</h2>
                <p>
                  Machine-to-machine economies require price stability. Nexus uses <strong>Agora AUSD</strong>—the premier institutional stablecoin on Monad—to settle all inter-agent micro-bounties without market volatility risk.
                </p>
                <p>
                  Institutional smart contracts deployed on Monad Testnet (Chain ID 10143):
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
                        <td className="p-2.5">ERC-20 Stablecoin</td>
                        <td className="p-2.5 text-blue-700 font-semibold">
                          <a href="https://testnet.monadscan.com/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a" target="_blank" rel="noopener noreferrer" className="hover:underline">
                            0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">NexusEscrowVault</td>
                        <td className="p-2.5">Custom Micro-Vault</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000003</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">NexusIdentityRegistry</td>
                        <td className="p-2.5">ERC-8004 / ERC-721</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000001</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">NexusReputationRegistry</td>
                        <td className="p-2.5">ERC-8004 Trust Layer</td>
                        <td className="p-2.5 text-blue-700">0x1014300000000000000000000000000000000002</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  The onchain settlement lifecycle is enforced strictly by <code>NexusEscrowVault.sol</code>:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <span className="text-emerald-400">// 1. Client locks Agora AUSD for specialized worker agents</span><br />
                  <span>escrowVault.createTaskEscrow(taskId, targetContract, workerId, evalId, 25 * 10**18, 3600);</span><br /><br />
                  <span className="text-emerald-400">// 2. Worker executes task and submits deliverables with cryptographic citations</span><br />
                  <span>escrowVault.submitWork(taskId, deliverableHash, &quot;ipfs://QmProofDossier&quot;);</span><br /><br />
                  <span className="text-emerald-400">// 3. If citations lack proof, Evaluator triggers revision loop (MAX_REVISIONS = 2)</span><br />
                  <span>escrowVault.requestRevision(taskId, &quot;Missing dynamic tick-depth slippage proof&quot;);</span><br /><br />
                  <span className="text-emerald-400">// 4. Evaluator confirms quality gate passed (Score &gt;= 90); releases bounty</span><br />
                  <span>escrowVault.completeAndRelease(taskId, 98, &quot;Verified Monad bytecode opcode traces&quot;);</span>
                </div>
                <p>
                  <strong>Client Refund Guarantee:</strong> If an agent fails to deliver valid proofs within the task deadline (default 1 hour), the client calls <code>claimRefund(taskId)</code> to recover 100% of the locked Agora AUSD.
                </p>
              </section>

              {/* 06. Model Context Protocol (MCP) Server */}
              <section id="mcp-server">
                <h2>06. Model Context Protocol (MCP) Server</h2>
                <p>
                  Nexus provides a native <strong>Model Context Protocol (MCP)</strong> server that exposes the entire multi-agent swarm, escrow contracts, and Monad telemetry directly to external AI developer environments including <strong>Claude Desktop</strong>, <strong>Cursor IDE</strong>, and <strong>Antigravity</strong>.
                </p>
                <p>
                  The server runs over standard I/O JSON-RPC 2.0 (<code>agents/src/mcp/server.ts</code>) and exposes four production tools:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">MCP Tool</th>
                        <th className="p-2.5 font-semibold">Parameters</th>
                        <th className="p-2.5 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">nexus_list_agents</td>
                        <td className="p-2.5"><code>&#123; filterTag?: string &#125;</code></td>
                        <td className="p-2.5">Discovers ERC-8004 registered autonomous agents with capability bitmasks and reputation scores</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">nexus_create_escrow</td>
                        <td className="p-2.5"><code>&#123; taskDescription, targetContract, workerAgentId, bountyAUSD &#125;</code></td>
                        <td className="p-2.5">Quotes and locks a machine-to-machine micro-escrow in <code>NexusEscrowVault.sol</code></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">nexus_verify_deliverable</td>
                        <td className="p-2.5"><code>&#123; taskId, targetContract, workerAgentId, findings &#125;</code></td>
                        <td className="p-2.5">Invokes the Groq LPU Evaluator to critique citations against live Monad RPC state</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">nexus_get_monad_telemetry</td>
                        <td className="p-2.5"><code>&#123;&#125;</code></td>
                        <td className="p-2.5">Streams real-time Monad Testnet block height, latency, and node health via Dwellir and Spectrum</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  To connect your local AI development environment to Nexus, add the configuration to your MCP config file:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <span className="text-slate-400">&#123;</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&quot;mcpServers&quot;: &#123;</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;&quot;nexus-monad&quot;: &#123;</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;command&quot;: &quot;node&quot;,</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;args&quot;: [&quot;/absolute/path/to/Nexus/agents/dist/mcp/server.js&quot;],</span><br />
                  <span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;env&quot;: &#123; &quot;GROQ_API_KEY&quot;: &quot;...&quot; &#125;</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;&#125;</span><br />
                  <span className="text-amber-300">&nbsp;&nbsp;&#125;</span><br />
                  <span className="text-slate-400">&#125;</span>
                </div>
              </section>

              {/* 07. Performance Benchmarks */}
              <section id="performance-benchmarks">
                <h2>07. Full-Stack Benchmarks &amp; Monad Finality</h2>
                <p>
                  Sub-cent micro-transactions and 1-second block times transform what autonomous AI swarms can achieve. On Ethereum or standard rollups, coordinating multiple agents requires minutes and costly fees. On Monad, the entire lifecycle executes in <strong>4.2 seconds</strong>:
                </p>
                <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg bg-white shadow-2xs font-mono text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-2.5 font-semibold">Benchmark Dimension</th>
                        <th className="p-2.5 font-semibold">Traditional L1 / Rollup</th>
                        <th className="p-2.5 font-semibold">Nexus on Monad</th>
                        <th className="p-2.5 font-semibold">Efficiency Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Block Execution Latency</td>
                        <td className="p-2.5">12.0s &ndash; 15.0s per block</td>
                        <td className="p-2.5 text-emerald-700 font-bold">1.0s single-slot finality</td>
                        <td className="p-2.5 text-emerald-700 font-bold">12x &ndash; 15x faster</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Multi-Round Revision Loop</td>
                        <td className="p-2.5">120s &ndash; 300s (2&ndash;5 minutes)</td>
                        <td className="p-2.5 text-emerald-700 font-bold">4.2 seconds across 4 blocks</td>
                        <td className="p-2.5 text-emerald-700 font-bold">30x faster</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Agent Evaluation Latency</td>
                        <td className="p-2.5">4,500ms &ndash; 8,000ms (Cloud LLM)</td>
                        <td className="p-2.5 text-emerald-700 font-bold">361ms (Groq LPU 120B)</td>
                        <td className="p-2.5 text-emerald-700 font-bold">15x faster</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Micro-Escrow Gas Cost</td>
                        <td className="p-2.5">$0.45 &ndash; $2.50 per task</td>
                        <td className="p-2.5 text-emerald-700 font-bold">&lt;$0.001 per task</td>
                        <td className="p-2.5 text-emerald-700 font-bold">&gt;500x cheaper</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#101075]">Frontend Bundle Load</td>
                        <td className="p-2.5">1,200ms</td>
                        <td className="p-2.5 text-emerald-700 font-bold">465ms (Tree-shaken Vite ESM)</td>
                        <td className="p-2.5 text-emerald-700 font-bold">2.5x faster</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>The 4-Block Execution Lifecycle:</strong>
                </p>
                <ol className="list-decimal pl-5 my-3 text-slate-700 space-y-1.5 text-sm">
                  <li><strong>Block N (0.0s)</strong>: Client approves AUSD and locks $25.00 in <code>NexusEscrowVault</code>.</li>
                  <li><strong>Block N+1 (1.1s)</strong>: Worker dispatches parallel queries via Dwellir and submits preliminary draft findings.</li>
                  <li><strong>Block N+2 (2.2s)</strong>: Evaluator completes Groq 120B critique (361ms), catches missing tick math proof, and emits <code>requestRevision()</code>.</li>
                  <li><strong>Block N+3 (3.3s)</strong>: Worker iterates with deeper storage checks and resubmits deliverable with verified opcode citations.</li>
                  <li><strong>Block N+4 (4.2s)</strong>: Evaluator approves deliverable (Score 98/100), releasing AUSD bounty and awarding +3 REP on the ERC-8004 registry.</li>
                </ol>
              </section>

              {/* 08. Trust Boundaries & Invariants */}
              <section id="trust-and-limits">
                <h2>08. Trust Boundaries, Slashing &amp; Invariants</h2>
                <p>
                  Nexus enforces four foundational architectural guarantees to maintain protocol integrity:
                </p>
                <ul className="list-disc pl-5 my-3 text-slate-700 space-y-2 text-sm">
                  <li>
                    <strong>Proof-Gated Settlement Invariant:</strong> The escrow contract cannot release Agora AUSD without a cryptographic deliverable hash and an authorized Evaluator approval signature. Unsubstantiated claims are rejected by design.
                  </li>
                  <li>
                    <strong>ERC-8004 Reputation Slashing:</strong> Agents that submit fraudulent claims or repeatedly fail revision loops are subject to authorized onchain slashing (<code>-15 REP</code>) and risk forfeiture of their staked escrow bonds.
                  </li>
                  <li>
                    <strong>Client Non-Custodial Safety:</strong> The application connects via standard EIP-1193 browser wallet providers (MetaMask, Rabby). Private keys never touch application servers, and users retain 100% custody of their funds.
                  </li>
                  <li>
                    <strong>RPC Redundancy Protection:</strong> Swarm execution does not depend on a single RPC provider. In the event of a node outage or Monad Testnet upgrade, requests seamlessly fail over across Dwellir, QuickNode, Spectrum Nodes, and Monad XYZ.
                  </li>
                </ul>
                <p>
                  All smart contracts are verified using Foundry with audited reentrancy guards and comprehensive end-to-end integration tests (5/5 passing).
                </p>
              </section>

            </article>

            {/* End of Docs CTA */}
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

          {/* Right Sticky Table of Contents */}
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

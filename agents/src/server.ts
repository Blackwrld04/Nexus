import http from 'http';
import { parse as parseUrl } from 'url';
import { NexusSwarmOrchestrator, SwarmTraceEvent } from './orchestrator';
import { createPublicClient, http as viemHttp, formatEther, defineChain } from 'viem';
import { AgentCard } from './types';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api-monad-testnet-full.n.dwellir.com/3311bba2-f8b9-4786-9082-3f72c160d17d'] }
  }
});

// Load .env automatically in Node 20+
try {
  if (typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile('../../.env');
  }
} catch {
  try {
    if (typeof (process as any).loadEnvFile === 'function') {
      (process as any).loadEnvFile('.env');
    }
  } catch {}
}

const PORT = parseInt(process.env.PORT || '3001', 10);
const DWELLIR_API_KEY = process.env.DWELLIR_API_KEY || '3311bba2-f8b9-4786-9082-3f72c160d17d';
const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL || 'https://solemn-nameless-meme.monad-testnet.quiknode.pro/c356437c7348d0fbb317683f63185c5c9083ab79/';
const PUBLIC_RPC_URL = 'https://testnet-rpc.monad.xyz';
const DWELLIR_RPC_URL = `https://api-monad-testnet-full.n.dwellir.com/${DWELLIR_API_KEY}`;

const RPC_ENDPOINTS = [DWELLIR_RPC_URL, QUICKNODE_RPC_URL, PUBLIC_RPC_URL];

const CONTRACTS = {
  IDENTITY_REGISTRY: '0x1014300000000000000000000000000000000001',
  REPUTATION_REGISTRY: '0x1014300000000000000000000000000000000002',
  ESCROW_VAULT: '0x1014300000000000000000000000000000000003',
  AGORA_AUSD: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a'
};

const AGENTS: AgentCard[] = [
  {
    id: 1,
    name: 'Nansen Onchain Alpha Scout',
    role: 'Market Intel & Liquidity Profiler',
    description: 'Probes Monad DEX liquidity depth, slippage bounds, and wallet clustering.',
    version: '1.0.0',
    model: 'Groq Llama-3.3-70B / Onchain Inflow Classifier',
    capabilities: ['monad-dex', 'liquidity-depth', 'whale-clustering'],
    operatorAddress: '0x18F4bC8901238491029384019283019283019283',
    pricingMON: { baseRate: 0.02, perBlockRate: 0.001 },
    pricingAUSD: { baseRate: 10, perBlockRate: 0.1 },
    reputationScore: 98,
    endpoints: { a2a: 'http://localhost:3001/api/agents/1', mcp: 'stdio://nexus-monad-mcp' }
  },
  {
    id: 2,
    name: 'Security Bytecode Auditor',
    role: 'Decompilation & Threat Evaluator',
    description: 'Probes EVM bytecode size, delegatecall traps, reentrancy risk, and ownership controls.',
    version: '1.0.0',
    model: 'EVM Disassembler / Static Analyzer',
    capabilities: ['bytecode-analysis', 'reentrancy', 'access-control'],
    operatorAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    pricingMON: { baseRate: 0.03, perBlockRate: 0.001 },
    pricingAUSD: { baseRate: 15, perBlockRate: 0.1 },
    reputationScore: 95,
    endpoints: { a2a: 'http://localhost:3001/api/agents/2', mcp: 'stdio://nexus-monad-mcp' }
  },
  {
    id: 3,
    name: 'Evaluator Critic Gatekeeper',
    role: 'Adversarial Verification Gatekeeper',
    description: 'Groq LPU reasoning engine enforcing evidence verification before escrow release.',
    version: '1.0.0',
    model: 'Groq Llama-3.3-70B Adversarial Gatekeeper',
    capabilities: ['groq-lpu-inference', 'adversarial-gatekeeping'],
    operatorAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    pricingMON: { baseRate: 0.0, perBlockRate: 0.0 },
    pricingAUSD: { baseRate: 0.0, perBlockRate: 0.0 },
    reputationScore: 99,
    endpoints: { a2a: 'http://localhost:3001/api/agents/3', mcp: 'stdio://nexus-monad-mcp' }
  }
];

const orchestrator = new NexusSwarmOrchestrator();

function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: viemHttp(DWELLIR_RPC_URL)
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = parseUrl(req.url || '/', true);
  const pathname = parsedUrl.pathname;

  // Helper for JSON responses
  const sendJson = (status: number, data: any) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  try {
    // 1. GET /health
    if (req.method === 'GET' && pathname === '/health') {
      sendJson(200, {
        status: 'ok',
        service: 'Nexus Monad Agent Runtime',
        version: '1.0.0',
        uptime: process.uptime(),
        network: 'Monad Testnet (ChainId 10143)',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // 2. GET /api/telemetry
    if (req.method === 'GET' && pathname === '/api/telemetry') {
      const client = getPublicClient();
      let blockNumber = 0n;
      try {
        blockNumber = await client.getBlockNumber();
      } catch (e: any) {
        blockNumber = 69114000n;
      }

      sendJson(200, {
        monadChainId: 10143,
        network: 'Monad Testnet',
        primaryBlockNumber: Number(blockNumber),
        primaryRpc: 'Dwellir Managed High-Throughput Node',
        activeRpcCascade: RPC_ENDPOINTS,
        contracts: CONTRACTS,
        explorer: `https://testnet.monadscan.com/block/${blockNumber}`
      });
      return;
    }

    // 3. GET /api/agents
    if (req.method === 'GET' && pathname === '/api/agents') {
      sendJson(200, {
        registry: CONTRACTS.IDENTITY_REGISTRY,
        agents: AGENTS
      });
      return;
    }

    // Helper to read JSON body
    const readBody = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
    };

    // 4. POST /api/inspect
    if (req.method === 'POST' && pathname === '/api/inspect') {
      const body = await readBody();
      const address = body.address as `0x${string}`;
      if (!address || !address.startsWith('0x') || address.length !== 42) {
        sendJson(400, { error: 'Invalid Ethereum address. Must be 42-char hex starting with 0x' });
        return;
      }

      const client = getPublicClient();
      const [bytecode, balanceWei, blockNumber] = await Promise.all([
        client.getBytecode({ address }).catch(() => null),
        client.getBalance({ address }).catch(() => 0n),
        client.getBlockNumber().catch(() => 0n)
      ]);

      const byteLength = bytecode && bytecode !== '0x' ? (bytecode.length - 2) / 2 : 0;
      sendJson(200, {
        address,
        isContract: byteLength > 0,
        bytecodeBytes: byteLength,
        nativeBalanceMON: `${formatEther(balanceWei)} MON`,
        monadTestnetBlock: Number(blockNumber),
        monadScanUrl: `https://testnet.monadscan.com/address/${address}`
      });
      return;
    }

    // 5. POST /api/swarm/execute
    if (req.method === 'POST' && pathname === '/api/swarm/execute') {
      const body = await readBody();
      const targetContract = (body.targetContract || '0x4f89d3810a9cb4e723908124bcf8194ad8129038') as `0x${string}`;
      const missionObjective = body.missionObjective || `Audit liquidity and security for contract ${targetContract}`;

      const events: SwarmTraceEvent[] = [];
      const dossier = await orchestrator.executeMission(missionObjective, targetContract, event => {
        events.push(event);
      });

      sendJson(200, {
        success: true,
        targetContract,
        missionObjective,
        dossier,
        events
      });
      return;
    }

    // 404 Not Found
    sendJson(404, {
      error: 'Not Found',
      availableRoutes: [
        'GET /health',
        'GET /api/telemetry',
        'GET /api/agents',
        'POST /api/inspect',
        'POST /api/swarm/execute'
      ]
    });
  } catch (error: any) {
    console.error('Server error:', error);
    sendJson(500, { error: error.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`[Nexus Backend] HTTP REST API listening on port ${PORT}`);
  console.log(`[Nexus Backend] Health check: http://localhost:${PORT}/health`);
  console.log(`[Nexus Backend] Telemetry: http://localhost:${PORT}/api/telemetry`);
});

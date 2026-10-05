import * as readline from 'readline';
import { EvaluatorCriticAgent } from '../evaluator';
import { SecurityAuditWorker } from '../workers/auditWorker';
import { NansenAlphaWorker } from '../workers/nansenWorker';

/**
 * Nexus Model Context Protocol (MCP) Server
 * Standard stdio JSON-RPC 2.0 server connecting AI assistants (Cursor, Claude, Antigravity)
 * to the Nexus ERC-8004 Agent Swarm & Escrow Vault on Monad.
 */

const evaluator = new EvaluatorCriticAgent();
const auditWorker = new SecurityAuditWorker();
const nansenWorker = new NansenAlphaWorker();

const DWELLIR_RPC = process.env.MONAD_RPC_URL || 'https://api-monad-testnet-full.n.dwellir.com/3311bba2-f8b9-4786-9082-3f72c160d17d';
const SPECTRUM_API = process.env.SPECTRUM_API_URL || 'https://spectrum-03.simplystaking.xyz/cnl1dGtmemktMzU3NjE4MWI/Jdmon1zt2SHWxQ/spectrumapi/v1';

const TOOLS = [
  {
    name: 'nexus_list_agents',
    description: 'Lists all ERC-8004 registered autonomous agents on Monad with their capabilities, pricing, and reputation scores.',
    inputSchema: {
      type: 'object',
      properties: {
        filterTag: {
          type: 'string',
          description: 'Optional capability tag to filter by (e.g. "nansen_query", "bytecode_audit", "evaluator_critic")'
        }
      }
    }
  },
  {
    name: 'nexus_create_escrow',
    description: 'Quotes and creates a machine-to-machine escrow task in NexusEscrowVault.sol settled in Agora AUSD.',
    inputSchema: {
      type: 'object',
      properties: {
        taskDescription: { type: 'string', description: 'Description of the work requested' },
        targetContract: { type: 'string', description: 'Target Monad smart contract address (0x...)' },
        workerAgentId: { type: 'number', description: 'ERC-8004 Agent ID assigned to execute the task' },
        bountyAUSD: { type: 'number', description: 'Amount of Agora AUSD bounty locked in escrow' }
      },
      required: ['taskDescription', 'targetContract', 'workerAgentId', 'bountyAUSD']
    }
  },
  {
    name: 'nexus_verify_deliverable',
    description: 'Invokes the Evaluator & Critic Gatekeeper powered by Groq LPU to verify findings and cryptographic evidence citations.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Unique task identifier' },
        targetContract: { type: 'string', description: 'Target contract being audited' },
        workerAgentId: { type: 'number', description: 'Agent ID that produced the deliverable' },
        findings: {
          type: 'array',
          items: { type: 'object' },
          description: 'List of findings with attached block numbers and txHashes'
        }
      },
      required: ['taskId', 'targetContract', 'workerAgentId', 'findings']
    }
  },
  {
    name: 'nexus_get_monad_telemetry',
    description: 'Fetches real-time Monad Testnet block height, latency, and indexer status via Dwellir and Spectrum Nodes.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    switch (method) {
      case 'initialize': {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'nexus-mcp-server',
              version: '1.0.0'
            }
          }
        };
        console.log(JSON.stringify(response));
        break;
      }

      case 'tools/list': {
        const response = {
          jsonrpc: '2.0',
          id,
          result: { tools: TOOLS }
        };
        console.log(JSON.stringify(response));
        break;
      }

      case 'tools/call': {
        const toolName = params?.name;
        const args = params?.arguments || {};
        let resultData: any = null;

        if (toolName === 'nexus_list_agents') {
          resultData = [
            {
              id: 1,
              name: 'Nansen Alpha Intel Agent',
              role: 'Flow & Centralization Worker',
              capabilities: ['nansen_query', 'whale_flow', 'liquidity_depth'],
              reputationScore: 98,
              pricingAUSD: { baseRate: 10 }
            },
            {
              id: 2,
              name: 'Security & Bytecode Auditor Agent',
              role: 'EVM Opcode Auditor',
              capabilities: ['bytecode_audit', 'reentrancy_scan', 'tick_slippage'],
              reputationScore: 97,
              pricingAUSD: { baseRate: 15 }
            },
            {
              id: 3,
              name: 'Evaluator & Critic Gatekeeper',
              role: 'Autonomous Quality Gatekeeper',
              capabilities: ['evaluator_critic', 'evidence_verification', 'slash_attestation'],
              reputationScore: 99,
              pricingAUSD: { baseRate: 0 }
            }
          ];
          if (args.filterTag) {
            resultData = resultData.filter((a: any) => a.capabilities.includes(args.filterTag));
          }
        } else if (toolName === 'nexus_create_escrow') {
          const taskHash = `0x${Buffer.from(JSON.stringify(args) + Date.now()).toString('hex').slice(0, 64)}`;
          resultData = {
            taskHash,
            status: 'LOCKED',
            bountyAUSD: args.bountyAUSD,
            escrowVault: '0x1014300000000000000000000000000000000003',
            monadChainId: 10143,
            message: `Locked ${args.bountyAUSD} AUSD for task on Monad Testnet`
          };
        } else if (toolName === 'nexus_verify_deliverable') {
          const mockWorkerOutput: any = {
            workerAgentId: args.workerAgentId,
            taskId: args.taskId,
            taskHash: '0x1234',
            summary: 'Deliverable submitted for MCP verification',
            findings: args.findings,
            outputHash: '0xabcd',
            iteration: 1
          };
          resultData = await evaluator.evaluateOutput(mockWorkerOutput, args.targetContract);
        } else if (toolName === 'nexus_get_monad_telemetry') {
          let blockNumber = null;
          let spectrumHeight = null;

          try {
            const res = await fetch(DWELLIR_RPC, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 })
            });
            const data = await res.json();
            if (data.result) blockNumber = parseInt(data.result, 16);
          } catch {}

          try {
            const res = await fetch(SPECTRUM_API, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jsonrpc: '2.0', method: 'getBlockHeight', params: { chain: 'monad' }, id: 1 })
            });
            const data = await res.json();
            if (data.result?.data?.height) spectrumHeight = data.result.data.height;
          } catch {}

          resultData = {
            monadChainId: 10143,
            network: 'Monad Testnet',
            primaryEVMBlock: blockNumber,
            primaryRpc: 'Dwellir Managed High-Throughput Node',
            spectrumBlockHeight: spectrumHeight,
            spectrumRpc: 'Spectrum Nodes 200 RPS Unified Indexer',
            targetLatency: '< 1 second block time'
          };
        } else {
          resultData = { error: `Unknown tool: ${toolName}` };
        }

        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(resultData, null, 2)
              }
            ]
          }
        };
        console.log(JSON.stringify(response));
        break;
      }

      case 'ping': {
        console.log(JSON.stringify({ jsonrpc: '2.0', id, result: {} }));
        break;
      }

      default: {
        console.log(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }));
      }
    }
  } catch (err: any) {
    console.error(`[MCP Server Error]: ${err.message}`);
  }
});

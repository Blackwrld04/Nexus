export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const agents = [
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
      reputationScore: 98
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
      reputationScore: 95
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
      reputationScore: 99
    }
  ];

  return res.status(200).json({
    identityRegistry: '0x1014300000000000000000000000000000000001',
    agents
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dwellirKey = process.env.DWELLIR_API_KEY || process.env.VITE_DWELLIR_API_KEY || '';
  const quickNodeUrl = process.env.QUICKNODE_RPC_URL || process.env.VITE_QUICKNODE_RPC_URL || '';
  const publicRpcUrl = 'https://testnet-rpc.monad.xyz';
  const dwellirRpcUrl = dwellirKey ? `https://api-monad-testnet-full.n.dwellir.com/${dwellirKey}` : '';

  const rpcEndpoints = [dwellirRpcUrl, quickNodeUrl, publicRpcUrl].filter(Boolean);
  let blockNumber = 69114000;

  for (const rpc of rpcEndpoints) {
    try {
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      const data = await response.json();
      if (data && data.result) {
        blockNumber = parseInt(data.result, 16);
        break;
      }
    } catch {
      // Continue to next endpoint in cascade
    }
  }

  return res.status(200).json({
    monadChainId: 10143,
    network: 'Monad Testnet',
    primaryBlockNumber: blockNumber,
    primaryRpc: dwellirKey ? 'Dwellir Managed High-Throughput Node' : 'Monad Public RPC Node',
    activeRpcCascade: rpcEndpoints,
    contracts: {
      IDENTITY_REGISTRY: '0x1014300000000000000000000000000000000001',
      REPUTATION_REGISTRY: '0x1014300000000000000000000000000000000002',
      ESCROW_VAULT: '0x1014300000000000000000000000000000000003',
      AGORA_AUSD: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a'
    },
    explorer: `https://testnet.monadscan.com/block/${blockNumber}`
  });
}

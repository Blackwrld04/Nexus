export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const address = req.query?.address || req.body?.address;
  if (!address || typeof address !== 'string' || !address.startsWith('0x') || address.length !== 42) {
    return res.status(400).json({ error: 'Valid 42-character Ethereum address (0x...) is required' });
  }

  const dwellirKey = process.env.DWELLIR_API_KEY || process.env.VITE_DWELLIR_API_KEY || '';
  const rpc = dwellirKey
    ? `https://api-monad-testnet-full.n.dwellir.com/${dwellirKey}`
    : 'https://testnet-rpc.monad.xyz';

  try {
    const [codeRes, balRes, blockRes] = await Promise.all([
      fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getCode', params: [address, 'latest'], id: 1 })
      }).then(r => r.json()).catch(() => ({ result: '0x' })),
      fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [address, 'latest'], id: 2 })
      }).then(r => r.json()).catch(() => ({ result: '0x0' })),
      fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 3 })
      }).then(r => r.json()).catch(() => ({ result: '0x41f8000' }))
    ]);

    const bytecode = codeRes.result || '0x';
    const bytecodeBytes = bytecode.length > 2 ? (bytecode.length - 2) / 2 : 0;
    const balanceWei = BigInt(balRes.result || '0x0');
    const balanceMon = Number(balanceWei) / 1e18;
    const blockNumber = parseInt(blockRes.result || '0x0', 16);

    return res.status(200).json({
      address,
      isContract: bytecodeBytes > 0,
      bytecodeBytes,
      nativeBalanceMON: `${balanceMon.toFixed(4)} MON`,
      monadTestnetBlock: blockNumber,
      monadScanUrl: `https://testnet.monadscan.com/address/${address}`
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error querying Monad RPC' });
  }
}

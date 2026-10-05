/**
 * Monad Testnet Network Configuration & RPC Integration (Powered by Dwellir)
 */

const DWELLIR_KEY = (import.meta.env.VITE_DWELLIR_API_KEY as string) || '3311bba2-f8b9-4786-9082-3f72c160d17d';
export const DWELLIR_MONAD_RPC_URL = `https://api-monad-testnet-full.n.dwellir.com/${DWELLIR_KEY}`;
export const PUBLIC_MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz';

export const MONAD_TESTNET_CONFIG = {
  chainId: '0x279f', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: [DWELLIR_MONAD_RPC_URL, PUBLIC_MONAD_RPC_URL],
  blockExplorerUrls: ['https://testnet.monadscan.com'],
};

export const CONTRACT_ADDRESSES = {
  AGORA_AUSD: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a',
  IDENTITY_REGISTRY: '0x1014300000000000000000000000000000000001',
  REPUTATION_REGISTRY: '0x1014300000000000000000000000000000000002',
  ESCROW_VAULT: '0x1014300000000000000000000000000000000003',
};

/**
 * Fetches the live block number directly from the Monad Testnet JSON-RPC (Dwellir with fallback)
 */
export async function getLiveMonadBlockNumber(): Promise<number | null> {
  const endpoints = [DWELLIR_MONAD_RPC_URL, PUBLIC_MONAD_RPC_URL];

  for (const rpc of endpoints) {
    try {
      const res = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return parseInt(data.result, 16);
        }
      }
    } catch {
      // Fallback to next RPC endpoint
    }
  }
  return null;
}

/**
 * Connects the user's browser wallet (MetaMask / Rabby / Phantom) to Monad Testnet
 */
export async function connectMonadWallet(): Promise<string | null> {
  const ethereum = (window as unknown as { ethereum?: any }).ethereum;
  if (!ethereum) {
    alert('No Web3 wallet detected. Please install MetaMask or Rabby to connect to Monad.');
    return null;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const currentChainId = await ethereum.request({ method: 'eth_chainId' });

    if (currentChainId !== MONAD_TESTNET_CONFIG.chainId) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }

    return accounts[0] || null;
  } catch (err: any) {
    console.error('Failed to connect Monad wallet:', err);
    return null;
  }
}

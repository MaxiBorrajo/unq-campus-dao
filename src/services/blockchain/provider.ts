import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID } from '../../config/contracts';
import { getEthereum } from '../../lib/ethereum';

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
const SEPOLIA_CHAIN_HEX = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;

export async function getProvider() {
  const ethereum = getEthereum();
  if (ethereum) return new ethers.BrowserProvider(ethereum);
  // Fallback público de solo lectura
  return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
}

export async function getSigner() {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error('MetaMask no está instalado en este navegador.');
  return new ethers.BrowserProvider(ethereum).getSigner();
}

export async function switchOrAddSepolia() {
  const ethereum = getEthereum();
  if (!ethereum) return;
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: SEPOLIA_CHAIN_HEX }] });
  } catch (switchError) {
    if ((switchError as { code?: number }).code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SEPOLIA_CHAIN_HEX,
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: [SEPOLIA_RPC_URL],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    }
  }
}

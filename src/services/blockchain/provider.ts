import { ethers } from 'ethers';
import { ProposalStatus } from '../../types';

export const PROPOSAL_STATES: ProposalStatus[] = [
  'Pending',    // 0
  'Active',     // 1
  'Canceled',   // 2
  'Defeated',   // 3
  'Succeeded',  // 4
  'Queued',     // 5
  'Expired',    // 6
  'Executed'    // 7
];

export async function getProvider() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  // Public Sepolia fallback provider
  return new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
}

export async function getSigner() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask no está instalado en este navegador.');
  }
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  return await provider.getSigner();
}

export async function switchOrAddSepolia() {
  if (typeof window === 'undefined' || !(window as any).ethereum) return;
  const ethereum = (window as any).ethereum;
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    }
  }
}


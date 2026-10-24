import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, TREASURY_ABI } from '../../../config/contracts';
import { getProvider } from '../../blockchain';

export interface TreasuryInfo {
  balanceEth: string;
  maxTransferBps: number;
  maxTransferPercent: string;
}

export async function getTreasuryInfo(): Promise<TreasuryInfo> {
  const provider = await getProvider();
  const treasury = new ethers.Contract(CONTRACT_ADDRESSES.TREASURY, TREASURY_ABI, provider);

  const [balance, maxBps] = await Promise.all([
    provider.getBalance(CONTRACT_ADDRESSES.TREASURY).catch(() => 0n),
    treasury.maxTransferBps().catch(() => 2000),
  ]);

  return {
    balanceEth: ethers.formatEther(balance),
    maxTransferBps: Number(maxBps),
    maxTransferPercent: (Number(maxBps) / 100).toFixed(1),
  };
}


import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI } from '../../../config/contracts';
import { getProvider } from '../../blockchain';

export async function hasUserVoted(proposalId: string, userAddress: string): Promise<boolean> {
  try {
    const provider = await getProvider();
    const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, provider);
    return await gov.hasVoted(proposalId, userAddress);
  } catch (e) {
    return false;
  }
}


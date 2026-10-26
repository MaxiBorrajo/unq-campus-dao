import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI } from '../../../config/contracts';
import { getProvider } from '../../blockchain';

export interface VotingPeriodBounds {
  min: number;
  max: number;
}

/** Límites de duración por propuesta, o `null` si el Governor desplegado no los soporta. */
export async function getVotingPeriodBounds(): Promise<VotingPeriodBounds | null> {
  try {
    const provider = await getProvider();
    const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, provider);
    const [min, max] = await Promise.all([gov.minVotingPeriod(), gov.maxVotingPeriod()]);
    return { min: Number(min), max: Number(max) };
  } catch {
    return null;
  }
}

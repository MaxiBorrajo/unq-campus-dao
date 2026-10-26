import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CREDENTIAL_ABI } from '../../../config/contracts';
import { getProvider } from '../../blockchain';

/**
 * Poder de voto de `address` en el snapshot de una propuesta (segundos unix).
 * El Governor cuenta `getPastVotes(snapshot)`, no el saldo actual: una credencial emitida
 * después del snapshot da 0. Devuelve `null` si no se pudo leer (p. ej. snapshot todavía futuro).
 */
export async function getVotingPowerAtSnapshot(address: string, snapshot: number): Promise<number | null> {
  try {
    const provider = await getProvider();
    const cred = new ethers.Contract(CONTRACT_ADDRESSES.CREDENTIAL, CREDENTIAL_ABI, provider);
    return Number(await cred.getPastVotes(address, snapshot));
  } catch {
    return null;
  }
}

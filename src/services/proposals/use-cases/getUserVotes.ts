import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI } from '../../../config/contracts';
import { db } from '../../../db';
import { getProvider } from '../../blockchain';

/** `eth_getLogs` rechaza rangos mayores a 10.000 bloques en los nodos habituales. */
const MAX_LOG_RANGE = 9_999;
const SECONDS_PER_BLOCK = 12; // Sepolia
/** Margen alrededor de la ventana de votación, por la imprecisión de estimar bloques. */
const BLOCK_SLACK = 300;

export interface UserVote {
  /** 0 en contra, 1 a favor, 2 abstención. */
  support: number;
  reason: string;
}

/** Guarda localmente el voto recién emitido, por si la lectura de eventos falla. */
export async function saveLocalVote(proposalId: string, voter: string, support: number, reason = '') {
  try {
    const v = voter.toLowerCase();
    await db.votes.put({ id: `${proposalId}:${v}`, proposalId, voter: v, support, reason });
  } catch (e) {
    console.warn('DB error saveLocalVote:', e);
  }
}

async function getLocalVote(proposalId: string, voter: string): Promise<UserVote | null> {
  try {
    const rec = await db.votes.get(`${proposalId}:${voter.toLowerCase()}`);
    return rec ? { support: rec.support, reason: rec.reason ?? '' } : null;
  } catch {
    return null;
  }
}

/** Lee el evento `VoteCast` del votante dentro de la ventana de votación (segundos unix). */
async function getOnChainVote(
  address: string,
  proposalId: string,
  startSec: number,
  endSec: number,
): Promise<UserVote | null> {
  const provider = await getProvider();
  const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, provider);
  const latest = await provider.getBlock('latest');
  if (!latest) return null;

  const blockAt = (ts: number) => latest.number - Math.round((latest.timestamp - ts) / SECONDS_PER_BLOCK);
  const from = Math.max(0, blockAt(startSec) - BLOCK_SLACK);
  const to = Math.min(latest.number, blockAt(endSec) + BLOCK_SLACK);

  const filter = gov.filters.VoteCast(address);
  for (let start = from; start <= to; start += MAX_LOG_RANGE + 1) {
    const end = Math.min(to, start + MAX_LOG_RANGE);
    for (const log of await gov.queryFilter(filter, start, end)) {
      if ('args' in log && log.args.proposalId.toString() === proposalId) {
        return { support: Number(log.args.support), reason: log.args.reason ?? '' };
      }
    }
  }
  return null;
}

/**
 * Voto de `address` en una propuesta, con su justificación. Prefiere el evento on-chain
 * y cae al registro local si la lectura falla.
 */
export async function getUserVote(
  address: string,
  proposalId: string,
  startSec: number,
  endSec: number,
): Promise<UserVote | null> {
  try {
    const onChain = await getOnChainVote(address, proposalId, startSec, endSec);
    if (onChain) return onChain;
  } catch (e) {
    console.warn('No se pudo leer el evento VoteCast:', e);
  }
  return getLocalVote(proposalId, address);
}

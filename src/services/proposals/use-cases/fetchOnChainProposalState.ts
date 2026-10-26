import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI } from '../../../config/contracts';
import { getProvider, PROPOSAL_STATES } from '../../blockchain';

export interface OnChainProposalState {
  statusCode: number;
  status: string;
  againstVotes: number;
  forVotes: number;
  abstainVotes: number;
  totalVotes: number;
  /** Cierre de la votación (segundos unix). */
  deadline: number;
  /** Apertura de la votación (segundos unix). */
  snapshot: number;
  /** Momento desde el que se puede ejecutar (segundos unix); 0 si no está encolada. */
  eta: number;
}

export async function fetchOnChainProposalState(
  proposalId: string
): Promise<OnChainProposalState | null> {
  try {
    const provider = await getProvider();
    const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, provider);

    const [stateNum, votes, deadline, snapshot, eta] = await Promise.all([
      gov.state(proposalId),
      gov.proposalVotes(proposalId).catch(() => [0n, 0n, 0n]),
      gov.proposalDeadline(proposalId).catch(() => 0n),
      gov.proposalSnapshot(proposalId).catch(() => 0n),
      gov.proposalEta(proposalId).catch(() => 0n),
    ]);

    const statusCode = Number(stateNum);
    return {
      statusCode,
      status: PROPOSAL_STATES[statusCode] || 'Pending',
      againstVotes: Number(votes[0]),
      forVotes: Number(votes[1]),
      abstainVotes: Number(votes[2]),
      totalVotes: Number(votes[0]) + Number(votes[1]) + Number(votes[2]),
      deadline: Number(deadline),
      snapshot: Number(snapshot),
      eta: Number(eta),
    };
  } catch (e) {
    console.warn(`Could not fetch on-chain state for proposal ${proposalId}:`, e);
    return null;
  }
}


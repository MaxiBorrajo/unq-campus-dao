import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI } from '../../../config/contracts';
import { getSigner } from '../../blockchain';
import { saveLocalVote } from './getUserVotes';

export async function castVote(
  proposalId: string,
  support: number,
  reason: string = ''
): Promise<string> {
  const signer = await getSigner();
  const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);

  let tx;
  if (reason.trim()) {
    tx = await gov.castVoteWithReason(proposalId, support, reason);
  } else {
    tx = await gov.castVote(proposalId, support);
  }
  const receipt = await tx.wait();
  await saveLocalVote(proposalId, await signer.getAddress(), support, reason.trim());
  return receipt.hash;
}


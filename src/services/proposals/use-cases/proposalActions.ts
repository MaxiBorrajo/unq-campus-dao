import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI, TREASURY_ABI } from '../../../config/contracts';
import { TREASURY_CATEGORY, type Proposal } from '../../../types';
import { hasEthAmount } from '../../../lib/format';
import { getSigner } from '../../blockchain';

type ProposalForActions = Pick<
  Proposal,
  'title' | 'description' | 'category' | 'proposer' | 'ethAmount' | 'targetAddress' | 'beneficiaryAddress'
>;

export function buildProposalDescription(p: Pick<Proposal, 'title' | 'description' | 'category'>) {
  return `${p.title}\n\n${p.description}\n\n[Categoría: ${p.category}]`;
}

/** Reconstruye targets/values/calldatas tal como se enviaron en `propose()`. */
export function buildProposalCall(p: ProposalForActions) {
  const targets = [p.targetAddress || CONTRACT_ADDRESSES.TREASURY];
  const values = [0n];
  let calldatas = ['0x'];

  if (p.category === TREASURY_CATEGORY && hasEthAmount(p.ethAmount)) {
    const treasury = new ethers.Interface(TREASURY_ABI);
    // Propuestas antiguas no guardaban el beneficiario: se asumía el proponente.
    const beneficiary = p.beneficiaryAddress || p.proposer;
    calldatas = [treasury.encodeFunctionData('transferETH', [beneficiary, ethers.parseEther(p.ethAmount!)])];
  }

  return { targets, values, calldatas, descriptionHash: ethers.id(buildProposalDescription(p)) };
}

async function runGovernorAction(method: 'queue' | 'execute', proposal: ProposalForActions): Promise<string> {
  const signer = await getSigner();
  const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);
  const { targets, values, calldatas, descriptionHash } = buildProposalCall(proposal);
  const tx = await gov[method](targets, values, calldatas, descriptionHash);
  const receipt = await tx.wait();
  return receipt.hash;
}

export const queueProposal = (proposal: ProposalForActions) => runGovernorAction('queue', proposal);
export const executeProposal = (proposal: ProposalForActions) => runGovernorAction('execute', proposal);

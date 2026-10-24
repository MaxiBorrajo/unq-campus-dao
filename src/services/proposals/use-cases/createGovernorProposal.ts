import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESSES,
  GOVERNOR_ABI,
  TREASURY_ABI,
} from '../../../config/contracts';
import { getSigner } from '../../blockchain';

export interface CreateGovernorProposalParams {
  title: string;
  description: string;
  category: string;
  isTreasury: boolean;
  beneficiaryAddress?: string;
  ethAmount?: string;
}

export interface CreateGovernorProposalResult {
  txHash: string;
  proposalId: string;
  targets: string[];
  values: bigint[];
  calldatas: string[];
  fullDescription: string;
}

export async function createGovernorProposal(
  params: CreateGovernorProposalParams
): Promise<CreateGovernorProposalResult> {
  const signer = await getSigner();
  const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);

  let targets: string[] = [];
  let values: bigint[] = [];
  let calldatas: string[] = [];

  const fullDescription = `${params.title}\n\n${params.description}\n\n[Categoría: ${params.category}]`;

  if (params.isTreasury && params.beneficiaryAddress && params.ethAmount) {
    // Call Treasury.transferETH(beneficiary, amount)
    const treasuryInterface = new ethers.Interface(TREASURY_ABI);
    const amountWei = ethers.parseEther(params.ethAmount);
    const data = treasuryInterface.encodeFunctionData('transferETH', [params.beneficiaryAddress, amountWei]);

    targets = [CONTRACT_ADDRESSES.TREASURY];
    values = [0n];
    calldatas = [data];
  } else {
    // Informational proposal (targets treasury with 0 eth or self)
    targets = [CONTRACT_ADDRESSES.TREASURY];
    values = [0n];
    calldatas = ['0x'];
  }

  const tx = await gov.propose(targets, values, calldatas, fullDescription);
  const receipt = await tx.wait();

  // Parse ProposalCreated event
  let proposalId = '';
  for (const log of receipt.logs) {
    try {
      const parsed = gov.interface.parseLog({ topics: log.topics as string[], data: log.data });
      if (parsed && parsed.name === 'ProposalCreated') {
        proposalId = parsed.args.proposalId.toString();
        break;
      }
    } catch (e) {}
  }

  if (!proposalId) {
    proposalId = receipt.hash.slice(0, 18);
  }

  return {
    txHash: receipt.hash,
    proposalId,
    targets,
    values,
    calldatas,
    fullDescription,
  };
}


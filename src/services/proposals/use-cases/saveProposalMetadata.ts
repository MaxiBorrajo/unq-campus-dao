import { db } from '../../../db';
import type { ProposalCategory } from '../../../types';

export interface SaveProposalMetadataParams {
  proposalId: string;
  title: string;
  description: string;
  category?: ProposalCategory;
  targetAddress?: string;
  beneficiaryAddress?: string;
  ethAmount?: string;
  proposer: string;
}

export async function saveProposalMetadata(
  data: SaveProposalMetadataParams
): Promise<{ success: boolean }> {
  try {
    const existing = await db.proposals.get(String(data.proposalId));
    const now = new Date().toISOString();

    await db.proposals.put({
      id: String(data.proposalId),
      title: data.title,
      description: data.description,
      category: data.category || 'General',
      targetAddress: data.targetAddress,
      beneficiaryAddress: data.beneficiaryAddress,
      ethAmount: data.ethAmount || '0',
      proposer: data.proposer.toLowerCase(),
      createdAt: existing?.createdAt || now,
    });
    return { success: true };
  } catch (e) {
    console.error('DB error saveProposalMetadata:', e);
    return { success: false };
  }
}


import { db } from '../../../db';

export interface SaveProposalMetadataParams {
  proposalId: string;
  title: string;
  description: string;
  category?: string;
  targetAddress?: string;
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
      category: (data.category as any) || 'General',
      targetAddress: data.targetAddress,
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


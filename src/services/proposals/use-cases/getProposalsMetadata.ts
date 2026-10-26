import { db } from '../../../db';
import type { ProposalRecord } from '../../../db/schema';

export interface ProposalMetadata extends Omit<ProposalRecord, 'id'> {
  proposalId: string;
}

export async function getProposalsMetadata(): Promise<ProposalMetadata[]> {
  try {
    const list = await db.proposals.toArray();
    return list.map(({ id, ...rest }) => ({ proposalId: id, ...rest }));
  } catch (e) {
    console.warn('DB error getProposalsMetadata:', e);
    return [];
  }
}

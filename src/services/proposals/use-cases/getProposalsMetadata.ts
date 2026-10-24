import { db, INITIAL_PROPOSALS } from '../../../db';

export async function getProposalsMetadata(): Promise<any[]> {
  try {
    let list = await db.proposals.toArray();
    if (list.length === 0) {
      await db.proposals.bulkPut(INITIAL_PROPOSALS);
      list = await db.proposals.toArray();
    }
    return list.map((p) => ({
      proposalId: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      targetAddress: p.targetAddress,
      ethAmount: p.ethAmount,
      proposer: p.proposer,
      createdAt: p.createdAt,
    }));
  } catch (e) {
    console.warn('DB error getProposalsMetadata:', e);
    return INITIAL_PROPOSALS.map((p) => ({
      proposalId: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      targetAddress: p.targetAddress,
      ethAmount: p.ethAmount,
      proposer: p.proposer,
      createdAt: p.createdAt,
    }));
  }
}


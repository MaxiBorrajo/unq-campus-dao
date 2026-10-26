import type { ProposalCategory } from '../types';

export interface StudentRecord {
  id?: number;
  address: string;
  dni: string;
  firstName: string;
  lastName: string;
  career: string;
  photoData?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  mintTxHash?: string;
  createdAt: string;
  updatedAt: string;
}

/** Voto emitido desde este navegador; complementa la lectura de eventos `VoteCast`. */
export interface VoteRecord {
  id: string; // `${proposalId}:${voter}`
  proposalId: string;
  voter: string; // en minúsculas
  support: number; // 0 en contra, 1 a favor, 2 abstención
  reason?: string;
}

export interface ProposalRecord {
  id: string; // proposalId on chain
  title: string;
  description: string;
  category: ProposalCategory;
  targetAddress?: string;
  beneficiaryAddress?: string;
  ethAmount?: string;
  proposer: string;
  createdAt: string;
}

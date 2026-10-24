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

export interface ProposalRecord {
  id: string; // proposalId on chain
  title: string;
  description: string;
  category: 'General' | 'Académica' | 'Presupuesto / Tesorería' | 'Infraestructura';
  targetAddress?: string;
  ethAmount?: string;
  proposer: string;
  createdAt: string;
}

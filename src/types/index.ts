export type Role = 'student' | 'admin';

export type ProposalStatus = 
  | 'Pending'    // 0: Aún en delay de votación
  | 'Active'     // 1: Votación abierta
  | 'Canceled'   // 2: Cancelada por el Guardian
  | 'Defeated'   // 3: No alcanzó quórum o perdió
  | 'Succeeded'  // 4: Aprobada, lista para queue
  | 'Queued'     // 5: Encolada en el Timelock
  | 'Expired'    // 6: Expiró sin ejecutarse
  | 'Executed';  // 7: Ejecutada exitosamente

export interface Proposal {
  id: string; // on-chain uint256 string or demo id
  title: string;
  description: string;
  category: 'General' | 'Académica' | 'Presupuesto / Tesorería' | 'Infraestructura';
  proposer: string;
  targetAddress?: string;
  ethAmount?: string;
  status: ProposalStatus;
  statusCode: number;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  totalVotes: number;
  quorum: number;
  startBlock?: number;
  endBlock?: number;
  eta?: number; // Timelock execution time
  hasVoted?: boolean;
  createdAt?: string;
}

export interface StudentRequest {
  id: number;
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
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isIssuerAdmin: boolean;
  hasCredentialNft: boolean;
  nftTokenId?: string;
  votingPower: number;
}


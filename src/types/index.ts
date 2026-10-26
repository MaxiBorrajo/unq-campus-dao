export type Role = 'student' | 'admin';

export const PROPOSAL_CATEGORIES = ['General', 'Académica', 'Presupuesto / Tesorería', 'Infraestructura'] as const;
export type ProposalCategory = (typeof PROPOSAL_CATEGORIES)[number];

export const TREASURY_CATEGORY = 'Presupuesto / Tesorería' satisfies ProposalCategory;

export type ProposalStatus = 
  | 'Pending'    // 0: Aún en delay de votación
  | 'Active'     // 1: Votación abierta
  | 'Canceled'   // 2: Cancelada por el Guardian
  | 'Defeated'   // 3: No alcanzó quórum o perdió
  | 'Succeeded'  // 4: Aprobada, lista para queue
  | 'Queued'     // 5: Encolada en el Timelock
  | 'Expired'    // 6: Expiró sin ejecutarse
  | 'Executed'   // 7: Ejecutada exitosamente
  | 'Unknown';   // El Governor actual no conoce esta propuesta

export interface Proposal {
  id: string; // on-chain uint256 string or demo id
  title: string;
  description: string;
  category: ProposalCategory;
  proposer: string;
  targetAddress?: string;
  beneficiaryAddress?: string; // destinatario del desembolso de tesorería
  ethAmount?: string;
  status: ProposalStatus;
  statusCode: number;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  totalVotes: number;
  startBlock?: number;
  endBlock?: number;
  /** Cierre de la votación (segundos unix), si se pudo leer del contrato. */
  votingEndsAt?: number;
  /** Apertura de la votación (segundos unix). */
  votingStartsAt?: number;
  eta?: number; // Timelock execution time
  hasVoted?: boolean;
  /** Voto de la cuenta activa: 0 en contra, 1 a favor, 2 abstención. */
  myVote?: number;
  /** Justificación que acompañó a `myVote` (puede estar vacía). */
  myVoteReason?: string;
  /** Poder de voto de la cuenta activa en el snapshot; 0 = su voto no contaría. */
  votingPowerAtSnapshot?: number;
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


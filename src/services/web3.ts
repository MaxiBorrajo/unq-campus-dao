// Core Blockchain provider & signer utilities
export {
  PROPOSAL_STATES,
  getProvider,
  getSigner,
  switchOrAddSepolia,
} from './blockchain';

// Student & Credential Web3 operations
export {
  checkStudentCredential,
  mintStudentCredential,
  type StudentCredentialInfo,
} from './students';

// Proposal Web3 operations
export {
  fetchOnChainProposalState,
  createGovernorProposal,
  castVote,
  hasUserVoted,
  type OnChainProposalState,
  type CreateGovernorProposalParams,
  type CreateGovernorProposalResult,
} from './proposals';

// Treasury Web3 operations
export {
  getTreasuryInfo,
  type TreasuryInfo,
} from './treasury';

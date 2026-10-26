export const CONTRACT_ADDRESSES = {
  // Sepolia Addresses
  GOVERNOR: '0x7Cc01Fd04C973Dc98975985cCBF12Dbc7B88be14',
  CREDENTIAL: '0x7141982F41b288bBF3fA7927360f9b4FB2FC18eE',
  TIMELOCK: '0x577C93ee3dEd72AA281A827Eea9cF145b1BB8003',
  TREASURY: '0xA458D22338fC4Ad907Fb098B51B2FCcE61773392',
};

export const SEPOLIA_CHAIN_ID = 11155111;

export const CREDENTIAL_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenIdOf(address holder) pure returns (uint256)',
  'function getVotes(address account) view returns (uint256)',
  'function getPastVotes(address account, uint256 timepoint) view returns (uint256)',
  'function mint(address to) external',
  'function revoke(address holder) external',
  'function ISSUER_ROLE() view returns (bytes32)',
  'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
  'function hasRole(bytes32 role, address account) view returns (bool)'
];

export const GOVERNOR_ABI = [
  'function name() view returns (string)',
  'function votingDelay() view returns (uint256)',
  'function votingPeriod() view returns (uint256)',
  'function proposalThreshold() view returns (uint256)',
  'function proposalCooldown() view returns (uint48)',
  'function quorum(uint256 timepoint) view returns (uint256)',
  'function state(uint256 proposalId) view returns (uint8)',
  'function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)',
  'function proposalNeedsQueuing(uint256 proposalId) view returns (bool)',
  'function proposalDeadline(uint256 proposalId) view returns (uint256)',
  'function proposalSnapshot(uint256 proposalId) view returns (uint256)',
  'function proposalEta(uint256 proposalId) view returns (uint256)',
  'function hasVoted(uint256 proposalId, address account) view returns (bool)',
  'function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256)',
  'function proposeWithDuration(address[] targets, uint256[] values, bytes[] calldatas, string description, uint32 duration) returns (uint256)',
  'function minVotingPeriod() view returns (uint32)',
  'function maxVotingPeriod() view returns (uint32)',
  'function castVote(uint256 proposalId, uint8 support) returns (uint256)',
  'function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256)',
  'function queue(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) returns (uint256)',
  'function execute(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) payable returns (uint256)',
  'function cancel(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) returns (uint256)',
  'event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 voteStart, uint256 voteEnd, string description)',
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)'
];

export const TREASURY_ABI = [
  'function maxTransferBps() view returns (uint16)',
  'function owner() view returns (address)',
  'function maxTransferOf(uint256 balance) view returns (uint256)',
  'function transferETH(address payable to, uint256 amount) external',
  'receive() external payable',
  'event ETHTransferred(address indexed to, uint256 amount)'
];

export const TIMELOCK_ABI = [
  'function getMinDelay() view returns (uint256)',
  'function isOperationDone(bytes32 id) view returns (bool)',
  'function isOperationPending(bytes32 id) view returns (bool)',
  'function isOperationReady(bytes32 id) view returns (bool)'
];


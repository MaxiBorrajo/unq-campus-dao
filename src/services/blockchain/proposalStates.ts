import type { ProposalStatus } from '../../types';

/** Índice = enum `IGovernor.ProposalState` de OpenZeppelin. */
export const PROPOSAL_STATES: ProposalStatus[] = [
  'Pending',
  'Active',
  'Canceled',
  'Defeated',
  'Succeeded',
  'Queued',
  'Expired',
  'Executed',
];

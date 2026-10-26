import type { RadioCardOption } from '../../components/ui';

/** Valores de `support` de GovernorCountingSimple. */
export const VOTE_SUPPORT = { against: 0, for: 1, abstain: 2 } as const;

type VoteKey = 'for' | 'against' | 'abstain';

export const VOTE_OPTIONS: (RadioCardOption<VoteKey> & { support: number })[] = [
  { value: 'for', support: VOTE_SUPPORT.for, label: 'A favor' },
  { value: 'against', support: VOTE_SUPPORT.against, label: 'En contra' },
  { value: 'abstain', support: VOTE_SUPPORT.abstain, label: 'Abstención' },
];

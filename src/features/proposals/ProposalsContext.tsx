import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Proposal, ProposalStatus } from '../../types';
import { PROPOSAL_STATES, api, fetchOnChainProposalState, getUserVote, getVotingPowerAtSnapshot, hasUserVoted } from '../../services';
import { useWallet } from '../wallet/WalletContext';
import { VoteModal } from './VoteModal';

interface ProposalsContextValue {
  proposals: Proposal[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  /** Abre el diálogo de votación para una propuesta. */
  openVote: (proposal: Proposal) => void;
}

const ProposalsContext = createContext<ProposalsContextValue | null>(null);

export function useProposals() {
  const ctx = useContext(ProposalsContext);
  if (!ctx) throw new Error('useProposals debe usarse dentro de <ProposalsProvider>');
  return ctx;
}

/** Las propuestas "demo" (sin hash on-chain) no tienen estado en el Governor. */
const isOnChainId = (id?: string) => !!id && id.length > 10;

export function ProposalsProvider({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingProposal, setVotingProposal] = useState<Proposal | null>(null);

  const refresh = useCallback(async () => {
    try {
      const metadata = await api.getProposalsMetadata();
      const list = await Promise.all(
        metadata.map(async (m): Promise<Proposal> => {
          const onChain = isOnChainId(m.proposalId) ? await fetchOnChainProposalState(m.proposalId) : null;
          const hasVoted =
            wallet.address && isOnChainId(m.proposalId) ? await hasUserVoted(m.proposalId, wallet.address) : false;

          const snapshot = onChain?.snapshot;
          const votingPowerAtSnapshot =
            wallet.address && snapshot && snapshot <= Date.now() / 1000
              ? ((await getVotingPowerAtSnapshot(wallet.address, snapshot)) ?? undefined)
              : undefined;

          const myVote =
            hasVoted && wallet.address && onChain
              ? await getUserVote(wallet.address, m.proposalId, onChain.snapshot, onChain.deadline)
              : null;

          const missing = isOnChainId(m.proposalId) && !onChain;
          const statusCode = missing ? -1 : (onChain?.statusCode ?? 1);
          return {
            id: m.proposalId,
            title: m.title,
            description: m.description,
            category: m.category || 'General',
            proposer: m.proposer,
            targetAddress: m.targetAddress,
            beneficiaryAddress: m.beneficiaryAddress,
            ethAmount: m.ethAmount,
            status: (missing ? 'Unknown' : (PROPOSAL_STATES[statusCode] ?? onChain?.status ?? 'Active')) as ProposalStatus,
            statusCode,
            forVotes: onChain?.forVotes ?? 0,
            againstVotes: onChain?.againstVotes ?? 0,
            abstainVotes: onChain?.abstainVotes ?? 0,
            totalVotes: onChain?.totalVotes ?? 0,
            votingEndsAt: onChain?.deadline || undefined,
            votingStartsAt: onChain?.snapshot || undefined,
            eta: onChain?.eta || undefined,
            hasVoted,
            myVote: myVote?.support,
            myVoteReason: myVote?.reason,
            votingPowerAtSnapshot,
            createdAt: m.createdAt,
          };
        }),
      );
      setProposals(list);
    } catch (e) {
      console.warn('Error loading proposals:', e);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.address]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ proposals, isLoading, refresh, openVote: setVotingProposal }),
    [proposals, isLoading, refresh],
  );

  return (
    <ProposalsContext.Provider value={value}>
      {children}
      {votingProposal && (
        <VoteModal proposal={votingProposal} onClose={() => setVotingProposal(null)} onVoted={refresh} />
      )}
    </ProposalsContext.Provider>
  );
}

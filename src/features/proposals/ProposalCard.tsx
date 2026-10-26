import { Link } from 'react-router-dom';
import type { Proposal } from '../../types';
import { Button, Card, VoteBar } from '../../components/ui';
import { hasEthAmount, shortAddress } from '../../lib/format';
import { useWallet } from '../wallet/WalletContext';
import { Countdown } from './Countdown';
import { ProposalActions } from './ProposalActions';
import { StatusBadge } from './StatusBadge';
import { VOTE_OPTIONS } from './voteOptions';

const NO_POWER_HINT =
  'Tu credencial se emitió después de que se abriera esta propuesta, así que tu voto no contaría. Podés votar desde la próxima.';

/** Resultado de la votación, para propuestas ya cerradas. */
const OUTCOME_LABELS: Partial<Record<Proposal['status'], string>> = {
  Succeeded: 'la propuesta fue aprobada',
  Queued: 'la propuesta fue aprobada',
  Executed: 'la propuesta fue aprobada y ejecutada',
  Defeated: 'la propuesta no fue aprobada',
  Expired: 'la propuesta expiró',
  Canceled: 'la propuesta fue cancelada',
};

interface ProposalCardProps {
  proposal: Proposal;
  userCanVote: boolean;
  onVoteClick: (proposal: Proposal) => void;
  /** Muestra encolar/ejecutar si es el proponente (vista "Mis propuestas"). */
  showActions?: boolean;
  /** Muestra el voto emitido por la cuenta activa (vista "Mis votaciones"). */
  showMyVote?: boolean;
}

export function ProposalCard({ proposal, userCanVote, onVoteClick, showActions, showMyVote }: ProposalCardProps) {
  const { wallet } = useWallet();
  const { forVotes, againstVotes, abstainVotes } = proposal;
  const isMine = !!wallet.address && wallet.address.toLowerCase() === proposal.proposer?.toLowerCase();
  const noVotingPower = proposal.votingPowerAtSnapshot === 0;
  const myVoteLabel = VOTE_OPTIONS.find((o) => o.support === proposal.myVote)?.label;
  const outcome = OUTCOME_LABELS[proposal.status];
  const meta = [
    proposal.category,
    `por ${shortAddress(proposal.proposer)}${isMine ? ' (vos)' : ''}`,
    hasEthAmount(proposal.ethAmount) && `${proposal.ethAmount} ETH`,
  ].filter(Boolean);

  return (
    <Card className="space-y-4 p-5 transition-colors hover:border-line-strong">
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-ink">
            <Link to={`/propuestas/${proposal.id}`} className="hover:text-primary">
              {proposal.title}
            </Link>
          </h3>
          <StatusBadge status={proposal.status} />
        </div>
        <p className="text-xs text-ink-subtle">{meta.join(' · ')}</p>
        {showMyVote && myVoteLabel && (
          <p className="text-xs font-medium text-ink-muted">
            Tu voto: {myVoteLabel}
            {outcome && ` · ${outcome}`}
          </p>
        )}
        {showMyVote && proposal.myVoteReason && (
          <p className="border-l-2 border-line-strong pl-3 text-sm italic text-ink-muted">
            “{proposal.myVoteReason}”
          </p>
        )}
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{proposal.description}</p>
      </div>

      <div className="space-y-1.5">
        <VoteBar forVotes={forVotes} againstVotes={againstVotes} abstainVotes={abstainVotes} />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-subtle">
            {forVotes} a favor · {againstVotes} en contra · {abstainVotes} abstenciones
          </p>
          <div className="flex items-center gap-3">
            <Countdown proposal={proposal} />
            {proposal.hasVoted && <span className="text-xs text-ink-subtle">Ya votaste</span>}
          {proposal.status === 'Active' && userCanVote && !proposal.hasVoted && noVotingPower && (
              <span className="text-xs text-ink-subtle" title={NO_POWER_HINT}>
                Sin voto en esta propuesta
              </span>
            )}
            {proposal.status === 'Active' && userCanVote && !proposal.hasVoted && !noVotingPower && (
            <Button size="sm" onClick={() => onVoteClick(proposal)}>
              Votar
            </Button>
          )}
          </div>
        </div>
      </div>
      {showActions && <ProposalActions proposal={proposal} />}
    </Card>
  );
}

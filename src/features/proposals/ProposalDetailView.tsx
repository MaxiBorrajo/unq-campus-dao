import { useParams } from 'react-router-dom';
import { CONTRACT_ADDRESSES } from '../../config/contracts';
import { hasEthAmount, percentOf } from '../../lib/format';
import { Button, Card, Spinner, VoteBar } from '../../components/ui';
import { BackLink } from '../../components/BackLink';
import { EmptyState } from '../../components/EmptyState';
import { useWallet } from '../wallet/WalletContext';
import { Countdown } from './Countdown';
import { StatusBadge } from './StatusBadge';
import { ProposalActions } from './ProposalActions';
import { useProposals } from './ProposalsContext';

export function ProposalDetailView() {
  const { id } = useParams<{ id: string }>();
  const { wallet } = useWallet();
  const { proposals, isLoading, openVote } = useProposals();

  const proposal = proposals.find((p) => p.id === id);
  const isMine = !!wallet.address && wallet.address.toLowerCase() === proposal?.proposer?.toLowerCase();

  if (!proposal) {
    return isLoading ? (
      <div className="flex justify-center p-12">
        <Spinner className="h-6 w-6" />
      </div>
    ) : (
      <>
        <BackLink to="/">Propuestas</BackLink>
        <EmptyState title="No encontramos esa propuesta" description="Puede que el enlace sea incorrecto." />
      </>
    );
  }

  const { forVotes, againstVotes, abstainVotes } = proposal;
  const total = proposal.totalVotes || forVotes + againstVotes + abstainVotes;
  const tally = [
    { label: 'A favor', votes: forVotes },
    { label: 'En contra', votes: againstVotes },
    { label: 'Abstención', votes: abstainVotes },
  ];

  return (
    <div>
      <BackLink to="/">Propuestas</BackLink>

      <div className="mb-6 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">{proposal.title}</h1>
          <StatusBadge status={proposal.status} />
        </div>
        <Countdown proposal={proposal} className="block text-sm" />
        <p className="text-sm text-ink-subtle">
          {proposal.category} · por{' '}
          <span className="break-all font-mono text-xs" title={proposal.proposer}>
            {proposal.proposer}
          </span>
          {isMine && ' (vos)'}
          {hasEthAmount(proposal.ethAmount) && ` · solicita ${proposal.ethAmount} ETH de la tesorería`}
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{proposal.description}</p>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-base font-semibold text-ink">Resultado</h2>
          <VoteBar forVotes={forVotes} againstVotes={againstVotes} abstainVotes={abstainVotes} size="md" />
          <dl className="grid grid-cols-3 gap-4 text-sm">
            {tally.map((t) => (
              <div key={t.label}>
                <dt className="text-ink-subtle">{t.label}</dt>
                <dd className="font-semibold text-ink">
                  {t.votes} <span className="font-normal text-ink-subtle">({percentOf(t.votes, total).toFixed(0)}%)</span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        {(proposal.status === 'Active' || proposal.status === 'Succeeded' || proposal.status === 'Queued') && (
          <Card className="space-y-3 p-5">
            {proposal.status === 'Active' &&
              (wallet.hasCredentialNft && proposal.votingPowerAtSnapshot === 0 ? (
                <p className="text-sm text-ink-subtle">
                  Tu credencial se emitió después de que se abriera esta propuesta, así que tu voto no contaría. Podés
                  votar desde la próxima.
                </p>
              ) : wallet.hasCredentialNft ? (
                <Button disabled={proposal.hasVoted} onClick={() => openVote(proposal)}>
                  {proposal.hasVoted ? 'Ya votaste' : 'Votar'}
                </Button>
              ) : (
                <p className="text-sm text-ink-subtle">Necesitás tu credencial para votar.</p>
              ))}

            <ProposalActions proposal={proposal} />
            {!isMine && (proposal.status === 'Succeeded' || proposal.status === 'Queued') && (
              <p className="text-sm text-ink-muted">
                La propuesta fue aprobada. Solo quien la presentó puede{' '}
                {proposal.status === 'Succeeded' ? 'encolarla' : 'ejecutarla'}.
              </p>
            )}
          </Card>
        )}

        <p className="break-all pt-2 font-mono text-xs text-ink-subtle">
          Governor {CONTRACT_ADDRESSES.GOVERNOR} · Timelock {CONTRACT_ADDRESSES.TIMELOCK}
        </p>
      </div>
    </div>
  );
}

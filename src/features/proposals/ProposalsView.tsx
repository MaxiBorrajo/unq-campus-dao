import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProposalStatus } from '../../types';
import { Button, Input, Select, Tab, Tabs, TabsList } from '../../components/ui';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import { useWallet } from '../wallet/WalletContext';
import { ProposalCard } from './ProposalCard';
import { useProposals } from './ProposalsContext';
import { FILTERABLE_STATUSES } from './status';
import { VOTE_OPTIONS } from './voteOptions';

type Scope = 'all' | 'mine' | 'votes';
type VoteFilter = 'all' | '0' | '1' | '2';
type StatusFilter = 'all' | ProposalStatus;

const STATUS_OPTIONS = [{ value: 'all', label: 'Todos los estados' }, ...FILTERABLE_STATUSES] as {
  value: StatusFilter;
  label: string;
}[];

const SCOPE_PATHS: Record<Scope, string> = { all: '/', mine: '/mis-propuestas', votes: '/mis-votaciones' };

const VOTE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos mis votos' },
  ...VOTE_OPTIONS.map((o) => ({ value: String(o.support), label: o.label })),
] as { value: VoteFilter; label: string }[];

export function ProposalsView({ scope }: { scope: Scope }) {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { proposals, openVote } = useProposals();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return proposals.filter((p) => {
      if (scope === 'mine' && p.proposer?.toLowerCase() !== wallet.address?.toLowerCase()) return false;
      if (scope === 'votes') {
        if (p.myVote === undefined) return false;
        if (voteFilter !== 'all' && p.myVote !== Number(voteFilter)) return false;
      }
      if (status !== 'all' && p.status !== status) return false;
      if (!q) return true;
      return [p.title, p.description, p.category].some((text) => text?.toLowerCase().includes(q));
    });
  }, [proposals, scope, status, voteFilter, search, wallet.address]);

  const goCreate = () => navigate('/propuestas/nueva');

  return (
    <div>
      {scope === 'votes' ? (
        <PageHeader title="Mis votaciones" description="Las propuestas en las que votaste y cómo terminaron." />
      ) : (
        <PageHeader
          title="Propuestas"
          description="Presentá iniciativas y votá las de otros estudiantes."
          action={<Button onClick={goCreate}>Nueva propuesta</Button>}
        />
      )}

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line">
        {scope === 'votes' ? (
          <span />
        ) : (
          <Tabs value={scope} onValueChange={(v) => navigate(SCOPE_PATHS[v as Scope])}>
            <TabsList className="border-b-0">
              <Tab value="all">Todas</Tab>
              <Tab value="mine">Mis propuestas</Tab>
            </TabsList>
          </Tabs>
        )}

        <div className="flex items-center gap-2 pb-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar"
            aria-label="Buscar propuestas"
            className="w-44 py-1.5"
          />
          {scope === 'votes' && (
            <Select<VoteFilter>
              value={voteFilter}
              onValueChange={setVoteFilter}
              options={VOTE_FILTER_OPTIONS}
              aria-label="Filtrar por mi voto"
              className="w-44 py-1.5"
            />
          )}
          <Select<StatusFilter>
            value={status}
            onValueChange={setStatus}
            options={STATUS_OPTIONS}
            aria-label="Filtrar por estado"
            className="w-44 py-1.5"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              userCanVote={wallet.hasCredentialNft}
              onVoteClick={openVote}
              showActions={scope === 'mine'}
              showMyVote={scope === 'votes'}
            />
          ))
        ) : (
          <EmptyState
            title={
              scope === 'mine'
                ? 'Todavía no presentaste propuestas'
                : scope === 'votes'
                  ? 'Todavía no votaste en ninguna propuesta'
                  : 'No hay propuestas para mostrar'
            }
            description={scope === 'mine' ? undefined : 'Probá con otra búsqueda o cambiá el filtro.'}
            action={
              scope === 'mine' ? (
                <Button size="sm" onClick={goCreate}>
                  Crear la primera
                </Button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

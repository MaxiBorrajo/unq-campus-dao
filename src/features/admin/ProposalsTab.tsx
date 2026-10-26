import type { Proposal } from '../../types';
import { Card } from '../../components/ui';
import { StatusBadge } from '../proposals/StatusBadge';

export function ProposalsTab({ proposals }: { proposals: Proposal[] }) {
  return (
    <Card className="divide-y divide-line">
      {proposals.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="font-semibold text-ink">{p.title}</p>
            <p className="text-xs text-ink-subtle">
              {p.forVotes} a favor · {p.againstVotes} en contra · {p.abstainVotes} abstenciones
            </p>
          </div>
          <StatusBadge status={p.status} />
        </div>
      ))}
    </Card>
  );
}

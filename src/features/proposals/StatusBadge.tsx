import { Badge } from '../../components/ui';
import type { ProposalStatus } from '../../types';
import { STATUS_META } from './status';

export function StatusBadge({ status }: { status: ProposalStatus }) {
  const { label, tone } = STATUS_META[status] ?? { label: status, tone: 'neutral' as const };
  return <Badge tone={tone}>{label}</Badge>;
}

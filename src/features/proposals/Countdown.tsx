import { useEffect, useRef, useState } from 'react';
import type { Proposal } from '../../types';
import { cn } from '../../lib/cn';
import { formatRemaining } from '../../lib/duration';
import { useProposals } from './ProposalsContext';

const nowSeconds = () => Date.now() / 1000;

/** Cuenta regresiva a la apertura (En espera) o al cierre (Votación abierta). */
export function Countdown({ proposal, className }: { proposal: Proposal; className?: string }) {
  const { refresh } = useProposals();
  const [now, setNow] = useState(nowSeconds);
  const refreshedFor = useRef<number | null>(null);

  const isPending = proposal.status === 'Pending';
  const target = isPending ? proposal.votingStartsAt : proposal.votingEndsAt;
  const live = (isPending || proposal.status === 'Active') && !!target;
  const remaining = target ? target - now : 0;

  // Cada segundo cuando falta poco; cada 30 s si falta más de una hora.
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setNow(nowSeconds()), remaining > 3600 ? 30000 : 1000);
    return () => clearInterval(id);
  }, [live, remaining > 3600]);

  // Al llegar a 0, vuelve a leer el estado del contrato (una sola vez por plazo).
  useEffect(() => {
    if (live && target && remaining <= 0 && refreshedFor.current !== target) {
      refreshedFor.current = target;
      const id = setTimeout(refresh, 3000);
      return () => clearTimeout(id);
    }
  }, [live, target, remaining, refresh]);

  if (!live || !target) return null;

  const urgent = !isPending && remaining > 0 && remaining < 3600;
  const text =
    remaining <= 0
      ? 'Actualizando…'
      : `${isPending ? 'Abre en' : 'Cierra en'} ${formatRemaining(remaining)}`;

  return <span className={cn('text-xs font-medium tabular-nums', urgent ? 'text-warning-700' : 'text-ink-subtle', className)}>{text}</span>;
}

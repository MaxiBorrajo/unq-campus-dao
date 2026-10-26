import { useEffect, useState } from 'react';
import type { Proposal } from '../../types';
import { executeProposal, queueProposal } from '../../services';
import { getErrorMessage } from '../../lib/errors';
import { formatRemaining } from '../../lib/duration';
import { Button, useToast } from '../../components/ui';
import { useWallet } from '../wallet/WalletContext';
import { useProposals } from './ProposalsContext';

export const isProposer = (proposal: Proposal, address: string | null | undefined) =>
  !!address && address.toLowerCase() === proposal.proposer?.toLowerCase();

/** Encolar / ejecutar una propuesta aprobada. Solo se ofrece a quien la presentó. */
export function ProposalActions({ proposal }: { proposal: Proposal }) {
  const { wallet } = useWallet();
  const { refresh } = useProposals();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [now, setNow] = useState(() => Date.now() / 1000);
  const eta = proposal.status === 'Queued' ? proposal.eta : undefined;
  const waiting = !!eta && eta > now;

  // Mientras falta el delay del timelock, actualiza la cuenta regresiva cada segundo.
  useEffect(() => {
    if (!waiting) return;
    const id = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => clearInterval(id);
  }, [waiting]);

  if (!isProposer(proposal, wallet.address)) return null;
  if (proposal.status !== 'Succeeded' && proposal.status !== 'Queued') return null;

  const queued = proposal.status === 'Queued';
  const run = async () => {
    try {
      setIsProcessing(true);
      await (queued ? executeProposal : queueProposal)(proposal);
      toast.success(queued ? 'Propuesta ejecutada' : 'Propuesta encolada');
      setTimeout(refresh, 2000);
    } catch (e) {
      console.error('Error en acción de propuesta:', e);
      toast.error(
        queued ? 'No se pudo ejecutar la propuesta' : 'No se pudo encolar la propuesta',
        getErrorMessage(e),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-muted">
        {queued
          ? waiting
            ? `El timelock debe cumplir su espera antes de ejecutar: faltan ${formatRemaining(eta! - now)}.`
            : 'La espera del timelock terminó: ya podés ejecutarla.'
          : 'Tu propuesta fue aprobada. Falta encolarla en el timelock.'}
      </p>
      <Button size="sm" loading={isProcessing} disabled={waiting} onClick={run}>
        {queued ? 'Ejecutar' : 'Encolar'}
      </Button>
    </div>
  );
}

import { useState } from 'react';
import type { Proposal } from '../../types';
import { castVote } from '../../services';
import { getErrorMessage } from '../../lib/errors';
import { Alert, Button, Dialog, Field, RadioCardGroup, Textarea, useToast } from '../../components/ui';
import { VOTE_OPTIONS } from './voteOptions';

interface VoteModalProps {
  proposal: Proposal;
  onClose: () => void;
  onVoted: () => void;
}

export function VoteModal({ proposal, onClose, onVoted }: VoteModalProps) {
  const toast = useToast();
  const [choice, setChoice] = useState<(typeof VOTE_OPTIONS)[number]['value'] | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const option = VOTE_OPTIONS.find((o) => o.value === choice);
    if (!option) {
      setError('Elegí cómo querés votar.');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await castVote(proposal.id, option.support, reason);
      toast.success('Voto registrado');
      onVoted();
      onClose();
    } catch (e) {
      console.error('Error al emitir voto:', e);
      setError(getErrorMessage(e, 'No se pudo emitir el voto'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      dismissible={!isSubmitting}
      title="Votar propuesta"
      description={proposal.title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={choice === null}>
            {isSubmitting ? 'Firmando…' : 'Confirmar voto'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <RadioCardGroup value={choice} onValueChange={setChoice} options={VOTE_OPTIONS} aria-label="Tu voto" />
        <Field
          label="Justificación (opcional)"
          description="Es pública y queda registrada en la blockchain: no se puede editar ni borrar."
        >
          <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </Dialog>
  );
}

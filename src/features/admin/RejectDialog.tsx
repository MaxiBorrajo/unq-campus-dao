import { useState } from 'react';
import type { StudentRequest } from '../../types';
import { Button, Dialog, Field, Textarea } from '../../components/ui';

const DEFAULT_REASON = 'No coincide con el padrón de alumnos regulares de la UNQ';

interface RejectDialogProps {
  request: StudentRequest | null;
  onClose: () => void;
  onConfirm: (request: StudentRequest, reason: string) => void;
}

export function RejectDialog({ request, onClose, onConfirm }: RejectDialogProps) {
  const [reason, setReason] = useState(DEFAULT_REASON);

  return (
    <Dialog
      open={!!request}
      onOpenChange={(open) => !open && onClose()}
      title="Rechazar solicitud"
      description={request && `${request.firstName} ${request.lastName} · DNI ${request.dni}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!reason.trim()}
            onClick={() => {
              if (request) onConfirm(request, reason.trim());
              setReason(DEFAULT_REASON);
            }}
          >
            Rechazar
          </Button>
        </>
      }
    >
      <Field label="Motivo" description="Se le muestra al alumno para que pueda corregir sus datos.">
        <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
    </Dialog>
  );
}

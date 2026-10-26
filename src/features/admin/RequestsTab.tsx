import type { StudentRequest } from '../../types';
import { etherscanTx } from '../../lib/format';
import { Avatar, Button, Card, Spinner } from '../../components/ui';
import { ExternalLink } from '../../components/ExternalLink';

interface RequestsTabProps {
  requests: StudentRequest[];
  isLoading: boolean;
  processingId: number | null;
  onApprove: (request: StudentRequest) => void;
  onReject: (request: StudentRequest) => void;
}

export function RequestsTab({ requests, isLoading, processingId, onApprove, onReject }: RequestsTabProps) {
  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-ink">Pendientes ({pending.length})</h2>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : pending.length > 0 ? (
          <Card className="divide-y divide-line">
            {pending.map((req) => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar shape="portrait" src={req.photoData} name={req.firstName} />
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-ink">
                      {req.firstName} {req.lastName}
                    </p>
                    <p className="text-ink-subtle">
                      DNI {req.dni} · {req.career}
                    </p>
                    <p className="break-all font-mono text-xs text-ink-subtle">{req.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="danger" size="sm" disabled={processingId === req.id} onClick={() => onReject(req)}>
                    Rechazar
                  </Button>
                  <Button size="sm" loading={processingId === req.id} onClick={() => onApprove(req)}>
                    {processingId === req.id ? 'Emitiendo…' : 'Aprobar y emitir'}
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <p className="text-sm text-ink-subtle">No hay solicitudes pendientes.</p>
        )}
      </section>

      {approved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Emitidas ({approved.length})</h2>
          <Card className="divide-y divide-line text-sm">
            {approved.map((req) => (
              <div key={req.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span className="text-ink">
                  {req.firstName} {req.lastName} <span className="text-ink-subtle">· {req.career}</span>
                </span>
                {req.mintTxHash && (
                  <ExternalLink href={etherscanTx(req.mintTxHash)} className="font-mono text-xs">
                    {req.mintTxHash.slice(0, 10)}…
                  </ExternalLink>
                )}
              </div>
            ))}
          </Card>
        </section>
      )}
    </div>
  );
}

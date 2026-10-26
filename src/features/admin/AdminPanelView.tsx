import { useState } from 'react';
import type { StudentRequest } from '../../types';
import { api, mintStudentCredential } from '../../services';
import { errorIncludes, getErrorMessage } from '../../lib/errors';
import { Alert, Button, Tab, Tabs, TabsList, TabsPanel } from '../../components/ui';
import { PageHeader } from '../../components/PageHeader';
import { useProposals } from '../proposals/ProposalsContext';
import { useTreasury } from '../treasury/useTreasury';
import { useWallet } from '../wallet/WalletContext';
import { useAdminRequests } from './AdminRequestsContext';
import { ProposalsTab } from './ProposalsTab';
import { RejectDialog } from './RejectDialog';
import { RequestsTab } from './RequestsTab';
import { TreasuryTab } from './TreasuryTab';

type AdminTab = 'requests' | 'proposals' | 'treasury';

export function AdminPanelView() {
  const { refresh: refreshWallet } = useWallet();
  const { proposals, refresh: refreshProposals } = useProposals();
  const { requests, pendingCount, isLoading, refresh: refreshRequests } = useAdminRequests();
  const { treasury, refresh: refreshTreasury } = useTreasury();

  const [tab, setTab] = useState<AdminTab>('requests');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<StudentRequest | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshAll = () => Promise.all([refreshRequests(), refreshTreasury(), refreshProposals(), refreshWallet()]);

  const handleApprove = async (req: StudentRequest) => {
    const name = `${req.firstName} ${req.lastName}`;
    try {
      setProcessingId(req.id);
      setError(null);
      setSuccess(`Emitiendo credencial para ${name}…`);
      const txHash = await mintStudentCredential(req.address);
      setSuccess('Credencial emitida. Guardando…');
      await api.approveRequest(req.id, txHash);
      setSuccess(`Credencial emitida para ${name}.`);
      await refreshRequests();
    } catch (e) {
      console.error('Error minting credential:', e);
      setSuccess(null);
      if (errorIncludes(e, 'AlreadyIssued')) {
        setError('Este estudiante ya posee una credencial NFT emitida en el contrato.');
        await api.approveRequest(req.id);
        await refreshRequests();
      } else {
        setError(getErrorMessage(e, 'Error al ejecutar mint() en el contrato'));
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: StudentRequest, reason: string) => {
    setRejecting(null);
    try {
      setProcessingId(req.id);
      setError(null);
      await api.rejectRequest(req.id, reason);
      setSuccess(`Solicitud de ${req.firstName} rechazada.`);
      await refreshRequests();
    } catch (e) {
      setError(getErrorMessage(e, 'Error al rechazar'));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Panel de la facultad"
        description="Emití credenciales y seguí la actividad de la DAO."
        action={
          <Button variant="outline" size="sm" onClick={refreshAll}>
            Actualizar
          </Button>
        }
      />

      {(success || error) && (
        <div className="mb-4 space-y-2">
          {success && <Alert tone="success">{success}</Alert>}
          {error && <Alert tone="error">{error}</Alert>}
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as AdminTab)} className="space-y-5">
        <TabsList>
          <Tab value="requests">Solicitudes ({pendingCount})</Tab>
          <Tab value="proposals">Propuestas ({proposals.length})</Tab>
          <Tab value="treasury">Tesorería</Tab>
        </TabsList>

        <TabsPanel value="requests" className="outline-none">
          <RequestsTab
            requests={requests}
            isLoading={isLoading}
            processingId={processingId}
            onApprove={handleApprove}
            onReject={setRejecting}
          />
        </TabsPanel>
        <TabsPanel value="proposals" className="outline-none">
          <ProposalsTab proposals={proposals} />
        </TabsPanel>
        <TabsPanel value="treasury" className="outline-none">
          <TreasuryTab treasury={treasury} />
        </TabsPanel>
      </Tabs>

      <RejectDialog request={rejecting} onClose={() => setRejecting(null)} onConfirm={handleReject} />
    </div>
  );
}

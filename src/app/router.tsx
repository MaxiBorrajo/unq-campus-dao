import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '../layout/AppShell';
import { AdminPanelView } from '../features/admin/AdminPanelView';
import { CreateProposalView } from '../features/proposals/CreateProposalView';
import { ProposalDetailView } from '../features/proposals/ProposalDetailView';
import { ProposalsView } from '../features/proposals/ProposalsView';
import { CredentialView } from '../features/students/CredentialView';
import { StudentRegistrationView } from '../features/students/StudentRegistrationView';
import { LoginView } from '../features/wallet/LoginView';
import { useWallet } from '../features/wallet/WalletContext';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  return wallet.isIssuerAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

/** Sin credencial (ni override) solo se puede acceder a la solicitud de ingreso. */
function AccessGate() {
  const { hasFullAccess } = useWallet();
  const { pathname } = useLocation();
  if (!hasFullAccess && pathname !== '/registro') return <Navigate to="/registro" replace />;
  return <Outlet />;
}

export function AppRoutes() {
  const { wallet } = useWallet();

  // Sin billetera conectada solo se ofrece la pantalla de ingreso.
  if (!wallet.isConnected) return <LoginView />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<AccessGate />}>
        <Route index element={<ProposalsView scope="all" />} />
        <Route path="mis-propuestas" element={<ProposalsView scope="mine" />} />
        <Route path="mis-votaciones" element={<ProposalsView scope="votes" />} />
        <Route path="propuestas/nueva" element={<CreateProposalView />} />
        <Route path="propuestas/:id" element={<ProposalDetailView />} />
        <Route path="credencial" element={<CredentialView />} />
        <Route path="registro" element={<StudentRegistrationView />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanelView />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

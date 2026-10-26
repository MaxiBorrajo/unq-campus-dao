import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/ui';
import { AdminRequestsProvider } from '../features/admin/AdminRequestsContext';
import { ProposalsProvider } from '../features/proposals/ProposalsContext';
import { StudentProvider } from '../features/students/StudentContext';
import { WalletProvider } from '../features/wallet/WalletContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WalletProvider>
          <StudentProvider>
            <AdminRequestsProvider>
              <ProposalsProvider>{children}</ProposalsProvider>
            </AdminRequestsProvider>
          </StudentProvider>
        </WalletProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

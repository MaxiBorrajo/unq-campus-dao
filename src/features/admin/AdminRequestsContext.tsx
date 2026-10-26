import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StudentRequest } from '../../types';
import { api } from '../../services';
import { useWallet } from '../wallet/WalletContext';

interface AdminRequestsContextValue {
  requests: StudentRequest[];
  pendingCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const AdminRequestsContext = createContext<AdminRequestsContextValue | null>(null);

export function useAdminRequests() {
  const ctx = useContext(AdminRequestsContext);
  if (!ctx) throw new Error('useAdminRequests debe usarse dentro de <AdminRequestsProvider>');
  return ctx;
}

/** Solo carga solicitudes cuando la cuenta conectada es emisora. */
export function AdminRequestsProvider({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!wallet.isIssuerAdmin) return setRequests([]);
    setIsLoading(true);
    try {
      setRequests(await api.getAdminRequests());
    } finally {
      setIsLoading(false);
    }
  }, [wallet.isIssuerAdmin]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ requests, isLoading, refresh, pendingCount: requests.filter((r) => r.status === 'pending').length }),
    [requests, isLoading, refresh],
  );

  return <AdminRequestsContext.Provider value={value}>{children}</AdminRequestsContext.Provider>;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StudentRequest } from '../../types';
import { api } from '../../services';
import { shortAddress } from '../../lib/format';
import { useWallet } from '../wallet/WalletContext';

interface StudentContextValue {
  /** Solicitud/perfil guardado localmente para la billetera conectada. */
  profile: StudentRequest | null;
  displayName: string;
  photo?: string;
  refresh: () => Promise<void>;
}

const StudentContext = createContext<StudentContextValue | null>(null);

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent debe usarse dentro de <StudentProvider>');
  return ctx;
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState<StudentRequest | null>(null);

  const refresh = useCallback(async () => {
    if (!wallet.address) return setProfile(null);
    const res = await api.getStudent(wallet.address);
    setProfile(res.found && res.student ? res.student : null);
  }, [wallet.address]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<StudentContextValue>(() => {
    const displayName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : wallet.address
        ? `Estudiante (${shortAddress(wallet.address)})`
        : 'Estudiante UNQ';
    return { profile, displayName, photo: profile?.photoData || undefined, refresh };
  }, [profile, wallet.address, refresh]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Role, WalletState } from '../../types';
import { checkStudentCredential } from '../../services';
import { getEthereum } from '../../lib/ethereum';
import { getErrorMessage } from '../../lib/errors';
import { useToast } from '../../components/ui';

const DISCONNECTED: WalletState = {
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  isIssuerAdmin: false,
  hasCredentialNft: false,
  votingPower: 0,
};

interface WalletContextValue {
  wallet: WalletState;
  /** Modo de la UI. Solo los emisores (ISSUER_ROLE) pueden usar `admin`. */
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  /** Sin credencial solo se ofrece pedirla, salvo que se fuerce ver todo o se esté en modo admin. */
  hasFullAccess: boolean;
  /** Override manual para quien ya tiene el NFT pero no se detectó. */
  unlockAll: boolean;
  setUnlockAll: (value: boolean) => void;
  /** Vuelve a leer credencial/rol on-chain de la cuenta actual. */
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet debe usarse dentro de <WalletProvider>');
  return ctx;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [wallet, setWallet] = useState<WalletState>(DISCONNECTED);
  const [requestedRole, setActiveRole] = useState<Role>('student');
  const [unlockAll, setUnlockAll] = useState(false);
  const chainIdRef = useRef<number | null>(null);

  const loadAccount = useCallback(async (address: string, chainId: number) => {
    chainIdRef.current = chainId;
    if (addressRef.current !== address) setUnlockAll(false);
    try {
      const cred = await checkStudentCredential(address);
      setWallet({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        isIssuerAdmin: cred.isIssuerAdmin,
        hasCredentialNft: cred.hasCredentialNft,
        nftTokenId: cred.nftTokenId,
        votingPower: cred.votingPower,
      });
      if (cred.isIssuerAdmin) setActiveRole('admin');
    } catch (e) {
      console.error('Error updating account data:', e);
      toast.error('No se pudo leer tu credencial', getErrorMessage(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      toast.error('MetaMask no encontrado', 'Instalá MetaMask para usar la DApp del Campus Virtual UNQ.');
      return;
    }
    try {
      setWallet((prev) => ({ ...prev, isConnecting: true }));
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      const chainId = parseInt((await ethereum.request({ method: 'eth_chainId' })) as string, 16);
      if (accounts.length > 0) await loadAccount(accounts[0], chainId);
    } catch (e) {
      console.error('Error connecting wallet:', e);
      toast.error('No se pudo conectar la billetera', getErrorMessage(e));
    } finally {
      setWallet((prev) => ({ ...prev, isConnecting: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAccount]);

  const disconnect = useCallback(() => {
    chainIdRef.current = null;
    setWallet(DISCONNECTED);
    setActiveRole('student');
    setUnlockAll(false);
  }, []);

  const addressRef = useRef<string | null>(null);
  addressRef.current = wallet.address;

  const refresh = useCallback(async () => {
    if (addressRef.current && chainIdRef.current) await loadAccount(addressRef.current, chainIdRef.current);
  }, [loadAccount]);

  // Reconexión automática y escucha de cambios de cuenta/red (se registra una sola vez).
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const readChainId = async () => parseInt((await ethereum.request({ method: 'eth_chainId' })) as string, 16);

    ethereum
      .request({ method: 'eth_accounts' })
      .then(async (accounts) => {
        const [first] = accounts as string[];
        if (first) await loadAccount(first, await readChainId());
      })
      .catch(() => {});

    const onAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else await loadAccount(accounts[0], await readChainId());
    };
    const onChainChanged = (chainIdHex: string) => {
      if (addressRef.current) void loadAccount(addressRef.current, parseInt(chainIdHex, 16));
    };

    ethereum.on('accountsChanged', onAccountsChanged);
    ethereum.on('chainChanged', onChainChanged);
    return () => {
      ethereum.removeListener('accountsChanged', onAccountsChanged);
      ethereum.removeListener('chainChanged', onChainChanged);
    };
  }, [loadAccount, disconnect]);

  const activeRole: Role = wallet.isIssuerAdmin ? requestedRole : 'student';

  const hasFullAccess = wallet.hasCredentialNft || unlockAll || (wallet.isIssuerAdmin && activeRole === 'admin');

  const value = useMemo(
    () => ({ wallet, activeRole, setActiveRole, hasFullAccess, unlockAll, setUnlockAll, connect, disconnect, refresh }),
    [wallet, activeRole, hasFullAccess, unlockAll, connect, disconnect, refresh],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

import { useCallback, useEffect, useState } from 'react';
import { getTreasuryInfo, type TreasuryInfo } from '../../services';

const EMPTY: TreasuryInfo = { balanceEth: '0.0', maxTransferBps: 2000, maxTransferPercent: '20.0' };

export function useTreasury() {
  const [treasury, setTreasury] = useState<TreasuryInfo>(EMPTY);

  const refresh = useCallback(async () => {
    try {
      setTreasury(await getTreasuryInfo());
    } catch (e) {
      console.warn('Error loading treasury:', e);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { treasury, refresh };
}

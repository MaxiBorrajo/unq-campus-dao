import type { Eip1193Provider } from 'ethers';

export interface EthereumProvider extends Eip1193Provider {
  on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  on(event: 'chainChanged', handler: (chainId: string) => void): void;
  removeListener(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  removeListener(event: 'chainChanged', handler: (chainId: string) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function getEthereum(): EthereumProvider | undefined {
  return typeof window === 'undefined' ? undefined : window.ethereum;
}

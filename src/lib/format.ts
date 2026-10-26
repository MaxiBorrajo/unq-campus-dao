export function shortAddress(address?: string | null, head = 6, tail = 4) {
  if (!address) return '';
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export function percentOf(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0;
}

export function hasEthAmount(amount?: string) {
  return !!amount && parseFloat(amount) > 0;
}

export const ETHERSCAN_URL = 'https://sepolia.etherscan.io';
export const etherscanAddress = (address: string) => `${ETHERSCAN_URL}/address/${address}`;
export const etherscanTx = (hash: string) => `${ETHERSCAN_URL}/tx/${hash}`;

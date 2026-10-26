import type { TreasuryInfo } from '../../services';
import { CONTRACT_ADDRESSES } from '../../config/contracts';
import { etherscanAddress } from '../../lib/format';
import { Card } from '../../components/ui';
import { ExternalLink } from '../../components/ExternalLink';

export function TreasuryTab({ treasury }: { treasury: TreasuryInfo }) {
  const rows = [
    { label: 'Balance', value: `${treasury.balanceEth} ETH` },
    { label: 'Tope por operación', value: `${treasury.maxTransferPercent}% del balance` },
    { label: 'Espera del timelock', value: '60 segundos' },
  ];

  return (
    <Card className="space-y-4 p-5">
      <dl className="divide-y divide-line text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-2.5">
            <dt className="text-ink-subtle">{r.label}</dt>
            <dd className="font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-ink-subtle">
        <ExternalLink href={etherscanAddress(CONTRACT_ADDRESSES.TREASURY)}>Tesorería</ExternalLink>
        {' · '}
        <ExternalLink href={etherscanAddress(CONTRACT_ADDRESSES.GOVERNOR)}>Governor</ExternalLink>
        {' · '}
        <ExternalLink href={etherscanAddress(CONTRACT_ADDRESSES.TIMELOCK)}>Timelock</ExternalLink>
      </p>
    </Card>
  );
}

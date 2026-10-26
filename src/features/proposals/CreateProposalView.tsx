import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TREASURY_CATEGORY, type ProposalCategory } from '../../types';
import { CONTRACT_ADDRESSES } from '../../config/contracts';
import { api, createGovernorProposal, getVotingPeriodBounds, type VotingPeriodBounds } from '../../services';
import { DURATION_PRESETS } from '../../lib/duration';
import { errorIncludes, getErrorMessage } from '../../lib/errors';
import { Alert, Button, Card, Field, Input, Select, Switch, Textarea, useToast } from '../../components/ui';
import { BackLink } from '../../components/BackLink';
import { PageHeader } from '../../components/PageHeader';
import { useWallet } from '../wallet/WalletContext';
import { useTreasury } from '../treasury/useTreasury';
import { useProposals } from './ProposalsContext';

type FreeCategory = Exclude<ProposalCategory, typeof TREASURY_CATEGORY>;

const CATEGORY_OPTIONS: { value: FreeCategory; label: string }[] = [
  { value: 'Académica', label: 'Académica' },
  { value: 'Infraestructura', label: 'Infraestructura' },
  { value: 'General', label: 'General' },
];

function explainError(e: unknown) {
  if (errorIncludes(e, 'ActiveProposalExists')) {
    return 'Ya tenés una propuesta abierta. Esperá a que termine para presentar otra.';
  }
  if (errorIncludes(e, 'ProposalCooldownActive')) {
    return 'Tenés que esperar 60 segundos entre una propuesta y la siguiente.';
  }
  return getErrorMessage(e, 'No se pudo enviar la propuesta');
}

export function CreateProposalView() {
  const navigate = useNavigate();
  const toast = useToast();
  const { wallet } = useWallet();
  const { refresh } = useProposals();
  const { treasury } = useTreasury();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FreeCategory>('Académica');
  const [isTreasury, setIsTreasury] = useState(false);
  const [ethAmount, setEthAmount] = useState('0.01');
  const [beneficiary, setBeneficiary] = useState(wallet.address || '');

  const [bounds, setBounds] = useState<VotingPeriodBounds | null>(null);
  const [duration, setDuration] = useState('');

  // Solo si el Governor desplegado soporta duración por propuesta.
  useEffect(() => {
    void getVotingPeriodBounds().then(setBounds);
  }, []);

  const durationOptions = bounds
    ? DURATION_PRESETS.filter((d) => d.seconds >= bounds.min && d.seconds <= bounds.max).map((d) => ({
        value: String(d.seconds),
        label: d.label,
      }))
    : [];
  const selectedDuration = durationOptions.some((o) => o.value === duration) ? duration : durationOptions[0]?.value;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Completá el título y la descripción.');
      return;
    }
    if (isTreasury && (!beneficiary.trim() || !ethAmount || parseFloat(ethAmount) <= 0)) {
      setError('Indicá una billetera de destino y un monto válido en ETH.');
      return;
    }

    if (isTreasury) {
      const maxAmount = (parseFloat(treasury.balanceEth) * parseFloat(treasury.maxTransferPercent)) / 100;
      if (parseFloat(ethAmount) > maxAmount) {
        setError(`El monto supera el tope por operación (${maxAmount} ETH, ${treasury.maxTransferPercent}% del balance).`);
        return;
      }
    }

    const finalCategory: ProposalCategory = isTreasury ? TREASURY_CATEGORY : category;
    try {
      setIsLoading(true);
      setError(null);

      const result = await createGovernorProposal({
        title,
        description,
        category: finalCategory,
        isTreasury,
        beneficiaryAddress: beneficiary,
        ethAmount: isTreasury ? ethAmount : '0',
        durationSeconds: selectedDuration ? Number(selectedDuration) : undefined,
      });

      await api.saveProposalMetadata({
        proposalId: result.proposalId,
        title,
        description,
        category: finalCategory,
        targetAddress: isTreasury ? CONTRACT_ADDRESSES.TREASURY : undefined,
        beneficiaryAddress: isTreasury ? beneficiary.trim() : undefined,
        ethAmount: isTreasury ? ethAmount : '0',
        proposer: wallet.address || '',
      });

      toast.success('Propuesta creada');
      await refresh();
      navigate('/');
    } catch (err) {
      console.error('Error al crear propuesta:', err);
      setError(explainError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink to="/">Propuestas</BackLink>
      <PageHeader
        title="Nueva propuesta"
        description="Podés tener una propuesta abierta a la vez, con 60 segundos de espera entre una y otra."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <Field label="Título">
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <Field label="Eje temático">
            <Select<FreeCategory> value={category} onValueChange={setCategory} options={CATEGORY_OPTIONS} disabled={isTreasury} />
          </Field>

          {durationOptions.length > 0 && selectedDuration && (
            <Field label="Duración de la votación">
              <Select value={selectedDuration} onValueChange={setDuration} options={durationOptions} />
            </Field>
          )}

          <Field label="Descripción">
            <Textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qué problema ves, qué proponés y a quiénes beneficia."
            />
          </Field>

          <div className="space-y-4 rounded-lg bg-surface-muted p-4">
            <Switch
              checked={isTreasury}
              onCheckedChange={setIsTreasury}
              label="Solicitar fondos de la tesorería"
              description={`Balance disponible: ${treasury.balanceEth} ETH · tope ${treasury.maxTransferPercent}% por operación`}
            />
            {isTreasury && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Monto (ETH)">
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    inputMode="decimal"
                    required
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                  />
                </Field>
                <Field label="Billetera que recibe">
                  <Input
                    required
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    placeholder="0x…"
                    className="font-mono text-xs"
                  />
                </Field>
              </div>
            )}
          </div>

          {error && <Alert tone="error">{error}</Alert>}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => navigate('/')} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading ? 'Firmando…' : 'Publicar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

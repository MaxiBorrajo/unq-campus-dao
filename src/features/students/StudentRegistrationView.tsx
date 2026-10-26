import { useEffect, useState } from 'react';
import { api } from '../../services';
import { getErrorMessage } from '../../lib/errors';
import { Alert, Button, Card, Field, Input, Select, Switch, useToast } from '../../components/ui';
import { PageHeader } from '../../components/PageHeader';
import { useWallet } from '../wallet/WalletContext';
import { CAREERS } from './careers';
import { useStudent } from './StudentContext';

function RequestStatus({ request }: { request: NonNullable<ReturnType<typeof useStudent>['profile']> }) {
  if (request.status === 'pending') {
    return <Alert title="Solicitud en revisión">La facultad tiene que aprobarla para emitir tu credencial.</Alert>;
  }
  if (request.status === 'approved') {
    return (
      <Alert tone="success" title="Credencial emitida">
        Ya podés presentar propuestas y votar.
        {request.mintTxHash && <p className="mt-1 break-all font-mono text-xs">Tx {request.mintTxHash}</p>}
      </Alert>
    );
  }
  return (
    <Alert tone="error" title="Solicitud rechazada">
      {request.rejectionReason || 'Los datos no coinciden con el padrón.'} Podés corregirlos y volver a enviar.
    </Alert>
  );
}

export function StudentRegistrationView() {
  const toast = useToast();
  const { wallet, unlockAll, setUnlockAll, refresh: refreshWallet } = useWallet();
  const { profile, refresh: refreshProfile } = useStudent();

  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [career, setCareer] = useState(CAREERS[0].value);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Precarga el formulario con la solicitud existente.
  useEffect(() => {
    if (!profile) return;
    setDni(profile.dni);
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setCareer(profile.career);
    if (profile.photoData) setPhoto(profile.photoData);
  }, [profile]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.address) {
      setError('Por favor conectá tu billetera MetaMask primero.');
      return;
    }
    if (!dni.trim() || !firstName.trim() || !lastName.trim() || !career.trim()) {
      setError('Por favor completá todos los campos obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await api.submitStudentRequest({
        address: wallet.address,
        dni,
        firstName,
        lastName,
        career,
        photoData: photo || undefined,
      });
      toast.success('Solicitud enviada');
      await Promise.all([refreshProfile(), refreshWallet()]);
    } catch (err) {
      setError(getErrorMessage(err, 'Error al enviar la solicitud'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Solicitar credencial"
        description="Completá tus datos. La facultad los verifica con el padrón y emite tu credencial."
      />

      {profile && (
        <div className="mb-4">
          <RequestStatus request={profile} />
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <Field label="Billetera conectada">
            <Input disabled value={wallet.address || 'No conectada'} className="font-mono text-xs" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Field>
            <Field label="Apellido">
              <Input required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="DNI">
              <Input required value={dni} onChange={(e) => setDni(e.target.value)} />
            </Field>
            <Field label="Carrera">
              <Select value={career} onValueChange={setCareer} options={CAREERS} />
            </Field>
          </div>

          <Field label="Foto (opcional)" description="JPG o PNG, hasta 2 MB.">
            <div className="flex items-center gap-4">
              {photo && <img src={photo} alt="Vista previa" className="h-16 w-14 rounded-lg object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="cursor-pointer text-sm text-ink-subtle file:mr-3 file:rounded-lg file:border file:border-line-strong file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-muted"
              />
            </div>
          </Field>

          {error && <Alert tone="error">{error}</Alert>}

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} disabled={!wallet.isConnected}>
              {profile ? 'Actualizar solicitud' : 'Enviar solicitud'}
            </Button>
          </div>
        </form>
      </Card>

      {!wallet.hasCredentialNft && (
        <div className="mt-6">
          <Switch
            checked={unlockAll}
            onCheckedChange={setUnlockAll}
            label="Ya tengo mi credencial"
            description="Mostrar el resto de la aplicación."
          />
        </div>
      )}
    </div>
  );
}

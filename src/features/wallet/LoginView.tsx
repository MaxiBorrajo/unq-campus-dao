import { useState } from 'react';
import { Button, Dialog, Spinner } from '../../components/ui';
import { useWallet } from './WalletContext';

const INFO_SECTIONS = [
  {
    title: 'Votación on-chain',
    text: 'Presentá y votá proyectos de infraestructura, bienestar estudiantil y becas en la blockchain de Sepolia, sin intermediarios.',
  },
  {
    title: 'Un estudiante, un voto',
    text: 'Al verificar tu regularidad con el padrón UNQ recibís una credencial NFT intransferible que te habilita a votar.',
  },
  {
    title: 'Tesorería transparente',
    text: 'Los fondos del Centro de Estudiantes están bajo un timelock: cada desembolso requiere una votación aprobada.',
  },
  {
    title: 'Por qué MetaMask',
    text: 'Tu billetera funciona como firma digital: nadie puede votar en tu nombre ni alterar los resultados.',
  },
];

function InfoDialog({ open, onOpenChange, onConnect }: { open: boolean; onOpenChange: (open: boolean) => void; onConnect: () => void }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Centro de Estudiantes UNQ"
      description="Democracia estudiantil directa, transparente y descentralizada."
      footer={
        <Button
          onClick={() => {
            onOpenChange(false);
            onConnect();
          }}
        >
          Conectar
        </Button>
      }
    >
      <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {INFO_SECTIONS.map(({ title, text }) => (
          <li key={title}>
            <h4 className="text-sm font-semibold text-ink">{title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

export function LoginView() {
  const { wallet, connect } = useWallet();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/unq-bg.jpg')` }}
    >
      <div className="mx-4 w-full max-w-[330px] animate-in fade-in zoom-in-95 overflow-hidden rounded-lg bg-white shadow-modal duration-200">
        <div className="flex items-center justify-center gap-3 bg-primary p-4">
          <img src="/images/unq-logo.png" alt="Logo UNQ" className="h-10 w-10 rounded-full bg-white object-contain" />
          <span className="text-base font-bold text-white">
            Universidad Nacional de Quilmes
          </span>
        </div>

        <div className="px-6 py-6 text-center">
          <button
            type="button"
            onClick={connect}
            disabled={wallet.isConnecting}
            className="flex w-full items-center justify-start rounded-lg border border-line-strong bg-white p-3 font-semibold text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {wallet.isConnecting ? (
              <>
                <Spinner className="h-5 w-5" />
                <span className="mx-auto text-sm font-medium text-ink-muted">Conectando...</span>
              </>
            ) : (
              <>
                <img src="/images/metamask-fox.png" alt="MetaMask" className="w-9" />
                <span className="mx-auto text-center text-sm font-bold">Continuar con MetaMask</span>
              </>
            )}
          </button>

          <div className="mt-5 flex items-center justify-around gap-2 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              ¿Qué es esto?
            </button>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-ink-subtle hover:text-ink hover:underline"
            >
              ¿No tenés MetaMask?
            </a>
          </div>
        </div>
      </div>

      <InfoDialog open={showInfo} onOpenChange={setShowInfo} onConnect={connect} />
    </div>
  );
}

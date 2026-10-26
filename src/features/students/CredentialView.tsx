import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui';
import { useWallet } from '../wallet/WalletContext';
import { StudentBadge } from './StudentBadge';
import { useStudent } from './StudentContext';

export function CredentialView() {
  const { wallet } = useWallet();
  const { profile, displayName, photo } = useStudent();

  return (
    <div>
      <PageHeader
        title="Mi credencial"
        description="NFT intransferible emitido por la facultad. Un estudiante, un voto."
      />
      <StudentBadge
        tokenId={wallet.nftTokenId}
        studentName={displayName}
        dni={profile?.dni}
        career={profile?.career}
        photoUrl={photo}
        hasNft={wallet.hasCredentialNft}
      />
      {wallet.hasCredentialNft && (
        <div className="mt-4 space-y-2">
          {!profile && (
            <p className="text-sm text-ink-muted">
              Tu credencial está emitida, pero en este navegador no tenemos tus datos (nombre, DNI, carrera).
            </p>
          )}
          <Link to="/registro">
            <Button variant="outline" size="sm">
              {profile ? 'Editar mis datos' : 'Completar mis datos'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

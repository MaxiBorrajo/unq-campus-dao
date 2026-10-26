import { PageHeader } from '../../components/PageHeader';
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
    </div>
  );
}

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CREDENTIAL_ABI } from '../../../config/contracts';
import { getProvider } from '../../blockchain';

export interface StudentCredentialInfo {
  isIssuerAdmin: boolean;
  hasCredentialNft: boolean;
  nftTokenId: string;
  votingPower: number;
}

export async function checkStudentCredential(address: string): Promise<StudentCredentialInfo> {
  const provider = await getProvider();
  const cred = new ethers.Contract(CONTRACT_ADDRESSES.CREDENTIAL, CREDENTIAL_ABI, provider);

  const issuerRole = await cred.ISSUER_ROLE();
  const adminRole = await cred.DEFAULT_ADMIN_ROLE();

  const [hasIssuerRole, hasAdminRole, balance, votes] = await Promise.all([
    cred.hasRole(issuerRole, address).catch(() => false),
    cred.hasRole(adminRole, address).catch(() => false),
    cred.balanceOf(address).catch(() => 0n),
    cred.getVotes(address).catch(() => 0n),
  ]);

  const hasNft = balance > 0n;
  let tokenId = '';
  if (hasNft) {
    try {
      const tid = await cred.tokenIdOf(address);
      tokenId = tid.toString();
    } catch (e) {
      tokenId = '';
    }
  }

  return {
    isIssuerAdmin: hasIssuerRole || hasAdminRole,
    hasCredentialNft: hasNft,
    nftTokenId: tokenId,
    votingPower: Number(votes),
  };
}


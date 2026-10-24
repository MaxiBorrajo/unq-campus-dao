import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CREDENTIAL_ABI } from '../../../config/contracts';
import { getSigner } from '../../blockchain';

export async function mintStudentCredential(studentAddress: string): Promise<string> {
  const signer = await getSigner();
  const cred = new ethers.Contract(CONTRACT_ADDRESSES.CREDENTIAL, CREDENTIAL_ABI, signer);
  const tx = await cred.mint(studentAddress);
  const receipt = await tx.wait();
  return receipt.hash;
}


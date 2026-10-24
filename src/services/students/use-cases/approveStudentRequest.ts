import { db } from '../../../db';

export async function approveStudentRequest(
  id: number,
  mintTxHash?: string
): Promise<{ success: boolean }> {
  try {
    await db.students.update(id, {
      status: 'approved',
      mintTxHash,
      rejectionReason: undefined,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (e) {
    console.error('DB error approveStudentRequest:', e);
    return { success: false };
  }
}


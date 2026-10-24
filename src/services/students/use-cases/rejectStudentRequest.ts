import { db } from '../../../db';

export async function rejectStudentRequest(
  id: number,
  reason?: string
): Promise<{ success: boolean }> {
  try {
    await db.students.update(id, {
      status: 'rejected',
      rejectionReason: reason || 'Datos no verificados con el padrón de la UNQ',
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (e) {
    console.error('DB error rejectStudentRequest:', e);
    return { success: false };
  }
}


import { db } from '../../../db';

export interface SubmitStudentRegistrationParams {
  address: string;
  dni: string;
  firstName: string;
  lastName: string;
  career: string;
  photoData?: string;
  /** La credencial ya fue emitida on-chain: el perfil se guarda aprobado, sin pasar por la facultad. */
  alreadyIssued?: boolean;
}

export async function submitStudentRegistration(
  data: SubmitStudentRegistrationParams
): Promise<{ success: boolean; message: string }> {
  try {
    const existing = await db.students.where('address').equalsIgnoreCase(data.address).first();
    const now = new Date().toISOString();
    const status = data.alreadyIssued ? 'approved' : 'pending';

    if (existing && existing.id) {
      await db.students.update(existing.id, {
        dni: data.dni,
        firstName: data.firstName,
        lastName: data.lastName,
        career: data.career,
        photoData: data.photoData || existing.photoData,
        status,
        rejectionReason: undefined,
        updatedAt: now,
      });
      return {
        success: true,
        message: data.alreadyIssued ? 'Datos actualizados' : 'Solicitud actualizada para aprobación de la facultad',
      };
    }

    await db.students.add({
      address: data.address.toLowerCase(),
      dni: data.dni,
      firstName: data.firstName,
      lastName: data.lastName,
      career: data.career,
      photoData: data.photoData,
      status,
      createdAt: now,
      updatedAt: now,
    });
    return {
      success: true,
      message: data.alreadyIssued ? 'Datos guardados' : 'Solicitud enviada para aprobación de la facultad',
    };
  } catch (e) {
    console.error('Error submitting student request:', e);
    return { success: false, message: 'Error al guardar la solicitud en la base de datos' };
  }
}


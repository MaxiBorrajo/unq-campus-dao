import { db } from '../../../db';

export interface SubmitStudentRegistrationParams {
  address: string;
  dni: string;
  firstName: string;
  lastName: string;
  career: string;
  photoData?: string;
}

export async function submitStudentRegistration(
  data: SubmitStudentRegistrationParams
): Promise<{ success: boolean; message: string }> {
  try {
    const existing = await db.students.where('address').equalsIgnoreCase(data.address).first();
    const now = new Date().toISOString();

    if (existing && existing.id) {
      await db.students.update(existing.id, {
        dni: data.dni,
        firstName: data.firstName,
        lastName: data.lastName,
        career: data.career,
        photoData: data.photoData || existing.photoData,
        status: 'pending',
        rejectionReason: undefined,
        updatedAt: now,
      });
      return { success: true, message: 'Solicitud actualizada para aprobación de la facultad' };
    }

    await db.students.add({
      address: data.address.toLowerCase(),
      dni: data.dni,
      firstName: data.firstName,
      lastName: data.lastName,
      career: data.career,
      photoData: data.photoData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    return { success: true, message: 'Solicitud enviada para aprobación de la facultad' };
  } catch (e) {
    console.error('Error submitting student request:', e);
    return { success: false, message: 'Error al guardar la solicitud en la base de datos' };
  }
}


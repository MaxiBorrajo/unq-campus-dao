import { db } from '../../../db';
import { StudentRequest } from '../../../types';

export async function getStudentProfile(address: string): Promise<{ found: boolean; student?: StudentRequest }> {
  try {
    const student = await db.students.where('address').equalsIgnoreCase(address).first();
    if (!student) return { found: false };
    return { found: true, student: student as StudentRequest };
  } catch (e) {
    console.warn('DB error getStudentProfile:', e);
    return { found: false };
  }
}


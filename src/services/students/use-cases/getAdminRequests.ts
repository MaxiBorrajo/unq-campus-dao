import { db } from '../../../db';
import { StudentRequest } from '../../../types';

export async function getAdminRequests(): Promise<StudentRequest[]> {
  try {
    const list = await db.students.orderBy('id').reverse().toArray();
    return list as StudentRequest[];
  } catch (e) {
    console.warn('DB error getAdminRequests:', e);
    return [];
  }
}


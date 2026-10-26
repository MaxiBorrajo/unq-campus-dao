import Dexie, { type EntityTable } from 'dexie';
import { StudentRecord, ProposalRecord, VoteRecord } from './schema';

export class CampusDatabase extends Dexie {
  students!: EntityTable<StudentRecord, 'id'>;
  proposals!: EntityTable<ProposalRecord, 'id'>;
  votes!: EntityTable<VoteRecord, 'id'>;

  constructor() {
    super('unq_campus_dao_db');
    this.version(1).stores({
      students: '++id, &address, dni, status, createdAt',
      proposals: 'id, category, proposer, createdAt',
    });

    // v2: elimina las propuestas de demostración que sembraba la versión anterior.
    this.version(2)
      .stores({})
      .upgrade((tx) => tx.table('proposals').where('id').startsWith('demo-').delete());

    this.version(3).stores({ votes: 'id, voter' });

    this.on('populate', () => {
      try {
        const legacyProposals = localStorage.getItem('unq_dao_proposals_v1');
        if (legacyProposals) {
          const parsed = JSON.parse(legacyProposals);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.proposals.bulkAdd(parsed.filter((p: { id?: string }) => !p.id?.startsWith('demo-')));
          }
        }

        const legacyStudents = localStorage.getItem('unq_dao_students_v1');
        if (legacyStudents) {
          const parsed = JSON.parse(legacyStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.students.bulkAdd(parsed);
          }
        }
      } catch (e) {
        console.warn('Error during Dexie initial populate:', e);
      }
    });
  }
}

export const db = new CampusDatabase();

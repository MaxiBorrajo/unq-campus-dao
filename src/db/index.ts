import Dexie, { type EntityTable } from 'dexie';
import { StudentRecord, ProposalRecord } from './schema';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export const INITIAL_PROPOSALS: ProposalRecord[] = [
  {
    id: 'demo-1',
    title: 'Ampliación del Horario de Biblioteca y Laboratorios de Informática',
    description: 'Proponemos extender el horario de la biblioteca central y de los laboratorios de computación hasta las 23:00 hs de lunes a viernes, y abrir los sábados de 9:00 a 18:00 hs para facilitar el estudio y proyectos finales de los alumnos de todas las carreras.',
    category: 'Académica',
    targetAddress: '0x0000000000000000000000000000000000000000',
    ethAmount: '0',
    proposer: '0xA458D22338fC4Ad907Fb098B51B2FCcE61773392',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Subsidio del Centro de Estudiantes para Buffet y Viandas Saludables',
    description: 'Solicitud de 0.05 ETH de los fondos de la Tesorería para subsidiar el menú estudiantil del buffet universitario y proveer opciones sin TACC y vegetarianas a precios accesibles.',
    category: 'Presupuesto / Tesorería',
    targetAddress: CONTRACT_ADDRESSES.TREASURY,
    ethAmount: '0.05',
    proposer: '0xA458D22338fC4Ad907Fb098B51B2FCcE61773392',
    createdAt: new Date().toISOString(),
  },
];

export class CampusDatabase extends Dexie {
  students!: EntityTable<StudentRecord, 'id'>;
  proposals!: EntityTable<ProposalRecord, 'id'>;

  constructor() {
    super('unq_campus_dao_db');
    this.version(1).stores({
      students: '++id, &address, dni, status, createdAt',
      proposals: 'id, category, proposer, createdAt',
    });

    this.on('populate', () => {
      try {
        const legacyProposals = localStorage.getItem('unq_dao_proposals_v1');
        if (legacyProposals) {
          const parsed = JSON.parse(legacyProposals);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.proposals.bulkAdd(parsed);
          } else {
            this.proposals.bulkAdd(INITIAL_PROPOSALS);
          }
        } else {
          this.proposals.bulkAdd(INITIAL_PROPOSALS);
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
        this.proposals.bulkAdd(INITIAL_PROPOSALS);
      }
    });
  }
}

export const db = new CampusDatabase();

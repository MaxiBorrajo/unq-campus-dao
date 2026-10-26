import type { BadgeTone } from '../../components/ui';
import type { ProposalStatus } from '../../types';

export const STATUS_META: Record<ProposalStatus, { label: string; tone: BadgeTone }> = {
  Pending: { label: 'En espera', tone: 'warning' },
  Active: { label: 'Votación abierta', tone: 'success' },
  Canceled: { label: 'Cancelada', tone: 'neutral' },
  Defeated: { label: 'Rechazada', tone: 'danger' },
  Succeeded: { label: 'Aprobada', tone: 'info' },
  Queued: { label: 'En timelock', tone: 'queued' },
  Expired: { label: 'Expirada', tone: 'neutral' },
  Executed: { label: 'Ejecutada', tone: 'executed' },
  Unknown: { label: 'No encontrada en el contrato', tone: 'neutral' },
};

/** Estados que se pueden filtrar en el listado, en orden de aparición. */
export const FILTERABLE_STATUSES: { value: ProposalStatus; label: string }[] = [
  { value: 'Active', label: 'Votación abierta' },
  { value: 'Pending', label: 'En Espera' },
  { value: 'Succeeded', label: 'Aprobadas' },
  { value: 'Queued', label: 'En Timelock' },
  { value: 'Executed', label: 'Ejecutadas' },
  { value: 'Defeated', label: 'Rechazadas' },
];

export const PASSED_STATUSES: ProposalStatus[] = ['Succeeded', 'Queued', 'Executed'];

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const DURATION_PRESETS = [
  { seconds: 5 * MINUTE, label: '5 minutos' },
  { seconds: HOUR, label: '1 hora' },
  { seconds: DAY, label: '1 día' },
  { seconds: 3 * DAY, label: '3 días' },
  { seconds: 7 * DAY, label: '1 semana' },
  { seconds: 14 * DAY, label: '2 semanas' },
];

/** "4 min 12 s", "3 h 20 min", "2 días 4 h". */
export function formatRemaining(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / DAY);
  const hours = Math.floor((s % DAY) / HOUR);
  const minutes = Math.floor((s % HOUR) / MINUTE);
  const seconds = s % MINUTE;
  if (days > 0) return `${days} ${days === 1 ? 'día' : 'días'}${hours ? ` ${hours} h` : ''}`;
  if (hours > 0) return `${hours} h${minutes ? ` ${minutes} min` : ''}`;
  if (minutes > 0) return `${minutes} min ${seconds} s`;
  return `${seconds} s`;
}

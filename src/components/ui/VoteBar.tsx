import { cn } from '../../lib/cn';
import { percentOf } from '../../lib/format';

export interface VoteBarProps {
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  size?: 'sm' | 'md';
  className?: string;
}

/** Barra apilada A favor / En contra / Abstención. */
export function VoteBar({ forVotes, againstVotes, abstainVotes, size = 'sm', className }: VoteBarProps) {
  const total = forVotes + againstVotes + abstainVotes;
  const segments = [
    { votes: forVotes, color: 'bg-success-600', label: 'A favor' },
    { votes: againstVotes, color: 'bg-danger-600', label: 'En contra' },
    { votes: abstainVotes, color: 'bg-ink-faint', label: 'Abstención' },
  ];

  return (
    <div
      role="img"
      aria-label={segments.map((s) => `${s.label}: ${s.votes}`).join(', ')}
      className={cn('flex w-full overflow-hidden rounded-lg bg-line', size === 'sm' ? 'h-1.5' : 'h-2', className)}
    >
      {segments.map((s) => (
        <div
          key={s.label}
          style={{ width: `${percentOf(s.votes, total)}%` }}
          className={cn('transition-all duration-300', s.color)}
          title={`${s.label}: ${percentOf(s.votes, total).toFixed(1)}%`}
        />
      ))}
    </div>
  );
}

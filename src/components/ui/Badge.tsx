import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/** Estado en texto: sin fondo ni borde. */
const badgeVariants = cva('text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'text-ink-subtle',
      primary: 'text-primary',
      success: 'text-success-700',
      warning: 'text-warning-700',
      danger: 'text-danger-700',
      info: 'text-info-700',
      queued: 'text-queued-700',
      executed: 'text-executed-700',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

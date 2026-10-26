import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const alertVariants = cva('rounded-lg border bg-white p-3 text-sm', {
  variants: {
    tone: {
      error: 'border-danger-300 text-danger-800',
      success: 'border-success-300 text-success-800',
      warning: 'border-warning-300 text-warning-900',
      info: 'border-line-strong text-ink-muted',
    },
  },
  defaultVariants: { tone: 'info' },
});

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
}

export function Alert({ tone, title, className, children, ...props }: AlertProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn(alertVariants({ tone }), className)} {...props}>
      {title && <p className="font-semibold">{title}</p>}
      {children}
    </div>
  );
}

import { forwardRef } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-800',
        outline: 'border border-line-strong bg-white text-ink hover:bg-surface-muted',
        danger: 'border border-danger-300 bg-white text-danger-700 hover:bg-danger-50',
        ghost: 'text-ink-muted hover:bg-surface-muted',
        link: 'p-0 text-primary hover:underline',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        icon: 'p-1.5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'className'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, disabled, className, children, ...props }, ref) => (
    <BaseButton
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </BaseButton>
  ),
);
Button.displayName = 'Button';

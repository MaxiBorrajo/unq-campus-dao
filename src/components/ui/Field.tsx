import { forwardRef } from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cn } from '../../lib/cn';

const controlClass =
  'w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-surface-muted disabled:text-ink-subtle';

export interface FieldProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + descripción. El control debe ser un `Input`, `Textarea` o `Select`. */
export function Field({ label, description, className, children }: FieldProps) {
  return (
    <BaseField.Root className={cn('block', className)}>
      <BaseField.Label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </BaseField.Label>
      {children}
      {description && (
        <BaseField.Description className="mt-1 block text-xs text-ink-subtle">
          {description}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}

export const Input = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => <BaseInput ref={ref} className={cn(controlClass, className)} {...props} />,
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(controlClass, 'leading-relaxed', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

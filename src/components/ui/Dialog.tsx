import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Bloquea el cierre (por ej. mientras se firma una transacción). */
  dismissible?: boolean;
}

const sizes = { md: 'max-w-md', lg: 'max-w-2xl' } as const;

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
  footer,
  dismissible = true,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(next) => (dismissible || next) && onOpenChange(next)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <BaseDialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white shadow-modal outline-none transition duration-150 data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
            sizes[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 px-6 pt-5">
            <div>
              <BaseDialog.Title className="text-base font-semibold text-ink">{title}</BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="mt-0.5 text-sm text-ink-subtle">{description}</BaseDialog.Description>
              )}
            </div>
            {dismissible && (
              <BaseDialog.Close
                aria-label="Cerrar"
                className="-mr-2 rounded-lg p-1.5 text-ink-subtle transition hover:bg-surface-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </BaseDialog.Close>
            )}
          </div>
          <div className="px-6 py-5">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2 px-6 pb-5">{footer}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

import { Toast as BaseToast } from '@base-ui/react/toast';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ToastType = 'success' | 'error' | 'info';

const accent: Record<ToastType, string> = {
  success: 'border-l-success-600',
  error: 'border-l-danger-600',
  info: 'border-l-primary',
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border border-l-4 border-line bg-white p-3 shadow-modal transition duration-200 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0',
        accent[(toast.type as ToastType) ?? 'info'] ?? accent.info,
      )}
    >
      <div className="min-w-0 flex-1 text-sm">
        <BaseToast.Title className="font-semibold text-ink" />
        <BaseToast.Description className="mt-0.5 break-words text-ink-muted" />
      </div>
      <BaseToast.Close aria-label="Cerrar" className="rounded-lg p-0.5 text-ink-subtle hover:text-ink">
        <X className="h-4 w-4" />
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

/** Provider + viewport. Montar una sola vez en la raíz de la app. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseToast.Provider timeout={6000}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/** Hook ergonómico: `const toast = useToast(); toast.error('...')`. */
export function useToast() {
  const manager = BaseToast.useToastManager();
  const show = (type: ToastType) => (title: string, description?: string) =>
    manager.add({ type, title, description });
  return { success: show('success'), error: show('error'), info: show('info') };
}

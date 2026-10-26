import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cn } from '../../lib/cn';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

/** Interruptor con label y descripción dentro de un recuadro clickeable. */
export function Switch({ checked, onCheckedChange, label, description, className }: SwitchProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-3', className)}>
      <BaseSwitch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full bg-line-strong transition outline-none focus-visible:ring-2 focus-visible:ring-primary data-[checked]:bg-primary"
      >
        <BaseSwitch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[checked]:translate-x-[18px]" />
      </BaseSwitch.Root>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-ink-subtle">{description}</span>}
      </span>
    </label>
  );
}

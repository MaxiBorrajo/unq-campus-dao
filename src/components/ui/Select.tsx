import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Select<T extends string = string>({
  value,
  onValueChange,
  options,
  disabled,
  className,
  ...aria
}: SelectProps<T>) {
  return (
    <BaseSelect.Root
      value={value}
      onValueChange={(v) => v != null && onValueChange(v as T)}
      items={options}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        {...aria}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border border-line-strong bg-white px-3 py-2 text-left text-sm text-ink outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-surface-muted disabled:text-ink-subtle',
          className,
        )}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-[60]">
          <BaseSelect.Popup className="min-w-[var(--anchor-width)] rounded-lg border border-line bg-white py-1 text-sm shadow-modal outline-none animate-in fade-in zoom-in-95 duration-100">
            <BaseSelect.List>
              {options.map((opt) => (
                <BaseSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-ink-muted outline-none data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary"
                >
                  <BaseSelect.ItemIndicator className="w-3.5">
                    <Check className="h-3.5 w-3.5" />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

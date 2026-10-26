import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { cn } from '../../lib/cn';

export interface RadioCardOption<T extends string> {
  value: T;
  label: string;
}

export interface RadioCardGroupProps<T extends string> {
  value: T | null;
  onValueChange: (value: T) => void;
  options: RadioCardOption<T>[];
  'aria-label'?: string;
}

export function RadioCardGroup<T extends string>({ value, onValueChange, options, ...aria }: RadioCardGroupProps<T>) {
  return (
    <RadioGroup
      value={value ?? ''}
      onValueChange={(v) => onValueChange(v as T)}
      className="grid grid-cols-3 gap-2"
      {...aria}
    >
      {options.map((opt) => (
        <Radio.Root
          key={opt.value}
          value={opt.value}
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-lg border border-line-strong px-3 py-2.5 text-center text-sm font-medium text-ink-muted outline-none transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary',
            value === opt.value && 'border-primary bg-primary-50 text-primary',
          )}
        >
          {opt.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}

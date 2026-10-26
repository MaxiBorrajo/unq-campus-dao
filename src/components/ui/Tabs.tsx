import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cn } from '../../lib/cn';

export const Tabs = BaseTabs.Root;
export const TabsPanel = BaseTabs.Panel;

export function TabsList({ className, ...props }: React.ComponentProps<typeof BaseTabs.List>) {
  return <BaseTabs.List className={cn('flex gap-5 border-b border-line', className as string)} {...props} />;
}

export function Tab({ className, ...props }: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        '-mb-px border-b-2 border-transparent pb-2.5 text-sm font-medium text-ink-subtle outline-none transition hover:text-ink focus-visible:text-ink data-[active]:border-primary data-[active]:text-primary',
        className as string,
      )}
      {...props}
    />
  );
}

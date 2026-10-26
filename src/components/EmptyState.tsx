import { Card } from './ui';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="space-y-2 px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mx-auto max-w-sm text-sm text-ink-subtle">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </Card>
  );
}

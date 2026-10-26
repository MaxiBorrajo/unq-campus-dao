import { cn } from '../../lib/cn';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={cn('rounded-lg border border-line bg-surface-card', className)} {...props} />;
}

export function CardBody({ className, ...props }: DivProps) {
  return <div className={cn('p-5', className)} {...props} />;
}

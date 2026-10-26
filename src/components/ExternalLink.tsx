import { cn } from '../lib/cn';

export function ExternalLink({ className, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noreferrer" className={cn('text-primary hover:underline', className)} {...props}>
      {children} ↗
    </a>
  );
}

import { Link } from 'react-router-dom';

export function BackLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="mb-4 inline-block text-sm font-medium text-primary hover:underline">
      ← {children}
    </Link>
  );
}

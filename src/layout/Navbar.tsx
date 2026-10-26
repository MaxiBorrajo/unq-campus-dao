import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { Role } from '../types';
import { SEPOLIA_CHAIN_ID } from '../config/contracts';
import { switchOrAddSepolia } from '../services';
import { cn } from '../lib/cn';
import { Button } from '../components/ui';
import { useWallet } from '../features/wallet/WalletContext';
import { useAdminRequests } from '../features/admin/AdminRequestsContext';

const ROLES: { value: Role; label: string }[] = [
  { value: 'student', label: 'Estudiante' },
  { value: 'admin', label: 'Facultad' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { wallet, activeRole, setActiveRole, hasFullAccess, disconnect } = useWallet();
  const { pendingCount } = useAdminRequests();
  const isSepolia = wallet.chainId === SEPOLIA_CHAIN_ID;

  const links: { to: string; label: string; visible: boolean; also?: string[] }[] = [
    { to: '/', label: 'Propuestas', visible: hasFullAccess, also: ['/mis-propuestas'] },
    { to: '/mis-votaciones', label: 'Mis votaciones', visible: hasFullAccess },
    { to: '/credencial', label: 'Mi credencial', visible: hasFullAccess },
    { to: '/registro', label: 'Solicitar credencial', visible: !wallet.hasCredentialNft },
    {
      to: '/admin',
      label: pendingCount > 0 ? `Panel (${pendingCount})` : 'Panel',
      visible: hasFullAccess && wallet.isIssuerAdmin && activeRole === 'admin',
    },
  ].filter((l) => l.visible);

  const changeRole = (role: Role) => {
    setActiveRole(role);
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      <div className="flex h-14 w-full items-center justify-between gap-6 px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/unq-logo.png" alt="UNQ" className="h-8 w-8 rounded-full bg-white object-contain" />
          <span className="hidden text-sm font-semibold sm:block">Centro de Estudiantes UNQ</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {links.map(({ to, label, also }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 font-medium transition',
                  isActive || also?.includes(pathname) ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {wallet.isIssuerAdmin && (
            <div className="flex rounded-lg bg-black/20 p-0.5">
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeRole(value)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                    activeRole === value ? 'bg-white text-primary' : 'text-white/70 hover:text-white',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {!isSepolia && (
            <Button size="sm" onClick={switchOrAddSepolia} className="bg-white text-primary hover:bg-white/90">
              Cambiar a Sepolia
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={disconnect} className="text-white/80 hover:bg-white/10 hover:text-white">
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}

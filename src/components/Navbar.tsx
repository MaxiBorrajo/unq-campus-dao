import React from 'react';
import { WalletState, Role } from '../types';
import { Wallet, ShieldCheck, UserCheck, HelpCircle, LogOut, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { switchOrAddSepolia } from '../services/web3';
import { SEPOLIA_CHAIN_ID } from '../config/contracts';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  activeRole: Role;
  onToggleRole: (role: Role) => void;
  studentName?: string;
  studentPhoto?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnect,
  onDisconnect,
  activeRole,
  onToggleRole,
  studentName = 'Estudiante UNQ',
  studentPhoto
}) => {
  const isSepolia = wallet.chainId === SEPOLIA_CHAIN_ID;

  return (
    <header className="unq-header-gradient text-white shadow-md border-b-2 border-[#5e101c] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y título institucional UNQ */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner border border-red-200 p-0.5 overflow-hidden">
              <img src="/images/unq-logo.png" alt="UNQ Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight leading-tight flex items-center gap-2">
                <span>Universidad Nacional de Quilmes</span>
              </div>
              <div className="text-xs text-red-200 flex items-center gap-1 font-medium">
                <span>Campus Virtual</span>
                <ChevronRight className="w-3 h-3 text-red-300" />
                <span className="text-white font-semibold">Centro de Estudiantes DAO</span>
              </div>
            </div>
          </div>

          {/* Selector de Rol (Admin / Estudiante) */}
          <div className="hidden md:flex items-center bg-[#5e101c] p-1 rounded-lg border border-red-800 text-xs">
            <span className="text-red-300 px-2 font-medium">Modo:</span>
            <button
              onClick={() => onToggleRole('student')}
              className={`px-3 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activeRole === 'student'
                  ? 'bg-white text-[#7a1827] shadow'
                  : 'text-red-200 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Estudiante
            </button>
            <button
              onClick={() => onToggleRole('admin')}
              className={`px-3 py-1 rounded font-semibold transition-all flex items-center gap-1 ${
                activeRole === 'admin'
                  ? 'bg-amber-400 text-gray-900 shadow'
                  : 'text-red-200 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Facultad (Admin)
            </button>
          </div>

          {/* Sección de Usuario & MetaMask */}
          <div className="flex items-center space-x-3">
            {/* Aviso si no está en Sepolia */}
            {wallet.isConnected && !isSepolia && (
              <button
                onClick={switchOrAddSepolia}
                className="bg-amber-500 hover:bg-amber-600 text-black text-xs px-2.5 py-1.5 rounded font-bold flex items-center gap-1 shadow animate-pulse"
                title="Cambiar a red Sepolia"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cambiar a Sepolia</span>
              </button>
            )}

            {wallet.isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Avatar y Datos de cuenta */}
                <div className="flex items-center space-x-2 bg-black/20 hover:bg-black/30 px-2.5 py-1.5 rounded-full border border-white/20">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-red-100 flex items-center justify-center border border-white/60">
                    {studentPhoto ? (
                      <img src={studentPhoto} alt={studentName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#7a1827] font-bold text-sm">
                        {studentName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-left text-xs pr-1 hidden sm:block">
                    <p className="font-semibold text-white leading-tight truncate max-w-[120px]">
                      {studentName}
                    </p>
                    <p className="text-[10px] text-red-200 font-mono">
                      {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Badge de Credencial NFT */}
                {wallet.hasCredentialNft && (
                  <span className="hidden lg:inline-flex items-center gap-1 bg-green-900/60 text-green-200 text-[10px] font-bold px-2 py-1 rounded border border-green-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                    Credencial NFT #{(wallet.nftTokenId?.slice(0, 4) || 'OK')}
                  </span>
                )}

                {/* Botón Salir */}
                <button
                  onClick={onDisconnect}
                  className="text-red-200 hover:text-white hover:bg-white/10 p-1.5 rounded transition text-xs flex items-center gap-1"
                  title="Desconectar Billetera"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={wallet.isConnecting}
                className="bg-white hover:bg-gray-100 text-[#7a1827] font-bold text-xs sm:text-sm px-4 py-2 rounded shadow flex items-center gap-2 transition transform active:scale-95"
              >
                {wallet.isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#7a1827]" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 text-[#7a1827]" />
                    <span>Ingresar con MetaMask</span>
                  </>
                )}
              </button>
            )}

            {/* Ayuda */}
            <a
              href="https://www.unq.edu.ar"
              target="_blank"
              rel="noreferrer"
              className="text-red-200 hover:text-white p-1 rounded hidden sm:flex items-center gap-1 text-xs"
              title="Ayuda UNQ"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ayuda</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};

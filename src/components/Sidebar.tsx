import React from 'react';
import { 
  Vote, 
  FilePlus, 
  Award, 
  ShieldCheck, 
  UserPlus, 
  Coins, 
  BookOpen, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Role, WalletState } from '../types';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  wallet: WalletState;
  activeRole: Role;
  pendingRequestsCount?: number;
  studentName?: string;
  studentPhoto?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  wallet,
  activeRole,
  pendingRequestsCount = 0,
  studentName = 'Estudiante UNQ',
  studentPhoto
}) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
      {/* Tarjeta de Perfil Estudiantil estilo Campus UNQ */}
      <div className="unq-card rounded bg-white p-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-red-100 flex-shrink-0 border-2 border-[#7a1827] shadow-sm">
          {studentPhoto ? (
            <img src={studentPhoto} alt={studentName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#7a1827] font-bold text-xl">
              {studentName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
            Bienvenido al Campus Virtual
          </p>
          <h2 className="text-sm font-bold text-[#7a1827] truncate">
            {studentName}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            {wallet.hasCredentialNft ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-800">
                Padrón Activo (1 Voto)
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                Sin Credencial NFT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menú: Accesos Rápidos */}
      <div className="unq-card rounded overflow-hidden">
        <div className="unq-title-bar px-4 py-2 flex items-center justify-between">
          <span>Accesos Rápidos</span>
          <Layers className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <nav className="divide-y divide-gray-100 text-xs">
          <button
            onClick={() => onSelectView('proposals')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
              currentView === 'proposals'
                ? 'bg-red-50 text-[#7a1827] font-bold border-l-4 border-[#7a1827]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Vote className="w-4 h-4 text-[#7a1827]" />
              <span>Propuestas y Votaciones</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => onSelectView('my-proposals')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
              currentView === 'my-proposals'
                ? 'bg-red-50 text-[#7a1827] font-bold border-l-4 border-[#7a1827]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span>Mis Propuestas Presentadas</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => onSelectView('create-proposal')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
              currentView === 'create-proposal'
                ? 'bg-red-50 text-[#7a1827] font-bold border-l-4 border-[#7a1827]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FilePlus className="w-4 h-4 text-emerald-600 font-bold" />
              <span className="font-semibold text-[#7a1827]">Generar Nueva Propuesta</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            onClick={() => onSelectView('credential')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
              currentView === 'credential'
                ? 'bg-red-50 text-[#7a1827] font-bold border-l-4 border-[#7a1827]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Mi Credencial Universitaria NFT</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {!wallet.hasCredentialNft && (
            <button
              onClick={() => onSelectView('registration')}
              className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
                currentView === 'registration'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-600'
                  : 'text-amber-700 bg-amber-50/50 hover:bg-amber-100/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">Solicitar Ingreso / Credencial</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
            </button>
          )}

          {/* Panel Admin / Facultad */}
          <button
            onClick={() => onSelectView('admin')}
            className={`w-full px-4 py-3 text-left flex items-center justify-between transition ${
              currentView === 'admin'
                ? 'bg-red-50 text-[#7a1827] font-bold border-l-4 border-[#7a1827]'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#7a1827]" />
              <span>Panel Facultad (Emisión NFT)</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Menú: Servicios e Institucional */}
      <div className="unq-card rounded overflow-hidden">
        <div className="unq-title-bar px-4 py-2">
          <span>Servicios e Información</span>
        </div>
        <div className="p-3 text-xs space-y-2 text-gray-600">
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="font-medium text-gray-700 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-600" /> Tesorería UNQ
            </span>
            <span className="text-gray-900 font-mono font-semibold">20% tope/op</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="font-medium text-gray-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Timelock Delay
            </span>
            <span className="text-gray-900 font-mono">60 seg</span>
          </div>
          <div className="pt-2">
            <a
              href="https://sepolia.etherscan.io/address/0x94a6A38E968110b7aE9477413d89baa540834A65"
              target="_blank"
              rel="noreferrer"
              className="text-[#7a1827] hover:underline flex items-center gap-1 text-[11px] font-medium"
            >
              <span>Ver Gobernador en Etherscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};


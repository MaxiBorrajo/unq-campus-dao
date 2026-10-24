import React, { useState } from 'react';
import { Proposal, WalletState } from '../types';
import { ProposalCard } from '../components/ProposalCard';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Layers, 
  Vote, 
  CheckCircle2, 
  Clock, 
  Coins 
} from 'lucide-react';

interface ProposalsViewProps {
  proposals: Proposal[];
  wallet: WalletState;
  onSelectProposal: (proposal: Proposal) => void;
  onVoteClick: (proposal: Proposal) => void;
  onCreateProposalClick: () => void;
  initialTab?: 'all' | 'mine';
}

export const ProposalsView: React.FC<ProposalsViewProps> = ({
  proposals,
  wallet,
  onSelectProposal,
  onVoteClick,
  onCreateProposalClick,
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProposals = proposals.filter((p) => {
    // Tab filter
    if (activeTab === 'mine') {
      if (!wallet.address || p.proposer?.toLowerCase() !== wallet.address.toLowerCase()) {
        return false;
      }
    }

    // Status filter
    if (selectedStatus !== 'all' && p.status !== selectedStatus) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  const activeCount = proposals.filter((p) => p.status === 'Active').length;
  const passedCount = proposals.filter((p) => p.status === 'Succeeded' || p.status === 'Executed' || p.status === 'Queued').length;

  return (
    <div className="space-y-4">
      {/* Barra superior de bienvenida e indicadores */}
      <div className="unq-card rounded bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#7a1827]" />
              <span>Centro de Estudiantes UNQ • Gobernanza Digital</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Presentá propuestas, votá iniciativas académicas o decidí el uso de los fondos de la Tesorería.
            </p>
          </div>

          <button
            onClick={onCreateProposalClick}
            disabled={!wallet.hasCredentialNft}
            className={`font-bold text-xs px-4 py-2.5 rounded shadow flex items-center gap-2 transition active:scale-95 ${
              wallet.hasCredentialNft
                ? 'bg-[#7a1827] hover:bg-[#60121e] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={wallet.hasCredentialNft ? 'Generar nueva propuesta' : 'Requiere Credencial NFT'}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generar Nueva Propuesta</span>
          </button>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
          <div className="bg-gray-50 p-2.5 rounded border border-gray-100 flex items-center gap-2.5">
            <div className="p-2 rounded bg-red-100 text-[#7a1827]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Total Propuestas</span>
              <span className="text-sm font-bold text-gray-900">{proposals.length}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-2.5 rounded border border-gray-100 flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-100 text-emerald-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Votaciones Activas</span>
              <span className="text-sm font-bold text-emerald-700">{activeCount}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-2.5 rounded border border-gray-100 flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-100 text-blue-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">Aprobadas / Ejecutadas</span>
              <span className="text-sm font-bold text-blue-700">{passedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs y Filtros */}
      <div className="unq-card rounded bg-white p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Tabs: Todas vs Mis Propuestas */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'all'
                ? 'bg-white text-[#7a1827] shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas las Propuestas ({proposals.length})
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === 'mine'
                ? 'bg-white text-[#7a1827] shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mis Propuestas
          </button>
        </div>

        {/* Buscador y Filtro por Estado */}
        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, palabra clave..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#7a1827] focus:border-[#7a1827] outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded py-1.5 px-2 text-xs outline-none focus:border-[#7a1827]"
            >
              <option value="all">Todos los estados</option>
              <option value="Active">Votación Abierta</option>
              <option value="Pending">En Espera</option>
              <option value="Succeeded">Aprobadas</option>
              <option value="Queued">En Timelock</option>
              <option value="Executed">Ejecutadas</option>
              <option value="Defeated">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de propuestas */}
      <div className="space-y-3">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((prop) => (
            <ProposalCard
              key={prop.id}
              proposal={prop}
              onSelect={onSelectProposal}
              onVoteClick={onVoteClick}
              userCanVote={wallet.hasCredentialNft}
              userHasVoted={prop.hasVoted}
            />
          ))
        ) : (
          <div className="unq-card rounded bg-white p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#7a1827] flex items-center justify-center mx-auto">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">
              {activeTab === 'mine'
                ? 'Aún no presentaste ninguna propuesta'
                : 'No se encontraron propuestas con los filtros seleccionados'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {activeTab === 'mine'
                ? 'Como estudiante con credencial NFT tenés derecho a elevar peticiones al centro de estudiantes y a la facultad.'
                : 'Probá modificando el criterio de búsqueda o cambiá el estado seleccionado.'}
            </p>
            {activeTab === 'mine' && wallet.hasCredentialNft && (
              <button
                onClick={onCreateProposalClick}
                className="bg-[#7a1827] text-white text-xs font-bold px-4 py-2 rounded shadow hover:bg-[#60121e] transition inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Crear mi primera propuesta
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


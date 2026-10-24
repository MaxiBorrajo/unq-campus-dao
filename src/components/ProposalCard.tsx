import React from 'react';
import { Proposal } from '../types';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Coins, 
  User, 
  Clock, 
  Check, 
  ExternalLink 
} from 'lucide-react';

interface ProposalCardProps {
  proposal: Proposal;
  onSelect: (proposal: Proposal) => void;
  onVoteClick?: (proposal: Proposal) => void;
  userCanVote: boolean;
  userHasVoted?: boolean;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onSelect,
  onVoteClick,
  userCanVote,
  userHasVoted
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>Votación Abierta</span>;
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Período de Espera</span>;
      case 'Succeeded':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Aprobada (Para Encolar)</span>;
      case 'Queued':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">En Timelock (Espera)</span>;
      case 'Executed':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Ejecutada On-Chain</span>;
      case 'Defeated':
        return <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Rechazada</span>;
      case 'Canceled':
        return <span className="bg-gray-200 text-gray-700 border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Cancelada</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  const total = proposal.totalVotes || (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes);
  const forPercent = total > 0 ? (proposal.forVotes / total) * 100 : 0;
  const againstPercent = total > 0 ? (proposal.againstVotes / total) * 100 : 0;
  const abstainPercent = total > 0 ? (proposal.abstainVotes / total) * 100 : 0;

  return (
    <div className="unq-card rounded bg-white hover:border-[#7a1827] transition-all duration-200 overflow-hidden shadow-sm">
      {/* Header estilo Campus UNQ */}
      <div className="bg-[#f5f5f5] px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-600 uppercase tracking-wider text-[11px]">
            {proposal.category || 'Iniciativa General'}
          </span>
          {proposal.ethAmount && parseFloat(proposal.ethAmount) > 0 && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-700" />
              Presupuesto: {proposal.ethAmount} ETH
            </span>
          )}
        </div>
        <div>{getStatusBadge(proposal.status)}</div>
      </div>

      {/* Contenido principal */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 
              onClick={() => onSelect(proposal)}
              className="text-base font-bold text-gray-900 hover:text-[#7a1827] cursor-pointer transition flex items-center gap-1.5"
            >
              <span>{proposal.title}</span>
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {proposal.description}
            </p>
          </div>
        </div>

        {/* Metadatos: proponente y tiempo */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium text-gray-700">Proponente:</span>
            <span className="font-mono text-gray-600">
              {proposal.proposer?.slice(0, 6)}...{proposal.proposer?.slice(-4)}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>ID Propuesta: <span className="font-mono text-gray-700">#{proposal.id?.slice(0, 8)}</span></span>
          </span>
        </div>

        {/* Barra de progreso de votación */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-medium text-gray-700">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              A favor: {proposal.forVotes} ({forPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1 text-red-700">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              En contra: {proposal.againstVotes} ({againstPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <MinusCircle className="w-3.5 h-3.5 text-gray-400" />
              Abstención: {proposal.abstainVotes} ({abstainPercent.toFixed(0)}%)
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${forPercent}%` }} 
              className="bg-emerald-600 transition-all duration-300"
              title={`A favor: ${forPercent.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${againstPercent}%` }} 
              className="bg-red-600 transition-all duration-300"
              title={`En contra: ${againstPercent.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${abstainPercent}%` }} 
              className="bg-gray-400 transition-all duration-300"
              title={`Abstención: ${abstainPercent.toFixed(1)}%`}
            />
          </div>
          <div className="text-[10px] text-gray-500 text-right">
            Total de votos emitidos: <span className="font-bold text-gray-800">{total}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onSelect(proposal)}
            className="text-[#7a1827] hover:underline font-semibold text-xs flex items-center gap-1"
          >
            <span>Ver expediente y debate</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {userHasVoted && (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs px-2.5 py-1 rounded font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Voto Registrado
              </span>
            )}

            {proposal.status === 'Active' && userCanVote && !userHasVoted && onVoteClick && (
              <button
                onClick={() => onVoteClick(proposal)}
                className="bg-[#7a1827] hover:bg-[#60121e] text-white text-xs font-bold px-3 py-1.5 rounded shadow transition active:scale-95"
              >
                Votar Propuesta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


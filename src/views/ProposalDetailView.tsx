import React, { useState, useEffect } from 'react';
import { Proposal, WalletState } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Coins, 
  ShieldCheck, 
  User, 
  ExternalLink, 
  AlertCircle,
  RefreshCw,
  GitBranch,
  Play
} from 'lucide-react';
import { CONTRACT_ADDRESSES, GOVERNOR_ABI, TREASURY_ABI } from '../config/contracts';
import { getSigner } from '../services/web3';
import { ethers } from 'ethers';

interface ProposalDetailViewProps {
  proposal: Proposal;
  wallet: WalletState;
  onBack: () => void;
  onVoteClick: (proposal: Proposal) => void;
  onRefresh: () => void;
}

export const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({
  proposal,
  wallet,
  onBack,
  onVoteClick,
  onRefresh
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const total = proposal.totalVotes || (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes);
  const forPercent = total > 0 ? (proposal.forVotes / total) * 100 : 0;
  const againstPercent = total > 0 ? (proposal.againstVotes / total) * 100 : 0;
  const abstainPercent = total > 0 ? (proposal.abstainVotes / total) * 100 : 0;

  // Timelock queue operation
  const handleQueue = async () => {
    try {
      setIsProcessing(true);
      setActionError(null);
      const signer = await getSigner();
      const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);

      let targets = [proposal.targetAddress || CONTRACT_ADDRESSES.TREASURY];
      let values = [0n];
      let calldatas = ['0x'];

      if (proposal.category === 'Presupuesto / Tesorería' && proposal.ethAmount && parseFloat(proposal.ethAmount) > 0) {
        const treasuryInterface = new ethers.Interface(TREASURY_ABI);
        const amountWei = ethers.parseEther(proposal.ethAmount);
        calldatas = [treasuryInterface.encodeFunctionData('transferETH', [proposal.proposer, amountWei])];
      }

      const fullDescription = `${proposal.title}\n\n${proposal.description}\n\n[Categoría: ${proposal.category}]`;
      const descHash = ethers.id(fullDescription);

      const tx = await gov.queue(targets, values, calldatas, descHash);
      setActionSuccess('Encolando propuesta en Timelock...');
      await tx.wait();
      setActionSuccess('¡Propuesta encolada exitosamente en el Timelock!');
      setTimeout(() => {
        onRefresh();
      }, 2000);
    } catch (e: any) {
      console.error('Error queuing proposal:', e);
      setActionError(e.reason || e.message || 'Error al encolar la propuesta');
    } finally {
      setIsProcessing(false);
    }
  };

  // Timelock execute operation
  const handleExecute = async () => {
    try {
      setIsProcessing(true);
      setActionError(null);
      const signer = await getSigner();
      const gov = new ethers.Contract(CONTRACT_ADDRESSES.GOVERNOR, GOVERNOR_ABI, signer);

      let targets = [proposal.targetAddress || CONTRACT_ADDRESSES.TREASURY];
      let values = [0n];
      let calldatas = ['0x'];

      if (proposal.category === 'Presupuesto / Tesorería' && proposal.ethAmount && parseFloat(proposal.ethAmount) > 0) {
        const treasuryInterface = new ethers.Interface(TREASURY_ABI);
        const amountWei = ethers.parseEther(proposal.ethAmount);
        calldatas = [treasuryInterface.encodeFunctionData('transferETH', [proposal.proposer, amountWei])];
      }

      const fullDescription = `${proposal.title}\n\n${proposal.description}\n\n[Categoría: ${proposal.category}]`;
      const descHash = ethers.id(fullDescription);

      const tx = await gov.execute(targets, values, calldatas, descHash);
      setActionSuccess('Ejecutando propuesta on-chain...');
      await tx.wait();
      setActionSuccess('¡Propuesta ejecutada exitosamente! Los fondos y cambios fueron aplicados.');
      setTimeout(() => {
        onRefresh();
      }, 2000);
    } catch (e: any) {
      console.error('Error executing proposal:', e);
      setActionError(e.reason || e.message || 'Error al ejecutar la propuesta on-chain');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="text-[#7a1827] hover:underline text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la lista de propuestas</span>
      </button>

      {/* Tarjeta Principal del Expediente */}
      <div className="unq-card rounded bg-white shadow-sm overflow-hidden">
        {/* Header estilo UNQ */}
        <div className="bg-[#7a1827] text-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Expediente #{proposal.id?.slice(0, 10)}...
            </span>
            <h1 className="text-xl font-bold leading-tight">{proposal.title}</h1>
          </div>
          <div>
            <span className="bg-white text-[#7a1827] font-bold text-xs px-3 py-1.5 rounded shadow uppercase tracking-wider">
              {proposal.status}
            </span>
          </div>
        </div>

        {/* Metadatos rápidos */}
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-700">Presentada por:</span>
              <span className="font-mono text-[#7a1827] font-medium">{proposal.proposer}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Categoría: <strong>{proposal.category}</strong></span>
            </span>
          </div>

          {proposal.ethAmount && parseFloat(proposal.ethAmount) > 0 && (
            <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded font-bold flex items-center gap-1.5 text-xs">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>Desembolso de Tesorería: {proposal.ethAmount} ETH</span>
            </div>
          )}
        </div>

        {/* Fundamentos de la propuesta */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Fundamentos y Propuesta Detallada
            </h3>
            <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-4 rounded border border-gray-200">
              {proposal.description}
            </div>
          </div>

          {/* Gráfico y Desglose de Votación */}
          <div className="unq-card rounded p-4 bg-white border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Escrutinio de Votos On-Chain
              </h3>
              <span className="text-xs text-gray-500">
                Total emitidos: <strong className="text-gray-800">{total}</strong>
              </span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${forPercent}%` }} className="bg-emerald-600 transition-all duration-300" />
              <div style={{ width: `${againstPercent}%` }} className="bg-red-600 transition-all duration-300" />
              <div style={{ width: `${abstainPercent}%` }} className="bg-gray-400 transition-all duration-300" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">A Favor</span>
                <span className="text-base font-black text-emerald-700">{proposal.forVotes}</span>
                <span className="text-[10px] text-emerald-600 block">({forPercent.toFixed(1)}%)</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
                <span className="text-[11px] font-bold text-red-800 uppercase block">En Contra</span>
                <span className="text-base font-black text-red-700">{proposal.againstVotes}</span>
                <span className="text-[10px] text-red-600 block">({againstPercent.toFixed(1)}%)</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-center">
                <span className="text-[11px] font-bold text-gray-700 uppercase block">Abstención</span>
                <span className="text-base font-black text-gray-700">{proposal.abstainVotes}</span>
                <span className="text-[10px] text-gray-500 block">({abstainPercent.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          {/* Acciones según el estado del Governor */}
          <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Acciones de Gobernanza
            </h4>

            {actionError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {/* Botón de Votar si está activa */}
              {proposal.status === 'Active' && (
                <>
                  {wallet.hasCredentialNft ? (
                    <button
                      onClick={() => onVoteClick(proposal)}
                      className="bg-[#7a1827] hover:bg-[#60121e] text-white text-xs font-bold px-5 py-2.5 rounded shadow flex items-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Emitir Mi Voto Estudiantil</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                      Debes poseer la credencial universitaria NFT para votar.
                    </div>
                  )}
                </>
              )}

              {/* Botón de Encolar si fue Aprobada */}
              {proposal.status === 'Succeeded' && (
                <button
                  onClick={handleQueue}
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded shadow flex items-center gap-2 transition"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
                  <span>Encolar en TimelockController (Queue)</span>
                </button>
              )}

              {/* Botón de Ejecutar si está en Timelock */}
              {proposal.status === 'Queued' && (
                <button
                  onClick={handleExecute}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded shadow flex items-center gap-2 transition"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Ejecutar Propuesta (Execute On-Chain)</span>
                </button>
              )}

              {proposal.status === 'Executed' && (
                <span className="text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Propuesta completamente ejecutada y asentada on-chain.
                </span>
              )}
            </div>
          </div>

          {/* Información técnica del contrato */}
          <div className="text-[11px] text-gray-500 space-y-1 font-mono pt-2 border-t border-gray-200">
            <div>Target Address: {proposal.targetAddress || CONTRACT_ADDRESSES.TREASURY}</div>
            <div>Contrato Governor: {CONTRACT_ADDRESSES.GOVERNOR}</div>
            <div>Contrato Timelock: {CONTRACT_ADDRESSES.TIMELOCK}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


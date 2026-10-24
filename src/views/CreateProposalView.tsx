import React, { useState } from 'react';
import { WalletState } from '../types';
import { 
  ArrowLeft, 
  FileText, 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { createGovernorProposal } from '../services/web3';
import { api } from '../services/api';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface CreateProposalViewProps {
  wallet: WalletState;
  onBack: () => void;
  onCreated: (proposalId: string) => void;
  treasuryBalance?: string;
}

export const CreateProposalView: React.FC<CreateProposalViewProps> = ({
  wallet,
  onBack,
  onCreated,
  treasuryBalance = '0.0'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Académica' | 'Presupuesto / Tesorería' | 'Infraestructura' | 'General'>('Académica');
  const [isTreasuryProposal, setIsTreasuryProposal] = useState(false);
  const [ethAmount, setEthAmount] = useState('0.01');
  const [beneficiary, setBeneficiary] = useState(wallet.address || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Por favor completá el título y la descripción detallada.');
      return;
    }

    if (isTreasuryProposal) {
      if (!beneficiary.trim() || !ethAmount || parseFloat(ethAmount) <= 0) {
        setErrorMsg('Para propuestas de tesorería debes indicar una billetera de destino y un monto válido en ETH.');
        return;
      }
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      setSuccessMsg('Enviando transacción a la red Sepolia...');

      // 1. Propose on Governor smart contract
      const result = await createGovernorProposal({
        title,
        description,
        category: isTreasuryProposal ? 'Presupuesto / Tesorería' : category,
        isTreasury: isTreasuryProposal,
        beneficiaryAddress: beneficiary,
        ethAmount: isTreasuryProposal ? ethAmount : '0'
      });

      setSuccessMsg('Transacción confirmada on-chain. Guardando metadatos...');

      // 2. Save metadata in backend SQLite
      await api.saveProposalMetadata({
        proposalId: result.proposalId,
        title,
        description,
        category: isTreasuryProposal ? 'Presupuesto / Tesorería' : category,
        targetAddress: isTreasuryProposal ? CONTRACT_ADDRESSES.TREASURY : undefined,
        ethAmount: isTreasuryProposal ? ethAmount : '0',
        proposer: wallet.address || ''
      });

      setSuccessMsg('¡Propuesta creada con éxito!');
      setTimeout(() => {
        onCreated(result.proposalId);
      }, 1500);

    } catch (err: any) {
      console.error('Error al crear propuesta:', err);
      // Human-readable errors from StudentGovernor
      if (err.message?.includes('ActiveProposalExists')) {
        setErrorMsg('Ya posees una propuesta abierta o en votación. Debes esperar a que finalice.');
      } else if (err.message?.includes('ProposalCooldownActive')) {
        setErrorMsg('El contrato requiere un período de enfriamiento (cooldown) de 60 segundos entre propuestas del mismo estudiante.');
      } else {
        setErrorMsg(err.reason || err.message || 'Error al enviar la propuesta on-chain');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="text-[#7a1827] hover:underline text-xs font-semibold flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la lista de propuestas</span>
      </button>

      {/* Tarjeta principal del formulario */}
      <div className="unq-card rounded bg-white overflow-hidden shadow-sm">
        
        {/* Cabecera estilo UNQ */}
        <div className="bg-[#7a1827] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded">
              <FileText className="w-5 h-5 text-red-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Presentar Nueva Propuesta Estudiantil</h2>
              <p className="text-xs text-red-200">
                Iniciativa formal de gobernanza • Universidad Nacional de Quilmes
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-1 rounded border border-red-500/30">
            OpenZeppelin Governor v5
          </span>
        </div>

        {/* Notificación de reglas del contrato */}
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Reglas anti-spam del contrato:</span>
            <p className="text-[11px] text-amber-800">
              Cada estudiante puede tener solo 1 propuesta activa a la vez. Entre propuesta y propuesta aplica un enfriamiento (cooldown) de 60 segundos.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Título de la Propuesta *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Ampliación de bibliografía digital y suscripciones a papers"
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#7a1827] focus:border-[#7a1827] outline-none"
            />
          </div>

          {/* Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Eje Temático *
              </label>
              <select
                value={category}
                disabled={isTreasuryProposal}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#7a1827] bg-white disabled:bg-gray-100"
              >
                <option value="Académica">Académica y Planes de Estudio</option>
                <option value="Infraestructura">Infraestructura, Aulas y Laboratorios</option>
                <option value="General">Iniciativa Estudiantil General</option>
              </select>
            </div>

            {/* Toggle Tesorería */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  checked={isTreasuryProposal}
                  onChange={(e) => setIsTreasuryProposal(e.target.checked)}
                  className="rounded text-[#7a1827] focus:ring-[#7a1827] w-4 h-4"
                />
                <div className="min-w-0">
                  <span className="font-bold text-gray-800 flex items-center gap-1 text-xs">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    ¿Solicita Fondos de la Tesorería?
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    Ejecuta transferETH() on-chain si se aprueba
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Campos adicionales de Tesorería */}
          {isTreasuryProposal && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-900 border-b border-amber-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" />
                  Configuración del Desembolso de Fondos
                </span>
                <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                  Balance Tesorería: {treasuryBalance} ETH
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Monto a Solicitar (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.0001"
                    required
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:border-[#7a1827] outline-none"
                    placeholder="0.01"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Tope máx: 20% del balance de la tesorería
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Billetera Receptora (Beneficiario) *
                  </label>
                  <input
                    type="text"
                    required
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    className="w-full text-xs p-2 font-mono border border-gray-300 rounded focus:border-[#7a1827] outline-none"
                    placeholder="0x..."
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    Dirección que recibirá los fondos si gana la votación
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Descripción completa */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Descripción, Fundamentos y Plan de Acción *
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describí con detalle la problemática detectada, la solución planteada, a quiénes beneficia y el impacto en la comunidad estudiantil de la UNQ..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#7a1827] focus:border-[#7a1827] outline-none leading-relaxed"
            />
          </div>

          {/* Mensajes de error o éxito */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#7a1827] hover:bg-[#60121e] disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded shadow flex items-center gap-2 transition active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando con MetaMask...</span>
                </>
              ) : (
                <span>Publicar Propuesta On-Chain</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


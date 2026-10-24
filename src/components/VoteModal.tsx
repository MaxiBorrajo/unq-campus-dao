import React, { useState } from 'react';
import { Proposal } from '../types';
import { X, CheckCircle2, XCircle, MinusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { castVote } from '../services/web3';

interface VoteModalProps {
  proposal: Proposal;
  onClose: () => void;
  onVoteSuccess: () => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  proposal,
  onClose,
  onVoteSuccess
}) => {
  const [selectedSupport, setSelectedSupport] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitVote = async () => {
    if (selectedSupport === null) {
      setErrorMsg('Seleccioná tu postura de voto antes de continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await castVote(proposal.id, selectedSupport, reason);
      onVoteSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al emitir voto:', err);
      setErrorMsg(err.reason || err.message || 'Error al emitir el voto con MetaMask');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header estilo UNQ */}
        <div className="bg-[#7a1827] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight">Emitir Voto Estudiantil</h3>
            <p className="text-xs text-red-200 mt-0.5">Centro de Estudiantes UNQ • 1 Estudiante = 1 Voto</p>
          </div>
          <button
            onClick={onClose}
            className="text-red-200 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info de la propuesta */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Propuesta a votar
            </p>
            <h4 className="font-bold text-gray-900 mt-0.5">{proposal.title}</h4>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{proposal.description}</p>
          </div>

          {/* Opciones de voto */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Seleccioná tu voto:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedSupport(1)}
                className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-1.5 ${
                  selectedSupport === 1
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${selectedSupport === 1 ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className="font-bold text-xs">A Favor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSupport(0)}
                className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-1.5 ${
                  selectedSupport === 0
                    ? 'border-red-600 bg-red-50 text-red-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <XCircle className={`w-5 h-5 ${selectedSupport === 0 ? 'text-red-600' : 'text-gray-400'}`} />
                <span className="font-bold text-xs">En Contra</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSupport(2)}
                className={`p-3 rounded-lg border-2 text-center transition flex flex-col items-center gap-1.5 ${
                  selectedSupport === 2
                    ? 'border-gray-600 bg-gray-100 text-gray-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <MinusCircle className={`w-5 h-5 ${selectedSupport === 2 ? 'text-gray-700' : 'text-gray-400'}`} />
                <span className="font-bold text-xs">Abstención</span>
              </button>
            </div>
          </div>

          {/* Justificación opcional */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Justificación de voto (Opcional):
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explicá brevemente a la comunidad el motivo de tu postura..."
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#7a1827] focus:border-[#7a1827] outline-none"
            />
          </div>

          {/* Mensaje de error */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmitVote}
              disabled={isSubmitting || selectedSupport === null}
              className="bg-[#7a1827] hover:bg-[#60121e] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded shadow flex items-center gap-2 transition"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Firmando en MetaMask...</span>
                </>
              ) : (
                <span>Confirmar y Votar On-Chain</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


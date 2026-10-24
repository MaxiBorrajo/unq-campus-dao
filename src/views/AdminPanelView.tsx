import React, { useState, useEffect } from 'react';
import { StudentRequest, Proposal, WalletState } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Coins, 
  Vote, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  AlertTriangle,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { mintStudentCredential, getTreasuryInfo } from '../services/web3';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface AdminPanelViewProps {
  wallet: WalletState;
  proposals: Proposal[];
  onRefreshData: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  wallet,
  proposals,
  onRefreshData
}) => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'proposals' | 'treasury'>('requests');
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [treasuryData, setTreasuryData] = useState<{
    balanceEth: string;
    maxTransferPercent: string;
  }>({ balanceEth: '0', maxTransferPercent: '20' });

  useEffect(() => {
    loadRequests();
    loadTreasury();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const data = await api.getAdminRequests();
      setRequests(data);
    } catch (e: any) {
      console.warn('Error loading admin requests:', e);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadTreasury = async () => {
    try {
      const data = await getTreasuryInfo();
      setTreasuryData(data);
    } catch (e) {
      console.warn('Error loading treasury:', e);
    }
  };

  const handleApproveAndMint = async (req: StudentRequest) => {
    try {
      setProcessingId(req.id);
      setActionError(null);
      setActionSuccess(`Iniciando minteo on-chain de la credencial para ${req.firstName} ${req.lastName}...`);

      // 1. Call mint(address) on StudentCredential contract with MetaMask
      const txHash = await mintStudentCredential(req.address);

      setActionSuccess(`Credencial minteada on-chain. Guardando estado en base de datos...`);

      // 2. Mark as approved in SQLite
      await api.approveRequest(req.id, txHash);

      setActionSuccess(`¡Credencial NFT emitida exitosamente para ${req.firstName} ${req.lastName}!`);
      loadRequests();
      onRefreshData();
    } catch (err: any) {
      console.error('Error minting credential:', err);
      if (err.message?.includes('AlreadyIssued')) {
        setActionError('Este estudiante ya posee una credencial NFT emitida en el contrato.');
        // Still update in DB
        await api.approveRequest(req.id);
        loadRequests();
      } else {
        setActionError(err.reason || err.message || 'Error al ejecutar mint() en el contrato');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: StudentRequest) => {
    const reason = prompt('Ingrese el motivo del rechazo para informar al alumno:', 'No coincide con el padrón de alumnos regulares de la UNQ');
    if (!reason) return;

    try {
      setProcessingId(req.id);
      setActionError(null);
      await api.rejectRequest(req.id, reason);
      setActionSuccess(`Solicitud de ${req.firstName} rechazada.`);
      loadRequests();
    } catch (err: any) {
      setActionError(err.message || 'Error al rechazar');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');

  return (
    <div className="space-y-4">
      {/* Header del Panel */}
      <div className="unq-card rounded bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded text-[#7a1827]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>Panel de Administración • Facultad UNQ</span>
                <span className="text-[10px] bg-red-100 text-[#7a1827] font-bold px-2 py-0.5 rounded border border-red-200">
                  ISSUER ROLE
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Emisión on-chain de credenciales soulbound a estudiantes y monitoreo de la DAO.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { loadRequests(); loadTreasury(); }}
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded border border-gray-300 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar Datos</span>
            </button>
          </div>
        </div>

        {/* Notificaciones globales */}
        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Tabs del Admin */}
      <div className="unq-card rounded bg-white p-2 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-[#7a1827] text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Solicitudes de Alumnos ({pendingRequests.length} pendientes)</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'proposals'
              ? 'bg-[#7a1827] text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Monitoreo de Propuestas ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('treasury')}
          className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'treasury'
              ? 'bg-[#7a1827] text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Tesorería y Timelock</span>
        </button>
      </div>

      {/* Tab 1: Solicitudes de Alumnos */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="unq-card rounded bg-white overflow-hidden shadow-sm">
            <div className="unq-title-bar px-4 py-3 flex items-center justify-between">
              <span>Bandeja de Solicitudes Pendientes para Minteo On-Chain</span>
              <span className="text-[11px] font-bold text-[#7a1827]">
                {pendingRequests.length} Alumnos en espera
              </span>
            </div>

            {isLoadingRequests ? (
              <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#7a1827]" />
                <span>Cargando solicitudes desde SQLite...</span>
              </div>
            ) : pendingRequests.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50/60 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {req.photoData ? (
                          <img src={req.photoData} alt={req.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 font-bold text-lg">{req.firstName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="space-y-0.5 text-xs min-w-0">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <span>{req.firstName} {req.lastName}</span>
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                            DNI {req.dni}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">{req.career}</p>
                        <p className="text-[11px] font-mono text-gray-500">
                          Wallet: {req.address}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción del admin */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(req)}
                        disabled={processingId === req.id}
                        className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition flex items-center gap-1.5"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>

                      <button
                        onClick={() => handleApproveAndMint(req)}
                        disabled={processingId === req.id}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded shadow transition flex items-center gap-1.5 active:scale-95"
                      >
                        {processingId === req.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Minteando en Sepolia...</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5" />
                            <span>Aprobar y Mintear NFT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                No hay solicitudes pendientes en este momento. Todos los alumnos están al día.
              </div>
            )}
          </div>

          {/* Historial de Aprobados */}
          {approvedRequests.length > 0 && (
            <div className="unq-card rounded bg-white overflow-hidden shadow-sm">
              <div className="unq-title-bar px-4 py-2">
                <span>Historial de Credenciales Emitidas ({approvedRequests.length})</span>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {approvedRequests.map((req) => (
                  <div key={req.id} className="p-3 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-gray-800">{req.firstName} {req.lastName}</span>
                      <span className="text-gray-500 font-mono">({req.dni})</span>
                      <span className="text-gray-400">• {req.career}</span>
                    </div>
                    {req.mintTxHash && (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${req.mintTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#7a1827] hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Tx: {req.mintTxHash.slice(0, 10)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Monitoreo de Propuestas */}
      {activeTab === 'proposals' && (
        <div className="unq-card rounded bg-white overflow-hidden shadow-sm">
          <div className="unq-title-bar px-4 py-3">
            <span>Todas las Propuestas del Centro de Estudiantes</span>
          </div>
          <div className="divide-y divide-gray-100 text-xs">
            {proposals.map((p) => (
              <div key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{p.title}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1">{p.description}</p>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono text-gray-700 font-semibold">
                    Votos: {p.forVotes} a favor / {p.againstVotes} contra
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.GOVERNOR}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7a1827] hover:underline flex items-center gap-1 text-[11px] justify-end"
                  >
                    <span>Ver en Governor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tesorería y Timelock */}
      {activeTab === 'treasury' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="unq-card rounded bg-white p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>Contrato de Tesorería (Treasury)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Balance Disponible</span>
                <span className="text-2xl font-black text-amber-900">{treasuryData.balanceEth} ETH</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Tope máximo por operación:</span>
                <span className="font-bold text-gray-800">{treasuryData.maxTransferPercent}% del balance ({CONTRACT_ADDRESSES.TREASURY})</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Owner del Contrato:</span>
                <span className="font-mono text-[11px] text-gray-700 break-all">{CONTRACT_ADDRESSES.TIMELOCK} (TimelockController)</span>
              </div>
            </div>
          </div>

          <div className="unq-card rounded bg-white p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Contrato TimelockController</span>
            </h3>
            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>
                El Timelock es el custodio real y ejecutor de las transferencias. Toda propuesta aprobada por los estudiantes debe esperar el delay de seguridad de <strong>60 segundos</strong> antes de poder ser ejecutada.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-xs">
                <strong>Gobernador Autorizado:</strong>
                <p className="font-mono text-[11px] break-all mt-0.5">{CONTRACT_ADDRESSES.GOVERNOR}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


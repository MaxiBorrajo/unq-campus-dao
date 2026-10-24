import React from 'react';
import { ShieldCheck, Award, Lock, CheckCircle2, User, BookOpen, Fingerprint } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface StudentBadgeProps {
  address: string;
  tokenId?: string;
  studentName?: string;
  dni?: string;
  career?: string;
  photoUrl?: string;
  hasNft: boolean;
}

export const StudentBadge: React.FC<StudentBadgeProps> = ({
  address,
  tokenId,
  studentName = 'Estudiante UNQ',
  dni = 'Pendiente de validación',
  career = 'Carrera no especificada',
  photoUrl,
  hasNft
}) => {
  return (
    <div className="max-w-md mx-auto">
      {/* Tarjeta física / credencial virtual */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-red-900 bg-gradient-to-br from-[#7a1827] via-[#8c1e30] to-[#5a111c] text-white p-6">
        
        {/* Marca de agua / decoración de fondo */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none flex items-center justify-center p-4">
          <img src="/images/unq-logo.png" alt="" className="w-full h-full object-contain opacity-20" />
        </div>

        {/* Encabezado Institucional */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow p-0.5 overflow-hidden">
              <img src="/images/unq-logo.png" alt="UNQ Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <p className="text-[10px] text-red-200 uppercase tracking-widest font-semibold">
                Universidad Nacional de Quilmes
              </p>
              <h3 className="text-sm font-bold tracking-tight">Credencial Estudiantil Digital</h3>
            </div>
          </div>
          <span className="bg-amber-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded shadow tracking-wider uppercase">
            UNQ • CRED
          </span>
        </div>

        {/* Cuerpo de la credencial */}
        <div className="flex items-center gap-4 my-5">
          {/* Foto del estudiante */}
          <div className="w-24 h-28 rounded-lg overflow-hidden bg-white/10 border-2 border-white/60 shadow flex-shrink-0 flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt={studentName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white/50" />
            )}
          </div>

          {/* Datos personales */}
          <div className="space-y-1 text-xs min-w-0">
            <div>
              <span className="text-[10px] text-red-200 uppercase tracking-wider block">Estudiante</span>
              <p className="font-bold text-sm text-white truncate">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] text-red-200 uppercase tracking-wider block">DNI</span>
              <p className="font-semibold text-white/90">{dni}</p>
            </div>
            <div>
              <span className="text-[10px] text-red-200 uppercase tracking-wider block">Carrera</span>
              <p className="font-semibold text-white/90 text-xs truncate flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-red-300" />
                {career}
              </p>
            </div>
          </div>
        </div>

        {/* Pie: Estado Web3 / NFT */}
        <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-red-200">
              <Lock className="w-3 h-3 text-amber-300" />
              <span className="text-[10px] font-semibold uppercase">Soulbound (No Transferible)</span>
            </div>
            <p className="font-mono text-[10px] text-white/70 truncate max-w-[200px]">
              ID: {tokenId ? `#${tokenId.slice(0, 10)}...` : 'Pendiente de emisión'}
            </p>
          </div>

          <div className="text-right">
            {hasNft ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Voto Habilitado (1 Voto)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded">
                Pendiente de Aprobación
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Info técnica explicativa */}
      <div className="mt-4 p-4 unq-card rounded text-xs space-y-2 text-gray-600 bg-white shadow-sm">
        <h4 className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
          <Fingerprint className="w-4 h-4 text-[#7a1827]" />
          Características del Contrato StudentCredential
        </h4>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-600">
          <li><strong>Estándar ERC-721 Soulbound:</strong> Si se intenta transferir la credencial a otra billetera, la transacción revierte con el error <code className="bg-gray-100 text-[#7a1827] px-1 py-0.5 rounded">Soulbound()</code>.</li>
          <li><strong>Autodelegación automática:</strong> Al mintear, el contrato delega automáticamente el poder de voto a favor del titular (<code className="bg-gray-100 text-[#7a1827] px-1 py-0.5 rounded">1 estudiante = 1 voto</code>).</li>
          <li><strong>Reloj por Timestamp:</strong> Utiliza marcas de tiempo reales en segundos para calcular la vigencia de votación y quórum.</li>
        </ul>
      </div>
    </div>
  );
};


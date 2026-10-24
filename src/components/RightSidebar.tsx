import React from 'react';
import { ExternalLink, Video, BookOpen, BookmarkCheck, Radio, CalendarDays } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  return (
    <aside className="w-full xl:w-64 flex-shrink-0 space-y-4">
      {/* Banner 1: Conozca la UNQ */}
      <a
        href="https://www.unq.edu.ar"
        target="_blank"
        rel="noreferrer"
        className="unq-card rounded overflow-hidden block group hover:shadow-md transition"
      >
        <div className="bg-[#7a1827] text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-200" />
            <span className="text-xs font-bold uppercase tracking-wider">Conozca la UNQ &gt;</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-red-200 opacity-75 group-hover:opacity-100" />
        </div>
        <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 text-[11px] text-gray-700">
          Universidad pública, gratuita y comprometida con el desarrollo social de Bernal y Quilmes.
        </div>
      </a>

      {/* Banner 2: Instructivos de uso */}
      <a
        href="#instructivos"
        onClick={(e) => { e.preventDefault(); alert("1. Conectá MetaMask en Sepolia.\n2. Si no tenés NFT, completá la solicitud.\n3. El admin aprueba y mintea tu credencial.\n4. Podés proponer o votar proyectos estudiantiles."); }}
        className="unq-card rounded overflow-hidden block group hover:shadow-md transition"
      >
        <div className="bg-[#1f4e79] text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-wider">Instructivos de uso &gt;</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50/60 text-[11px] text-gray-700">
          Guía rápida sobre cómo funciona el sistema de votación on-chain con credencial soulbound.
        </div>
      </a>

      {/* Banner 3: Biblioteca UNQ */}
      <div className="unq-card rounded overflow-hidden">
        <div className="bg-[#555555] text-white p-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">Biblioteca UNQ &gt;</span>
        </div>
        <div className="p-3 text-[11px] text-gray-600 bg-gray-50">
          Acceso al catálogo en línea y repositorios bibliográficos de la universidad.
        </div>
      </div>

      {/* Mi Agenda */}
      <div className="unq-card rounded overflow-hidden">
        <div className="unq-title-bar px-3 py-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-gray-500" /> Mi agenda
          </span>
        </div>
        <div className="p-3 text-xs text-gray-500 italic bg-white">
          Usted no posee próximos eventos en la agenda
        </div>
        <div className="bg-[#7a1827] text-white text-[10px] text-right px-3 py-1 font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#65121e]">
          Ver mi agenda
        </div>
      </div>

      {/* UNQtv y Streaming */}
      <div className="unq-card rounded overflow-hidden space-y-2 p-2 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex items-center justify-between px-2 py-1 border-b border-gray-800">
          <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
            <Video className="w-4 h-4 text-red-500 animate-pulse" />
            <span>UNQtv En vivo</span>
          </div>
          <span className="text-[10px] bg-red-600 text-white px-1.5 rounded font-mono">LIVE</span>
        </div>
        <div className="px-2 py-1 text-[11px] text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Streaming UNQ</span>
          </div>
          <span className="text-[10px] text-gray-500">Canal 2</span>
        </div>
      </div>
    </aside>
  );
};


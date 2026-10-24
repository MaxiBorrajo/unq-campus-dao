import React, { useState } from "react";
import {
  ExternalLink,
  HelpCircle,
  X,
  ShieldCheck,
  Vote,
  Award,
  Coins,
  Loader2,
} from "lucide-react";

interface LoginViewProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onConnect,
  isConnecting,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center lg:justify-end lg:pr-28 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('/images/unq-bg.jpg')` }}
    >
      {/* Floating Login Card idéntico en escala y estructura al Campus Virtual UNQ */}
      <div className="w-full max-w-[330px] mx-4 bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 rounded-lg">
        {/* Encabezado Rojo Institucional con patrón rayado sutil y borde gris */}
        <div className="bg-[#851424] p-4 flex items-center justify-center gap-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 flex-shrink-0 shadow">
            <img
              src="/images/unq-logo.png"
              alt="Logo UNQ"
              className="rounded-full"
            />
          </div>
          <div className="text-white leading-[1.15] py-0.5 mr-auto">
            <span className="block text-md font-bold tracking-wide">
              Universidad Nacional de Quilmes
            </span>
          </div>
        </div>

        {/* Cuerpo compacto de la Tarjeta */}
        <div className="px-6 py-6 text-center">
          {/* Botón oficial de Conectar con MetaMask */}
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-start p-3 rounded-lg border border-gray-300 bg-white hover:bg-[#E2761B] text-gray-800 font-semibold shadow-sm hover:shadow active:scale-[0.98] transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#E2761B]" />
                <span className="text-sm font-medium text-gray-700">
                  Conectando...
                </span>
              </>
            ) : (
              <>
                <img
                  src="/images/metamask-fox.png"
                  alt="MetaMask"
                  className="w-9 group-hover:scale-105 transition-transform"
                />
                <span className="text-sm font-bold tracking-widemr mx-auto text-center">
                  Continuar con MetaMask
                </span>
              </>
            )}
          </button>

          {/* Dos links simples debajo */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-around gap-2">
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-[#851424] hover:text-[#5e101c] hover:underline text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Qué es esto?</span>
            </button>

            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-gray-800 hover:underline text-xs flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>¿No tenés MetaMask?</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal explicativo "¿Qué es esto?" */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Header del modal */}
            <div className="bg-[#851424] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white p-0.5">
                  <img
                    src="/images/unq-logo.png"
                    alt="UNQ"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <h3 className="font-bold text-sm tracking-wide">
                  Centro de Estudiantes UNQ • DAO
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4 text-xs text-gray-700 leading-relaxed">
              <p className="text-sm font-semibold text-[#851424]">
                Democracia estudiantil directa, transparente y descentralizada
                en la Universidad Nacional de Quilmes.
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-red-50 text-[#851424] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Vote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Votación On-Chain de Iniciativas
                    </h4>
                    <p className="text-gray-600 mt-0.5">
                      Presentá y votá proyectos de infraestructura, bienestar
                      estudiantil y becas directamente en la blockchain de
                      Sepolia sin intermediarios.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      1 Estudiante = 1 Voto (Soulbound NFT)
                    </h4>
                    <p className="text-gray-600 mt-0.5">
                      Al verificar tu regularidad con el padrón UNQ, recibís tu
                      Credencial Universitaria Digital NFT intransferible para
                      emitir votos legítimos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Tesorería Pública y Transparente
                    </h4>
                    <p className="text-gray-600 mt-0.5">
                      Los fondos del Centro de Estudiantes están bajo un
                      contrato Timelock auditado: cada ejecución de presupuesto
                      requiere aprobación asamblearia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">
                  ¿Por qué MetaMask?
                </span>{" "}
                MetaMask actúa como tu firma criptográfica de identidad digital,
                garantizando que nadie pueda votar en tu nombre ni falsificar
                resultados.
              </div>
            </div>

            {/* Footer del modal */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Sepolia Testnet</span>
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  onConnect();
                }}
                className="bg-[#851424] hover:bg-[#6d101d] text-white px-4 py-2 rounded font-semibold text-xs transition-colors shadow-sm"
              >
                Conectar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

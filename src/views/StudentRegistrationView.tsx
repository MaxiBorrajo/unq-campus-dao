import React, { useState, useEffect } from 'react';
import { WalletState, StudentRequest } from '../types';
import { 
  UserPlus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  XCircle,
  FileBadge,
  User
} from 'lucide-react';
import { api } from '../services/api';

interface StudentRegistrationViewProps {
  wallet: WalletState;
  onRequestSubmitted: () => void;
}

export const StudentRegistrationView: React.FC<StudentRegistrationViewProps> = ({
  wallet,
  onRequestSubmitted
}) => {
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [career, setCareer] = useState('Licenciatura en Informática');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [existingRequest, setExistingRequest] = useState<StudentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.address) {
      loadStudentStatus();
    }
  }, [wallet.address]);

  const loadStudentStatus = async () => {
    if (!wallet.address) return;
    try {
      setIsLoading(true);
      const res = await api.getStudent(wallet.address);
      if (res.found && res.student) {
        setExistingRequest(res.student);
        setDni(res.student.dni);
        setFirstName(res.student.firstName);
        setLastName(res.student.lastName);
        setCareer(res.student.career);
        if (res.student.photoData) {
          setPhotoPreview(res.student.photoData);
        }
      }
    } catch (e) {
      console.warn('Error loading student request:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.address) {
      setErrorMsg('Por favor conectá tu billetera MetaMask primero.');
      return;
    }

    if (!dni.trim() || !firstName.trim() || !lastName.trim() || !career.trim()) {
      setErrorMsg('Por favor completá todos los campos obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.submitStudentRequest({
        address: wallet.address,
        dni,
        firstName,
        lastName,
        career,
        photoData: photoPreview || undefined
      });

      setSuccessMsg('¡Solicitud enviada con éxito! La facultad revisará tu solicitud para mintear tu credencial NFT.');
      loadStudentStatus();
      onRequestSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="unq-card rounded bg-white overflow-hidden shadow-sm">
        
        {/* Cabecera estilo UNQ */}
        <div className="bg-[#7a1827] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-red-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Solicitud de Credencial Universitaria Digital</h2>
              <p className="text-xs text-red-200">
                Padrón estudiantil de la Universidad Nacional de Quilmes
              </p>
            </div>
          </div>
          <FileBadge className="w-6 h-6 text-amber-300" />
        </div>

        {/* Estado actual de la solicitud si ya existe */}
        {existingRequest && (
          <div className="p-4 border-b border-gray-200">
            {existingRequest.status === 'pending' && (
              <div className="bg-amber-50 border border-amber-300 rounded p-3 text-amber-900 flex items-start gap-2.5 text-xs">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold">Solicitud en proceso de verificación:</span>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Tu solicitud fue recibida. La administración de la facultad debe aprobarla para mintear tu credencial NFT en la red Sepolia.
                  </p>
                </div>
              </div>
            )}

            {existingRequest.status === 'approved' && (
              <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-emerald-900 flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">¡Credencial Aprobada y Emitida!</span>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Tu credencial ya fue registrada en el contrato on-chain. Ya podés presentar propuestas y participar de las votaciones.
                  </p>
                  {existingRequest.mintTxHash && (
                    <p className="font-mono text-[10px] text-emerald-700 mt-1">
                      Tx: {existingRequest.mintTxHash}
                    </p>
                  )}
                </div>
              </div>
            )}

            {existingRequest.status === 'rejected' && (
              <div className="bg-red-50 border border-red-300 rounded p-3 text-red-900 flex items-start gap-2.5 text-xs">
                <XCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Solicitud Rechazada:</span>
                  <p className="text-red-800 text-[11px] mt-0.5">
                    Motivo: {existingRequest.rejectionReason || 'Datos no coincidentes con el padrón de la UNQ.'}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1">
                    Podés corregir los datos en el formulario a continuación y volver a enviar la solicitud.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Wallet fija */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Billetera MetaMask Conectada
            </label>
            <input
              type="text"
              disabled
              value={wallet.address || 'Billetera no conectada'}
              className="w-full text-xs font-mono p-2.5 bg-gray-100 border border-gray-300 rounded text-gray-600 outline-none"
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Número de DNI *
            </label>
            <input
              type="text"
              required
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 42123456"
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-[#7a1827] outline-none"
            />
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nombre(s) *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ej: Maximiliano Hernán"
                className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-[#7a1827] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Apellido(s) *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej: Borrajo"
                className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-[#7a1827] outline-none"
              />
            </div>
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Carrera Universitaria *
            </label>
            <select
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-[#7a1827] outline-none bg-white"
            >
              <option value="Licenciatura en Informática">Licenciatura en Informática</option>
              <option value="Tecnicatura Universitaria en Programación Informática">Tecnicatura Universitaria en Programación Informática (TPI)</option>
              <option value="Ingeniería en Automatización y Control">Ingeniería en Automatización y Control</option>
              <option value="Licenciatura en Biotecnología">Licenciatura en Biotecnología</option>
              <option value="Licenciatura en Administración">Licenciatura en Administración</option>
              <option value="Licenciatura en Comercio Internacional">Licenciatura en Comercio Internacional</option>
              <option value="Licenciatura en Ciencias Sociales">Licenciatura en Ciencias Sociales</option>
            </select>
          </div>

          {/* Foto opcional */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Foto para la Credencial (Opcional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-[#7a1827] hover:file:bg-red-100 cursor-pointer"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Formatos soportados: JPG, PNG. Tamaño máximo recomendado: 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Alertas */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botón */}
          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !wallet.isConnected}
              className="bg-[#7a1827] hover:bg-[#60121e] disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded shadow flex items-center gap-2 transition active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enviando solicitud...</span>
                </>
              ) : (
                <span>{existingRequest ? 'Actualizar Solicitud' : 'Enviar Solicitud de Ingreso'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


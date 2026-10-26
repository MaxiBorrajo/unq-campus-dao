interface StudentBadgeProps {
  tokenId?: string;
  studentName?: string;
  dni?: string;
  career?: string;
  photoUrl?: string;
  hasNft: boolean;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-xs text-white/60">{children}</span>
);

export function StudentBadge({
  tokenId,
  studentName = 'Estudiante UNQ',
  dni = 'Pendiente de validación',
  career = 'Carrera no especificada',
  photoUrl,
  hasNft,
}: StudentBadgeProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-primary p-6 text-white">
      <div className="flex items-center gap-3 border-b border-white/20 pb-4">
        <img src="/images/unq-logo.png" alt="UNQ" className="h-9 w-9 rounded-full bg-white object-contain" />
        <div>
          <p className="text-xs text-white/60">Universidad Nacional de Quilmes</p>
          <h3 className="text-sm font-semibold">Credencial estudiantil digital</h3>
        </div>
      </div>

      <div className="my-5 flex items-center gap-4">
        <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
          {photoUrl && <img src={photoUrl} alt={studentName} className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 space-y-2 text-sm">
          <div>
            <Label>Estudiante</Label>
            <p className="truncate font-semibold">{studentName}</p>
          </div>
          <div>
            <Label>DNI</Label>
            <p>{dni}</p>
          </div>
          <div>
            <Label>Carrera</Label>
            <p className="truncate">{career}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs">
        <span className="font-mono text-white/60">
          {tokenId ? `#${tokenId.slice(0, 10)}…` : 'Sin emitir'}
        </span>
        <span className="font-medium">{hasNft ? 'Habilitado para votar' : 'Pendiente de aprobación'}</span>
      </div>
    </div>
  );
}

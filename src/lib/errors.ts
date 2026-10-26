/** Extrae un mensaje legible de errores de ethers / MetaMask / JS. */
export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado') {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const e = error as { reason?: unknown; message?: unknown };
    if (typeof e.reason === 'string' && e.reason) return e.reason;
    if (typeof e.message === 'string' && e.message) return e.message;
  }
  return fallback;
}

export function errorIncludes(error: unknown, text: string) {
  return getErrorMessage(error, '').includes(text);
}

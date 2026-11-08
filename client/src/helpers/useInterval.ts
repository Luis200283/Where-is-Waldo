import { useEffect, useRef } from "react";

/**
 * Ejecuta `callback` cada `delay` milisegundos.
 * Pasa `delay = null` para pausar el intervalo.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<(() => void) | null>(null); // guarda el callback entre renders

  // Guarda siempre la última versión del callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay === null) return; // con null se detiene el temporizador

    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(id);
  }, [delay]); // solo se reinicia si cambia el delay
}

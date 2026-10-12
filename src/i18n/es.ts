// src/i18n/es.ts
// The single source of UI copy. The product interface is in Spanish
// (DECISIONS.md 2026-10-12); the WhatsApp templates in src/lib/messages.ts
// already were.
//
// No i18n library yet, on purpose: one language, one file, no runtime cost and
// nothing to configure. If a second language ever becomes real, this file is
// the shape a library would consume anyway.
//
// Voice: confident caddie. Specific numbers. One recommendation. Two sentences
// at most (VADDI §6).
//
// Phase 1's screens still render English strings inline; they move here in B3
// as each screen is touched. Nothing is translated twice.

export const es = {
  /** The four states every screen has (VADDI §5.8). */
  estados: {
    cargando: 'Cargando…',
    errorTitulo: 'Algo ha fallado',
    errorCuerpo: 'No se ha podido cargar. Inténtalo otra vez.',
    sinConexionTitulo: 'Sin conexión',
    sinConexionCuerpo: 'Esto es lo último que teníamos. Vuelve a conectarte para actualizar.',
  },

  acciones: {
    reintentar: 'Reintentar',
    volverAIntentar: 'Probar otra vez',
    copiar: 'Copiar',
    copiado: 'Copiado',
    compartir: 'Compartir',
  },
} as const;

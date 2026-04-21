/**
 * ═══════════════════════════════════════════════════════
 * SHEETS LOGGER — core/sheets-logger.js
 * Registra cada descarga en Google Sheets via Apps Script.
 * La URL del webhook se configura en SHEETS_WEBHOOK_URL.
 * ═══════════════════════════════════════════════════════
 */

const SheetsLogger = (() => {
    'use strict';

    // Pegar aquí la URL del Apps Script Web App desplegado
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby4GY-lCxUomUHTUcF5n-0_gKuzcQDHc7UeG0FR9KBUWZT5LhZegu9ig5rohWbfF1n_/exec';

    /**
     * Registra una descarga en el Sheet.
     * @param {Object} data
     * @param {string} data.seccion   — 'Redes Sociales' | 'Gafetes' | 'Certificados' | 'Plataforma AVE'
     * @param {string} data.programa  — programa institucional seleccionado
     * @param {string} [data.titulo]  — título del afiche / certificado
     * @param {string} [data.detalle] — detalle adicional (participante, subtítulo, etc.)
     */
    async function log(data) {
        if (!WEBHOOK_URL) return; // no configurado aún

        const email = sessionStorage.getItem('dne_access') || '';

        const payload = {
            timestamp: new Date().toISOString(),
            email,
            ...data,
        };

        try {
            await fetch(WEBHOOK_URL, {
                method:  'POST',
                mode:    'no-cors', // Apps Script no envía CORS headers
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            });
        } catch (err) {
            // Silencioso — el log nunca debe interrumpir la descarga
            console.warn('SheetsLogger: no se pudo registrar la descarga', err);
        }
    }

    return { log };
})();

console.log('📊 sheets-logger.js loaded');

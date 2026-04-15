/**
 * ═══════════════════════════════════════════════════════
 * FORMAT MANAGER — core/format-manager.js
 * Gestión de formatos de redes sociales (Posteo/Historia)
 * Toggle dual con vista compartida
 * ═══════════════════════════════════════════════════════
 */

const FormatManager = (() => {
    'use strict';

    /* ── Formatos disponibles ── */
    const FORMATS = {
        posteo: {
            id: 'posteo',
            label: 'Posteo',
            ratio: '5:4',
            width: 1080,
            height: 1350,
            displayWidth: 346,  // 32% scale - optimized for 100% zoom
            displayHeight: 432
        },
        historia: {
            id: 'historia',
            label: 'Historia',
            ratio: '9:16',
            width: 1080,
            height: 1920,
            displayWidth: 243,  // Scaled to align height with Posteo
            displayHeight: 432
        }
    };

    /* ── State ── */
    let activeFormats = ['posteo', 'historia']; // Ambos activos por defecto

    /**
     * Get all available formats
     */
    function getAll() {
        return { ...FORMATS };
    }

    /**
     * Get a specific format by ID
     */
    function get(formatId) {
        return FORMATS[formatId] || null;
    }

    /**
     * Get active formats
     */
    function getActive() {
        return activeFormats.map(id => FORMATS[id]).filter(Boolean);
    }

    /**
     * Toggle format on/off
     */
    function toggle(formatId) {
        const index = activeFormats.indexOf(formatId);

        if (index > -1) {
            // Remove if active
            activeFormats.splice(index, 1);
        } else {
            // Add if inactive
            activeFormats.push(formatId);
        }

        // Ensure at least one format is active
        if (activeFormats.length === 0) {
            activeFormats = ['posteo'];
        }

        notifyChange();
        return activeFormats;
    }

    /**
     * Check if a format is active
     */
    function isActive(formatId) {
        return activeFormats.includes(formatId);
    }

    /**
     * Set active formats
     */
    function setActive(formatIds) {
        activeFormats = Array.isArray(formatIds) ? formatIds : [formatIds];
        if (activeFormats.length === 0) {
            activeFormats = ['posteo'];
        }
        notifyChange();
    }

    /* ── Change callbacks ── */
    const changeCallbacks = [];

    function onChange(callback) {
        changeCallbacks.push(callback);
    }

    function notifyChange() {
        changeCallbacks.forEach(cb => {
            try {
                cb(activeFormats);
            } catch (err) {
                console.error('FormatManager onChange callback error:', err);
            }
        });
    }

    /**
     * Initialize format toggles
     */
    function init() {
        const toggleButtons = document.querySelectorAll('.format-toggle-btn');

        toggleButtons.forEach(btn => {
            const formatId = btn.dataset.format;

            // Set initial state
            if (isActive(formatId)) {
                btn.classList.add('active');
            }

            // Add click handler
            btn.addEventListener('click', () => {
                toggle(formatId);
                updateToggleUI();
            });
        });

        console.log('📐 FormatManager initialized:', activeFormats);
    }

    /**
     * Update toggle button UI
     */
    function updateToggleUI() {
        const toggleButtons = document.querySelectorAll('.format-toggle-btn');

        toggleButtons.forEach(btn => {
            const formatId = btn.dataset.format;
            if (isActive(formatId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /* ── Public API ── */
    return {
        init,
        getAll,
        get,
        getActive,
        toggle,
        isActive,
        setActive,
        onChange
    };
})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => FormatManager.init());

console.log('📐 format-manager.js loaded');

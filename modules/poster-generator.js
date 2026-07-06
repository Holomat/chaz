/**
 * ═══════════════════════════════════════════════════════
 * POSTER GENERATOR — modules/poster-generator.js
 * Multi-format poster canvas (Posteo + Historia)
 * Shared controls with dual view support
 * ═══════════════════════════════════════════════════════
 */

const PosterGenerator = (() => {
    'use strict';

    /* ── State ── */
    // Encuadre independiente por formato: { posteo|historia|reels: { x, y, scale } }
    let bgTransforms = {};
    let activeBgFormat = 'posteo'; // último canvas tocado → destino de los botones +/−
    let isDragging = false;
    let dragFormat = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let debounceTimer = null;
    let bgDataUrl = null; // Store background as data URL for all posters

    function tf(formatId) {
        if (!bgTransforms[formatId]) bgTransforms[formatId] = { x: 0, y: 0, scale: 1 };
        return bgTransforms[formatId];
    }

    /* ── DOM references (lazy-initialized) ── */
    let els = {};

    function getEls() {
        if (els._initialized) return els;
        els = {
            container: document.getElementById('posterFormatsContainer'),
            bgInput: document.getElementById('bgInput'),
            bgLabel: document.getElementById('bgLabel'),
            scaleInput: document.getElementById('scaleInput'),
            etiquetaIn: document.getElementById('etiquetaIn'),
            titleIn: document.getElementById('titleIn'),
            subtitleIn: document.getElementById('subtitleIn'),
            fechaIn: document.getElementById('fechaIn'),
            horaIn: document.getElementById('horaIn'),
            lugarIn: document.getElementById('lugarIn'),
            _initialized: true
        };
        return els;
    }

    /**
     * Process asterisk syntax: *text* → <span class="bold-part">text</span>
     */
    function processBrackets(text) {
        return text
            .replace(/\*(.*?)\*/g, '<span class="bold-part">$1</span>')
            .replace(/\n/g, '<br>'); // Enter = salto de línea en el diseño
    }

    /* ── Íconos de evento (Root/assets/iconos, inline para teñirse con currentColor) ── */
    const EVENT_ICONS = {
        fecha: `<svg class="event-icon" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M39.5193 9.21679C39.5193 7.26449 38.1763 5.88829 36.2328 5.85628C35.5218 5.85628 34.795 5.85628 34.0998 5.85628C33.768 5.85628 33.452 5.85628 33.1202 5.85628H32.2827V4H29.4387V5.82428H14.0965V4H11.2524V5.80827H10.8416C10.8416 5.80827 10.7626 5.82428 10.731 5.84028C10.6362 5.84028 10.5414 5.84028 10.4466 5.84028C10.0358 5.84028 9.62495 5.84028 9.21414 5.84028C8.61372 5.84028 7.99751 5.84028 7.39709 5.84028C5.61164 5.84028 4.42661 6.83243 4.0474 8.5927C4.0474 8.6407 4.0158 8.67271 4 8.72072V36.4689C4 36.773 4.0474 37.301 4.1106 37.5091C4.1896 37.7971 4.28441 38.0532 4.41081 38.2772C5.04283 39.3814 5.99085 39.9574 7.23909 39.9574C8.80333 39.9574 10.3992 39.9574 11.9318 39.9574C12.5954 39.9574 13.2432 39.9574 13.9069 39.9574H19.9268C25.3306 39.9574 30.7343 39.9574 36.138 39.9574C37.7655 39.9574 39.0453 38.9813 39.4087 37.4611C39.4719 37.205 39.5035 36.901 39.5035 36.5649C39.5035 27.7636 39.5035 18.8022 39.5035 9.20079L39.5193 9.21679ZM36.7227 37.125H6.81247V17.8901H36.7227V37.125ZM36.7227 15.0257H6.81247V8.68871H11.2682V10.465H14.0491V8.67271H29.4387V10.465H32.2195V8.68871H36.7069V15.0257H36.7227Z" fill="currentColor"/><path d="M21.7594 33.0131C22.265 33.0131 22.7548 33.0131 23.2288 33.0131C23.2288 32.6611 23.2288 32.309 23.2288 31.973C23.2288 31.8129 23.2288 31.6689 23.2288 31.5089C23.2288 31.3489 23.2288 31.1888 23.2288 31.0448C23.2288 30.6928 23.2288 30.3407 23.2288 29.9727C22.2808 29.9727 21.3012 29.9727 20.2109 29.9727C20.2109 31.0928 20.2109 32.085 20.2109 33.0291C20.7482 33.0291 21.2696 33.0291 21.7594 33.0291V33.0131Z" fill="currentColor"/><path d="M23.1811 22.082H20.2422V25.0745H23.1811V22.082Z" fill="currentColor"/><path d="M15.3608 30.0039H12.4219V32.9964H15.3608V30.0039Z" fill="currentColor"/><path d="M31.017 30.0039H28.0781V32.9964H31.017V30.0039Z" fill="currentColor"/><path d="M31.0328 22.082H28.0781V25.0585H31.0328V22.082Z" fill="currentColor"/></svg>`,
        hora: `<svg class="event-icon" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20.8703 2C21.6129 2 22.3555 2 23.0981 2C23.2087 2.016 23.3193 2.04801 23.4141 2.06401C24.457 2.22404 25.4998 2.32005 26.5268 2.56008C36.2757 4.92844 42.5642 14.8499 40.6524 24.8355C39.8624 28.9801 37.9505 32.5326 34.8536 35.3651C30.4611 39.4297 25.2628 41.0459 19.3692 40.2778C15.6245 39.7977 12.3064 38.2295 9.47817 35.7011C6.14428 32.7087 4.04283 28.9961 3.28441 24.5474C3.158 23.8273 3.0948 23.0912 3 22.3711C3 21.619 3 20.8669 3 20.1147C3.0158 19.9867 3.0474 19.8427 3.0632 19.7147C3.158 19.0266 3.20541 18.3225 3.33181 17.6344C4.05863 13.8098 5.78087 10.4973 8.48274 7.72886C11.3268 4.83243 14.7397 2.99215 18.7214 2.30404C19.4324 2.17602 20.1593 2.11202 20.8861 2H20.8703ZM21.9921 5.00846C13.1755 5.00846 5.97048 12.2736 5.95468 21.2189C5.93888 30.1483 13.1123 37.4454 21.9447 37.4774C30.7613 37.5094 37.9979 30.1963 38.0137 21.2509C38.0137 12.3216 30.8245 5.02446 21.9921 5.00846Z" fill="currentColor"/><path d="M20.5234 22.7087V7.73047H23.4623V19.7323H31.7733V22.7087H20.5234Z" fill="currentColor"/></svg>`,
        lugar: `<svg class="event-icon" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M37.1855 13.9887C36.0886 7.9264 31.1591 2.74188 25.2004 1.39775C24.6587 1.2743 24.1034 1.19201 23.5753 1.10972C23.3315 1.06857 23.0877 1.04115 22.844 1H22.8169H20.6636H20.6095C20.4605 1.02743 20.3115 1.04114 20.149 1.06857C19.824 1.10972 19.4719 1.16458 19.1333 1.21945C13.2965 2.35785 9.16602 5.86906 6.86379 11.6708C5.68559 14.6471 5.71268 17.9251 6.94505 21.6969C7.89302 24.6184 9.43687 27.4027 11.9152 30.7219C14.5153 34.2056 17.4405 37.2368 20.7313 40.556C21.0428 40.8577 21.3678 41.0223 21.7064 41.0223C22.045 41.0223 22.3835 40.8714 22.695 40.5697C23.0742 40.1994 23.4534 39.8016 23.819 39.4313L24.1305 39.1021C26.9067 36.2767 29.8048 33.177 32.2696 29.6795C34.301 26.8129 35.6281 24.2755 36.4678 21.7107C37.3751 18.9264 37.6053 16.4164 37.172 14.0162L37.1855 13.9887ZM33.9759 20.9151C33.1092 23.5211 31.7143 26.0311 29.4663 29.0623C27.1234 32.2169 24.3472 35.1109 21.7064 37.7991C21.3543 37.4288 21.0022 37.0585 20.6636 36.7019C19.7157 35.7006 18.7406 34.672 17.7926 33.6433C15.2466 30.859 13.3507 28.4039 11.8339 25.9077C10.263 23.3154 9.32853 21.0386 8.89517 18.7481C8.2045 15.0723 9.04414 11.8217 11.4683 8.79049C13.608 6.10222 16.2081 4.45634 19.1875 3.90772C20.1084 3.74313 21.0022 3.64711 21.8689 3.64711C25.4712 3.64711 28.6266 5.10098 31.2945 8.0087C32.9467 9.79173 33.9759 11.6845 34.4635 13.7693C34.9916 16.0049 34.8291 18.3503 33.9759 20.9151Z" fill="currentColor"/><path d="M21.7333 10.3301C17.8466 10.3301 14.6776 13.5259 14.6641 17.4486C14.6641 21.3987 17.8059 24.6219 21.6926 24.6219H21.7062C23.6021 24.6219 25.3762 23.8812 26.7169 22.5371C28.0576 21.1929 28.7889 19.3962 28.7889 17.476C28.7889 13.5396 25.6335 10.3301 21.7468 10.3164L21.7333 10.3301ZM26.1617 17.5034C26.1617 18.6967 25.6877 19.8214 24.848 20.6717C24.0084 21.5084 22.8979 21.9747 21.7062 21.9747C21.7062 21.9747 21.7062 21.9747 21.6926 21.9747C20.5144 21.9747 19.4175 21.4947 18.5914 20.658C17.7518 19.7939 17.2913 18.6555 17.2913 17.4348C17.3049 14.9797 19.2956 12.991 21.7333 12.991C21.7333 12.991 21.7333 12.991 21.7468 12.991C22.9385 12.991 24.049 13.471 24.8751 14.3214C25.7012 15.1718 26.1617 16.3102 26.1617 17.5171V17.5034Z" fill="currentColor"/></svg>`
    };

    /**
     * Create a poster element for a specific format.
     * @param {Object} format - Format configuration from FormatManager
     * @returns {HTMLElement}
     */
    function createPosterElement(format) {
        const poster = document.createElement('div');
        poster.className = 'poster';
        poster.dataset.format = format.id;
        poster.id = `posterArea-${format.id}`;

        // Set dimensions based on format
        poster.style.width = `${format.displayWidth}px`;
        poster.style.height = `${format.displayHeight}px`;

        poster.innerHTML = `
            <div class="bg-wrapper" data-format="${format.id}">
                <img class="bg-preview" src="${bgDataUrl || ''}" alt="" style="display: ${bgDataUrl ? 'block' : 'none'};">
            </div>
            <img class="shadow-overlay" src="Root/assets/sombra-post-story.png" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; z-index: 1; display: block;">
            <div class="logo-container">
                <svg class="logo-svg-inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.84 90.93" style="display: block;">
                    <polygon fill="currentColor" points="45.57 24.06 45.57 19.42 31.62 19.42 26.98 19.42 26.98 24.06 26.98 28.72 26.98 33.36 26.98 38.02 26.98 42.66 31.62 42.66 45.57 42.66 45.57 38.02 31.62 38.02 31.62 33.36 45.57 33.36 45.57 28.72 31.62 28.72 31.62 24.06 45.57 24.06"/>
                    <path fill="currentColor" d="M15.36,19.42c-3.87,0-7,3.13-7,7s3.13,7,7,7,7-3.13,7-7-3.13-7-7-7ZM15.36,28.76c-1.29,0-2.34-1.05-2.34-2.34s1.05-2.34,2.34-2.34,2.34,1.05,2.34,2.34-1.05,2.34-2.34,2.34Z"/>
                    <rect fill="currentColor" x="8.36" y="38.02" width="14" height="4.67"/>
                    <rect fill="currentColor" x="8.36" y="47.35" width="37.21" height="4.67"/>
                </svg>
                <img class="logo-image" src="" alt="Logo Institucional" style="display: none;">
            </div>
            <div class="text-container">
                <div class="etiqueta"></div>
                <div class="title"></div>
                <div class="subtitle"></div>
                <div class="event-info hidden">
                    <span class="event-item hidden" data-ev="fecha">${EVENT_ICONS.fecha}<span class="event-item-text"></span></span>
                    <span class="event-item hidden" data-ev="hora">${EVENT_ICONS.hora}<span class="event-item-text"></span></span>
                    <span class="event-item hidden" data-ev="lugar">${EVENT_ICONS.lugar}<span class="event-item-text"></span></span>
                </div>
            </div>
        `;

        return poster;
    }

    /**
     * Render posters based on active formats.
     */
    function renderPosters() {
        const e = getEls();
        if (!e.container) return;

        const activeFormats = FormatManager ? FormatManager.getActive() : [];

        // Clear container
        e.container.innerHTML = '';

        // Create poster for each active format
        activeFormats.forEach(format => {
            const poster = createPosterElement(format);
            e.container.appendChild(poster);

            // Update background transform on this poster
            updatePosterBackground(poster);
        });

        // Sync text to all posters
        syncText();

        // Mobile: recalculate zoom after new format(s) are in DOM
        setTimeout(() => updateScale(), 50);

        console.log(`📐 Rendered ${activeFormats.length} poster(s)`);
    }

    /**
     * Update background sizing + transform for a specific poster element.
     * La imagen se dimensiona a "cover" real (cubre el canvas manteniendo
     * proporción) con su información completa desbordando el marco: al
     * arrastrar o escalar se revela lo que queda fuera del encuadre.
     * @param {HTMLElement} poster
     */
    function updatePosterBackground(poster) {
        const img = poster.querySelector('.bg-preview');
        if (!img) return;

        const apply = () => {
            const t  = tf(poster.dataset.format);
            const nw = img.naturalWidth;
            const nh = img.naturalHeight;
            const fw = poster.offsetWidth;
            const fh = poster.offsetHeight;
            if (nw && nh && fw && fh) {
                const cover = Math.max(fw / nw, fh / nh);
                img.style.width  = `${nw * cover}px`;
                img.style.height = `${nh * cover}px`;
            }
            img.style.transform =
                `translate(-50%, -50%) translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
        };

        if (img.complete && img.naturalWidth) {
            apply();
        } else {
            img.addEventListener('load', apply, { once: true });
            apply(); // aplica al menos el transform mientras carga
        }
    }

    /**
     * Update background transform for all posters.
     */
    function updateBgTransform() {
        const posters = document.querySelectorAll('.poster[data-format]');
        posters.forEach(poster => updatePosterBackground(poster));
    }

    /**
     * Sync text inputs to all poster previews (debounced).
     */
    function syncText() {
        const e = getEls();
        const etiquetaHTML = processBrackets(e.etiquetaIn?.value || '');
        const titleHTML = processBrackets(e.titleIn?.value || '');
        const subtitleHTML = processBrackets(e.subtitleIn?.value || '');

        // Update all poster text elements
        document.querySelectorAll('.poster[data-format] .etiqueta').forEach(el => {
            el.innerHTML = etiquetaHTML;
        });
        document.querySelectorAll('.poster[data-format] .title').forEach(el => {
            el.innerHTML = titleHTML;
        });
        document.querySelectorAll('.poster[data-format] .subtitle').forEach(el => {
            el.innerHTML = subtitleHTML;
        });

        // Baseline 0 system: toggle classes for baseline alignment
        const hasTitle = titleHTML.trim() !== '';
        const hasSubtitle = subtitleHTML.trim() !== '';
        document.querySelectorAll('.poster[data-format] .text-container').forEach(tc => {
            tc.classList.toggle('no-title', !hasTitle);
            tc.classList.toggle('no-subtitle', !hasSubtitle);
        });

        // Línea de evento (fecha / hora / lugar) — cada ítem aparece solo si tiene texto.
        // Con al menos uno, la línea toma el baseline del subtítulo y el bloque sube.
        const evData = {
            fecha: (e.fechaIn?.value || '').trim(),
            hora:  (e.horaIn?.value  || '').trim(),
            lugar: (e.lugarIn?.value || '').trim(),
        };
        const hasEvent = !!(evData.fecha || evData.hora || evData.lugar);
        document.querySelectorAll('.poster[data-format] .event-info').forEach(info => {
            info.classList.toggle('hidden', !hasEvent);
            info.querySelectorAll('.event-item').forEach(item => {
                const txt = evData[item.dataset.ev] || '';
                item.querySelector('.event-item-text').innerHTML = processBrackets(txt);
                item.classList.toggle('hidden', !txt);
            });
        });
    }

    /**
     * Debounced sync (300ms).
     */
    function debouncedSync() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(syncText, 300);
    }

    /**
     * Load a background image from a File.
     * @param {File} file
     */
    function loadBackground(file) {
        if (!file) return;
        const e = getEls();
        const reader = new FileReader();
        reader.onload = (ev) => {
            bgDataUrl = ev.target.result;

            // Update all poster backgrounds
            document.querySelectorAll('.poster[data-format] .bg-preview').forEach(img => {
                img.src = bgDataUrl;
                img.style.display = 'block';
            });

            const nameEl = document.querySelector('#bgLabel .prompt-photo-name');
            if (nameEl) nameEl.textContent = file.name;

            // Reset: cada formato arranca con la foto en cover centrado
            bgTransforms = {};
            if (e.scaleInput) e.scaleInput.value = 1;
            updateBgTransform();
        };
        reader.readAsDataURL(file);
    }

    /**
     * Set background scale (aplica al último canvas tocado).
     * @param {number} scale
     */
    function setScale(scale) {
        tf(activeBgFormat).scale = parseFloat(scale);
        updateBgTransform();
    }

    function stepScale(delta) {
        const t = tf(activeBgFormat);
        t.scale = Math.max(0.5, Math.min(5, t.scale + delta));
        const e = getEls();
        if (e.scaleInput) e.scaleInput.value = t.scale;
        updateBgTransform();
    }

    /**
     * Initialize drag-to-reposition for the background.
     * Uses event delegation for dynamically created posters.
     */
    function initDrag() {
        const e = getEls();
        if (!e.container) return;

        // Drag: reencuadra SOLO el canvas donde se arrastra
        e.container.addEventListener('mousedown', (ev) => {
            const bgWrapper = ev.target.closest('.bg-wrapper');
            if (!bgWrapper || !bgDataUrl) return;
            const poster = ev.target.closest('.poster[data-format]');
            if (!poster) return;

            dragFormat = poster.dataset.format;
            activeBgFormat = dragFormat; // los botones +/− apuntan a este canvas
            const t = tf(dragFormat);
            if (e.scaleInput) e.scaleInput.value = t.scale;

            isDragging = true;
            dragStartX = ev.clientX - t.x;
            dragStartY = ev.clientY - t.y;
            ev.preventDefault();
        });

        window.addEventListener('mousemove', (ev) => {
            if (!isDragging || !dragFormat) return;
            const t = tf(dragFormat);
            t.x = ev.clientX - dragStartX;
            t.y = ev.clientY - dragStartY;
            requestAnimationFrame(updateBgTransform);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            dragFormat = null;
        });

        // Rueda del mouse sobre un canvas: zoom de la foto en ESE canvas
        e.container.addEventListener('wheel', (ev) => {
            const bgWrapper = ev.target.closest('.bg-wrapper');
            if (!bgWrapper || !bgDataUrl) return;
            const poster = ev.target.closest('.poster[data-format]');
            if (!poster) return;
            ev.preventDefault();

            const fmt = poster.dataset.format;
            activeBgFormat = fmt;
            const t = tf(fmt);
            t.scale = Math.max(0.5, Math.min(5, t.scale + (ev.deltaY < 0 ? 0.05 : -0.05)));
            if (e.scaleInput) e.scaleInput.value = t.scale;
            requestAnimationFrame(updateBgTransform);
        }, { passive: false });
    }

    /**
     * Get poster configuration for export.
     * @returns {Object}
     */
    function getConfig() {
        const e = getEls();
        return {
            etiqueta: e.etiquetaIn?.value || '',
            title: e.titleIn?.value || '',
            subtitle: e.subtitleIn?.value || '',
            bgTransforms: JSON.parse(JSON.stringify(bgTransforms)),
            hasBg: !!bgDataUrl
        };
    }

    /**
     * Get poster element by format ID.
     * @param {string} formatId
     * @returns {HTMLElement|null}
     */
    function getPosterElement(formatId) {
        return document.getElementById(`posterArea-${formatId}`);
    }

    /**
     * Load shadow overlay as base64 to avoid CORS issues.
     */
    async function loadShadowOverlay() {
        const shadowPath = 'Root/assets/sombra-post-story.png';

        try {
            const response = await fetch(shadowPath);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve) => {
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    // Update all shadow overlays
                    document.querySelectorAll('.poster[data-format] .shadow-overlay').forEach(img => {
                        img.src = dataUrl;
                        img.style.display = 'block';
                    });
                    console.log('🌑 Shadow overlay loaded');
                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.warn('⚠️ Shadow overlay not found, posters will work without it:', error);
        }
    }

    /**
     * Initialize the poster generator.
     */
    function init() {
        const e = getEls();

        // Initial render
        renderPosters();

        // Load shadow overlay
        loadShadowOverlay();

        // Listen to format changes
        if (FormatManager) {
            FormatManager.onChange(() => {
                renderPosters();
                // Re-apply shadow overlay after render
                setTimeout(() => loadShadowOverlay(), 100);
            });
        }

        // Text input listeners with debounce
        [e.etiquetaIn, e.titleIn, e.subtitleIn, e.fechaIn, e.horaIn, e.lugarIn].forEach(input => {
            if (input) {
                input.addEventListener('input', debouncedSync);
            }
        });

        // Background file input
        if (e.bgInput) {
            e.bgInput.addEventListener('change', (ev) => {
                const file = ev.target.files[0];
                if (file) loadBackground(file);
            });
        }

        // Scale slider
        if (e.scaleInput) {
            e.scaleInput.addEventListener('input', (ev) => setScale(ev.target.value));
        }

        // Drag
        initDrag();

        // Initial text sync
        syncText();

        console.log('🖼️ PosterGenerator initialized (multi-format)');
    }

    /* ── Zoom ── */
    function setZoom(factor) {
        const container = document.getElementById('posterStackFrame') || document.getElementById('posterFormatsContainer');
        if (!container) return;
        container.style.transform = `scale(${factor})`;
        container.style.transformOrigin = 'center center';
    }

    function getFullState() {
        const e = getEls();
        return {
            etiqueta:  e.etiquetaIn?.value  || '',
            title:     e.titleIn?.value     || '',
            subtitle:  e.subtitleIn?.value  || '',
            fecha:     e.fechaIn?.value     || '',
            hora:      e.horaIn?.value      || '',
            lugar:     e.lugarIn?.value     || '',
            bgDataUrl: bgDataUrl || null,
            bgTransforms: JSON.parse(JSON.stringify(bgTransforms))
        };
    }

    function restoreState(state) {
        if (!state) return;
        bgDataUrl = state.bgDataUrl || null;

        if (state.bgTransforms) {
            bgTransforms = JSON.parse(JSON.stringify(state.bgTransforms));
        } else if (state.bgScale !== undefined || state.bgPosX !== undefined) {
            // Compatibilidad con estados guardados con encuadre global
            bgTransforms = {};
            ['posteo', 'historia', 'reels'].forEach(f => {
                bgTransforms[f] = {
                    x: state.bgPosX ?? 0,
                    y: state.bgPosY ?? 0,
                    scale: state.bgScale ?? 1
                };
            });
        } else {
            bgTransforms = {};
        }

        document.querySelectorAll('.poster[data-format] .bg-preview').forEach(img => {
            if (bgDataUrl) { img.src = bgDataUrl; img.style.display = 'block'; }
            else           { img.src = '';        img.style.display = 'none';  }
        });

        const e = getEls();
        if (e.scaleInput) e.scaleInput.value = tf(activeBgFormat).scale;
        const nameEl = document.querySelector('#bgLabel .prompt-photo-name');
        if (nameEl) nameEl.textContent = bgDataUrl ? '(imagen cargada)' : '';
        updateBgTransform();
    }

    /**
     * Mobile-only: recalculate zoom so the poster fills the canvas-area correctly.
     * Preview state → fills full width; edit state → fits entirely with padding.
     * Safe to call on desktop (no-op).
     */
    function updateScale() {
        if (window.innerWidth > 640) return;
        if (document.body.classList.contains('mob-mini')) return; // mini zoom managed by MobileDesignManager

        const canvas = document.querySelector('.canvas-area');
        if (!canvas) return;

        const activeFormats = typeof FormatManager !== 'undefined' ? FormatManager.getActive() : [];
        if (activeFormats.length === 0) return;

        const format = activeFormats[0];
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const isMobEdit = document.body.classList.contains('mob-edit');
        const pad = isMobEdit ? 20 : 0;

        const scale = Math.min(
            (rect.width  - pad) / format.displayWidth,
            (rect.height - pad) / format.displayHeight
        );

        setZoom(Math.max(0.1, scale));
    }

    /* ── Public API ── */
    return {
        init,
        syncText,
        loadBackground,
        setScale,
        stepScale,
        getConfig,
        getFullState,
        restoreState,
        renderPosters,
        getPosterElement,
        setZoom,
        updateScale
    };
})();

/* Auto-init on DOM ready */
document.addEventListener('DOMContentLoaded', () => PosterGenerator.init());

console.log('🖼️ poster-generator.js loaded');

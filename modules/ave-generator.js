/**
 * ═══════════════════════════════════════════════════════
 * AVE GENERATOR — modules/ave-generator.js
 * Plataforma AVE banner canvas (1500×540px)
 * Left-aligned layout with photo bg, shadow, color system
 * ═══════════════════════════════════════════════════════
 */

const AveGenerator = (() => {
    'use strict';

    const AVE_W = 1500;
    const AVE_H = 540;

    const LOGO_MAP = {
        'DNE Isotipo':               'dne-iso',
        'MEC - DNE':                 'dne',
        'Cultura Científica':        'cc',
        'Cultura Científica (Anep)': 'cc-anep',
        'Ccepi':                     'ccepi',
        'PAS':                       'pas',
        'PNEC':                      'pnec',
        'Cecap':                     'cecap',
        'Secretaría Permanente':     'sp'
    };

    /* ── State ── */
    let bgScale = 1;
    let bgPosX = 0;
    let bgPosY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let bgDataUrl = null;

    /* ── Background ── */

    function updateBgTransform() {
        const bgPreview = document.querySelector('#aveCanvas .ave-bg-preview');
        if (bgPreview) {
            bgPreview.style.transform = `translate(${bgPosX}px, ${bgPosY}px) scale(${bgScale})`;
        }
    }

    function loadBackground(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            bgDataUrl = ev.target.result;
            const bgPreview = document.querySelector('#aveCanvas .ave-bg-preview');
            if (bgPreview) {
                bgPreview.src = bgDataUrl;
                bgPreview.style.display = 'block';
            }
            const label = document.getElementById('aveBgLabel');
            if (label) label.querySelector('span').textContent = file.name;
            bgPosX = 0;
            bgPosY = 0;
            bgScale = 1;
            const scaleInput = document.getElementById('aveScaleInput');
            if (scaleInput) scaleInput.value = 1;
            updateBgTransform();
        };
        reader.readAsDataURL(file);
    }

    function setScale(scale) {
        bgScale = parseFloat(scale);
        updateBgTransform();
    }

    function initDrag() {
        const canvas = document.getElementById('aveCanvas');
        if (!canvas) return;

        canvas.addEventListener('mousedown', (ev) => {
            if (!bgDataUrl || !ev.target.closest('.ave-bg-wrapper')) return;
            isDragging = true;
            dragStartX = ev.clientX - bgPosX;
            dragStartY = ev.clientY - bgPosY;
            ev.preventDefault();
        });

        window.addEventListener('mousemove', (ev) => {
            if (!isDragging) return;
            bgPosX = ev.clientX - dragStartX;
            bgPosY = ev.clientY - dragStartY;
            requestAnimationFrame(updateBgTransform);
        });

        window.addEventListener('mouseup', () => { isDragging = false; });
    }

    /* ── Shadow overlay ── */

    async function loadShadowOverlay() {
        try {
            const response = await fetch('Root/assets/sombra-post-story.png');
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const shadowImg = document.getElementById('aveShadowOverlay');
                    if (shadowImg) {
                        shadowImg.src = e.target.result;
                        shadowImg.style.display = 'block';
                    }
                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.warn('⚠️ AVE shadow overlay not found:', err);
        }
    }

    /* ── Logo ── */

    function updateLogoSrc() {
        const program = document.getElementById('aveProgram')?.value || 'MEC - DNE';
        const base = LOGO_MAP[program] || 'dne';
        const logoEl = document.getElementById('aveLogoImg');
        if (logoEl) logoEl.src = `Root/assets/logos/logo-${base}-mono.svg`;
    }

    /* ── Text ── */

    function syncText() {
        const titleEl = document.getElementById('aveTitleDisplay');
        const subtitleEl = document.getElementById('aveSubtitleDisplay');
        if (titleEl) titleEl.textContent = document.getElementById('aveTitleIn')?.value || '';
        if (subtitleEl) subtitleEl.textContent = document.getElementById('aveSubtitleIn')?.value || '';
    }

    /* ── Scale to fit wrap ── */

    function updateScale() {
        const wrapper = document.getElementById('aveScaleWrapper');
        const wrap = document.getElementById('aveWrap');
        if (!wrapper || !wrap) return;
        const availW = wrap.offsetWidth - 48;
        const availH = wrap.offsetHeight - 48;
        const scale = Math.min(availW / AVE_W, availH / AVE_H, 1);
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top center';
    }

    /* ── Export ── */

    async function exportJPG() {
        if (typeof window.htmlToImage === 'undefined' || !window.htmlToImage.toJpeg) {
            throw new Error('Librería html-to-image no disponible.');
        }
        const canvas = document.getElementById('aveCanvas');
        if (!canvas) throw new Error('AVE canvas not found');

        const wrapper = document.getElementById('aveScaleWrapper');
        const origTransform = wrapper?.style.transform || '';
        const origOrigin = wrapper?.style.transformOrigin || '';

        ExportEngine.showProgress(0, 'Preparando banner...');

        if (wrapper) {
            wrapper.style.transform = 'scale(1)';
            wrapper.style.transformOrigin = 'top left';
        }
        canvas.style.setProperty('border-radius', '0px', 'important');
        canvas.style.setProperty('box-shadow', 'none', 'important');

        await new Promise(r => setTimeout(r, 200));
        ExportEngine.showProgress(30, 'Generando imagen...');

        try {
            const dataUrl = await window.htmlToImage.toJpeg(canvas, {
                quality: 0.98,
                pixelRatio: 2,
                backgroundColor: '#1a1a2e',
                cacheBust: true,
                skipFonts: false,
            });
            ExportEngine.showProgress(90, 'Descargando...');
            const link = document.createElement('a');
            link.download = `ave-banner-${Date.now()}.jpg`;
            link.href = dataUrl;
            link.click();
            ExportEngine.showProgress(100, '¡Banner descargado!');
            setTimeout(() => ExportEngine.hideProgress(), 2000);
        } finally {
            canvas.style.borderRadius = '';
            canvas.style.boxShadow = '';
            if (wrapper) {
                wrapper.style.transform = origTransform;
                wrapper.style.transformOrigin = origOrigin;
            }
        }
    }

    /* ── Init ── */

    function init() {
        ['aveTitleIn', 'aveSubtitleIn'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', syncText);
        });

        const aveBgInput = document.getElementById('aveBgInput');
        if (aveBgInput) {
            aveBgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) loadBackground(file);
            });
        }

        const aveScaleInput = document.getElementById('aveScaleInput');
        if (aveScaleInput) {
            aveScaleInput.addEventListener('input', (e) => setScale(e.target.value));
        }

        document.getElementById('aveProgram')?.addEventListener('change', updateLogoSrc);

        initDrag();
        loadShadowOverlay();
        syncText();
        updateLogoSrc();
        window.addEventListener('resize', updateScale);

        console.log('📺 AveGenerator initialized');
    }

    return { init, syncText, exportJPG, updateScale };
})();

document.addEventListener('DOMContentLoaded', () => AveGenerator.init());
console.log('📺 ave-generator.js loaded');

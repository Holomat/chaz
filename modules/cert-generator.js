/**
 * ═══════════════════════════════════════════════════════
 * CERT GENERATOR — modules/cert-generator.js
 * A4 landscape certificate (1123×794px)
 * Trama background + institutional typography
 * ═══════════════════════════════════════════════════════
 */

const CertGenerator = (() => {
    'use strict';

    const CERT_W = 1123;
    const CERT_H = 794;

    let certResponsibleCount = 1;

    const LOGO_MAP = {
        'DNE Isotipo':              'dne-iso',
        'MEC - DNE':                'dne',
        'Cultura Científica':       'cc',
        'Cultura Científica (Anep)':'cc-anep',
        'Ccepi':                    'ccepi',
        'PAS':                      'pas',
        'PNEC':                     'pnec',
        'Cecap':                    'cecap',
        'Secretaría Permanente':    'sp'
    };

    /**
     * Break a title string into lines of at most maxChars characters,
     * splitting only at word boundaries. Returns lines joined with \n.
     */
    function wrapTitle(text, maxChars = 25) {
        const words = text.trim().split(/\s+/);
        const lines = [];
        let current = '';

        for (const word of words) {
            if (!current) {
                current = word;
            } else if ((current + ' ' + word).length <= maxChars) {
                current += ' ' + word;
            } else {
                lines.push(current);
                current = word;
            }
        }
        if (current) lines.push(current);
        return lines.join('\n');
    }

    function getLogoSrc(program) {
        const base = LOGO_MAP[program] || 'dne';
        return `Root/assets/logos/logo-${base}-color.svg`;
    }

    function val(id) {
        return document.getElementById(id)?.value ?? '';
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    /**
     * Re-render all dynamic content from sidebar inputs into the canvas.
     */
    function render() {
        const program = val('certProgram') || 'MEC - DNE';

        const logoEl = document.getElementById('certLogoImg');
        if (logoEl) logoEl.src = getLogoSrc(program);

        const rawTitle = val('certTitle') || 'Título del Curso';
        setText('certTitleDisplay', wrapTitle(rawTitle));
        setText('certNameDisplay',    val('certName')    || 'Nombre y Apellido');
        setText('certDetailsDisplay', val('certDetails') || '');

        for (let i = 1; i <= 3; i++) {
            setText(`certR${i}NameDisplay`, val(`certR${i}Name`));
            setText(`certR${i}RoleDisplay`, val(`certR${i}Role`));
            setText(`certR${i}InstDisplay`, val(`certR${i}Inst`));

            const block = document.getElementById(`certResponsible${i}`);
            if (block) block.classList.toggle('hidden', i > certResponsibleCount);
        }
    }

    /**
     * Compute and apply CSS scale so the certificate fits the preview area.
     */
    function updateScale() {
        const wrapper = document.getElementById('certScaleWrapper');
        const wrap    = document.getElementById('certWrap');
        if (!wrapper || !wrap) return;

        const availW = wrap.offsetWidth  - 48;
        const availH = wrap.offsetHeight - 48;
        const scale  = Math.min(availW / CERT_W, availH / CERT_H, 1);
        wrapper.style.transform = `scale(${scale})`;
    }

    /**
     * Export the certificate as a high-quality JPG.
     */
    async function exportJPG() {
        const certCanvas = document.getElementById('certCanvas');
        if (!certCanvas) throw new Error('Cert canvas not found');

        if (typeof window.htmlToImage === 'undefined' || !window.htmlToImage.toJpeg) {
            throw new Error('Librería html-to-image no disponible.');
        }

        ExportEngine.showProgress(0, 'Preparando certificado...');

        const wrapper     = document.getElementById('certScaleWrapper');
        const origTransform = wrapper ? wrapper.style.transform : '';
        if (wrapper) {
            wrapper.style.transform       = 'scale(1)';
            wrapper.style.transformOrigin = 'top left';
        }

        const origRadius = certCanvas.style.borderRadius;
        const origShadow = certCanvas.style.boxShadow;
        certCanvas.style.setProperty('border-radius', '0px', 'important');
        certCanvas.style.setProperty('box-shadow',    'none', 'important');

        await new Promise(r => setTimeout(r, 200));
        ExportEngine.showProgress(30, 'Generando imagen...');

        try {
            const dataUrl = await window.htmlToImage.toJpeg(certCanvas, {
                quality:         0.98,
                pixelRatio:      3,
                backgroundColor: '#FFFFFF',
                cacheBust:       true,
                skipFonts:       false,
            });

            ExportEngine.showProgress(90, 'Descargando...');

            const link      = document.createElement('a');
            link.download   = `certificado-dne-${Date.now()}.jpg`;
            link.href       = dataUrl;
            link.click();

            ExportEngine.showProgress(100, '¡Certificado descargado!');
            setTimeout(() => ExportEngine.hideProgress(), 2000);

        } finally {
            certCanvas.style.borderRadius = origRadius;
            certCanvas.style.boxShadow    = origShadow;
            if (wrapper) {
                wrapper.style.transform       = origTransform;
                wrapper.style.transformOrigin = '';
            }
        }
    }

    function syncRespButtons() {
        document.getElementById('certAddResponsible')
            ?.classList.toggle('hidden', certResponsibleCount >= 3);
        document.getElementById('certRemoveResponsible')
            ?.classList.toggle('hidden', certResponsibleCount <= 1);
        document.getElementById('certFooter')
            ?.classList.toggle('cert-footer--single', certResponsibleCount === 1);
    }

    /**
     * Reveal the next responsible slot (sidebar + canvas).
     */
    function addResponsible() {
        if (certResponsibleCount >= 3) return;
        certResponsibleCount++;
        document.getElementById(`certRespSection${certResponsibleCount}`)
            ?.classList.remove('hidden');
        syncRespButtons();
        render();
    }

    /**
     * Hide the last responsible slot (sidebar + canvas).
     */
    function removeResponsible() {
        if (certResponsibleCount <= 1) return;
        document.getElementById(`certRespSection${certResponsibleCount}`)
            ?.classList.add('hidden');
        certResponsibleCount--;
        syncRespButtons();
        render();
    }

    /**
     * Wire up digital signature upload + clear for one responsible slot.
     */
    function wireSigUpload(i) {
        const input    = document.getElementById(`certR${i}SigInput`);
        const clearBtn = document.getElementById(`certR${i}SigClear`);
        const img      = document.getElementById(`certR${i}SigImg`);
        const label    = document.getElementById(`certR${i}SigLabel`);
        if (!input || !img) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                img.src = ev.target.result;
                img.classList.add('loaded');
                if (clearBtn) clearBtn.classList.remove('hidden');
                if (label) {
                    const span = label.querySelector('span');
                    if (span) span.textContent = '✓ Firma cargada';
                }
            };
            reader.readAsDataURL(file);
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                img.src = '';
                img.classList.remove('loaded');
                clearBtn.classList.add('hidden');
                input.value = '';
                if (label) {
                    const span = label.querySelector('span');
                    if (span) span.textContent = 'Firma digital';
                }
            });
        }
    }

    function init() {
        const ids = [
            'certProgram',
            'certTitle', 'certName', 'certDetails',
            'certR1Name', 'certR1Role', 'certR1Inst',
            'certR2Name', 'certR2Role', 'certR2Inst',
            'certR3Name', 'certR3Role', 'certR3Inst',
        ];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input',  render);
            el.addEventListener('change', render);
        });

        wireSigUpload(1);
        wireSigUpload(2);
        wireSigUpload(3);

        document.getElementById('certAddResponsible')
            ?.addEventListener('click', addResponsible);
        document.getElementById('certRemoveResponsible')
            ?.addEventListener('click', removeResponsible);

        window.addEventListener('resize', updateScale);
        updateScale();
        syncRespButtons();
        render();

        console.log('📜 CertGenerator initialized');
    }

    return { init, render, exportJPG, updateScale };
})();

document.addEventListener('DOMContentLoaded', () => CertGenerator.init());
console.log('📜 cert-generator.js loaded');

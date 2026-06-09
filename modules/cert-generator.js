/**
 * ═══════════════════════════════════════════════════════
 * CERT GENERATOR — modules/cert-generator.js
 * A4 landscape certificate (1123×794px)
 * Trama background + institutional typography
 * CSV/Excel batch export (one JPG per participant)
 * ═══════════════════════════════════════════════════════
 */

const CertGenerator = (() => {
    'use strict';

    const CERT_W = 1123;
    const CERT_H = 794;

    /* ── State ── */
    let certResponsibleCount = 1;
    let certRecords          = [];   // loaded from CSV/Excel
    let certRecordIndex      = 0;
    let certZoomFactor       = 1;
    let dorsoEnabled         = false; // dorso (back side) preview switch

    const LOGO_MAP = {
        'DNE Isotipo':              'dne-iso',
        'MEC - DNE':                'dne',
        'Cultura Científica':                'cc',
        'Cultura Científica (Anep)':         'cc-anep',
        'CC 40 Anos':        '40-cc',
        'CC 40 Anos (Anep)': '40-cc-anep',
        'Ccepi':                    'ccepi',
        'PAS':                      'pas',
        'PNEC':                     'pnec',
        'Cecap':                    'cecap',
        'Secretaría Permanente':    'sp'
    };

    /* ── Helpers ── */

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

    function processBold(text) {
        const escaped = (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return escaped.replace(/\*(.*?)\*/g, '<span class="bold-part">$1</span>');
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = processBold(text);
    }

    function setInput(id, text) {
        const el = document.getElementById(id);
        if (el) el.value = text;
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    /* ── Title width adjustment ── */

    function adjustTitleWidth() {
        const el = document.getElementById('certTitleDisplay');
        if (!el) return;
        el.classList.remove('cert-title--wide');
        const style  = getComputedStyle(el);
        const lineH  = parseFloat(style.lineHeight);
        const twoLinesH = lineH * 2
                        + parseFloat(style.paddingTop)
                        + parseFloat(style.paddingBottom);
        if (el.offsetHeight > Math.ceil(twoLinesH) + 1) {
            el.classList.add('cert-title--wide');
        }
    }

    /* ── Render ── */

    function render() {
        const program = val('certProgram') || 'MEC - DNE';
        const logoEl  = document.getElementById('certLogoImg');
        if (logoEl) logoEl.src = getLogoSrc(program);

        const rawTitle = val('certTitle') || 'Nombre de la actividad a certificar (curso, taller o programa)';
        setText('certTitleDisplay', rawTitle);
        adjustTitleWidth();
        setText('certNameDisplay',    val('certName')    || 'Nombre y Apellido');
        setText('certDetailsDisplay', val('certDetails') || '');

        // Dorso: nombre del curso (= título del frente) + contenidos editables
        setText('certBackTitleDisplay',   val('certTitle')       || 'Nombre de la actividad');
        setText('certBackContentDisplay', val('certBackContent') || '');

        // Hide inst display rows (always hidden, field removed from UI)
        for (let i = 1; i <= 3; i++) {
            const instEl = document.getElementById(`certR${i}InstDisplay`);
            if (instEl) instEl.style.display = 'none';
        }

        for (let i = 1; i <= 3; i++) {
            setText(`certR${i}NameDisplay`, val(`certR${i}Name`));
            setText(`certR${i}RoleDisplay`, val(`certR${i}Role`));
            setText(`certR${i}InstDisplay`, val(`certR${i}Inst`));

            const block = document.getElementById(`certResponsible${i}`);
            if (block) block.style.display = (i > certResponsibleCount) ? 'none' : '';
        }
    }

    /* ── Scale ── */

    function updateScale() {
        const wrapper    = document.getElementById('certScaleWrapper');
        const canvasArea = document.getElementById('canvasArea');
        if (!wrapper || !canvasArea) return;
        const cs   = getComputedStyle(canvasArea);
        const padT = parseFloat(cs.paddingTop)    || 0;
        const padB = parseFloat(cs.paddingBottom) || 0;
        const availW = canvasArea.clientWidth  - 48;
        const availH = canvasArea.clientHeight - padT - padB - 48; // descuenta la reserva de la barra
        const base   = Math.min(availW / CERT_W, availH / CERT_H, 1) * 0.9; // 90% por defecto
        wrapper.style.transform       = `scale(${base * certZoomFactor})`;
        wrapper.style.transformOrigin = 'center center';
    }

    /* ── Dorso (back side) toggle — switch frente/dorso ── */
    function setDorso(on) {
        dorsoEnabled = !!on;
        const front  = document.getElementById('certCanvas');
        const back   = document.getElementById('certBackCanvas');
        const row    = document.getElementById('certBackRow');
        const rowSep = document.getElementById('certBackSep');
        const detRow = document.getElementById('certDetailsRow');
        const detSep = document.getElementById('certDetailsSep');
        const toggle = document.getElementById('certDorsoToggle');
        // Switch: muestra una sola cara a la vez
        if (front) front.style.display = dorsoEnabled ? 'none' : '';
        if (back)  back.style.display  = dorsoEnabled ? '' : 'none';
        // Campos del frente (Detalle) ↔ campos del dorso (Contenidos)
        if (detRow) detRow.classList.toggle('hidden', dorsoEnabled);
        if (detSep) detSep.classList.toggle('hidden', dorsoEnabled);
        if (row)    row.classList.toggle('hidden', !dorsoEnabled);
        if (rowSep) rowSep.classList.toggle('hidden', !dorsoEnabled);
        if (toggle) {
            toggle.classList.toggle('is-on', dorsoEnabled);
            toggle.setAttribute('aria-checked', dorsoEnabled ? 'true' : 'false');
        }
        render();
        updateScale();
    }

    function toggleDorso() {
        setDorso(!dorsoEnabled);
    }

    function setZoom(factor) {
        certZoomFactor = factor;
        updateScale();
    }

    /* ── CSV / Excel data loading ── */

    async function loadCertData(file) {
        if (typeof DataParser === 'undefined') {
            showToast('DataParser no disponible', 'error');
            return;
        }

        const result = await DataParser.parseFile(file);

        // Filter records that have at least nombre or apellido
        const records = result.records.filter(r => r.nombre || r.apellido);

        if (!records.length) {
            showToast(result.errors[0] || 'No se encontraron registros válidos', 'error');
            return;
        }

        certRecords      = records;
        certRecordIndex  = 0;

        // Update sidebar stats
        const countEl = document.getElementById('certDataRowCount');
        if (countEl) countEl.textContent = `${records.length} participante${records.length !== 1 ? 's' : ''}`;

        document.getElementById('certDataPreview')?.classList.remove('hidden');

        goToCertRecord(0);
        showToast(`${records.length} participantes cargados ✓`, 'success');

        // Update download button labels
        const btn = document.getElementById('mainDownloadBtn');
        if (btn) btn.querySelector('span').textContent = `Descargar ${records.length} certificados`;
        const certBtn = document.getElementById('certDownloadBtn');
        if (certBtn) {
            const span = certBtn.querySelector('span');
            if (span) span.textContent = `Descargar ${records.length} certificados`;
        }
    }

    function goToCertRecord(index) {
        if (!certRecords.length) return;
        certRecordIndex = Math.max(0, Math.min(index, certRecords.length - 1));

        const r        = certRecords[certRecordIndex];
        const fullName = [r.nombre, r.apellido].filter(Boolean).join(' ');
        setInput('certName', fullName);

        render();
        updateCertNav();
    }

    function updateCertNav() {
        const total = certRecords.length;
        const idx   = certRecordIndex;

        const indicator = document.getElementById('certPageIndicator');
        if (indicator) indicator.textContent = `${idx + 1} / ${total}`;

        const prev = document.getElementById('certPrevBtn');
        const next = document.getElementById('certNextBtn');
        if (prev) prev.disabled = idx <= 0;
        if (next) next.disabled = idx >= total - 1;
    }

    /* ── Export helpers ── */

    function prepareCanvasForExport(certCanvas, wrapper) {
        const origTransform = wrapper ? wrapper.style.transform       : '';
        const origOrigin    = wrapper ? wrapper.style.transformOrigin : '';
        if (wrapper) {
            wrapper.style.transform       = 'scale(1)';
            wrapper.style.transformOrigin = 'top left';
        }
        certCanvas.style.setProperty('border-radius', '0px', 'important');
        certCanvas.style.setProperty('box-shadow',    'none', 'important');
        return { origTransform, origOrigin };
    }

    function restoreCanvas(certCanvas, wrapper, saved) {
        certCanvas.style.borderRadius = '';
        certCanvas.style.boxShadow    = '';
        if (wrapper) {
            wrapper.style.transform       = saved.origTransform;
            wrapper.style.transformOrigin = saved.origOrigin;
        }
    }

    async function captureJPG(certCanvas) {
        return window.htmlToImage.toJpeg(certCanvas, {
            quality:         0.98,
            pixelRatio:      3,
            backgroundColor: '#FFFFFF',
            cacheBust:       true,
            skipFonts:       false,
            filter: (node) => {
                // Excluir solo imágenes sin src (firmas no cargadas)
                if (node.tagName === 'IMG') {
                    const src = node.getAttribute('src');
                    return !!(src && src.trim() !== '');
                }
                return true;
            },
        });
    }

    function triggerDownload(dataUrl, filename) {
        const link    = document.createElement('a');
        link.download = filename;
        link.href     = dataUrl;
        link.click();
    }

    /* Captura una cara (frente o dorso) aunque esté oculta por el switch */
    async function captureFace(canvas) {
        const prevDisplay = canvas.style.display;
        if (prevDisplay === 'none') canvas.style.display = '';
        canvas.style.setProperty('border-radius', '0px', 'important');
        canvas.style.setProperty('box-shadow',    'none', 'important');
        await delay(120);
        const url = await captureJPG(canvas);
        canvas.style.borderRadius = '';
        canvas.style.boxShadow    = '';
        canvas.style.display      = prevDisplay;
        return url;
    }

    /* nombre de archivo seguro a partir del nombre completo */
    function safe(fullName) {
        return fullName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-áéíóúüñÁÉÍÓÚÜÑ]/g, '');
    }

    /* ── Single export ── mode: 'front' | 'dorso' ── */

    async function exportSingle(mode) {
        const certCanvas = document.getElementById('certCanvas');
        if (!certCanvas) throw new Error('Cert canvas not found');

        const backCanvas = document.getElementById('certBackCanvas');
        const wrapper = document.getElementById('certScaleWrapper');
        const saved   = prepareCanvasForExport(certCanvas, wrapper);

        await delay(200);
        ExportEngine.showProgress(30, mode === 'dorso' ? 'Generando dorso...' : 'Generando imagen...');

        try {
            const ts = Date.now();
            if (mode === 'dorso') {
                if (backCanvas) {
                    const backUrl = await captureFace(backCanvas);
                    triggerDownload(backUrl, `certificado-dne-${ts}-Contenidos.jpg`);
                }
            } else {
                const frontUrl = await captureFace(certCanvas);
                triggerDownload(frontUrl, `certificado-dne-${ts}.jpg`);
            }

            ExportEngine.showProgress(100, '¡Certificado descargado!');
            setTimeout(() => ExportEngine.hideProgress(), 2000);
        } finally {
            restoreCanvas(certCanvas, wrapper, saved);
        }
    }

    /* ── Batch export ── mode: 'front' | 'dorso' ── */

    async function exportBatch(mode) {
        const certCanvas = document.getElementById('certCanvas');
        if (!certCanvas) throw new Error('Cert canvas not found');

        const backCanvas = document.getElementById('certBackCanvas');
        const wrapper = document.getElementById('certScaleWrapper');
        const saved   = prepareCanvasForExport(certCanvas, wrapper);

        ExportEngine.showProgress(0, `Exportando 0 / ${certRecords.length}...`);
        const total = certRecords.length;

        try {
            if (mode === 'dorso') {
                // El dorso (Contenidos) es idéntico para todos: se captura una vez
                // y se descarga por participante con el nombre del frente + "Contenidos".
                const backUrl = backCanvas ? await captureFace(backCanvas) : null;
                for (let i = 0; i < total; i++) {
                    const r        = certRecords[i];
                    const fullName = [r.nombre, r.apellido].filter(Boolean).join(' ');
                    if (backUrl) triggerDownload(backUrl, `certificado-${safe(fullName)}-Contenidos.jpg`);
                    await delay(150);
                    ExportEngine.showProgress(Math.round(((i + 1) / total) * 100), `${i + 1} / ${total}`);
                }
            } else {
                for (let i = 0; i < total; i++) {
                    const r        = certRecords[i];
                    const fullName = [r.nombre, r.apellido].filter(Boolean).join(' ');
                    setInput('certName', fullName);
                    render();
                    await delay(150);
                    const dataUrl = await captureFace(certCanvas);
                    triggerDownload(dataUrl, `certificado-${safe(fullName)}.jpg`);
                    await delay(200);
                    ExportEngine.showProgress(Math.round(((i + 1) / total) * 100), `${i + 1} / ${total}`);
                }
            }

            ExportEngine.showProgress(100, `¡${total} ${mode === 'dorso' ? 'dorsos' : 'certificados'} exportados!`);
            setTimeout(() => ExportEngine.hideProgress(), 2500);

        } finally {
            restoreCanvas(certCanvas, wrapper, saved);
            goToCertRecord(certRecordIndex);
        }
    }

    /* ── Modal de descarga (frente / dorso / cancelar) ── */

    function showExportDialog() {
        return new Promise((resolve) => {
            const backdrop = document.getElementById('certDlBackdrop');
            const btnFront = document.getElementById('certDlFront');
            const btnBack  = document.getElementById('certDlBack');
            const btnCancel= document.getElementById('certDlCancel');
            if (!backdrop || !btnFront || !btnBack || !btnCancel) { resolve('cancel'); return; }

            backdrop.hidden = false;

            function cleanup(choice) {
                backdrop.hidden = true;
                btnFront.removeEventListener('click', onFront);
                btnBack.removeEventListener('click', onBack);
                btnCancel.removeEventListener('click', onCancel);
                backdrop.removeEventListener('click', onBackdrop);
                document.removeEventListener('keydown', onKey);
                resolve(choice);
            }
            const onFront    = () => cleanup('front');
            const onBack     = () => cleanup('dorso');
            const onCancel   = () => cleanup('cancel');
            const onBackdrop = (e) => { if (e.target === backdrop) cleanup('cancel'); };
            const onKey      = (e) => { if (e.key === 'Escape') cleanup('cancel'); };

            btnFront.addEventListener('click', onFront);
            btnBack.addEventListener('click', onBack);
            btnCancel.addEventListener('click', onCancel);
            backdrop.addEventListener('click', onBackdrop);
            document.addEventListener('keydown', onKey);
        });
    }

    /* ── Public export entry point ── */

    async function exportJPG() {
        if (typeof window.htmlToImage === 'undefined' || !window.htmlToImage.toJpeg) {
            throw new Error('Librería html-to-image no disponible.');
        }

        const choice = await showExportDialog(); // 'front' | 'dorso' | 'cancel'
        if (choice === 'cancel') return false;

        ExportEngine.showProgress(0, certRecords.length > 0
            ? `Preparando ${certRecords.length} certificados...`
            : 'Preparando certificado...');

        if (certRecords.length > 0) {
            await exportBatch(choice);
        } else {
            await exportSingle(choice);
        }
        return true;
    }

    /* ── Responsables ── */

    function syncRespButtons() {
        document.getElementById('certAddResponsible')
            ?.classList.toggle('hidden', certResponsibleCount >= 3);
        document.getElementById('certRemoveResponsible')
            ?.classList.toggle('hidden', certResponsibleCount <= 1);
        document.getElementById('certFooter')
            ?.classList.toggle('cert-footer--single', certResponsibleCount === 1);
    }

    function addResponsible() {
        if (certResponsibleCount >= 3) return;
        certResponsibleCount++;
        document.getElementById(`certRespSection${certResponsibleCount}`)
            ?.classList.remove('hidden');
        syncRespButtons();
        render();
    }

    function removeResponsible() {
        if (certResponsibleCount <= 1) return;
        document.getElementById(`certRespSection${certResponsibleCount}`)
            ?.classList.add('hidden');
        certResponsibleCount--;
        syncRespButtons();
        render();
    }

    /* ── Digital signature upload ── */

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

    /* ── Init ── */

    function init() {
        const ids = [
            'certProgram',
            'certTitle', 'certName', 'certDetails', 'certBackContent',
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

        // CSV import
        const certDataInput = document.getElementById('certDataInput');
        if (certDataInput) {
            certDataInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const label = document.getElementById('certDataLabel');
                if (label) label.querySelector('span').textContent = file.name;
                loadCertData(file);
            });
        }

        // Navigation
        document.getElementById('certPrevBtn')
            ?.addEventListener('click', () => goToCertRecord(certRecordIndex - 1));
        document.getElementById('certNextBtn')
            ?.addEventListener('click', () => goToCertRecord(certRecordIndex + 1));

        wireSigUpload(1);
        wireSigUpload(2);
        wireSigUpload(3);

        document.getElementById('certAddResponsible')
            ?.addEventListener('click', addResponsible);
        document.getElementById('certRemoveResponsible')
            ?.addEventListener('click', removeResponsible);

        // Toggle dorso (back side)
        document.getElementById('certDorsoToggle')
            ?.addEventListener('click', toggleDorso);

        window.addEventListener('resize', updateScale);
        updateScale();
        syncRespButtons();
        render();

        console.log('📜 CertGenerator initialized');
    }

    return { init, render, exportJPG, updateScale, setZoom };
})();

document.addEventListener('DOMContentLoaded', () => CertGenerator.init());
console.log('📜 cert-generator.js loaded');

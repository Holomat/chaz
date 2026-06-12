/**
 * POST /api/login
 * Valida correo @mec.gub.uy + contraseña (server-side) y setea una cookie de sesión.
 * La contraseña y el token NUNCA llegan al cliente: viven en este archivo serverless
 * (que no se sirve al navegador) y/o en variables de entorno de Vercel.
 *
 * Variables de entorno (opcionales — hay fallback para que funcione out-of-the-box):
 *   ACCESS_PASSWORD   contraseña de acceso        (default: "comunicacion")
 *   SESSION_TOKEN     valor secreto de la cookie  (default: constante de abajo)
 *   ALLOWED_DOMAIN    dominio permitido           (default: "mec.gub.uy")
 */

const DEFAULT_PASSWORD = 'comunicacion';
const DEFAULT_TOKEN    = 'atomo-dne-2026-7f3a9c1e5b8d4620'; // debe coincidir con middleware.js
const DEFAULT_DOMAIN   = 'mec.gub.uy';
const MAX_AGE          = 60 * 60 * 12; // 12 horas

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Método no permitido' });
        return;
    }

    const PASSWORD = process.env.ACCESS_PASSWORD || DEFAULT_PASSWORD;
    const TOKEN    = process.env.SESSION_TOKEN   || DEFAULT_TOKEN;
    const DOMAIN   = (process.env.ALLOWED_DOMAIN || DEFAULT_DOMAIN).toLowerCase();

    // Body puede venir parseado (objeto) o como string
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    body = body || {};

    const email    = String(body.email    || '').trim().toLowerCase();
    const password = String(body.password || '');

    const emailRx = new RegExp('^[^@\\s]+@' + DOMAIN.replace(/\./g, '\\.') + '$', 'i');
    if (!emailRx.test(email)) {
        res.status(401).json({ ok: false, error: `Usá un correo @${DOMAIN} válido.` });
        return;
    }
    if (password !== PASSWORD) {
        res.status(401).json({ ok: false, error: 'Contraseña incorrecta.' });
        return;
    }

    res.setHeader('Set-Cookie',
        `atomo_session=${TOKEN}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}`);
    res.status(200).json({ ok: true });
}

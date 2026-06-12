/**
 * POST /api/login
 * Valida el código de acceso (server-side) y setea una cookie de sesión httpOnly.
 * El código y el token NUNCA llegan al cliente: viven en este archivo serverless
 * (que no se sirve al navegador) y/o en variables de entorno de Vercel.
 *
 * Variables de entorno (opcionales — hay fallback para que funcione out-of-the-box):
 *   ACCESS_PASSWORD   código de acceso            (default: "comunica")
 *   SESSION_TOKEN     valor secreto de la cookie  (default: constante de abajo)
 */

const DEFAULT_PASSWORD = 'comunica';
const DEFAULT_TOKEN    = 'atomo-dne-2026-7f3a9c1e5b8d4620'; // debe coincidir con middleware.js
const MAX_AGE          = 60 * 60 * 12; // 12 horas

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Método no permitido' });
        return;
    }

    const PASSWORD = process.env.ACCESS_PASSWORD || DEFAULT_PASSWORD;
    const TOKEN    = process.env.SESSION_TOKEN   || DEFAULT_TOKEN;

    // Body puede venir parseado (objeto) o como string
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = {}; } }
    body = body || {};

    const password = String(body.password || '');

    if (password !== PASSWORD) {
        res.status(401).json({ ok: false, error: 'Código inválido.' });
        return;
    }

    res.setHeader('Set-Cookie',
        `atomo_session=${TOKEN}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}`);
    res.status(200).json({ ok: true });
}

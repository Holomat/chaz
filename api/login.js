/**
 * POST /api/login
 * Valida el codigo de acceso y setea una cookie de sesion httpOnly.
 * El codigo y el token viven del lado serverless o en variables de entorno.
 *
 * Variables de entorno opcionales:
 *   ACCESS_PASSWORD   codigo de acceso            (default: "comunica")
 *   SESSION_TOKEN     valor secreto de la cookie  (default: constante de abajo)
 */

const DEFAULT_PASSWORD = 'comunica';
const DEFAULT_TOKEN = 'atomo-dne-2026-7f3a9c1e5b8d4620'; // debe coincidir con middleware.js
const MAX_AGE = 60 * 60 * 12; // 12 horas
const ALLOWED_DOMAIN = '@mec.gub.uy';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Metodo no permitido' });
        return;
    }

    const PASSWORD = process.env.ACCESS_PASSWORD || DEFAULT_PASSWORD;
    const TOKEN = process.env.SESSION_TOKEN || DEFAULT_TOKEN;

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (_) {
            body = {};
        }
    }
    body = body || {};

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email.endsWith(ALLOWED_DOMAIN)) {
        res.status(401).json({ ok: false, error: 'Usa tu usuario MEC.' });
        return;
    }

    if (password !== PASSWORD) {
        res.status(401).json({ ok: false, error: 'Codigo invalido.' });
        return;
    }

    res.setHeader(
        'Set-Cookie',
        `atomo_session=${TOKEN}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${MAX_AGE}`
    );
    res.status(200).json({ ok: true });
}

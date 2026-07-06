/**
 * Edge Middleware — protege toda la app.
 * Si el visitante no tiene una cookie de sesión válida, lo redirige a /login.html.
 * Así el index.html y TODOS los assets (CSS/JS/imágenes) NO se sirven a usuarios
 * sin autenticar → el código del front no es accesible sin loguearse.
 *
 * Excluidos del gate (públicos): la propia página de login, su API y favicon.
 */

const DEFAULT_TOKEN = 'atomo-dne-2026-7f3a9c1e5b8d4620'; // debe coincidir con api/login.js

export const config = {
    // Corre en todo excepto login.html, /api/login y favicons
    matcher: ['/((?!login\\.html|api/login|favicon\\.ico|favicon\\.svg|robots\\.txt).*)'],
};

export default function middleware(request) {
    const TOKEN  = process.env.SESSION_TOKEN || DEFAULT_TOKEN;
    const cookie = request.headers.get('cookie') || '';
    const match  = cookie.match(/(?:^|;\s*)atomo_session=([^;]+)/);

    if (match && match[1] === TOKEN) {
        return; // autenticado → continúa al recurso
    }

    const url      = new URL(request.url);
    const loginUrl = new URL('/login.html', request.url);
    loginUrl.searchParams.set('next', url.pathname + url.search);
    return Response.redirect(loginUrl, 307);
}

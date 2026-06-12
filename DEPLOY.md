# Deploy en Vercel — átomo (con acceso protegido)

Sitio estático + autenticación server-side. Un visitante **sin sesión válida no recibe
el HTML/JS/CSS de la app**: el Edge Middleware lo redirige a `/login.html`. La contraseña
se valida en una función serverless (`/api/login`), no en el cliente.

## Arquitectura

```
Visitante ─▶ middleware.js (edge)
               │  ¿cookie atomo_session válida?
               │    sí ─▶ sirve la app (index.html + assets)
               │    no ─▶ redirige a /login.html
               │
/login.html ──▶ POST /api/login  (valida @mec.gub.uy + contraseña)
                   └─ setea cookie httpOnly y vuelve a /
```

- `login.html` — página de login pública y autocontenida (no carga assets de la app).
- `api/login.js` — valida correo + contraseña, setea la cookie de sesión.
- `middleware.js` — bloquea todo salvo `login.html` y `/api/login`.

## Pasos

1. **Repo privado** (ya está): `Holomat/atomo_3`. Importante para que el código no se clone desde GitHub.

2. En **vercel.com** → *Add New Project* → *Import* el repo `Holomat/atomo_3`.
   - Framework Preset: **Other** (se detecta solo; no hay build).
   - Build & Output: dejar vacío (sitio estático).

3. **Variables de entorno** (Settings → Environment Variables). Opcionales pero recomendadas:
   | Variable          | Valor                                   |
   |-------------------|-----------------------------------------|
   | `ACCESS_PASSWORD` | `comunicacion`                          |
   | `SESSION_TOKEN`   | una cadena larga y aleatoria (32+ chars)|
   | `ALLOWED_DOMAIN`  | `mec.gub.uy`                            |

   > Si NO las setea, el código usa defaults (`comunicacion` y un token interno). Funciona igual,
   > pero conviene setear `SESSION_TOKEN` propio en producción.

4. **Deploy**. Vercel publica en `https://<proyecto>.vercel.app`.

## Verificar que el gate funciona

- Abrir la URL en una ventana incógnito → debe mostrar **/login.html** (no la app).
- Pedir directamente `https://<proyecto>.vercel.app/index.html` sin loguear → debe redirigir a login.
- Loguear con `algo@mec.gub.uy` + la contraseña → entra a la app.
- Un correo de otro dominio o contraseña incorrecta → rechazado.

## Credenciales

- Correo: cualquiera que termine en `@mec.gub.uy`.
- Contraseña: `comunicacion` (o lo que pongas en `ACCESS_PASSWORD`).

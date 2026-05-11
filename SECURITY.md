# Security Policy / Política de Seguridad

## Supported Versions / Versiones Soportadas

| Version | Supported | Versión | Soportado |
|---|---|---|---|
| `main` (latest) | ✅ Yes | `main` (última) | ✅ Sí |
| Older releases | ❌ No | Versiones anteriores | ❌ No |

We only maintain the latest version of DevConnect Web. Please update to the latest `main` before reporting a vulnerability.  
Solo mantenemos la versión más reciente de DevConnect Web. Por favor actualiza a la última versión `main` antes de reportar una vulnerabilidad.

---

## Reporting a Vulnerability / Reportar una Vulnerabilidad

**Please do not open a public GitHub issue for security vulnerabilities.**  
**Por favor no abras un issue público en GitHub para vulnerabilidades de seguridad.**

If you discover a security vulnerability, report it privately to:  
Si descubres una vulnerabilidad de seguridad, repórtala de forma privada a:

**Email:** contactdevconnect@m41k80dev.com

Include in your report:  
Incluye en tu reporte:

- A description of the vulnerability  
  Una descripción de la vulnerabilidad  
- Steps to reproduce  
  Pasos para reproducirla  
- The potential impact  
  El impacto potencial  
- (Optional) A suggested fix  
  (Opcional) Una posible solución  

You will receive an acknowledgement within **72 hours**. We will work with you to understand and address the issue before any public disclosure.  
Recibirás una confirmación dentro de **72 horas**. Trabajaremos contigo para entender y resolver el problema antes de cualquier divulgación pública.

---

## Scope / Alcance

This policy covers the **frontend** repository (`devconnect-web`). For backend vulnerabilities, report to the API repository: https://github.com/M41k80/devconnect-api-nestjs  
Esta política cubre el repositorio de **frontend** (`devconnect-web`). Para vulnerabilidades del backend, repórtalas en el repositorio de la API: https://github.com/M41k80/devconnect-api-nestjs

### In scope / Dentro del alcance

- Authentication bypass (e.g. accessing protected routes without a valid session)  
  Bypass de autenticación (ej. acceder a rutas protegidas sin sesión válida)  
- XSS vulnerabilities in rendered content  
  Vulnerabilidades XSS en contenido renderizado  
- Sensitive data exposure in client-side code or network requests  
  Exposición de datos sensibles en el código del cliente o solicitudes de red  
- Open redirects that could be used for phishing  
  Redirecciones abiertas que puedan usarse para phishing  

### Out of scope / Fuera del alcance

- Vulnerabilities in third-party dependencies that already have a public CVE (please open a Dependabot PR or GitHub issue instead)  
  Vulnerabilidades en dependencias de terceros que ya tengan un CVE público (abrir PR con Dependabot o issue en GitHub)  
- Self-XSS (requires the attacker to run code in their own browser)  
  Self-XSS (requiere que el atacante ejecute código en su propio navegador)  
- Theoretical vulnerabilities with no practical exploit  
  Vulnerabilidades teóricas sin explotación práctica  
- Issues in demo or staging environments only  
  Problemas solo en entornos demo o staging  

---

## Security Architecture Notes / Notas de Arquitectura de Seguridad

For security researchers, here are the relevant design decisions:  
Para investigadores de seguridad, estas son las decisiones de diseño relevantes:

- **Authentication:** HttpOnly cookies. JavaScript cannot read the `token` cookie. This protects against XSS token theft.  
  **Autenticación:** Cookies HttpOnly. JavaScript no puede leer la cookie `token`. Esto protege contra el robo de tokens vía XSS.  

- **CSRF:** The API requires `withCredentials: true` on the Axios client and validates the `Origin` header. No CSRF token is needed because the cookies are HttpOnly and the API enforces CORS.  
  **CSRF:** La API requiere `withCredentials: true` en el cliente Axios y valida el header `Origin`. No se necesita token CSRF porque las cookies son HttpOnly y la API aplica CORS.  

- **Environment variables:** Only `NEXT_PUBLIC_API_URL` is exposed to the client. No secrets exist in the frontend build.  
  **Variables de entorno:** Solo `NEXT_PUBLIC_API_URL` está expuesta al cliente. No hay secretos en el build del frontend.  

- **Route protection:** Handled at the Edge via `src/proxy.ts` (Next.js middleware). JWT is decoded to check the `role` claim before any page renders.  
  **Protección de rutas:** Se maneja en el Edge mediante `src/proxy.ts` (middleware de Next.js). El JWT se decodifica para verificar el `role` antes de renderizar cualquier página.  
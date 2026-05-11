# Variables de Entorno

DevConnect Web usa un conjunto mínimo de variables de entorno. Este documento cubre cada variable, qué hace y cómo configurarla para cada ambiente.

---

## Resumen

Next.js utiliza dos tipos de variables de entorno:

- **`NEXT_PUBLIC_*`** — expuestas al navegador. Estas se incrustan en el paquete del cliente en tiempo de construcción. Cualquier persona puede verlas en las DevTools del navegador.
- **Sin prefijo** — solo para el servidor. Nunca expuestas al cliente. Usadas en Componentes del Servidor, Manejadores de Rutas y Middleware.

DevConnect actualmente tiene una sola variable, y es `NEXT_PUBLIC_`:

---

## Referencia de Variables

### `NEXT_PUBLIC_API_URL`

| Campo | Valor |
|---|---|
| **Requerido** | Sí |
| **Tipo** | Cadena de URL (sin barra final) |
| **Expuesta al navegador** | Sí |
| **Valor por defecto** | `http://localhost:3000/api` |

**¿Qué hace:**

Establece la URL base para todas las solicitudes API. Cada llamada realizada a través del cliente HTTP usa esta URL como prefijo.

```typescript
// lib/http/http-client.ts
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
```

**Ejemplos:**

```env
# Desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Pruebas
NEXT_PUBLIC_API_URL=https://api-staging.devconnect.dev/api

# Producción
NEXT_PUBLIC_API_URL=https://api.devconnect.dev/api
```

> **Nota:** No incluyas una barra final. El cliente HTTP construye rutas como `/projects`, `/auth/login`, etc. — una barra final resultaría en dobles barras.

---

## Archivos de Entorno

Next.js carga archivos de entorno en el siguiente orden (el de mayor prioridad anula al de menor):

| Archivo | Propósito | Comiteado a git? |
|---|---|---|
| `.env` | Valores por defecto base para todos los ambientes | ✅ Sí (solo valores no secretos) |
| `.env.local` | Anulaciones locales — nunca comiteadas | ❌ No |
| `.env.development` | Valores específicos del desarrollo | ✅ Sí (si no son secretos) |
| `.env.production` | Valores específicos de producción | ✅ Sí (si no son secretos) |
| `.env.development.local` | Anulaciones locales del desarrollo | ❌ No |
| `.env.production.local` | Anulaciones locales de producción | ❌ No |

**Para el desarrollo local**, crea `.env.local`:

```bash
cp .env.example .env.local
```

`.env.local` está listado en `.gitignore` y nunca será comiteado.

---

## `.env.example`

El repositorio incluye un archivo `.env.example` con todas las variables y sus descripciones:

```env
# ============================================================
# DevConnect Web — Variables de Entorno
# ============================================================
# Copia este archivo a .env.local y completa los valores.
# Nunca comites .env.local en el control de versiones.
# ============================================================

# URL base del API de DevConnect (sin barra final)
# Desarrollo local: http://localhost:3000/api
# Ejemplo de producción: https://api.devconnect.dev/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Configuración para Producción

### Vercel (recomendado)

En el panel del proyecto de Vercel:

1. Ve a **Configuración → Variables de Entorno**
2. Añade cada variable con su valor de producción
3. Selecciona los entornos a los que se aplica (Producción, Vista previa, Desarrollo)
4. Reimplementa — Vercel inyecta las variables en tiempo de construcción

```
Nombre de la Variable            Valor
NEXT_PUBLIC_API_URL      https://api.devconnect.dev/api
```

### Otros Plataformas

Configura las variables de entorno según la documentación de tu plataforma. Para Docker:

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://api.devconnect.dev/api
```

Para un servicio systemd o un archivo `.env` en el servidor, recuerda que las variables `NEXT_PUBLIC_*` están **incrustadas en el paquete de construcción** — no se pueden cambiar en tiempo de ejecución sin volver a construir. Siempre establecelas antes de ejecutar `next build`.

---

## Notas sobre Seguridad

1. **Las variables `NEXT_PUBLIC_*` son públicas.** La URL del API no es sensible — estará visible en el navegador de todos modos, ya que todas las solicitudes API van a ella. No pongas secretos aquí.

2. **El secreto JWT vive en el backend.** El frontend nunca necesita saber el secreto de firma del JWT. La autenticación se maneja completamente por cookies HttpOnly — el navegador las gestiona automáticamente y JavaScript no puede leerlas.

3. **Nunca pongas lo siguiente en `NEXT_PUBLIC_*`:**
   - Credenciales de base de datos
   - Claves secretas de API
   - Secretos del proveedor de pagos
   - Credenciales del servicio de correo electrónico

   Estos pertenecen al backend (NestJS), no al frontend.

---

## Validando Variables de Entorno al Iniciar

Actualmente, la aplicación tiene una única caída por defecto para las variables faltantes:

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
```

Si tu equipo crece, considera añadir validación de inicio:

```typescript
// lib/env.ts
const requiredVars = ['NEXT_PUBLIC_API_URL'] as const

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Variable de entorno requerida faltante: ${varName}`)
  }
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
}
```

Esto falla rápidamente al iniciar con un error claro en lugar de un comportamiento indefinido silencioso.
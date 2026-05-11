# Comenzando

Esta guía cubre todo lo que necesitas para ejecutar DevConnect Web localmente, desde cero hasta un entorno de desarrollo funcional.

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de continuar:

| Herramienta | Versión Mínima | Cómo Verificar |
|---|---|---|
| Node.js | 18.0.0 | `node --version` |
| Yarn | 1.22.0 | `yarn --version` |
| Git | Cualquiera | `git --version` |

También necesitas que **DevConnect API** esté ejecutándose localmente. El frontend es un consumidor puro de API — no hace nada sin el backend.

→ Configuración del backend: [devconnect-api-nestjs — Comenzando](https://github.com/M41k80/devconnect-api-nestjs/blob/main/docs/getting-started.md)

La API debe ser accesible en `http://localhost:3000/api` antes de iniciar el frontend.

---

## Paso 1 — Clona el Repositorio

Si eres un **contribuidor**, forkea primero, luego clona tu fork:

```bash
# Forkea en GitHub, luego:
git clone https://github.com/YOUR_USERNAME/devconnect-web.git
cd devconnect-web
git remote add upstream https://github.com/M41k80/devconnect-web.git
```

Si solo quieres ejecutarlo localmente:

```bash
git clone https://github.com/M41k80/devconnect-web.git
cd devconnect-web
```

---

## Paso 2 — Instala las Dependencias

```bash
yarn install
```

Esto instala todas las dependencias listadas en `package.json`. El proyecto usa Yarn como gestor de paquetes. No uses `npm install` — creará un archivo `package-lock.json` y entrará en conflicto con el archivo `yarn.lock`.

---

## Paso 3 — Configura las Variables de Entorno

Crea un archivo de entorno local a partir del ejemplo:

```bash
cp .env.example .env.local
```

Abre `.env.local` y establece lo siguiente:

```env
# La URL base del API de DevConnect — sin barra final
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Esa es la única variable requerida para el desarrollo local. Consulta [environment-variables.md](environment-variables.md) para la referencia completa, incluyendo variables de producción.

---

## Paso 4 — Inicia el Servidor de Desarrollo

```bash
yarn dev
```

Next.js iniciará en el puerto `3001` (incrementa automáticamente si el puerto está ocupado). Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

Deberías ver la página de aterrizaje de DevConnect. Si el backend también está ejecutándose, el inicio de sesión y el registro funcionarán inmediatamente.

---

## Paso 5 — Verifica la Configuración

Para confirmar que todo funciona:

1. Abre [http://localhost:3001](http://localhost:3001) — se carga la página de aterrizaje
2. Haz clic en **Empezar** — abre el modal de registro
3. Registra una cuenta — eres redirigido a `/projects`
4. Abre [http://localhost:3001/projects](http://localhost:3001/projects) — se carga la lista de proyectos

Si el paso 3 o 4 falla, es probable que el backend no esté ejecutándose o no sea accesible. Verifica que `NEXT_PUBLIC_API_URL` apunte a la dirección correcta.

---

## Flujo de Desarrollo

### Observación de Archivos

`yarn dev` usa el reemplazo de módulos caliente integrado de Next.js. Los cambios en componentes, hooks y estilos se reflejan inmediatamente en el navegador sin una recarga completa.

### Verificación de TypeScript

Next.js realiza la verificación de TypeScript durante la construcción, no durante `yarn dev`. Para verificar los tipos mientras desarrollas:

```bash
# Verifica tipos sin construir
npx tsc --noEmit
```

### Linting

```bash
yarn lint
```

Esto ejecuta ESLint con la configuración de Next.js. Corrige todos los avisos antes de abrir una PR.

---

## Referencia de Scripts del Proyecto

| Comando | Descripción |
|---|---|
| `yarn dev` | Inicia el servidor de desarrollo con recarga caliente |
| `yarn build` | Construye el paquete de producción |
| `yarn start` | Sirve el paquete de producción (requiere primero `yarn build`) |
| `yarn lint` | Ejecuta ESLint en todos los archivos fuente |

---

## Problemas de Configuración Comunes

### Errores `ECONNREFUSED` en la consola del navegador

El frontend no puede alcanzar el backend.

- ¿Está la API ejecutándose? (`yarn start:dev` en el repositorio de la API)
- ¿Está `NEXT_PUBLIC_API_URL` correcto en `.env.local`?
- ¿Hay un conflicto de puerto? (por defecto: `3000` para la API, `3001` para web)

### Errores `Module not found`

Intenta eliminar y reinstalar las dependencias:

```bash
rm -rf node_modules .next
yarn install
yarn dev
```

### Errores de TypeScript después de extraer cambios

Un compañero puede haber añadido nuevos tipos. Ejecuta:

```bash
npx tsc --noEmit
```

Lee los errores y actualiza tu código según corresponda.

### Puerto ya en uso

Next.js incrementa automáticamente al siguiente puerto disponible. Revisa la salida del terminal para obtener la URL real.

O especifica un puerto explícitamente:

```bash
yarn dev -p 3002
```

---

## ¿Qué Explorar Primero?

Una vez que la aplicación esté en ejecución, aquí tienes una ruta sugerida para entender el código fuente:

1. **`src/proxy.ts`** — el middleware que protege las rutas antes de que se rendericen
2. **`src/app/layout.tsx`** — el layout raíz que envuelve todo
3. **`src/app/lib/http/`** — el cliente HTTP e interceptores
4. **`src/app/store/auth.store.ts`** — cómo se gestiona el estado de autenticación
5. **`src/app/(public)/projects/page.tsx`** — una página representativa que usa el patrón de hooks

→ Continúa con [Estructura del Proyecto](project-structure.md) para una explicación completa de cada carpeta.
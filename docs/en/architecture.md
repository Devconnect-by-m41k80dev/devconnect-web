## 🏗️ Architecture / Arquitectura

This document explains the architectural decisions made in DevConnect Web, why they were made, and how all the pieces connect.
Este documento explica las decisiones de arquitectura tomadas en DevConnect Web, por qué se hicieron y cómo se conectan todas las piezas.

---

## 🧭 High-Level Overview / Vista general

```
Browser
  │
  ├── Next.js Middleware (proxy.ts)     ← Route protection before render
  │
  ├── App Router Pages                  ← Thin composition layer
  │     ├── Custom Hooks                ← All data fetching + logic
  │     └── Components                  ← All rendering
  │
  ├── Zustand Stores                    ← Client-side state
  │     ├── auth.store                  ← User identity
  │     ├── notifications.store         ← Badge counts
  │     └── theme.store                 ← UI theme
  │
  └── HTTP Layer (Axios)                ← API communication
        ├── http-client.ts              ← Axios instance + config
        ├── interceptors.ts             ← Response unwrapping + 401 handling
        └── http-methods.ts             ← Typed get/post/patch/del wrappers
              │
              └── lib/api/*             ← Resource-specific API modules
                    │
                    └── DevConnect API  ← NestJS backend (separate repo)
```

---

## 🧩 Separation of Concerns / Separación de responsabilidades

The architecture enforces a strict separation between three layers.
La arquitectura impone una separación estricta entre tres capas.

### 📦 Layer 1: Data (Hooks + API) / Capa 1: Datos (Hooks + API)

Where / Dónde: src/app/hooks/ and src/app/lib/api/
Dónde: src/app/hooks/ y src/app/lib/api/

Responsibility / Responsabilidad:
Fetch data, manage loading/error state, expose mutations.
Obtener datos, manejar estados de carga/error y exponer mutaciones.

Custom hooks are the data layer. They own all useState, useEffect, and API call logic. A hook returns data and actions — it never renders anything.
Los custom hooks son la capa de datos. Manejan todo el useState, useEffect y la lógica de llamadas a la API. Un hook devuelve datos y acciones — nunca renderiza UI.

```typescript
// useProjects.ts — only data concerns
// useProjects.ts — solo responsabilidades de datos
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)

  // ... fetch logic ...
  // ... lógica de obtención de datos ...

  return { projects, loading, filters, setFilter, clearFilters }
}
```

### 🧠 Layer 2: Logic (Context + Stores) / Capa 2: Lógica (Contexto + Stores)

Where / Dónde: src/app/context/ and src/app/store/
Dónde: src/app/context/ y src/app/store/

Responsibility / Responsabilidad:
Cross-component state that doesn't belong to a single feature.
Estado compartido entre componentes que no pertenece a una sola funcionalidad.

ModalContext — one auth modal instance for the whole app, accessible anywhere
ModalContext — una única instancia del modal de autenticación para toda la app
auth.store — user identity, accessible everywhere without prop drilling
auth.store — identidad del usuario, accesible en cualquier parte sin prop drilling
notifications.store — badge counts, shared between Navbar and Applications page
notifications.store — conteo de notificaciones, compartido entre Navbar y la página de Applications
theme.store — current theme, synced to the DOM
theme.store — tema actual, sincronizado con el DOM

### 🎨 Layer 3: UI (Components + Pages) / Capa 3: UI (Componentes + Páginas)

Where / Dónde: src/app/components/ and src/app/(protected|public)/*/page.tsx
Dónde: src/app/components/ y src/app/(protected|public)/*/page.tsx

Responsibility / Responsabilidad:
Render UI based on props and hook data. Components should not contain fetch, axios, or direct localStorage calls.
Renderizar UI basada en props y datos de hooks. Los componentes no deben contener fetch, axios ni llamadas directas a localStorage.

Pages are the thinnest layer.
Las páginas son la capa más delgada.

```tsx

// profile/page.tsx — only composition
// profile/page.tsx — solo composición
export default function ProfilePage() {
  const { user, form, editing, ... } = useProfile()  // ← data from hook
  // ← datos desde el hook

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <ProfileSidebar user={user} onEditClick={() => setEditing(true)} />
        {editing && <ProfileEditForm ... />}
        <ProfileApplicationsList apps={apps} loading={appsLoad} />
      </main>
      <Footer />
    </div>
  )
}
```

---

## 🔄 Data Flow / Flujo de datos

### 🔐 Authentication Flow / Flujo de autenticación

```
User clicks "Sign In"
Usuario hace clic en "Iniciar sesión"

  → useModal().openAuth("login")
  → ModalContext sets authOpen = true
  → ModalContext establece authOpen = true

  → <AuthModal> renders
  → Se renderiza <AuthModal>

  → User submits LoginForm
  → El usuario envía el LoginForm

  → authApi.login(credentials) → POST /auth/login
  → authApi.login(credentials) → POST /auth/login

  → Backend sets HttpOnly cookie "token"
  → El backend establece cookie HttpOnly "token"

  → usersApi.getMe() → GET /users/me
  → usersApi.getMe() → GET /users/me

  → useAuthStore.setUser(user)
  → useAuthStore.setUser(user)

  → Modal closes, page updates reactively
  → El modal se cierra y la página se actualiza de forma reactiva
```

### 🛡️ Route Protection Flow / Flujo de protección de rutas

```
User navigates to /profile
El usuario navega a /profile

  → proxy.ts (middleware) runs on Edge
  → proxy.ts (middleware) se ejecuta en Edge

  → Reads "token" cookie
  → Lee la cookie "token"

  → jwtDecode(token) → extracts role
  → jwtDecode(token) → extrae el rol

  → If no role: redirect to /?auth=login&redirect=/profile
  → Si no hay rol: redirige a /?auth=login&redirect=/profile

  → ModalContext reads ?auth=login on mount
  → ModalContext lee ?auth=login al montarse

  → Opens login modal automatically
  → Abre el modal de login automáticamente

  → After login: user is sent to /profile
  → Después del login: el usuario es enviado a /profile
```

### 🔁 Silent Token Refresh Flow / Flujo de refresh silencioso de token

```
Any API request fails with 401
Cualquier request API falla con 401

  → interceptors.ts catches the error
  → interceptors.ts captura el error

  → POST /auth/refresh (sends refresh token cookie)
  → POST /auth/refresh (envía cookie de refresh token)

  → If refresh succeeds: retry the original request
  → Si el refresh funciona: reintenta la request original

  → If refresh fails: logout()
  → Si falla: logout()

  → dispatch "open-auth-modal" event
  → dispara evento "open-auth-modal"

  → ModalContext listener opens login modal
  → ModalContext abre el modal de login
```

### 🔔 Notification Flow (Owner) / Flujo de notificaciones (propietario)

```
UserMenu mounts (user is authenticated)
UserMenu se monta (usuario autenticado)

  → useNotificationsStore.fetchPending(userId)
  → useNotificationsStore.fetchPending(userId)

  → GET /projects?limit=100 → filter by owner.id
  → GET /projects?limit=100 → filtrar por owner.id

  → For each owned project: GET /projects/:id/applications (parallel)
  → Por cada proyecto: GET /projects/:id/applications (en paralelo)

  → Count applications with status "pending"
  → Cuenta aplicaciones con estado "pending"

  → Set pendingCount in store
  → Guarda pendingCount en el store

  → Badge renders on avatar
  → Se muestra badge en el avatar

  → Cache TTL: 60 seconds
  → Cache TTL: 60 segundos

  → decrement() called after each accept/reject to keep badge accurate
  → decrement() se llama tras aceptar/rechazar para mantener el badge actualizado
```

### 🟢 Notification Flow (Applicant — Accepted) / Flujo de notificación (Solicitante — Aceptado)

```
useNotificationsStore.fetchPending(userId)
useNotificationsStore.fetchPending(userId)

  → GET /projects/applied
  → GET /projects/applied

  → Filter: status === "accepted" AND applicationId NOT IN localStorage("dc-accepted-seen")
  → Filtra: status === "accepted" y applicationId NO en localStorage("dc-accepted-seen")

  → Set acceptedCount in store
  → Guarda acceptedCount en el store

  → Green badge renders on avatar
  → Se muestra badge verde en el avatar

User opens /profile
El usuario abre /profile

  → ProfileApplicationsList mounts
  → ProfileApplicationsList se monta

  → useEffect: if any accepted apps → markAcceptedSeen()
  → useEffect: si hay apps aceptadas → markAcceptedSeen()

  → getApplied() → save accepted IDs to localStorage("dc-accepted-seen")
  → getApplied() → guarda IDs en localStorage("dc-accepted-seen")

  → Set acceptedCount = 0 → green badge disappears
  → Set acceptedCount = 0 → el badge verde desaparece
```

---

## 🧩 Component Design Philosophy / Filosofía de diseño de componentes

### 🎯 Single Responsibility / Responsabilidad única

Each component file exports one component with one responsibility. If a component is doing two things, it should be two components.
Cada archivo de componente exporta un solo componente con una única responsabilidad. Si un componente hace dos cosas, debería dividirse en dos componentes.

Examples / Ejemplos:

ProjectCard renders a clickable card — it does not know about filtering or pagination
ProjectCard renderiza una tarjeta clickeable — no sabe nada de filtros o paginación
ProjectsFilterPanel renders filter chips — it does not know about the project list
ProjectsFilterPanel renderiza chips de filtros — no conoce la lista de proyectos
ProfileSidebar renders profile info — it does not know about the edit form
ProfileSidebar renderiza información del perfil — no conoce el formulario de edición

### 📦 Props Over Global State / Props sobre estado global

Components receive their data through props, not by calling stores or hooks directly.
Los componentes reciben sus datos mediante props, no llamando directamente a stores o hooks.

This makes them:
Esto los hace:

Easier to test (just pass different props)
Más fáciles de testear (solo pasas distintas props)
Easier to reuse (works anywhere, not just in the context where the store exists)
Más reutilizables (funcionan en cualquier parte, no solo donde existe el store)
Easier to understand (all dependencies are visible in the function signature)
Más fáciles de entender (todas las dependencias están visibles en la firma de la función)

Exception / Excepción:
Cross-cutting concerns like useI18n(), useModal(), and useAuthStore() are called directly inside components where prop-drilling would be impractical.
Funciones transversales como useI18n(), useModal() y useAuthStore() se llaman directamente cuando el prop drilling sería poco práctico.

### 🧱 Compound Components / Componentes compuestos

Large features are split into a parent component and named sub-components.
Las funcionalidades grandes se dividen en un componente padre y subcomponentes nombrados.

```
ProjectCard/
  ProjectCard.tsx           ← wrapper + link
  ProjectCardHeader.tsx     ← title + badge
  ProjectCardTechStack.tsx  ← tech chips
  ProjectCardFooter.tsx     ← avatar + date + score
```

The parent composes the sub-components. Each sub-component is independently testable and replaceable.
El componente padre compone los subcomponentes. Cada subcomponente es independiente, testeable y reemplazable.

---

## 📈 Scalability Decisions / Decisiones de escalabilidad
🧠 Why Zustand instead of Redux or React Query? / ¿Por qué Zustand en vez de Redux o React Query?
Zustand is simpler — stores are plain JavaScript objects with actions. No reducers, no boilerplate.
Zustand es más simple — los stores son objetos JS con acciones. Sin reducers ni boilerplate.
Redux would be overkill for this scale of state. We have three small stores.
Redux sería excesivo para esta escala. Solo hay tres stores pequeños.
React Query was considered for server state but the combination of Zustand + custom hooks covers the same use cases with less abstraction overhead.
React Query se consideró para estado del servidor, pero Zustand + custom hooks cubren lo mismo con menos complejidad.

If the project grows significantly in data complexity, migrating to React Query is a natural evolution.
Si el proyecto crece en complejidad de datos, migrar a React Query sería una evolución natural.

### 🌐 Why a custom HTTP layer instead of React Query fetching? / ¿Por qué una capa HTTP custom en vez de React Query?

The lib/http/ layer handles two things React Query can't easily handle:
La capa lib/http/ maneja dos cosas que React Query no resuelve fácilmente:

Response envelope unwrapping — backend returns { success, data, message }
Desempaquetado de respuestas — el backend devuelve { success, data, message }
Silent token refresh — 401 interceptor retries requests automatically
Refresh silencioso de token — el interceptor 401 reintenta requests automáticamente

These belong in the HTTP client, not in individual query functions.
Esto pertenece al cliente HTTP, no a cada función de consulta.

### 🗂️ Why route groups (protected) and (public)? / ¿Por qué route groups (protected) y (public)?

Route groups allow applying middleware behavior without affecting URLs.
Los route groups permiten aplicar middleware sin afectar las URLs.

(protected) is handled via PROTECTED_PREFIXES in proxy.ts
(protected) se maneja con PROTECTED_PREFIXES en proxy.ts
(public) is purely organizational
(public) es solo organizacional

### 🎨 Why CSS variables instead of Tailwind theming? / ¿Por qué CSS variables en vez de theming de Tailwind?

Tailwind dark mode uses class-based variants (dark:bg-gray-900).
El dark mode de Tailwind usa clases (dark:bg-gray-900).

CSS variables are more flexible and composable.
Las variables CSS son más flexibles y componibles.

```css
/* One definition, works everywhere */
/* Una definición, funciona en todas partes */
--text-muted: #4a4e6b;

.dark { --text-muted: #a0a4c8; }
```

```tsx
/* Used in any component */
<p style={{ color: 'var(--text-muted)' }}>
```

Changing the value in one place affects all consumers automatically.
Cambiar el valor en un solo lugar afecta a todos los consumidores automáticamente.

---

## 🔌 Backend Contract / Contrato con el backend

The frontend is fully decoupled from the backend. The only contract is the REST API.
El frontend está completamente desacoplado del backend. El único contrato es la API REST.

All responses follow { success: boolean, data: T, message: string }
Todas las respuestas siguen el formato { success: boolean, data: T, message: string }
Authentication uses HttpOnly cookies (no Authorization header)
La autenticación usa cookies HttpOnly (sin header Authorization)
Token refresh uses the POST /auth/refresh endpoint
El refresh de token usa el endpoint POST /auth/refresh

The GET /projects/applied response uses applicationId (not id) as the primary key
La respuesta de GET /projects/applied usa applicationId (no id) como clave primaria

This is modeled explicitly as AppliedProject in the frontend type system
Esto se modela explícitamente como AppliedProject en el sistema de tipos del frontend

See api-integration.md for the full HTTP layer documentation.
Ver api-integration.md para la documentación completa de la capa HTTP.

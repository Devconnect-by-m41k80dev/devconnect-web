# Gestión de Estado

DevConnect utiliza **Zustand** para todo el estado global del cliente y **hooks personalizados** para el estado local y de servidor. Este documento explica cada store, cuándo usar cada uno y cómo interactúan entre sí.

---

## Filosofía

El estado en este proyecto vive en uno de estos tres lugares:

| Dónde | Qué almacena | Herramienta |
|---|---|---|
| **Stores de Zustand** | Estado global entre componentes que persiste o necesita ser accedido desde partes no relacionadas de la UI | Zustand + middleware persist |
| **Hooks personalizados** | Datos del servidor (obtenidos desde la API) y estado local de UI ligado a una página o funcionalidad específica | React `useState` + `useEffect` |
| **React Context** | Un único controlador global de UI (el modal de autenticación) | React Context API |

La regla principal es: **usar la herramienta más simple que resuelva el problema.**

- Si dos componentes no relacionados necesitan los mismos datos → store de Zustand
- Si los datos solo se necesitan en una funcionalidad/página → hook personalizado
- Si es una única preocupación global de UI → React Context

---

## Stores de Zustand

### `auth.store.ts` — Identidad del Usuario

**Persistido en localStorage como `dc-auth`**

```typescript
interface AuthState {
  user:            User | null
  isAuthenticated: boolean
  isLoading:       boolean
}

interface AuthActions {
  setUser:    (user: User | null) => void
  fetchMe:    () => Promise<void>       // GET /users/me
  logout:     () => Promise<void>       // POST /auth/logout + limpiar estado
  clearAuth:  () => void                // limpiar estado únicamente, sin llamada API
}
```

### Comportamientos clave

- **`isAuthenticated` NO se persiste** — siempre se recalcula a partir de `user` durante la rehidratación. Si la cookie expiró mientras el usuario estaba ausente, `fetchMe()` fallará y establecerá `isAuthenticated: false`, evitando estados de autenticación obsoletos.

- **`fetchMe()`** es la fuente de verdad para saber si la sesión es válida. Se llama después del login y al iniciar la aplicación (en `Navbar` mediante `UserMenu`).

- **`logout()`** llama a la API (que elimina la cookie HttpOnly), luego limpia el estado local y finalmente dispara `open-auth-modal` para mostrar el modal de login. Maneja correctamente el caso donde la llamada a la API falla: el estado local siempre se limpia.

### Cuándo usarlo

```typescript
// ✅ Verificar si el usuario está autenticado
const { isAuthenticated } = useAuthStore()

// ✅ Obtener el usuario actual
const { user } = useAuthStore()

// ✅ Ejecutar logout desde cualquier lugar
const { logout } = useAuthStore()

// ❌ No llamar fetchMe() directamente en un componente
// ya que hooks/Navbar lo ejecutan automáticamente
```

---

### `notifications.store.ts` — Contadores de Notificaciones

**No persistido** (se recalcula al montar)

```typescript
interface NotificationsState {
  pendingCount:  number   // aplicaciones pendientes de revisión — para PROPIETARIOS
  acceptedCount: number   // aplicaciones aceptadas recientemente — para POSTULANTES
  lastFetched:   number | null
  loading:       boolean
}

interface NotificationsActions {
  fetchPending:     (userId: string) => Promise<void>
  decrement:        (by?: number) => void
  markAcceptedSeen: () => void
  invalidate:       () => void
  reset:            () => void
}
```

### Comportamientos clave

- **TTL de caché de 60 segundos** — `fetchPending` no hace nada si se llama dentro de los 60 segundos posteriores a la última consulta. Esto evita múltiples llamadas innecesarias desde distintos componentes.

- **`pendingCount`** — cuenta aplicaciones pendientes en TODOS los proyectos propiedad del usuario. Requiere dos llamadas API:
  - `GET /projects` (filtrado por propietario)
  - `GET /projects/:id/applications` en paralelo para cada proyecto.

- **`acceptedCount`** — cuenta aplicaciones aceptadas que el usuario aún no vio. Lo “visto” se guarda en `localStorage` bajo `dc-accepted-seen` (un arreglo JSON de strings `applicationId`). Cuando se llama `markAcceptedSeen()` (desde `ProfileApplicationsList` al montar), guarda los IDs actuales y pone el contador en cero.

- **`decrement()`** — se llama después de que un propietario acepta o rechaza una aplicación para mantener el badge actualizado sin recargar todo.

- **`invalidate()`** — establece `lastFetched = null`, forzando que la siguiente llamada a `fetchPending()` consulte realmente la API.

- **`reset()`** — se ejecuta al cerrar sesión para limpiar todos los contadores.

### Cuándo usarlo

```typescript
// ✅ Leer contadores para mostrarlos (Navbar/UserMenu)
const { pendingCount, acceptedCount } = useNotificationsStore()

// ✅ Ejecutar carga inicial (UserMenu al montar)
const { fetchPending } = useNotificationsStore()

useEffect(() => {
  fetchPending(user.id)
}, [user?.id])

// ✅ Decrementar después de una acción
const { decrement } = useNotificationsStore()

await projectsApi.acceptApplication(id)
decrement(1)

// ✅ Marcar aceptadas como vistas
const { markAcceptedSeen } = useNotificationsStore()

useEffect(() => {
  markAcceptedSeen()
}, [])
```

---

### `theme.store.ts` — Tema de la UI

**Persistido en localStorage como `dc-theme`**

```typescript
interface ThemeState {
  theme: 'light' | 'dark'
}

interface ThemeActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggle:   () => void
}
```

### Comportamientos clave

- **`applyThemeToDOM(theme)`** — agrega o elimina la clase `dark` en `<html>` y añade temporalmente `theme-changing` para habilitar animaciones CSS de transición.

- **Prevención de parpadeo** — `layout.tsx` incluye un script inline que lee `localStorage` y aplica la clase dark antes de renderizar la página, evitando el “flash” en modo claro para usuarios de modo oscuro.

### Cuándo usarlo

```typescript
// ✅ Alternar tema desde ThemeToggle
const { toggle } = useThemeStore()

// ✅ Leer tema actual
const { theme } = useThemeStore()
```

---

## React Context: `ModalContext`

El modal de autenticación se gestiona con React Context (no Zustand) porque es una **preocupación de UI** — renderiza un componente, no almacena datos de negocio.

```typescript
type ModalContextType = {
  openAuth: (mode?: 'login' | 'register') => void
  closeAuth: () => void
}
```

### Uso

```typescript
const { openAuth } = useModal()

// Abrir modal de login
openAuth('login')

// Abrir modal de registro
openAuth('register')

// Abrir con modo por defecto (login)
openAuth()
```

### Tres formas en que se abre el modal

1. **Interacción del usuario** — al hacer clic en Login/Register se llama `openAuth()`
2. **Redirección del middleware** — `proxy.ts` redirige a `/?auth=login`; `ModalContext` lee el parámetro `?auth`
3. **Interceptor 401** — el interceptor HTTP dispara un `CustomEvent` llamado `open-auth-modal`; `ModalContext` lo escucha

Este diseño permite que cualquier código — incluso código no React dentro del interceptor HTTP — pueda abrir el modal de login mediante un `CustomEvent`.

---

## Hooks Personalizados como Estado Local

Para datos que pertenecen a una página específica, se utilizan hooks personalizados:

```typescript
// useProjects.ts — limitado a la página de listado de proyectos
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filters,  setFilters]  = useState(INITIAL_FILTERS)

  return {
    projects,
    loading,
    filters,
    setFilter,
    clearFilters,
    ...
  }
}
```

Este estado se crea cuando el componente se monta y se destruye al desmontarse. No se comparte entre rutas — navegar fuera de `/projects` limpia los filtros.

### Hooks disponibles

| Hook | Responsable de |
|---|---|
| `useProjects` | Lista de proyectos, filtros, paginación y búsqueda con debounce |
| `useMyProjects` | Proyectos propiedad del usuario actual |
| `useNewProject` | Estado del formulario de nuevo proyecto, stack tecnológico y envío |
| `useProfile` | Datos del perfil propio, formulario de edición y proyectos aplicados |
| `useUserProfile` | Perfil público, seguidores, seguidos y acción de seguir |
| `useProjectApplications` | Aplicaciones de un proyecto + aceptar/rechazar |
| `useNotifications` | Proyectos del usuario + sus aplicaciones (para `/applications`) |
| `useStats` | Estadísticas globales de la plataforma para la landing page |

---

## Ejemplo de Flujo de Datos: Aplicación a un Proyecto

Así fluye el estado cuando un usuario aplica a un proyecto:

```text
Usuario hace clic en "Send Application"
  ↓
handleApply() en projects/[id]/page.tsx
  ↓
projectsApi.apply(id, { message })     ← HTTP POST
  ↓
setApplied(true)                       ← estado local del componente
  ↓
La UI muestra "Application sent!" con icono de éxito
  ↓
  ╔═══════════════════════════════╗
  ║ (Más tarde, el owner abre /applications) ║
  ╚═══════════════════════════════╝
  ↓
useNotifications(userId) obtiene grupos
  ↓
Muestra la aplicación en la pestaña "Pending"
  ↓
Owner hace clic en "Accept"
  ↓
projectsApi.acceptApplication(appId)   ← HTTP PATCH
  ↓
useNotificationsStore.decrement(1)     ← badge actualizado inmediatamente
  ↓
updateStatus(appId, "accepted")        ← actualización local sin refetch
  ↓
  ╔═══════════════════════════════╗
  ║ (Mientras tanto, el postulante abre la app) ║
  ╚═══════════════════════════════╝
  ↓
useNotificationsStore.fetchPending(userId)
  ↓
GET /projects/applied → encuentra aplicación aceptada
  ↓
acceptedCount = 1 (no existe en localStorage)
  ↓
Badge verde aparece en el avatar del Navbar
  ↓
Usuario abre /profile
  ↓
ProfileApplicationsList se monta
  ↓
markAcceptedSeen() → guarda ID en localStorage → acceptedCount = 0
  ↓
Banner de Discord aparece bajo la aplicación aceptada
```

---

## Qué NO hacer

```typescript
// ❌ Nunca obtener datos directamente en un componente
export function ProjectsList() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get('/projects').then(res => setProjects(res.data))
  }, [])
}

// ✅ Usar un hook
export function ProjectsList() {
  const { projects } = useProjects()
}
```

```typescript
// ❌ Nunca almacenar datos del servidor en Zustand
// (a menos que realmente necesiten ser globales y persistentes)
const useProjectsStore = create(set => ({
  projects: [],
  fetchProjects: async () => { ... }
}))

// ✅ Los datos del servidor pertenecen a hooks personalizados
export function useProjects() { ... }
```

```typescript
// ❌ Nunca llamar useAuthStore dentro de un módulo API
// (riesgo de dependencia circular)
export const projectsApi = {
  create: async (body) => {
    const { user } = useAuthStore()  // ← incorrecto
  }
}
```
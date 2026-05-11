# Integración de API

Este documento explica exactamente cómo el frontend se comunica con la DevConnect API — desde la instancia de Axios hasta los módulos individuales de recursos.

---

## Resumen

La capa HTTP tiene tres niveles:

```
lib/api/*.api.ts          ← Módulos de recursos (qué llamar)
      ↓
lib/http/http-methods.ts  ← Envoltorios tipados (cómo llamar)
      ↓
lib/http/http-client.ts   ← Instancia de Axios (configuración de conexión)
      ↓
lib/http/interceptors.ts  ← Procesamiento de respuesta (desenvolver + refrescar)
```

---

## Cliente HTTP (`http-client.ts`)

```typescript
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,                          // Enviar cookies en cada solicitud
  headers: { 'Content-Type': 'application/json' },
})
```

Dos cosas que notar:

1. **`withCredentials: true`** — Esto es esencial. Sin él, el navegador no enviará la cookie `token` HttpOnly con solicitudes entre orígenes, y cada solicitud fallará con un 401.

2. **`baseURL` desde entorno** — La base URL se configura a través de `NEXT_PUBLIC_API_URL`. En desarrollo esto es `http://localhost:3000/api`. En producción apunta a tu API desplegada.

---

## Interceptores de Respuesta (`interceptors.ts`)

Cada respuesta de la API del backend está envuelta en un sobre:

```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

El interceptor tiene dos trabajos:

### Trabajo 1: Desenvolver el sobre

```typescript
httpClient.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      response.data = response.data.data  // ← desenvolver transparentemente
    }
    return response
  },
  // ...
)
```

Después de que este interceptor se ejecute, todos los consumidores reciben el `data` interno directamente — nunca ven `{ success, data, message }`.

### Trabajo 2: Refrescar token silenciosamente en 401

```typescript
async (error) => {
  const original = error.config as typeof error.config & { _retry?: boolean }

  if (error.response?.status === 401 && !original._retry) {
    original._retry = true                          // prevenir bucle infinito

    try {
      await httpClient.post('/auth/refresh')        // refrescar el token
      return httpClient(original)                   // repetir la solicitud original
    } catch {
      useAuthStore.getState().logout()              // también falló el refresco
      localStorage.removeItem('dc-auth')
      window.dispatchEvent(
        new CustomEvent('open-auth-modal', { detail: { mode: 'login' } })
      )
    }
  }

  return Promise.reject(error)
}
```

Si una solicitud obtiene un 401:
1. Intenta refrescar el token silenciosamente a través de `POST /auth/refresh`
2. Si el refresco tiene éxito: repetir la solicitud original — el llamador nunca lo sabe
3. Si también falla el refresco: cerrar sesión al usuario y abrir el modal de inicio de sesión a través de un CustomEvent

La bandera `_retry` previene un bucle infinito si el punto final de refresco mismo devuelve 401.

---

## Envoltorios de Métodos HTTP (`http-methods.ts`)

En lugar de llamar directamente a `httpClient.get(...)`, todos los módulos de API utilizan envoltorios tipados:

```typescript
export const get = async <T, P = unknown>(
  url: string,
  config?: AxiosRequestConfig<P>
): Promise<T> => {
  const res = await httpClient.get<ApiResponse<T>>(url, config)
  if (!res.data.success) throw new Error(res.data.message)
  return res.data.data
}
```

Métodos disponibles: `get`, `post`, `patch`, `del`

Todos los cuatro:
- Están completamente tipados con generéricos
- Lanzan un `Error` adecuado con el mensaje del backend si `success === false`
- Manejan mensajes de matriz: `['campo requerido', 'email no válido']` → unidos con `, `

---

## Módulos de Recursos de API (`lib/api/`)

Cada módulo es responsable de un recurso de backend. Todos se exportan desde `lib/api/index.ts`.

### `auth.api.ts`

```typescript
export const authApi = {
  register: (body: RegisterDto) => post<RegisterResponse>('/auth/register', body),
  login:    (body: LoginUserDto) => post<{ message: string }>('/auth/login', body),
  logout:   () => post<{ message: string }>('/auth/logout'),
  refresh:  () => post<{ message: string }>('/auth/refresh'),
}
```

### `projects.api.ts`

```typescript
export const projectsApi = {
  create:            (body) => post<ProjectResponseDto>('/projects', body),
  getAll:            (params?) => get<PaginatedResponse<Project>>('/projects', { params }),
  getById:           (id) => get<Project>(`/projects/${id}`),
  update:            (id, body) => patch<Project>(`/projects/${id}`, body),
  remove:            (id) => del<MessageResponse>(`/projects/${id}`),
  getMembers:        (id) => get<ProjectMember[]>(`/projects/${id}/members`),
  apply:             (id, body) => post<ProjectApplication>(`/projects/${id}/apply`, body),
  getApplications:   (id, params?) => get<PaginatedApplicationsResponse>(`/projects/${id}/applications`, { params }),
  acceptApplication: (appId) => patch<MessageResponse>(`/projects/applications/${appId}/accept`),
  rejectApplication: (appId) => patch<MessageResponse>(`/projects/applications/${appId}/reject`),
  getApplied:        () => get<AppliedProject[]>('/projects/applied'),
  discover:          () => get<(Project & { score: number })[]>('/projects/discover'),
}
```

> **Importante:** `getApplied()` devuelve `AppliedProject[]`, no `ProjectApplication[]`. Las formas son diferentes — `AppliedProject` usa `applicationId` como su clave. Esto es intencional y modelado como un tipo separado.

### `users.api.ts`

```typescript
export const usersApi = {
  getMe:          () => get<User>('/users/me'),
  getById:        (id) => get<User>(`/users/${id}`),
  updateProfile:  (body) => patch<User>('/users/me', body),
}
```

### `follows.api.ts`

```typescript
export const followsApi = {
  follow:       (id) => post<MessageResponse>(`/follows/${id}`),
  unfollow:     (id) => del<MessageResponse>(`/follows/${id}`),
  getFollowers: (id) => get<{ follower: User[] }>(`/follows/followers/${id}`),
  getFollowing: (id) => get<{ following: User[] }>(`/follows/following/${id}`),
}
```

### `stats.api.ts`

```typescript
export interface PlatformStats {
  projects:     number
  users:        number
  applications: number
}

export const statsApi = {
  getStats: () => get<PlatformStats>('/stats'),
}
```

---

## Estrategia de Manejo de Errores

### En módulos de API

Los errores se propagan desde las envoltorios HTTP como objetos `Error` con mensajes legibles para humanos extraídos del campo `message` del backend.

### En ganchos

Los ganchos capturan los errores y los almacenan en el estado local:

```typescript
try {
  const res = await projectsApi.getAll(params)
  setProjects(res.data)
} catch {
  setProjects([])
  setTotal(0)
}
```

Para operaciones no críticas (notificaciones), los errores se devoran silenciosamente. Para acciones disparadas por el usuario (enviar, aplicar), se muestra el mensaje de error en la interfaz de usuario.

### En componentes

Los componentes reciben el estado de error de los ganchos y renderizan una interfaz de usuario apropiada:

```typescript
const { form, loading, apiError, onSubmit } = useNewProject()

// En JSX:
{apiError && (
  <div className="error-banner">
    <AlertCircle size={14} /> {apiError}
  </div>
)}
```

### En formularios

React Hook Form + Zod maneja la validación del lado cliente. El formulario no golpea la API hasta que pasa la validación del lado cliente.

```typescript
const schema = z.object({
  title:       z.string().min(1, 'Requerido').max(100),
  description: z.string().min(10, 'Min 10 caracteres').max(2000),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

---

## Agregando un Nuevo Punto Final de API

1. **Añadir el método al módulo adecuado** en `lib/api/`:

```typescript
// projects.api.ts
export const projectsApi = {
  // ... métodos existentes
  archive: (id: string) => patch<MessageResponse>(`/projects/${id}/archive`),
}
```

2. **Añadir tipos** si la forma de la respuesta es nueva (en `types/entities/` o `types/dtos/`)

3. **Utilizarlo en un gancho**:

```typescript
// En tu gancho
const result = await projectsApi.archive(id)
```

4. **Nunca llamar a la API directamente desde un componente.** Siempre pasar por un gancho.

---

## Importando Módulos de API

Todos los módulos de API se vuelven a exportar desde `lib/api/index.ts`:

```typescript
// ✅ Correcto
import { projectsApi, authApi, usersApi } from '@/app/lib/api'

// ❌ Evitar importaciones profundas
import { projectsApi } from '@/app/lib/api/projects.api'
```

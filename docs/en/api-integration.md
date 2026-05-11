# API Integration

This document explains exactly how the frontend communicates with the DevConnect API — from the Axios instance to individual resource modules.

---

## Overview

The HTTP layer has three levels:

```
lib/api/*.api.ts          ← Resource modules (what to call)
      ↓
lib/http/http-methods.ts  ← Typed wrappers (how to call)
      ↓
lib/http/http-client.ts   ← Axios instance (connection config)
      ↓
lib/http/interceptors.ts  ← Response processing (unwrap + refresh)
```

---

## HTTP Client (`http-client.ts`)

```typescript
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,                          // Send cookies on every request
  headers: { 'Content-Type': 'application/json' },
})
```

Two things to note:

1. **`withCredentials: true`** — This is essential. Without it, the browser will not send the HttpOnly `token` cookie with cross-origin requests, and every request will fail with 401.

2. **`baseURL` from environment** — The base URL is configured via `NEXT_PUBLIC_API_URL`. In development this is `http://localhost:3000/api`. In production it points to your deployed API.

---

## Response Interceptor (`interceptors.ts`)

Every API response from the backend is wrapped in an envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

The interceptor has two jobs:

### Job 1: Unwrap the envelope

```typescript
httpClient.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      response.data = response.data.data  // ← unwrap transparently
    }
    return response
  },
  // ...
)
```

After this interceptor runs, all consumers receive the inner `data` directly — they never see `{ success, data, message }`.

### Job 2: Silent token refresh on 401

```typescript
async (error) => {
  const original = error.config as typeof error.config & { _retry?: boolean }

  if (error.response?.status === 401 && !original._retry) {
    original._retry = true                          // prevent infinite loop

    try {
      await httpClient.post('/auth/refresh')        // refresh the token
      return httpClient(original)                   // retry original request
    } catch {
      useAuthStore.getState().logout()              // refresh also failed
      localStorage.removeItem('dc-auth')
      window.dispatchEvent(
        new CustomEvent('open-auth-modal', { detail: { mode: 'login' } })
      )
    }
  }

  return Promise.reject(error)
}
```

If a request gets a 401:
1. Try to refresh the token silently via `POST /auth/refresh`
2. If refresh succeeds: replay the original request — the caller never knows it happened
3. If refresh also fails: log the user out and open the login modal via a CustomEvent

The `_retry` flag prevents an infinite loop if the refresh endpoint itself returns 401.

---

## HTTP Method Wrappers (`http-methods.ts`)

Rather than calling `httpClient.get(...)` directly, all API modules use typed wrappers:

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

Available methods: `get`, `post`, `patch`, `del`

All four:
- Are fully typed with generics
- Throw a proper `Error` with the backend's message if `success === false`
- Handle array messages: `['field is required', 'email is invalid']` → joined with `, `

---

## API Resource Modules (`lib/api/`)

Each module is responsible for one backend resource. All are exported from `lib/api/index.ts`.

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

> **Important:** `getApplied()` returns `AppliedProject[]`, not `ProjectApplication[]`. The shapes are different — `AppliedProject` uses `applicationId` as its key. This is intentional and modeled as a separate type.

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

## Error Handling Strategy

### In API modules

Errors propagate from the HTTP wrappers as `Error` objects with human-readable messages extracted from the backend's `message` field.

### In hooks

Hooks catch errors and store them in local state:

```typescript
try {
  const res = await projectsApi.getAll(params)
  setProjects(res.data)
} catch {
  setProjects([])
  setTotal(0)
}
```

For non-critical operations (notifications), errors are silently swallowed. For user-triggered actions (submit, apply), the error message is shown in the UI.

### In components

Components receive error state from hooks and render appropriate UI:

```typescript
const { form, loading, apiError, onSubmit } = useNewProject()

// In JSX:
{apiError && (
  <div className="error-banner">
    <AlertCircle size={14} /> {apiError}
  </div>
)}
```

### In forms

React Hook Form + Zod handles client-side validation. The form does not hit the API until client-side validation passes.

```typescript
const schema = z.object({
  title:       z.string().min(1, 'Required').max(100),
  description: z.string().min(10, 'Min 10 characters').max(2000),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

---

## Adding a New API Endpoint

1. **Add the method to the appropriate module** in `lib/api/`:

```typescript
// projects.api.ts
export const projectsApi = {
  // ... existing methods
  archive: (id: string) => patch<MessageResponse>(`/projects/${id}/archive`),
}
```

2. **Add types** if the response shape is new (in `types/entities/` or `types/dtos/`)

3. **Use it in a hook**:

```typescript
// In your hook
const result = await projectsApi.archive(id)
```

4. **Never call the API directly from a component.** Always go through a hook.

---

## Importing API Modules

All API modules are re-exported from `lib/api/index.ts`:

```typescript
// ✅ Correct
import { projectsApi, authApi, usersApi } from '@/app/lib/api'

// ❌ Avoid deep imports
import { projectsApi } from '@/app/lib/api/projects.api'
```

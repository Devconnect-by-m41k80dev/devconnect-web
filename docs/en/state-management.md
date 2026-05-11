# State Management

DevConnect uses **Zustand** for all global client-side state and **custom hooks** for local/server state. This document explains every store, when to use each, and how they interact.

---

## Philosophy

State in this project lives in one of three places:

| Where | What it holds | Tool |
|---|---|---|
| **Zustand stores** | Global, cross-component state that persists or needs to be accessed from unrelated parts of the UI | Zustand + persist middleware |
| **Custom hooks** | Server data (fetched from the API) and local UI state tied to a specific page or feature | React `useState` + `useEffect` |
| **React Context** | A single global UI controller (the auth modal) | React Context API |

The guiding rule: **use the simplest tool that solves the problem.**

- If two unrelated components need the same data → Zustand store
- If data is only needed within one feature/page → custom hook
- If it's a single global UI concern → React Context

---

## Zustand Stores

### `auth.store.ts` — User Identity

**Persisted to localStorage as `dc-auth`**

```typescript
interface AuthState {
  user:            User | null
  isAuthenticated: boolean
  isLoading:       boolean
}

interface AuthActions {
  setUser:    (user: User | null) => void
  fetchMe:    () => Promise<void>       // GET /users/me
  logout:     () => Promise<void>       // POST /auth/logout + clear state
  clearAuth:  () => void                // clear state only, no API call
}
```

**Key behaviors:**

- **`isAuthenticated` is NOT persisted** — it is always recalculated from `user` on rehydration. If the cookie expired while the user was away, `fetchMe()` will fail and set `isAuthenticated: false`, preventing stale auth state.

- **`fetchMe()`** is the source of truth for whether the session is valid. Called after login and on app boot (in `Navbar` via `UserMenu`).

- **`logout()`** calls the API (which clears the HttpOnly cookie), then clears local state, then dispatches `open-auth-modal` so the login modal appears. It handles the case where the API call fails gracefully — the local state is always cleared regardless.

**When to use:**

```typescript
// ✅ Check if user is authenticated
const { isAuthenticated } = useAuthStore()

// ✅ Get the current user
const { user } = useAuthStore()

// ✅ Trigger logout from anywhere
const { logout } = useAuthStore()

// ❌ Don't call fetchMe() in a component — it's called by hooks/Navbar automatically
```

---

### `notifications.store.ts` — Badge Counts

**Not persisted** (recalculated on mount)

```typescript
interface NotificationsState {
  pendingCount:  number   // apps pending review — for project OWNERS
  acceptedCount: number   // newly accepted apps — for APPLICANTS
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

**Key behaviors:**

- **Cache TTL of 60 seconds** — `fetchPending` is a no-op if called within 60 seconds of the last fetch. This prevents spam from multiple components calling it on mount.

- **`pendingCount`** — counts pending applications across ALL projects owned by the user. Requires two API calls: `GET /projects` (filter by owner) + parallel `GET /projects/:id/applications` for each.

- **`acceptedCount`** — counts accepted applications the user hasn't seen yet. "Seen" is tracked in `localStorage` under `dc-accepted-seen` (a JSON array of `applicationId` strings). When `markAcceptedSeen()` is called (from `ProfileApplicationsList` on mount), it saves current accepted IDs to localStorage and zeroes the count.

- **`decrement()`** — called after an owner accepts or rejects an application to keep the badge accurate without a full refetch.

- **`invalidate()`** — sets `lastFetched = null`, forcing the next `fetchPending()` call to actually hit the API. Use this after operations that change the application count.

- **`reset()`** — called on logout to clear all counts.

**When to use:**

```typescript
// ✅ Read counts for display (in Navbar/UserMenu)
const { pendingCount, acceptedCount } = useNotificationsStore()

// ✅ Trigger initial fetch (in UserMenu on mount)
const { fetchPending } = useNotificationsStore()
useEffect(() => { fetchPending(user.id) }, [user?.id])

// ✅ Decrement after action (in useNotifications hook)
const { decrement } = useNotificationsStore()
await projectsApi.acceptApplication(id)
decrement(1)

// ✅ Mark accepted as seen (in ProfileApplicationsList)
const { markAcceptedSeen } = useNotificationsStore()
useEffect(() => { markAcceptedSeen() }, [])
```

---

### `theme.store.ts` — UI Theme

**Persisted to localStorage as `dc-theme`**

```typescript
interface ThemeState {
  theme: 'light' | 'dark'
}

interface ThemeActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggle:   () => void
}
```

**Key behaviors:**

- **`applyThemeToDOM(theme)`** — adds/removes the `dark` class on `<html>` and temporarily adds `theme-changing` to enable CSS transition animations.

- **Flash prevention** — `layout.tsx` includes an inline script that reads `localStorage` and applies the dark class before the page renders, preventing the light-mode flash on dark-mode users' first paint.

**When to use:**

```typescript
// ✅ Toggle from ThemeToggle component
const { toggle } = useThemeStore()

// ✅ Read current theme
const { theme } = useThemeStore()
```

---

## React Context: `ModalContext`

The auth modal is managed via React Context (not Zustand) because it is a **UI concern** — it renders a component, it doesn't hold business data.

```typescript
type ModalContextType = {
  openAuth: (mode?: 'login' | 'register') => void
  closeAuth: () => void
}
```

**Consumed via:**

```typescript
const { openAuth } = useModal()

// Open the login modal
openAuth('login')

// Open the register modal
openAuth('register')

// Open with default (login)
openAuth()
```

**Three ways the modal opens:**

1. **User interaction** — clicking Login/Register buttons calls `openAuth()`
2. **Middleware redirect** — `proxy.ts` redirects to `/?auth=login`; `ModalContext` reads the `?auth` query param on mount
3. **401 interceptor** — the HTTP interceptor dispatches `open-auth-modal` CustomEvent; `ModalContext` listens for it

This design means any code anywhere — including non-React code in the HTTP interceptor — can open the login modal by dispatching a CustomEvent.

---

## Custom Hooks as Local State

For data that belongs to a specific page, use custom hooks:

```typescript
// useProjects.ts — scoped to the project listing page
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filters,  setFilters]  = useState(INITIAL_FILTERS)
  // ...
  return { projects, loading, filters, setFilter, clearFilters, ... }
}
```

This state is created when the component mounts and destroyed when it unmounts. It is not shared between routes — navigating away from `/projects` clears the filter state.

**Available hooks:**

| Hook | Owns |
|---|---|
| `useProjects` | Project list, filters, pagination, debounced search |
| `useMyProjects` | Projects owned by the current user |
| `useNewProject` | New project form state, tech stack input, submit |
| `useProfile` | Own profile data, edit form, applied projects list |
| `useUserProfile` | Public user profile, followers, following, follow action |
| `useProjectApplications` | Applications for a single project + accept/reject |
| `useNotifications` | Owned projects + their applications (for `/applications` page) |
| `useStats` | Platform-wide statistics for landing page |

---

## Data Flow Example: Project Application

Here's how state flows when a user applies to a project:

```
User clicks "Send Application"
  ↓
handleApply() in projects/[id]/page.tsx
  ↓
projectsApi.apply(id, { message })     ← HTTP POST
  ↓
setApplied(true)                       ← local component state
  ↓
UI shows "Application sent!" with success icon
  ↓
  ╔═══════════════════════════════╗
  ║ (Later, owner opens /applications) ║
  ╚═══════════════════════════════╝
  ↓
useNotifications(userId) fetches groups
  ↓
Shows application in "Pending" tab
  ↓
Owner clicks "Accept"
  ↓
projectsApi.acceptApplication(appId)   ← HTTP PATCH
  ↓
useNotificationsStore.decrement(1)     ← badge updates immediately
  ↓
updateStatus(appId, "accepted")        ← local state update (no refetch)
  ↓
  ╔═══════════════════════════════╗
  ║ (Meanwhile, applicant opens app) ║
  ╚═══════════════════════════════╝
  ↓
useNotificationsStore.fetchPending(userId)
  ↓
GET /projects/applied → finds accepted app
  ↓
acceptedCount = 1 (not in localStorage seen set)
  ↓
Green badge appears on avatar in Navbar
  ↓
User opens /profile
  ↓
ProfileApplicationsList mounts
  ↓
markAcceptedSeen() → saves ID to localStorage → acceptedCount = 0
  ↓
Discord banner shows under the accepted application
```

---

## What NOT to Do

```typescript
// ❌ Never fetch data directly in a component
export function ProjectsList() {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    axios.get('/projects').then(res => setProjects(res.data))
  }, [])
}

// ✅ Use a hook
export function ProjectsList() {
  const { projects } = useProjects()
}
```

```typescript
// ❌ Never store server data in a Zustand store
// (unless it truly needs to be global and long-lived, like the current user)
const useProjectsStore = create(set => ({
  projects: [],
  fetchProjects: async () => { ... }
}))

// ✅ Server data belongs in custom hooks
export function useProjects() { ... }
```

```typescript
// ❌ Never call useAuthStore inside an API module
// (circular dependency risk, already happens in interceptors — don't add more)
export const projectsApi = {
  create: async (body) => {
    const { user } = useAuthStore()  // ← wrong
  }
}
```

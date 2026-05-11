# Arquitectura

Este documento explica las decisiones arquitectónicas tomadas en DevConnect Web, por qué se tomaron y cómo se conectan todos los componentes.

---

## Vista General de Alto Nivel

```
Navegador
  │
  ├── Middleware Next.js (proxy.ts)     ← Protección de rutas antes del renderizado
  │
  ├── Páginas del Enrutador de la Aplicación                  ← Capa de composición ligera
  │     ├── Ganchos Personalizados                ← Todas las solicitudes de datos + lógica
  │     └── Componentes                  ← Todas las renderizaciones
  │
  ├── Almacenes Zustand                    ← Estado del lado cliente
  │     ├── auth.store                  ← Identidad del usuario
  │     ├── notifications.store         ← Contadores de insignias
  │     └── theme.store                 ← Tema de la interfaz de usuario
  │
  └── Capa HTTP (Axios)                ← Comunicación con la API
        ├── http-client.ts              ← Instancia de Axios + configuración
        ├── interceptors.ts             ← Desenvoltura de respuestas + manejo de 401
        └── http-methods.ts             ← Envoltorios tipados get/post/patch/del
              │
              └── lib/api/*             ← Módulos específicos de recursos de la API
                    │
                    └── DevConnect API  ← Backend NestJS (repositorio separado)
```

---

## Separación de Preocupaciones

La arquitectura impone una separación estricta entre tres capas:

### Capa 1: Datos (Ganchos + API)

**Dónde:** `src/app/hooks/` y `src/app/lib/api/`

**Responsabilidad:** Obtener datos, gestionar el estado de carga/error, exponer mutaciones.

Los ganchos personalizados son la capa de datos. Son dueños de todos los `useState`, `useEffect` y la lógica de llamada a la API. Un gancho devuelve datos y acciones — nunca renderiza nada.

```typescript
// useProjects.ts — solo preocupaciones de datos
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  // ... lógica de obtención ...
  return { projects, loading, filters, setFilter, clearFilters }
}
```

### Capa 2: Lógica (Contexto + Almacenes)

**Dónde:** `src/app/context/` y `src/app/store/`

**Responsabilidad:** Estado entre componentes que no pertenece a una sola característica.

- `ModalContext` — una instancia de modal de autenticación para toda la aplicación, accesible desde cualquier lugar
- `auth.store` — identidad del usuario, accesible desde cualquier lugar sin pasar props
- `notifications.store` — contadores de insignias, compartidos entre Navbar y la página de Aplicaciones
- `theme.store` — tema actual, sincronizado con el DOM

### Capa 3: Interfaz de Usuario (Componentes + Páginas)

**Dónde:** `src/app/components/` y `src/app/(protected|public)/*/page.tsx`

**Responsabilidad:** Renderizar la interfaz de usuario basada en props y datos del gancho. Los componentes no deben contener llamadas a `fetch`, `axios` o directamente a `localStorage`.

Las páginas son la capa más ligera:

```tsx
// profile/page.tsx — solo composición
export default function ProfilePage() {
  const { user, form, editing, ... } = useProfile()  // ← datos del gancho

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

## Flujo de Datos

### Flujo de Autenticación

```
El usuario hace clic en "Iniciar Sesión"
  → useModal().openAuth("login")
  → ModalContext establece authOpen = true
  → <AuthModal> se renderiza
  → El usuario envía LoginForm
  → authApi.login(credentials) → POST /auth/login
  → El backend establece la cookie HttpOnly "token"
  → usersApi.getMe() → GET /users/me
  → useAuthStore.setUser(user)
  → La modal se cierra, la página se actualiza reactivamente
```

### Flujo de Protección de Rutas

```
El usuario navega a /profile
  → proxy.ts (middleware) se ejecuta en Edge
  → Lee la cookie "token"
  → jwtDecode(token) → extrae el rol
  → Si no hay rol: redirige a /?auth=login&redirect=/profile
  → ModalContext lee ?auth=login al montar
  → Abre automáticamente el modal de inicio de sesión
  → Después del inicio de sesión: el usuario se envía a /profile
```

### Flujo Silencioso de Refresco de Token

```
Cualquier solicitud de la API falla con 401
  → interceptors.ts captura el error
  → POST /auth/refresh (envía la cookie de token de refresco)
  → Si el refresco tiene éxito: vuelve a intentar la solicitud original
  → Si el refresco falla: logout() → dispara el evento "open-auth-modal"
  → El oyente de ModalContext abre el modal de inicio de sesión
```

### Flujo de Notificaciones (Dueño)

```
UserMenu se monta (el usuario está autenticado)
  → useNotificationsStore.fetchPending(userId)
  → GET /projects?limit=100 → filtrar por owner.id
  → Para cada proyecto dueño: GET /projects/:id/applications (paralelo)
  → Contar aplicaciones con estado "pendiente"
  → Establecer pendingCount en el almacen
  → La insignia se renderiza en el avatar
  → TTL de caché: 60 segundos
  → decrement() llamado después de cada aceptación/rechazo para mantener la precisión de la insignia
```

### Flujo de Notificaciones (Postulante — Aceptado)

```
useNotificationsStore.fetchPending(userId)
  → GET /projects/applied
  → Filtro: estado === "aceptado" Y applicationId NO EN localStorage("dc-accepted-seen")
  → Establecer acceptedCount en el almacen
  → La insignia verde se renderiza en el avatar

El usuario abre /profile
  → ProfileApplicationsList se monta
  → useEffect: si hay alguna aplicación aceptada → markAcceptedSeen()
  → getApplied() → guardar IDs aceptados en localStorage("dc-accepted-seen")
  → Establecer acceptedCount = 0 → la insignia verde desaparece
```

---

## Filosofía de Diseño de Componentes

### Responsabilidad Única

Cada archivo de componente exporta un componente con una única responsabilidad. Si un componente está haciendo dos cosas, debería ser dos componentes.

Ejemplos:
- `ProjectCard` renderiza una tarjeta clickeable — no sabe nada sobre el filtrado o la paginación
- `ProjectsFilterPanel` renderiza chips de filtro — no sabe nada sobre la lista de proyectos
- `ProfileSidebar` renderiza información del perfil — no sabe nada sobre el formulario de edición

### Props en lugar de Estado Global

Los componentes reciben sus datos a través de props, no llamando directamente almacenes o ganchos. Esto los hace:
- Más fáciles de probar (simplemente pasar diferentes props)
- Más fáciles de reutilizar (funciona en cualquier lugar, no solo en el contexto donde existe el almacen)
- Más fáciles de entender (todas las dependencias están visibles en la firma de la función)

Excepción: preocupaciones transversales como `useI18n()`, `useModal()` y `useAuthStore()` se llaman directamente dentro de los componentes donde el pasaje de props sería impráctico.

### Componentes Compuestos

Grandes características se dividen en un componente padre y sub-componentes nombrados:

```
ProjectCard/
  ProjectCard.tsx           ← envoltorio + vínculo
  ProjectCardHeader.tsx     ← título + insignia
  ProjectCardTechStack.tsx  ← chips de tecnología
  ProjectCardFooter.tsx     ← avatar + fecha + puntuación
```

El padre compone los sub-componentes. Cada sub-componente es testeable e intercambiable por separado.

---

## Decisiones de Escalabilidad

### ¿Por qué Zustand en lugar de Redux o React Query?

- **Zustand** es más simple — los almacenes son objetos JavaScript simples con acciones. Sin reductores, sin boilerplate.
- **Redux** sería excesivo para esta escala de estado. Tenemos tres pequeños almacenes.
- **React Query** se consideró para el estado del servidor pero la combinación de Zustand + ganchos personalizados cubre los mismos casos de uso con menos sobrecarga de abstracción. Si el proyecto crece significativamente en complejidad de datos, migrar a React Query es una evolución natural.

### ¿Por qué una capa HTTP personalizada en lugar del fetching incorporado de React Query?

La capa `lib/http/` maneja dos cosas que React Query no puede manejar fácilmente:
1. **Desenvoltura de la respuesta** — el backend envuelve cada respuesta en `{ success, data, message }`. El interceptor desvuelve esto transparentemente.
2. **Refresco silencioso del token** — el interceptor 401 reitera las solicitudes fallidas después de refrescar el token, sin involucrar al usuario.

Estos son problemas que pertenecen al cliente HTTP, no en funciones de consulta individuales.

### ¿Por qué grupos de rutas `(protected)` y `(public)`?

Los grupos de rutas permiten aplicar comportamientos diferentes a conjuntos diferentes de rutas sin afectar las URLs. El prefijo del grupo `(protected)` está en `PROTECTED_PREFIXES` en `proxy.ts`. El grupo `(public)` no tiene tratamiento especial de middleware — es solo organizacional.

### ¿Por qué variables CSS en lugar del tema de Tailwind?

El modo oscuro de Tailwind usa variantes basadas en clases (`dark:bg-gray-900`). Eso funciona, pero crea ruido visual y hace que los colores sean imposibles de componer. Las propiedades personalizadas CSS permiten:

```css
/* Una definición, funciona en todas partes */
--text-muted: #4a4e6b;          /* modo claro */

.dark { --text-muted: #a0a4c8; } /* anulación del modo oscuro */
```

```tsx
/* Usado en cualquier componente */
<p style={{ color: 'var(--text-muted)' }}>
```

Cambiar el color en un lugar afecta automáticamente a todos los consumidores.

---

## Contrato del Backend

El frontend está completamente desacoplado del backend. El único contrato es la API REST:

- Todas las respuestas siguen `{ success: boolean, data: T, message: string }`
- La autenticación usa cookies HttpOnly (no se utiliza el encabezado `Authorization`)
- El refresco del token usa el punto final `POST /auth/refresh`
- La respuesta de `GET /projects/applied` usa `applicationId` (no `id`) como la clave primaria — esto se modela explícitamente como `AppliedProject` en el sistema de tipos del frontend

Consulte [api-integration.md](api-integration.md) para documentación completa de la capa HTTP.
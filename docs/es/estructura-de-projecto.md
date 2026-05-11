# Estructura del Proyecto

Este documento explica cada carpeta principal en el proyecto y por qué existe. Entender esta estructura es el camino más rápido para ser productivo en la base de código.

---

## Nivel Raíz

```
devconnect-web/
├── public/                  # Archivos estáticos sirviendo en /
│   ├── logo-icon.jpeg       # Icono del favicon y de la barra de navegación
│   └── logo-full.jpeg       # Logotipo completo (usado en la página Acerca de etc.)
├── src/                     # Todo el código fuente
│   ├── app/                 # Raíz del enrutador de aplicaciones de Next.js
│   └── proxy.ts             # Middleware de Next.js (protección de rutas)
├── .env.example             # Plantilla de variables de entorno
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.js       # Configuración de Tailwind CSS
├── tsconfig.json            # Configuración de TypeScript
└── package.json
```

### `src/proxy.ts`

Este es el archivo del middleware de Next.js. Se ejecuta **en la borde antes de que se rendericen cualquier página**. Su única tarea es la protección de rutas:

- Lee el JWT desde la cookie `token`
- Decodifica el JWT para extraer la reclamación `role` (no se necesita una llamada al backend)
- Redirige a los usuarios no autenticados que intentan acceder a rutas protegidas a `/?auth=login`
- Redirige a los no administradores que intentan acceder a `/admin` a `/projects`

Prefijos de rutas protegidas: `/profile`, `/discover`, `/projects/new`, `/applications`

> El archivo se llama `proxy.ts` (no `middleware.ts`) porque Next.js 16 permite nombres de middleware personalizados a través de la exportación `matcher`. La exportación `config.matcher` al final lo registra como el middleware activo.

---

## `src/app/` — La Raíz de la Aplicación

```
src/app/
├── (protected)/             # Rutas que requieren autenticación
├── (public)/                # Rutas accesibles sin autenticación
├── components/              # Todos los componentes UI reutilizables
├── context/                 # Proveedores de React Context
├── hooks/                   # Hooks personalizados de React
├── i18n/                    # Internacionalización
├── lib/                     # Capa de API + utilidades
├── store/                   # Almacenes Zustand
├── styles/                  # CSS global
├── types/                   # Definiciones de tipos TypeScript
├── layout.tsx               # Diseño raíz (fuentes, metadatos, proveedores)
├── page.tsx                 # Página de aterrizaje (/)
└── not-found.tsx            # Página 404
```

---

## Grupos de Rutas

### `(protected)/` — Rutas Autenticadas

Estas rutas están protegidas por el middleware. Si un usuario no está autenticado, se redirige a la página principal con el modal de autenticación preabierto.

```
(protected)/
├── applications/page.tsx    # Bandeja de entrada del propietario: revisar solicitudes pendientes
├── discover/page.tsx        # Flujo de proyectos ajustados por habilidades
├── profile/page.tsx         # Perfil propio del usuario + formulario de edición
└── projects/new/page.tsx    # Crear un nuevo proyecto
```

El nombre de la carpeta `(protected)` usa la sintaxis **grupo de rutas** de Next.js — los paréntesis no forman parte de la URL.

### `(public)/` — Rutas No Autenticadas

Estas rutas son accesibles sin iniciar sesión. Algunos recursos dentro de ellas (como aplicarse a un proyecto) solicitan el inicio de sesión si se intenta acceder no autenticado.

```
(public)/
├── projects/
│   ├── page.tsx             # Lista de proyectos con filtros
│   └── [id]/page.tsx        # Detalles del proyecto + formulario de aplicación
├── users/[id]/page.tsx      # Perfil público del usuario + seguir/dejar de seguir
├── about/page.tsx           # Acerca de DevConnect
├── terms/page.tsx           # Términos de Servicio
└── privacy/page.tsx         # Política de Privacidad
```

---

## `components/`

Los componentes están organizados por **dominio de características**, no por tipo. Esto significa que los componentes relacionados viven juntos en lugar de tener todos los botones en una carpeta y todas las tarjetas en otra.

```
components/
├── auth/                    # Modal de autenticación y formularios
│   ├── AuthModal.tsx        # Contenedor modal (páginas de inicio de sesión/registro)
│   ├── LoginFormModal.tsx   # Formulario de inicio de sesión con validación
│   └── RegisterFormModal.tsx# Formulario de registro con selección de rol/habilidades
│
├── landing/                 # Secciones de la página de aterrizaje
│   ├── HeroSection.tsx      # Hero con encabezado + CTAs
│   ├── Stats.tsx            # Estadísticas en vivo del backend (proyectos, usuarios, solicitudes)
│   ├── Features.tsx         # Cuadrícula de características
│   ├── Sponsors.tsx         # Sección de patrocinadores con llamada a la acción de contacto
│   ├── Donate.tsx           # Sección de donación (Buy Me a Coffee)
│   └── CTABanner.tsx        # Llamada a la acción en el fondo
│
├── layout/                  # Componentes de diseño global
│   ├── Navbar.tsx           # Navegación superior (compone sub-componentes navbar/*)
│   ├── Footer.tsx           # Pie de página del sitio con columnas de enlaces
│   ├── UserMenu.tsx         # Menú desplegable del usuario autenticado con insignias
│   └── navbar/              # Sub-componentes navbar
│       ├── Logo.tsx         # Marca de logotipo + wordmark
│       ├── DesktopNavLinks.tsx   # Enlaces de navegación (desktop)
│       ├── AuthButtons.tsx  # Botones de inicio de sesión/registro para invitados
│       ├── MobileMenu.tsx   # Navegación completa para móviles
│       ├── ThemeToggle.tsx  # Interruptor de modo claro/oscuro
│       └── LenguageDropdown.tsx  # Selector de idioma EN/ES
│
├── notifications/           # Componentes del sistema de notificaciones
│   ├── NotificationBell.tsx # Icono de campana con insignia de conteo pendiente
│   ├── ApplicationItem.tsx  # Tarjeta única de solicitud (acciones de aceptar/rechazar)
│   └── ProjectApplicationsList.tsx  # Lista filtrada de solicitudes para un proyecto
│
├── profile/                 # Componentes del perfil de usuario (página de perfil propio)
│   ├── ProfileSidebar.tsx   # Avatar, nombre, biografía, enlaces sociales
│   ├── ProfileSkills.tsx    # Lista de chips de habilidades
│   ├── ProfileEditForm.tsx  # Formulario de edición en línea
│   └── ProfileApplicationsList.tsx  # Lista de proyectos aplicados + banner de Discord
│
├── project/                 # Tarjeta del proyecto (usada en listas)
│   ├── ProjectCard.tsx      # Contenedor de tarjeta (clickeable, enlaza a detalles)
│   ├── ProjectCardHeader.tsx     # Título + insignia de estado
│   ├── ProjectCardTechStack.tsx  # Chips de tecnología
│   └── ProjectCardFooter.tsx     # Avatar del propietario + fecha + puntuación de coincidencia
│
├── projects/                # Componentes específicos de la página de lista de proyectos
│   ├── ProjectsPagination.tsx    # Navegación de páginas
│   ├── filters/
│   │   ├── ProjectsSearchBar.tsx # Entrada de búsqueda + conmutador de filtro
│   │   └── ProjectsFilterPanel.tsx  # Chips de estado + tecnología
│   └── form/
│       ├── TechStackInput.tsx    # Entrada multi-etiqueta para la pila tecnológica
│       └── StatusPicker.tsx      # Grupo de botones de estado
│
├── ui/                      # Primitivas reutilizables genéricas
│   ├── Avatar.tsx           # Avatar del usuario con retroceso a iniciales
│   ├── Badge.tsx            # Insignias de estado (estado del proyecto + estado de solicitud)
│   └── Spinner.tsx          # Spinners de carga
│
└── user/                    # Componentes del perfil público del usuario
    ├── UserProfileSidebar.tsx     # Tarjeta de perfil + botón de seguir + estadísticas
    ├── UserTabBar.tsx             # Selector de pestañas Seguidores / Siguiendo
    └── UserFollowList.tsx         # Lista de tarjetas de usuarios seguidores/seguidos
```

**¿Por qué organizado así?** Cuando una característica necesita cambios, todos los archivos afectados están co-ubicuados. Si cambia la característica del perfil, abres `components/profile/`. No necesitas buscar por `components/buttons/`, `components/forms/`, `components/cards/`.

---

## `context/`

```
context/
└── ModalContext.tsx    # Controlador global del modal de autenticación
```

`ModalContext` es el controlador global del modal de autenticación. Realiza:
- Almacena el estado booleano `authOpen` y `mode` ("login" | "register")
- Expone `openAuth(mode?)` y `closeAuth()` a través del hook `useModal()`
- Escucha por `open-auth-modal` CustomEvents (despachados por el interceptor HTTP en 401)
- Lee los parámetros de consulta `?auth=login` redirigidos desde el middleware
- Renderiza la única instancia `<AuthModal>` para toda la aplicación

Hay **solo uno** React Context en este proyecto. Todo lo demás usa Zustand.

---

## `hooks/`

Los hooks personalizados separan la lógica de obtención de datos del rendering. Cada página significativa tiene un hook correspondiente.

```
hooks/
├── useDebounce.ts           # Debounce genérico para entradas de búsqueda
├── useMyProjects.ts         # Proyectos propios del usuario actual
├── useNewProject.ts         # Estado del formulario + lógica de envío para crear un proyecto
├── useNotifications.ts      # Proyectos propios + sus solicitudes pendientes (para la página /applications)
├── useProfile.ts            # Datos del perfil propio + formulario de edición + proyectos aplicados
├── useProjectApplications.ts # Solicitudes para un solo proyecto (para ProjectApplicationsList)
├── useProjects.ts           # Lista de proyectos con filtros, paginación, búsqueda retrasada
├── useStats.ts              # Estadísticas en todo el proyecto para la página de aterrizaje
└── useUserProfile.ts        # Perfil público del usuario + seguidores + siguiendo + acción de seguir
```

**La regla:** un hook es dueño de una preocupación. `useProjects` maneja la obtención y el filtrado. `useNewProject` maneja el estado del formulario y el envío. No se superponen.

---

## `i18n/`

```
i18n/
└── index.ts    # Diccionario completo EN/ES + hook useI18n() + almacenamiento de locale
```

El sistema entero de traducción vive en un solo archivo. Exporta:
- `useI18n()` — devuelve `{ t, locale, setLocale }` 
- `useLocaleStore` — el almacén Zustand que persiste la preferencia de idioma a `localStorage`

El objeto `t` está completamente tipado — TypeScript generará un error si haces referencia a una clave que no existe en el diccionario.

---

## `lib/`

```
lib/
├── api/                     # Un archivo por recurso API
│   ├── index.ts             # Re-exporta todo (import from @/app/lib/api)
│   ├── auth.api.ts          # Inicio de sesión, cierre de sesión, registro, actualización
│   ├── follows.api.ts       # Seguir, dejar de seguir, getFollowers, getFollowing
│   ├── metadata.api.ts      # Roles profesionales y habilidades (para el registro)
│   ├── projects.api.ts      # Todos los puntos finales del proyecto
│   ├── stats.api.ts         # Estadísticas del proyecto
│   ├── users.api.ts         # Puntos finales del perfil de usuario
│   └── error.api.ts         # Utilidad para extraer mensajes de error
│
├── http/                    # Configuración de Axios — no modificar sin cuidado
│   ├── http-client.ts       # Instancia de Axios con baseURL y credenciales
│   ├── http-methods.ts      # Envoltorios tipados: get, post, patch, del
│   └── interceptors.ts      # Desenvoltura de respuesta + renovación silenciosa en 401
│
├── utils.ts                 # cn() mezclador de clases, formatDate(), truncate()
└── scrollToSection.ts       # Utilidad para el desplazamiento de anclas en la página de aterrizaje
```

---

## `store/`

```
store/
├── auth.store.ts            # Identidad del usuario, inicio/cierre de sesión, fetchMe
├── notifications.store.ts   # Conteo pendiente (propietario) + conteo aceptado (solicitante)
└── theme.store.ts           # Tema claro/oscuro con alternancia de clases DOM
```

Todos los almacenes usan Zustand con el middleware `persist` para la hidratación de `localStorage`. Consulta [state-management.md](state-management.md) para documentación detallada.

---

## `styles/`

```
styles/
└── globals.css    # Directivas de Tailwind + variables CSS + clases de componentes
```

Un solo archivo. Todos los estilos globales, el sistema de tokens de diseño (`--brand`, `--text-muted`, etc.), clases reutilizables de componentes (`.dc-card`, `.dc-btn-primary`, `.dc-input`), animaciones y el cargador esqueleto.

---

## `types/`

```
types/
├── api/
│   └── api.types.ts         # Envoltorios ApiResponse<T> y ApiSuccess<T>
├── dtos/                    # Formas del cuerpo de la solicitud
│   ├── create-project.dto.ts
│   ├── update-project.dto.ts
│   ├── apply-project.dto.ts
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── ...
├── entities/                # Formas de respuesta (espejo de las entidades del backend)
│   ├── user.entity.ts
│   ├── project.entity.ts
│   ├── project-application.entity.ts
│   ├── project-member.entity.ts
│   ├── applied-project.entity.ts   # Forma diferente a ProjectApplication!
│   ├── skill.entity.ts
│   └── ...
├── enums/
│   ├── application-status.enum.ts  # pendiente | aceptado | rechazado
│   ├── project-status.enum.ts      # idea | construcción | mvp | lanzado
│   └── role.enum.ts                # usuario | administrador | moderador
├── metadata/
│   └── register-metadata.types.ts  # Roles profesionales + habilidades para el formulario de registro
└── pagination/
    └── pagination.types.ts          # PaginatedResponse<T> y PaginatedApplicationsResponse
```

**¿Por qué separar `entities/` de `dtos/`?** Los DTOs son lo que **envías** a la API (cuerpos de solicitud). Las entidades son lo que **recibes** de la API (formas de respuesta). Son diferentes: un DTO para crear un proyecto tiene `title` y `description` como cadenas requeridas; la entidad del Proyecto tiene `id`, `createdAt`, `owner` y muchos otros campos que solo existen después de la creación.

**Nota sobre `applied-project.entity.ts`:** El punto final `GET /projects/applied` devuelve una forma diferente al estándar `ProjectApplication`. Utiliza `applicationId` (no `id`) como clave. Esto se modela como un tipo separado para evitar confusiones.
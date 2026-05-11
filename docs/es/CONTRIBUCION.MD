# Contribuyendo a DevConnect Web

Primero que todo — gracias por dedicarle tiempo para contribuir.

DevConnect es un proyecto de código abierto creado por desarrolladores, para profesionales de TI. Cada contribución cuenta, ya sea corrigiendo un error tipográfico, mejorando un componente o lanzando una nueva función. Esta guía te ayudará a empezar rápidamente y asegurará que tu contribución se integre suavemente en el proyecto.

-----

## Tabla de Contenidos

- [Contribuyendo a DevConnect Web](#contribuyendo-a-devconnect-web)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Código de Conducta](#código-de-conducta)
  - [Maneras de Contribuir](#maneras-de-contribuir)
  - [Antes de Empezar](#antes-de-empezar)
  - [Configuración del Desarrollo](#configuración-del-desarrollo)
    - [1. Forkea y clona](#1-forkea-y-clona)
    - [2. Agrega el remoto upstream](#2-agrega-el-remoto-upstream)
    - [3. Instala dependencias](#3-instala-dependencias)
    - [4. Configura el entorno](#4-configura-el-entorno)
    - [5. Inicia la API de backend](#5-inicia-la-api-de-backend)
    - [6. Inicia el servidor de desarrollo](#6-inicia-el-servidor-de-desarrollo)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Estrategia de Ramificación](#estrategia-de-ramificación)
  - [Convenio de Commits](#convenio-de-commits)
    - [Tipos](#tipos)
    - [Alcance (opcional pero recomendado)](#alcance-opcional-pero-recomendado)
    - [Ejemplos](#ejemplos)
  - [Estándares de Codificación](#estándares-de-codificación)
    - [TypeScript](#typescript)
    - [Arquitectura de Componentes](#arquitectura-de-componentes)
    - [Hooks](#hooks)
    - [Capa de API](#capa-de-api)
    - [Estilo](#estilo)
    - [Internacionalización](#internacionalización)
    - [Estilo del Código](#estilo-del-código)
  - [Enviando una Pull Request](#enviando-una-pull-request)
    - [Lista de verificación antes de abrir una PR](#lista-de-verificación-antes-de-abrir-una-pr)
    - [Formato del título de la PR](#formato-del-título-de-la-pr)
    - [Plantilla de descripción de la PR](#plantilla-de-descripción-de-la-pr)
  - [Proceso de Revisión](#proceso-de-revisión)
  - [Reportando Errores](#reportando-errores)
  - [Sugerir Características](#sugerir-características)
  - [Preguntas \& Soporte](#preguntas--soporte)

-----

## Código de Conducta

Al participar en este proyecto, estás de acuerdo con nuestro [Código de Conducta](./CODEOFCONDUCT.MD). Por favor léelo antes de contribuir. Estamos comprometidos a proporcionar un entorno acogedor y respetuoso para todos.

-----

## Maneras de Contribuir

No necesitas escribir código para contribuir. Aquí tienes todas las formas en que puedes ayudar:

|Tipo|Ejemplos|
|---|---|
|🐛 **Corrección de errores**|Arreglar un componente roto, resolver un problema de diseño, corregir la validación del formulario|
|✨ **Características**|Nuevas páginas, nuevos componentes UI, mejorar la lógica de las notificaciones|
|📖 **Documentación**|Mejorar el README, corregir errores tipográficos, aclarar los pasos de configuración|
|🧪 **Pruebas**|Agregar pruebas unitarias faltantes, mejorar la cobertura de React Testing Library|
|🎨 **Diseño**|Mejorar la accesibilidad, refinar el comportamiento responsivo, mejorar las animaciones|
|🌐 **Traducciones**|Mejorar traducciones EN/ES, agregar nuevas claves i18n|
|🔒 **Seguridad**|Reportar vulnerabilidades, mejorar el manejo de autenticación en la interfaz de usuario|
|💬 **Discusión**|Abrir issues, compartir ideas, dar retroalimentación sobre PRs|

-----

## Antes de Empezar

1. **Busca issues existentes** — tu idea o error puede estar ya siendo rastreado. Evita duplicar esfuerzos.
1. **Abre un issue primero** para cambios significativos (nuevas características, cambios rompientes, decisiones arquitectónicas) para que el equipo pueda alinearse antes de invertir tiempo en codificación.
1. **Pequeños fixes** (errores tipográficos, documentación, errores menores) pueden ir directamente a una PR sin un issue previo.

-----

## Configuración del Desarrollo

### 1. Forkea y clona

```bash
# Forkea el repo en GitHub, luego:
git clone https://github.com/YOUR_USERNAME/devconnect-web.git
cd devconnect-web
```

### 2. Agrega el remoto upstream

```bash
git remote add upstream https://github.com/M41k80/devconnect-web.git
```

### 3. Instala dependencias

```bash
yarn install
```

### 4. Configura el entorno

```bash
cp .env.local.example .env.local
# Edita .env.local — establece NEXT_PUBLIC_API_URL a tu API en ejecución
```

### 5. Inicia la API de backend

El frontend no tiene ninguna funcionalidad sin la DevConnect API. Iníciala primero:

```bash
# Ver: https://github.com/M41k80/devconnect-api-nestjs
# La API debe ser accesible en http://localhost:3000/api
```

### 6. Inicia el servidor de desarrollo

```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3001`.

-----

## Estructura del Proyecto

Entender la base de código antes de contribuir te ayudará a colocar tus cambios en el lugar correcto.

```
src/
├── app/
│   ├── (protected)/          # Rutas que requieren autenticación
│   ├── (public)/             # Rutas públicas
│   ├── components/           # Todos los componentes de UI organizados por característica
│   │   ├── auth/             # Modal y formularios de autenticación
│   │   ├── landing/          # Secciones de la página de aterrizaje
│   │   ├── layout/           # Navbar, Footer, UserMenu
│   │   ├── notifications/    # NotificationBell, ApplicationItem
│   │   ├── profile/          # Sub-componentes del perfil
│   │   ├── project/          # ProjectCard y sub-componentes
│   │   ├── projects/         # Filtros, paginación, formularios
│   │   ├── ui/               # Primitivas genéricas (Avatar, Badge, Spinner)
│   │   └── user/             # Sub-componentes del perfil público del usuario
│   ├── context/              # ModalContext — controlador de modal de autenticación
│   ├── hooks/                # Hooks personalizados — todos los datos de obtención y lógica
│   ├── i18n/                 # Diccionarios EN/ES + hook useI18n()
│   ├── lib/
│   │   ├── api/              # Módulos de API específicos de recursos
│   │   ├── http/             # Instancia de Axios, interceptores, envoltorios tipados
│   │   └── utils.ts          # cn(), formatDate(), truncate()
│   ├── store/                # Almacenes Zustand (auth, notifications, theme)
│   ├── styles/               # globals.css — Tailwind + variables CSS + sistema de diseño
│   └── types/                # Tipos TypeScript (entidades, DTOs, enums, paginación)
└── proxy.ts                  # Middleware Edge de Next.js (protección de rutas)
```

La regla más importante: **las páginas son delgadas**. Un `page.tsx` debería componer componentes y llamar a un hook. Todas las obtenciones de datos deben estar en `hooks/`. Todos los renderizados deben estar en `components/`.

-----

## Estrategia de Ramificación

Siempre ramifica desde `main`. Usa la siguiente convención de nombres:

|Prefijo|Cuándo usarlo|Ejemplo|
|---|---|---|
|`feat/`|Nueva característica o mejora UI|`feat/project-edit-page`|
|`fix/`|Corrección de errores|`fix/notification-badge-count`|
|`docs/`|Cambios solo en la documentación|`docs/update-getting-started`|
|`test/`|Añadiendo o mejorando pruebas|`test/profile-sidebar-coverage`|
|`refactor/`|Cambio de código sin cambios de comportamiento|`refactor/extract-project-hooks`|
|`chore/`|Herramientas, dependencias, configuración|`chore/upgrade-next-16`|
|`style/`|Cambios visuales/UI, mejoras en CSS|`style/improve-dark-mode-contrast`|

```bash
# Siempre comienza desde un main actualizado
git checkout main
git pull upstream main

# Crea tu rama
git checkout -b feat/tu-nombre-de-característica
```

-----

## Convenio de Commits

Este proyecto sigue la **[Convenciones de Commits](https://www.conventionalcommits.org/)** especificación. Todos los commits deben seguir este formato:

```
<tipo>(<alcance>): <descripción breve>

[cuerpo opcional]

[pie de página opcional]
```

### Tipos

|Tipo|Descripción|
|---|---|
|`feat`|Una nueva característica visible para el usuario|
|`fix`|Una corrección de errores|
|`docs`|Cambios solo en la documentación|
|`test`|Añadiendo o modificando pruebas|
|`refactor`|Cambio de código que ni arregla un error ni añade una característica|
|`chore`|Actualizaciones de dependencias, cambios de configuración, herramientas|
|`perf`|Mejora en el rendimiento|
|`style`|Cambios visuales/UI sin cambio lógico|
|`ci`|Cambios en la configuración de CI/CD|

### Alcance (opcional pero recomendado)

Usa el área de funcionalidad como alcance: `auth`, `projects`, `profile`, `notifications`, `navbar`, `landing`, `i18n`, `api`, `store`, `hooks`, `ui`, `theme`.

### Ejemplos

```
feat(notificaciones): añadir un distintivo verde para solicitudes aceptadas
fix(auth): prevenir renderizado doble de modal en 401
refactor(perfil): extraer ProfileSidebar en componente separado
feat(i18n): agregar traducciones faltantes al español para la página de solicitudes
style(landing): mejorar el contraste del color oscuro para la sección Stats
chore(deps): actualizar zustand a v5
test(utils): añadir pruebas unitarias para formatDate y cn helpers
```

> ⚠️ Los commits que no siguen esta convención serán marcados durante la revisión de PR.

-----

## Estándares de Codificación

### TypeScript

- Usa **tipado estricto** en todas partes. Evita `any` — usa `unknown` con guardas de tipo si es necesario.
- Prefiere `interface` para formas de objetos usadas como contratos; `type` para uniones y tipos computados.
- Todas las funciones y hooks exportadas deben tener tipos de retorno explícitos.
- Los tipos de entidad y DTOs viven en `src/app/types/` — nunca los redefines en línea en componentes.

### Arquitectura de Componentes

- Cada componente tiene una **única responsabilidad**. Si hace dos cosas, haz dos componentes.
- Mantén los componentes por debajo de **80 líneas**. Si es más largo, extrae sub-componentes o hooks.
- Usa **exportaciones nombradas** para todos los componentes (excepto `page.tsx` y archivos `layout.tsx` que deben usar exportaciones por defecto según la convención de Next.js).
- La interfaz de props debe definirse directamente encima de la función del componente.

```typescript
// ✅ Bueno
interface ProfileSkillsProps {
  skills: User['skills']
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  // ...
}

// ❌ Mal — sin interfaz, any implícito
export default function ProfileSkills(props) {
  // ...
}
```

### Hooks

- Los hooks personalizados viven en `src/app/hooks/` y se llaman `use` + dominio (por ejemplo, `useProjects`, `useUserProfile`).
- Un hook debe tener **una preocupación**: ya sea obtención de datos, estado del formulario o estado de la interfaz — no una mezcla.
- Limpia las suscripciones y los oyentes de eventos en funciones de retorno de `useEffect`.
- No llames a almacenes Zustand dentro de hooks a menos que sea absolutamente necesario — pasa los datos como parámetros en su lugar.

### Capa de API

- Las llamadas a la API pertenecen exclusivamente a `src/app/lib/api/` — **nunca** en línea en componentes o páginas.
- Siempre usa los envoltorios tipados (`get`, `post`, `patch`, `del`) de `lib/http/http-methods.ts`.
- Nunca importes `axios` directamente en componentes, hooks o páginas.

```typescript
// ✅ Correcto
import { projectsApi } from '@/app/lib/api'
const project = await projectsApi.getById(id)

// ❌ Incorrecto — axios directo en un hook
import axios from 'axios'
const project = await axios.get(`/projects/${id}`)
```

### Estilo

- Usa **clases de utilidad de Tailwind** para todos los diseños, espaciado, radio de borde y flex/grid.
- Usa **propiedades personalizadas de CSS** (por ejemplo, `var(--brand)`, `var(--text-muted)`, `var(--border)`) para todos los colores y sombras. Nunca codifica valores hex en componentes.
- Usa las clases del sistema de diseño definidas en `globals.css` (`dc-card`, `.dc-btn-primary`, `.dc-input`, `.dc-page`, etc.) antes de escribir estilos personalizados.
- Usa la utilidad `cn()` de `lib/utils.ts` para todos los nombres de clase condicionales.

```tsx
// ✅ Bueno — usa tokens de diseño y cn()
<div
  className={cn('dc-card p-5', isActive && 'border-[--brand]')}
  style={{ color: 'var(--text-muted)' }}
>

// ❌ Mal — color codificado, ningún sistema de diseño
<div style={{ background: '#171930', color: '#b0b7d6', padding: '20px' }}>
```

### Internacionalización

- Todas las cadenas visibles para el usuario deben venir de `useI18n()`. Nunca codifica texto en inglés en JSX.
- Al añadir nuevas cadenas, actualiza **ambos** los diccionarios `en` y `es` en `src/app/i18n/index.ts` en el mismo commit.
- El objeto `t` está completamente tipado — TypeScript detectará claves faltantes en tiempo de compilación.

```typescript
// ✅ Bueno
const { t } = useI18n()
<p>{t.profile.memberSince}</p>

// ❌ Mal — cadena codificada
<p>Member since</p>
```

### Estilo del Código

- La formateo se maneja por tu editor usando el `.vscode/settings.json` (formatea al guardar con Prettier).
- Linting está forzado por **ESLint** — ejecuta `yarn lint` antes de comprometer.
- No hay importaciones no utilizadas, ningún bloque de código comentado, ni `console.log` en el código de producción.
- Las nuevas rutas protegidas deben añadirse a `PROTECTED_PREFIXES` en `src/proxy.ts`.

```bash
# Ejecuta antes de subir
yarn lint
yarn build
```

-----

## Enviando una Pull Request

### Lista de verificación antes de abrir una PR

- [ ] Mi rama está actualizada con `upstream/main` (rebasada, no fusionada)
- [ ] Todos los tipos TypeScript son correctos: `yarn build` pasa sin errores
- [ ] No hay errores de lint: `yarn lint` pasa
- [ ] He probado en **modo claro** y **modo oscuro**
- [ ] He probado en **viewport móvil** (≤ 768px)
- [ ] Nuevas cadenas visibles para el usuario se añaden a **ambos** `en` y `es` en `i18n/index.ts`
- [ ] Nuevas rutas protegidas se añaden a `PROTECTED_PREFIXES` en `proxy.ts`
- [ ] No hay colores hex codificados en componentes — variables CSS utilizadas por completo
- [ ] No se han introducido tipos `any`
- [ ] Mis commits siguen el formato Conveniones de Commits

### Formato del título de la PR

Sigue la misma convención que los commits:

```
feat(notificaciones): distintivo dual para propietarios y solicitantes
fix(perfil): lista de solicitudes no actualiza después de aceptar
style(landing): mejorar diseño responsivo de la sección Sponsors
```

### Plantilla de descripción de la PR

Al abrir una PR, por favor completa lo siguiente:

```
## ¿Qué hace esta PR?
Breve descripción del cambio y el problema que soluciona.

## Tipo de cambio
- [ ] Corrección de errores
- [ ] Nueva característica
- [ ] Documentación
- [ ] Refactor
- [ ] Mejora de estilo/UI
- [ ] Prueba
- [ ] Otro

## Capturas de pantalla (si hay cambios en la interfaz)
Capturas antes y después para cualquier cambio visual.

## Cómo probar
Instrucciones paso a paso para que el revisor verifique el cambio.

## Issue relacionado
Cierra #<número_de_issue>

## Notas para los revisores
Cualquier cosa que requiera atención especial o contexto.
```

-----

## Proceso de Revisión

- Todas las PRs requieren **al menos una aprobación** de un mantenedor antes de fusionarse.
- Los revisores verificarán: corrección, tipos TypeScript, estilo de código, completitud i18n, comportamiento responsivo y compatibilidad con modo oscuro.
- Por favor, sé responsive ante los comentarios de revisión. Las PRs inactivas durante más de 14 días pueden ser cerradas.
- Una vez aprobada, un mantenedor fusionará usando **Squash and Merge** para mantener la historia del `main` limpia.

-----

## Reportando Errores

¿Encontraste un error? Por favor, abre un issue en GitHub con la siguiente información:

1. **Título** — corto y descriptivo: `[BUG] Distintivo de notificaciones muestra conteo incorrecto después de aceptar`
1. **Entorno** — OS, navegador, versión de Node, tamaño de pantalla
1. **Pasos para reproducir** — los pasos exactos para desencadenar el error
1. **Comportamiento esperado** — lo que debería suceder
1. **Comportamiento actual** — lo que realmente ocurre
1. **Capturas de pantalla / Errores en la consola** — cualquier salida visual relevante o mensajes de error

> 🔒 **Vulnerabilidades de seguridad** — por favor, **no** abre un issue público. En su lugar, informa las privadas enviando un correo electrónico a `contactdevconnect@m41k80dev.com`. Nos pondremos en contacto dentro de 48 horas.

-----

## Sugerir Características

¿Tienes una idea para mejorar DevConnect? Abre un issue en GitHub con la etiqueta `enhancement` e incluye:

1. **El problema** — ¿qué dolor punto resuelve esto?
1. **La solución propuesta** — cómo luciría y funcionaría desde la perspectiva del usuario?
1. **Alternativas consideradas** — otros enfoques que pensaste
1. **¿Cambios de backend necesarios?** — enlace o descripción de cualquier nuevo endpoint de API requerido
1. **Contexto adicional** — mockups, referencias a características similares, capturas de pantalla

Las solicitudes de características son revisadas por los mantenedores y discutidas abiertamente. La alineación con el plan estratégico del proyecto determina la priorización.

-----

## Preguntas & Soporte

- **Preguntas generales** — abre una Discusión en GitHub en la categoría `Q&A`.
- **Reportes de errores** — abre un Issue de GitHub.
- **Ideas de características** — abre un Issue de GitHub con la etiqueta `enhancement`.
- **Problemas de seguridad** — envía un correo electrónico a `contactdevconnect@m41k80dev.com` privadamente.
- **Chat comunitario** — únete a nuestro [Discord](https://discord.gg/5xEWnfJDjt) para ayuda en tiempo real.

Apreciamos tu paciencia — los mantenedores son voluntarios y responderán tan pronto como sea posible.

-----

<div align="center">

Gracias por formar parte de DevConnect 💜

</div>
# Introducción

## ¿Qué es DevConnect?

DevConnect es una plataforma de colaboración entre desarrolladores de código abierto. Existe para resolver un problema específico y real en la comunidad del software:

> **Los grandes desarrolladores no pueden encontrar proyectos de código abierto en los que contribuir. Los buenos proyectos no pueden encontrar los contribuyentes adecuados.**

DevConnect cierra ese vacío con una coincidencia inteligente basada en habilidades, un flujo limpio de aplicaciones y una comunidad ligera construida alrededor de Discord.

---

## ¿Para quién es?

### Desarrolladores que buscan contribuir

Tienes habilidades. Quieres trabajar en proyectos reales. No sabes dónde buscar ni cómo comenzar. DevConnect te muestra proyectos que coinciden exactamente con tu pila tecnológica y rol — y te permite aplicar con un solo mensaje.

### Propietarios de proyectos que buscan contribuyentes

Estás construyendo algo públicamente. Necesitas personas. DevConnect da a tu proyecto una lista dedicada, una bandeja de entrada para solicitudes y las herramientas para gestionar tu equipo — sin tener que correr un proceso de contratación.

---

## Este Repositorio

Este repositorio (`devconnect-web`) es el **frontend** de la plataforma DevConnect. Es una aplicación Next.js construida con el enrutador App, TypeScript y Tailwind CSS.

Consumo la [API de DevConnect](https://github.com/M41k80/devconnect-api-nestjs) (NestJS + PostgreSQL) a través del HTTP. Los dos repositorios están diseñados para ejecutarse independientemente y comunicarse exclusivamente mediante el API REST.

---

## Conceptos Básicos

Antes de sumergirte en el código, comprende estos conceptos de dominio:

### Proyecto
Un proyecto de software publicado por un desarrollador (el **propietario**). Tiene un título, descripción, pila tecnológica, estado (`idea` / `construcción` / `mvp` / `lanzado`) y enlaces opcionales (repositorio, demo, docs).

### Aplicación
Una solicitud de un desarrollador para unirse a un proyecto. Tiene un estado: `pendiente` → `aceptado` | `rechazado`. Contiene un mensaje opcional del solicitante.

### Miembro
Un desarrollador que ha sido **aceptado** en un proyecto. Los miembros son visibles en la página de detalles del proyecto y pueden colaborar a través de Discord.

### Descubrir
Una alimentación inteligente que raking proyectos por **puntaje de coincidencia** — un número calculado desde cuántas de las habilidades del usuario aparecen en la pila tecnológica del proyecto, ponderadas por el rol profesional del usuario. El algoritmo de puntuación se ejecuta en el backend.

### Notificaciones
Existen dos corrientes de notificación distintas:
- **Notificaciones del propietario** — solicitudes pendientes esperando revisión
- **Notificaciones del solicitante** — nuevas aplicaciones aceptadas (vistas una vez y luego marcadas como leídas a través de `localStorage`)

---

## Filosofía de Diseño

El frontend se construyó con tres principios guían:

### 1. Las páginas son finas
Las páginas (`page.tsx`) deben ser cortas — idealmente por debajo de 80 líneas. Todas las solicitudes de datos viven en ganchos personalizados. Toda la complejidad de la interfaz de usuario vive en subcomponentes. Una página es solo una capa de composición.

### 2. Un archivo, una razón para cambiar
Un componente que maneja tanto la obtención de datos como el renderizado son dos cosas fingiendo ser una. Las separamos. Si cambias el contrato de la API, tocas el gancho. Si cambias el diseño visual, tocas el componente.

### 3. El sistema de diseño es variables CSS
Los colores, sombras y transiciones están definidos una vez en `globals.css` como propiedades personalizadas de CSS. Los componentes hacen referencia a variables (`var(--brand)`, `var(--text-muted)`). Esto hace que el sistema de temas funcione sin una biblioteca de CSS-in-JS y mantiene los modos oscuro/claro simples.

---

## ¿Qué viene a continuación?

- [Getting Started](getting-started.md) — guía completa para configuración local
- [Project Structure](project-structure.md) — qué hace cada carpeta y por qué existe
- [Architecture](architecture.md) — cómo se conectan todos los componentes
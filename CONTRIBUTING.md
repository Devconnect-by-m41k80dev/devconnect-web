# Contributing to DevConnect Web / Contribuir a DevConnect Web

**EN:**
Thank you for considering contributing to DevConnect! This document explains how to contribute effectively. Please read it fully before opening a pull request.

**ES:**
¡Gracias por considerar contribuir a DevConnect! Este documento explica cómo contribuir de manera efectiva. Por favor léelo completo antes de abrir un pull request.

---

## Table of Contents / Tabla de Contenidos

- [Contributing to DevConnect Web / Contribuir a DevConnect Web](#contributing-to-devconnect-web--contribuir-a-devconnect-web)
  - [Table of Contents / Tabla de Contenidos](#table-of-contents--tabla-de-contenidos)
  - [Code of Conduct / Código de Conducta](#code-of-conduct--código-de-conducta)
  - [How to Report Bugs / Cómo Reportar Bugs](#how-to-report-bugs--cómo-reportar-bugs)
  - [How to Request Features / Cómo Solicitar Features](#how-to-request-features--cómo-solicitar-features)
  - [Running the Project Locally / Ejecutar el Proyecto Localmente](#running-the-project-locally--ejecutar-el-proyecto-localmente)
    - [Prerequisites / Requisitos](#prerequisites--requisitos)
    - [Full Setup / Instalación Completa](#full-setup--instalación-completa)
  - [Git Workflow / Flujo de Git](#git-workflow--flujo-de-git)
    - [Branch Naming / Nombres de Ramas](#branch-naming--nombres-de-ramas)
    - [Step-by-Step Workflow / Flujo Paso a Paso](#step-by-step-workflow--flujo-paso-a-paso)
  - [Commit Conventions / Convenciones de Commits](#commit-conventions--convenciones-de-commits)
    - [Types / Tipos](#types--tipos)
    - [Examples / Ejemplos](#examples--ejemplos)
    - [Breaking Changes / Cambios Críticos](#breaking-changes--cambios-críticos)
  - [Pull Request Guidelines / Guía de PRs](#pull-request-guidelines--guía-de-prs)
    - [Before Opening a PR / Antes de abrir PR](#before-opening-a-pr--antes-de-abrir-pr)
    - [PR Description / Descripción](#pr-description--descripción)
  - [Code Standards / Estándares de Código](#code-standards--estándares-de-código)
    - [TypeScript](#typescript)
    - [Components](#components)
    - [Hooks](#hooks)
    - [API](#api)
    - [Styling](#styling)
    - [i18n](#i18n)
  - [Project-Specific Rules / Reglas Específicas](#project-specific-rules--reglas-específicas)
  - [Questions? / ¿Preguntas?](#questions--preguntas)

---

## Code of Conduct / Código de Conducta

**EN:**
By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it. We enforce it.

**ES:**
Al participar en este proyecto aceptas nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Por favor léelo. Es obligatorio.

---

## How to Report Bugs / Cómo Reportar Bugs

**EN:**

Before reporting a bug:

1. Search [existing issues](https://github.com/M41k80/devconnect-web/issues) to avoid duplicates
2. Make sure you can reproduce the bug consistently

When opening a bug report, include:

* **What you expected** vs **what happened**
* Steps to reproduce (exact)
* Your environment: OS, browser, Node.js version
* Relevant error messages or screenshots
* Which page or component is affected

Use the **Bug Report** issue template when available.

**ES:**

Antes de reportar un bug:

1. Busca en los [issues existentes](https://github.com/M41k80/devconnect-web/issues) para evitar duplicados
2. Asegúrate de poder reproducir el bug consistentemente

Al abrir un reporte incluye:

* **Qué esperabas** vs **qué ocurrió**
* Pasos exactos para reproducirlo
* Tu entorno: SO, navegador, versión de Node
* Errores o capturas relevantes
* Qué página o componente está afectado

Usa la plantilla de **Bug Report** cuando esté disponible.

---

## How to Request Features / Cómo Solicitar Features

**EN:**

Before requesting a feature:

1. Check the [existing issues and discussions](https://github.com/M41k80/devconnect-web/discussions)
2. Ensure it fits the project mission

A good feature request includes:

* The problem it solves
* Proposed implementation (optional)
* Backend impact (link API repo if needed)

**ES:**

Antes de solicitar una feature:

1. Revisa [issues y discusiones existentes](https://github.com/M41k80/devconnect-web/discussions)
2. Asegúrate que encaje con el objetivo del proyecto

Una buena solicitud incluye:

* El problema que resuelve
* Propuesta de implementación (opcional)
* Impacto en backend (link al repo API si aplica)

---

## Running the Project Locally / Ejecutar el Proyecto Localmente

### Prerequisites / Requisitos

| Tool           | Version                     |
| -------------- | --------------------------- |
| Node.js        | 18 or higher                |
| Yarn           | 1.x                         |
| Git            | Any recent version          |
| DevConnect API | Running on `localhost:3000` |

---

### Full Setup / Instalación Completa

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/devconnect-web.git
cd devconnect-web

# 2. Add the upstream remote
git remote add upstream https://github.com/M41k80/devconnect-web.git

# 3. Install dependencies
yarn install

# 4. Create your environment file
cp .env.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

```bash
# 5. Start backend
# Ver: https://github.com/M41k80/devconnect-api-nestjs

# 6. Start frontend
yarn dev
```

**EN:** The app runs at http://localhost:3001
**ES:** La app corre en http://localhost:3001

---

## Git Workflow / Flujo de Git

**EN:** We use a feature branch workflow.
**ES:** Usamos un flujo basado en ramas por feature.

### Branch Naming / Nombres de Ramas

| Type          | Pattern        | Example                       |
| ------------- | -------------- | ----------------------------- |
| New feature   | `feat/...`     | `feat/project-search-filters` |
| Bug fix       | `fix/...`      | `fix/navbar-badge-count`      |
| Documentation | `docs/...`     | `docs/api-integration-guide`  |
| Refactoring   | `refactor/...` | `refactor/profile-page-hooks` |
| Chore         | `chore/...`    | `chore/update-dependencies`   |

---

### Step-by-Step Workflow / Flujo Paso a Paso

```bash
git checkout main
git pull upstream main

git checkout -b feat/your-feature-name

git add .
git commit -m "feat(projects): add tech stack filter chips"

git fetch upstream
git rebase upstream/main

git push origin feat/your-feature-name
```

---

## Commit Conventions / Convenciones de Commits

**EN:** We follow Conventional Commits
**ES:** Seguimos Conventional Commits

```bash
<type>(<scope>): <description>
```

### Types / Tipos

* feat → feature
* fix → bug
* refactor → refactor
* docs → docs
* style → estilo
* test → tests
* chore → mantenimiento
* perf → performance
* ci → CI/CD

---

### Examples / Ejemplos

```bash
git commit -m "feat(notifications): add badge"
git commit -m "fix(auth): fix login bug"
```

---

### Breaking Changes / Cambios Críticos

```bash
feat(api)!: breaking change example
```

---

## Pull Request Guidelines / Guía de PRs

### Before Opening a PR / Antes de abrir PR

* Build sin errores
* Lint sin errores
* Probado manualmente
* Responsive probado

---

### PR Description / Descripción

**EN:** What, Why, How, Screenshots, Testing
**ES:** Qué, Por qué, Cómo, Capturas, Pruebas

---

## Code Standards / Estándares de Código

### TypeScript

* No `any`

### Components

* Responsabilidad única

### Hooks

* Un solo propósito

### API

* No axios directo

### Styling

* Tailwind + variables

### i18n

* No hardcodear texto

---

## Project-Specific Rules / Reglas Específicas

1. Middleware en `proxy.ts`
2. Usar Zustand
3. Prefijo `dc-` en CSS
4. Tipos centralizados
5. Páginas simples

---

## Questions? / ¿Preguntas?

Discord: https://discord.gg/fRPSECNF

---

**EN:** We appreciate every contribution.
**ES:** Apreciamos cada contribución. 🙏

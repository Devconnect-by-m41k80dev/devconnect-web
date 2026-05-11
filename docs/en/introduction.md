# Introduction

## What is DevConnect?

DevConnect is an open-source developer collaboration platform. It exists to solve a specific, real problem in the software community:

> **Great developers can't find open-source projects to contribute to. Great projects can't find the right contributors.**

DevConnect closes that gap with smart skill-based matching, a clean application flow, and a lightweight community built around Discord.

---

## Who Is It For?

### Developers looking to contribute

You have skills. You want to work on real projects. You don't know where to look or how to get started. DevConnect shows you projects that match your exact tech stack and role — and lets you apply with a single message.

### Project owners looking for contributors

You're building something in public. You need people. DevConnect gives your project a dedicated listing, an application inbox, and the tools to manage your team — without running a hiring process.

---

## This Repository

This repository (`devconnect-web`) is the **frontend** of the DevConnect platform. It is a Next.js application built with the App Router, TypeScript, and Tailwind CSS.

It consumes the [DevConnect API](https://github.com/M41k80/devconnect-api-nestjs) (NestJS + PostgreSQL) via HTTP. The two repositories are designed to be run independently and communicate exclusively through the REST API.

---

## Core Concepts

Before diving into the code, understand these domain concepts:

### Project
A software project posted by a developer (the **owner**). Has a title, description, tech stack, status (`idea` / `building` / `mvp` / `launched`), and optional links (repo, demo, docs).

### Application
A request from a developer to join a project. Has a status: `pending` → `accepted` | `rejected`. Contains an optional message from the applicant.

### Member
A developer who has been **accepted** into a project. Members are visible on the project detail page and can collaborate via Discord.

### Discover
A smart feed that ranks projects by **match score** — a number calculated from how many of the user's skills appear in the project's tech stack, weighted by the user's professional role. The scoring algorithm runs on the backend.

### Notifications
Two distinct notification streams exist:
- **Owner notifications** — pending applications waiting for review
- **Applicant notifications** — newly accepted applications (seen once, then marked as read via `localStorage`)

---

## Design Philosophy

The frontend was built with three guiding principles:

### 1. Pages are thin
Pages (`page.tsx`) should be short — ideally under 80 lines. All data fetching lives in custom hooks. All UI complexity lives in sub-components. A page is just a composition layer.

### 2. One file, one reason to change
A component that handles both data fetching and rendering is two things pretending to be one. We separate them. If you change the API contract, you touch the hook. If you change the visual design, you touch the component.

### 3. The design system is CSS variables
Colors, shadows, and transitions are defined once in `globals.css` as CSS custom properties. Components reference variables (`var(--brand)`, `var(--text-muted)`). This makes the theme system work without a CSS-in-JS library and keeps dark/light mode simple.

---

## What's Next?

- [Getting Started](getting-started.md) — full local setup guide
- [Project Structure](project-structure.md) — what every folder does and why it exists
- [Architecture](architecture.md) — how all the pieces connect

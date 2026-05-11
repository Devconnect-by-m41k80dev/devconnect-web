# Contributing to DevConnect Web

First off — thank you for taking the time to contribute.

DevConnect is an open-source project built by developers, for IT professionals. Every contribution matters, whether it's fixing a typo, improving a component, or shipping a brand new feature. This guide will help you get up and running quickly and ensure your contribution fits smoothly into the project.

-----

## Table of Contents

- [Contributing to DevConnect Web](#contributing-to-devconnect-web)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Ways to Contribute](#ways-to-contribute)
  - [Before You Start](#before-you-start)
  - [Development Setup](#development-setup)
    - [1. Fork and clone](#1-fork-and-clone)
    - [2. Add the upstream remote](#2-add-the-upstream-remote)
    - [3. Install dependencies](#3-install-dependencies)
    - [4. Configure environment](#4-configure-environment)
    - [5. Start the backend API](#5-start-the-backend-api)
    - [6. Start the development server](#6-start-the-development-server)
  - [Project Structure](#project-structure)
  - [Branching Strategy](#branching-strategy)
  - [Commit Convention](#commit-convention)
    - [Types](#types)
    - [Scope (optional but recommended)](#scope-optional-but-recommended)
    - [Examples](#examples)
  - [Coding Standards](#coding-standards)
    - [TypeScript](#typescript)
    - [Component Architecture](#component-architecture)
    - [Hooks](#hooks)
    - [API Layer](#api-layer)
    - [Styling](#styling)
    - [Internationalization](#internationalization)
    - [Code Style](#code-style)
  - [Submitting a Pull Request](#submitting-a-pull-request)
    - [Checklist before opening a PR](#checklist-before-opening-a-pr)
    - [PR title format](#pr-title-format)
    - [PR description template](#pr-description-template)
  - [Review Process](#review-process)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Questions \& Support](#questions--support)

-----

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODEOFCONDUCT.MD). Please read it before contributing. We are committed to providing a welcoming and respectful environment for everyone.

-----

## Ways to Contribute

You don't have to write code to contribute. Here are all the ways you can help:

|Type|Examples|
|---|---|
|🐛 **Bug fixes**|Fix a broken component, resolve a layout issue, correct form validation|
|✨ **Features**|New pages, new UI components, improve notification logic|
|📖 **Documentation**|Improve the README, fix typos, clarify setup steps|
|🧪 **Tests**|Add missing unit tests, improve React Testing Library coverage|
|🎨 **Design**|Improve accessibility, refine responsive behavior, enhance animations|
|🌐 **Translations**|Improve EN/ES translations, add new i18n keys|
|🔒 **Security**|Report vulnerabilities, improve auth handling in the UI|
|💬 **Discussion**|Open issues, share ideas, give feedback on PRs|

-----

## Before You Start

1. **Search existing issues** — your idea or bug may already be tracked. Avoid duplicate effort.
1. **Open an issue first** for significant changes (new features, breaking changes, architecture decisions) so the team can align before you invest time coding.
1. **Small fixes** (typos, documentation, minor bugs) can go straight to a PR without a prior issue.

-----

## Development Setup

### 1. Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/devconnect-web.git
cd devconnect-web
```

### 2. Add the upstream remote

```bash
git remote add upstream https://github.com/M41k80/devconnect-web.git
```

### 3. Install dependencies

```bash
yarn install
```

### 4. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your running API
```

### 5. Start the backend API

The frontend has no functionality without the DevConnect API. Start it first:

```bash
# See: https://github.com/M41k80/devconnect-api-nestjs
# The API must be accessible at http://localhost:3000/api
```

### 6. Start the development server

```bash
yarn dev
```

The app will be available at `http://localhost:3001`.

-----

## Project Structure

Understanding the codebase before contributing helps you put your changes in the right place.

```
src/
├── app/
│   ├── (protected)/          # Routes requiring authentication
│   ├── (public)/             # Public routes
│   ├── components/           # All UI components organized by feature
│   │   ├── auth/             # Auth modal and forms
│   │   ├── landing/          # Landing page sections
│   │   ├── layout/           # Navbar, Footer, UserMenu
│   │   ├── notifications/    # NotificationBell, ApplicationItem
│   │   ├── profile/          # Profile sub-components
│   │   ├── project/          # ProjectCard and sub-components
│   │   ├── projects/         # Filters, pagination, forms
│   │   ├── ui/               # Generic primitives (Avatar, Badge, Spinner)
│   │   └── user/             # Public user profile sub-components
│   ├── context/              # ModalContext — auth modal controller
│   ├── hooks/                # Custom hooks — all data fetching and logic
│   ├── i18n/                 # EN/ES dictionaries + useI18n() hook
│   ├── lib/
│   │   ├── api/              # Resource-specific API modules
│   │   ├── http/             # Axios instance, interceptors, typed wrappers
│   │   └── utils.ts          # cn(), formatDate(), truncate()
│   ├── store/                # Zustand stores (auth, notifications, theme)
│   ├── styles/               # globals.css — Tailwind + CSS variables + design system
│   └── types/                # TypeScript types (entities, DTOs, enums, pagination)
└── proxy.ts                  # Next.js Edge middleware (route protection)
```

The most important rule: **pages are thin**. A `page.tsx` should only compose components and call a hook. All data fetching belongs in `hooks/`. All rendering belongs in `components/`.

-----

## Branching Strategy

Always branch off from `main`. Use the following naming convention:

|Prefix|When to use|Example|
|---|---|---|
|`feat/`|New feature or UI enhancement|`feat/project-edit-page`|
|`fix/`|Bug fix|`fix/notification-badge-count`|
|`docs/`|Documentation changes only|`docs/update-getting-started`|
|`test/`|Adding or improving tests|`test/profile-sidebar-coverage`|
|`refactor/`|Code refactoring without behavior changes|`refactor/extract-project-hooks`|
|`chore/`|Tooling, dependencies, config|`chore/upgrade-next-16`|
|`style/`|Visual/UI changes, CSS improvements|`style/improve-dark-mode-contrast`|

```bash
# Always start from an up-to-date main
git checkout main
git pull upstream main

# Create your branch
git checkout -b feat/your-feature-name
```

-----

## Commit Convention

This project follows the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. All commits must follow this format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

|Type|Description|
|---|---|
|`feat`|A new feature visible to the user|
|`fix`|A bug fix|
|`docs`|Documentation changes only|
|`test`|Adding or modifying tests|
|`refactor`|Code change that neither fixes a bug nor adds a feature|
|`chore`|Dependency updates, config changes, tooling|
|`perf`|Performance improvement|
|`style`|Visual/CSS changes with no logic change|
|`ci`|CI/CD configuration changes|

### Scope (optional but recommended)

Use the feature area as scope: `auth`, `projects`, `profile`, `notifications`, `navbar`, `landing`, `i18n`, `api`, `store`, `hooks`, `ui`, `theme`.

### Examples

```
feat(notifications): add green badge for accepted applications
fix(auth): prevent double modal render on 401
refactor(profile): extract ProfileSidebar into separate component
feat(i18n): add missing Spanish translations for applications page
style(landing): improve dark mode color contrast for Stats section
chore(deps): upgrade zustand to v5
test(utils): add unit tests for formatDate and cn helpers
```

> ⚠️ Commits that don't follow this convention will be flagged during PR review.

-----

## Coding Standards

### TypeScript

- Use **strict typing** everywhere. Avoid `any` — use `unknown` with type guards if needed.
- Prefer `interface` for object shapes used as contracts; `type` for unions and computed types.
- All exported functions and hooks must have explicit return types.
- Entity and DTO types live in `src/app/types/` — never redefine them inline in components.

### Component Architecture

- Every component has a **single responsibility**. If it does two things, make two components.
- Keep components under **80 lines**. If longer, extract sub-components or hooks.
- Use **named exports** for all components (except `page.tsx` and `layout.tsx` files which must use default exports per Next.js convention).
- Props interface must be defined directly above the component function.

```typescript
// ✅ Good
interface ProfileSkillsProps {
  skills: User['skills']
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  // ...
}

// ❌ Bad — no interface, implicit any
export default function ProfileSkills(props) {
  // ...
}
```

### Hooks

- Custom hooks live in `src/app/hooks/` and are named `use` + domain (e.g. `useProjects`, `useUserProfile`).
- A hook should own **one concern**: either data fetching, form state, or UI state — not a mix.
- Clean up subscriptions and event listeners in `useEffect` return functions.
- Do not call Zustand stores inside hooks unless absolutely necessary — pass data as parameters instead.

### API Layer

- API calls belong exclusively in `src/app/lib/api/` — **never** inline in components or pages.
- Always use the typed wrappers (`get`, `post`, `patch`, `del`) from `lib/http/http-methods.ts`.
- Never import `axios` directly in components, hooks, or pages.

```typescript
// ✅ Correct
import { projectsApi } from '@/app/lib/api'
const project = await projectsApi.getById(id)

// ❌ Wrong — direct axios in a hook
import axios from 'axios'
const project = await axios.get(`/projects/${id}`)
```

### Styling

- Use **Tailwind utility classes** for all layout, spacing, border-radius, and flex/grid.
- Use **CSS custom properties** (e.g. `var(--brand)`, `var(--text-muted)`, `var(--border)`) for all colors and shadows. Never hardcode hex values in components.
- Use the design system classes (`.dc-card`, `.dc-btn-primary`, `.dc-input`, `.dc-page`, etc.) defined in `globals.css` before writing custom styles.
- Use the `cn()` utility from `lib/utils.ts` for all conditional class names.

```tsx
// ✅ Good — uses design tokens and cn()
<div
  className={cn('dc-card p-5', isActive && 'border-[--brand]')}
  style={{ color: 'var(--text-muted)' }}
>

// ❌ Bad — hardcoded color, no design system
<div style={{ background: '#171930', color: '#b0b7d6', padding: '20px' }}>
```

### Internationalization

- All user-visible strings must come from `useI18n()`. Never hardcode English text in JSX.
- When adding new strings, update **both** `en` and `es` dictionaries in `src/app/i18n/index.ts` in the same commit.
- The `t` object is fully typed — TypeScript will catch missing keys at build time.

```typescript
// ✅ Good
const { t } = useI18n()
<p>{t.profile.memberSince}</p>

// ❌ Bad — hardcoded string
<p>Member since</p>
```

### Code Style

- Formatting is handled by your editor using the `.vscode/settings.json` (format on save with Prettier).
- Linting is enforced by **ESLint** — run `yarn lint` before committing.
- No unused imports, no commented-out code blocks, no `console.log` left in production code.
- New protected routes must be added to `PROTECTED_PREFIXES` in `src/proxy.ts`.

```bash
# Run before pushing
yarn lint
yarn build
```

-----

## Submitting a Pull Request

### Checklist before opening a PR

- [ ] My branch is up to date with `upstream/main` (rebased, not merged)
- [ ] All TypeScript types are correct: `yarn build` passes with no errors
- [ ] No lint errors: `yarn lint` passes
- [ ] I've tested in both **light mode** and **dark mode**
- [ ] I've tested on **mobile viewport** (≤ 768px)
- [ ] New user-visible strings are added to **both** `en` and `es` in `i18n/index.ts`
- [ ] New protected routes are added to `PROTECTED_PREFIXES` in `proxy.ts`
- [ ] No hardcoded hex colors in components — CSS variables used throughout
- [ ] No `any` types introduced
- [ ] My commits follow the Conventional Commits format

### PR title format

Follow the same convention as commits:

```
feat(notifications): dual badge for owners and applicants
fix(profile): applications list not refreshing after accept
style(landing): improve Sponsors section responsive layout
```

### PR description template

When you open a PR, please fill out the following:

```
## What does this PR do?
Brief description of the change and the problem it solves.

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Style / UI improvement
- [ ] Test
- [ ] Other

## Screenshots (if UI changes)
Before / After screenshots for any visual changes.

## How to test
Step-by-step instructions for the reviewer to verify the change.

## Related issue
Closes #<issue_number>

## Notes for reviewers
Anything that requires special attention or context.
```

-----

## Review Process

- All PRs require **at least one approval** from a maintainer before merging.
- Reviewers will check: correctness, TypeScript types, code style, i18n completeness, responsive behavior, and dark mode compatibility.
- Please be responsive to review comments. PRs inactive for more than 14 days may be closed.
- Once approved, a maintainer will merge using **Squash and Merge** to keep the `main` history clean.

-----

## Reporting Bugs

Found a bug? Please open a GitHub issue with the following information:

1. **Title** — short and descriptive: `[BUG] Notification badge shows wrong count after accept`
1. **Environment** — OS, browser, Node version, screen size
1. **Steps to reproduce** — the exact steps to trigger the bug
1. **Expected behavior** — what should happen
1. **Actual behavior** — what actually happens
1. **Screenshots / Console errors** — any relevant visual output or error messages

> 🔒 **Security vulnerabilities** — please do **not** open a public issue. Instead, report them privately by emailing `contactdevconnect@m41k80dev.com`. We will acknowledge within 48 hours.

-----

## Suggesting Features

Have an idea to improve DevConnect? Open a GitHub issue with the `enhancement` label and include:

1. **The problem** — what pain point does this solve?
1. **The proposed solution** — how would it look and work from the user's perspective?
1. **Alternatives considered** — other approaches you thought about
1. **Backend changes required?** — link or describe any new API endpoints needed
1. **Additional context** — mockups, references to similar features, screenshots

Feature requests are reviewed by maintainers and discussed openly. Alignment with the project roadmap determines prioritization.

-----

## Questions & Support

- **General questions** — open a GitHub Discussion in the `Q&A` category.
- **Bug reports** — open a GitHub Issue.
- **Feature ideas** — open a GitHub Issue with the `enhancement` label.
- **Security issues** — email `contactdevconnect@m41k80dev.com` privately.
- **Community chat** — join our [Discord](https://discord.gg/5xEWnfJDjt) for real-time help.

We appreciate your patience — maintainers are volunteers and will respond as soon as possible.

-----

<div align="center">

Thank you for being part of DevConnect 💜

</div>

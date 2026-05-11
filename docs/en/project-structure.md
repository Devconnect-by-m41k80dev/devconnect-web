# Project Structure

This document explains every major folder in the project and why it exists. Understanding this structure is the fastest path to being productive in the codebase.

---

## Root Level

```
devconnect-web/
├── public/                  # Static files served at /
│   ├── logo-icon.jpeg       # Favicon and navbar icon
│   └── logo-full.jpeg       # Full logo (used in About page etc.)
├── src/                     # All source code
│   ├── app/                 # Next.js App Router root
│   └── proxy.ts             # Next.js middleware (route protection)
├── .env.example             # Environment variable template
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

### `src/proxy.ts`

This is the Next.js middleware file. It runs **on the Edge before any page renders**. Its only job is route protection:

- Reads the JWT from the `token` cookie
- Decodes the JWT to extract the `role` claim (no backend call needed)
- Redirects unauthenticated users trying to access protected routes to `/?auth=login`
- Redirects non-admins trying to access `/admin` to `/projects`

Protected route prefixes: `/profile`, `/discover`, `/projects/new`, `/applications`

> The file is named `proxy.ts` (not `middleware.ts`) because Next.js 16 supports custom middleware filenames via the `matcher` export. The `config.matcher` export at the bottom registers it as the active middleware.

---

## `src/app/` — The Application Root

```
src/app/
├── (protected)/             # Routes requiring authentication
├── (public)/                # Routes accessible without authentication
├── components/              # All reusable UI components
├── context/                 # React Context providers
├── hooks/                   # Custom React hooks
├── i18n/                    # Internationalization
├── lib/                     # API layer + utilities
├── store/                   # Zustand stores
├── styles/                  # Global CSS
├── types/                   # TypeScript type definitions
├── layout.tsx               # Root layout (fonts, metadata, providers)
├── page.tsx                 # Landing page (/)
└── not-found.tsx            # 404 page
```

---

## Route Groups

### `(protected)/` — Authenticated Routes

These routes are protected by the middleware. If a user is not authenticated, they are redirected to the home page with the auth modal pre-opened.

```
(protected)/
├── applications/page.tsx    # Owner's inbox: review pending applications
├── discover/page.tsx        # Skill-matched project feed
├── profile/page.tsx         # User's own profile + edit form
└── projects/new/page.tsx    # Create a new project
```

The `(protected)` folder name uses Next.js **route group** syntax — the parentheses are not part of the URL.

### `(public)/` — Unauthenticated Routes

These routes are accessible without logging in. Some features within them (like applying to a project) prompt login if attempted unauthenticated.

```
(public)/
├── projects/
│   ├── page.tsx             # Project listing with filters
│   └── [id]/page.tsx        # Project detail + apply form
├── users/[id]/page.tsx      # Public user profile + follow/unfollow
├── about/page.tsx           # About DevConnect
├── terms/page.tsx           # Terms of Service
└── privacy/page.tsx         # Privacy Policy
```

---

## `components/`

Components are organized by **feature domain**, not by type. This means related components live together rather than all buttons in one folder and all cards in another.

```
components/
├── auth/                    # Auth modal and forms
│   ├── AuthModal.tsx        # Modal wrapper (login/register tabs)
│   ├── LoginFormModal.tsx   # Login form with validation
│   └── RegisterFormModal.tsx# Registration form with role/skills selection
│
├── landing/                 # Landing page sections
│   ├── HeroSection.tsx      # Hero with headline + CTAs
│   ├── Stats.tsx            # Live stats from backend (projects, users, applications)
│   ├── Features.tsx         # Feature grid
│   ├── Sponsors.tsx         # Sponsor section with contact CTA
│   ├── Donate.tsx           # Donation section (Buy Me a Coffee)
│   └── CTABanner.tsx        # Bottom call-to-action
│
├── layout/                  # Global layout components
│   ├── Navbar.tsx           # Top navigation (composes navbar/* sub-components)
│   ├── Footer.tsx           # Site footer with link columns
│   ├── UserMenu.tsx         # Authenticated user dropdown with badges
│   └── navbar/              # Navbar sub-components
│       ├── Logo.tsx         # Logo mark + wordmark
│       ├── DesktopNavLinks.tsx   # Navigation links (desktop)
│       ├── AuthButtons.tsx  # Login/Register buttons for guests
│       ├── MobileMenu.tsx   # Full-screen mobile navigation
│       ├── ThemeToggle.tsx  # Light/dark toggle
│       └── LenguageDropdown.tsx  # EN/ES language switcher
│
├── notifications/           # Notification system components
│   ├── NotificationBell.tsx # Bell icon with pending count badge
│   ├── ApplicationItem.tsx  # Single application card (accept/reject actions)
│   └── ProjectApplicationsList.tsx  # Filtered list of applications for a project
│
├── profile/                 # User profile components (own profile page)
│   ├── ProfileSidebar.tsx   # Avatar, name, bio, social links
│   ├── ProfileSkills.tsx    # Skills chip list
│   ├── ProfileEditForm.tsx  # Inline edit form
│   └── ProfileApplicationsList.tsx  # Applied projects list + Discord banner
│
├── project/                 # Project card (used in listings)
│   ├── ProjectCard.tsx      # Card wrapper (clickable, links to detail)
│   ├── ProjectCardHeader.tsx     # Title + status badge
│   ├── ProjectCardTechStack.tsx  # Tech chips
│   └── ProjectCardFooter.tsx     # Owner avatar + date + match score
│
├── projects/                # Project-list-page-specific components
│   ├── ProjectsPagination.tsx    # Page navigation
│   ├── filters/
│   │   ├── ProjectsSearchBar.tsx # Search input + filter toggle
│   │   └── ProjectsFilterPanel.tsx  # Status + tech filter chips
│   └── form/
│       ├── TechStackInput.tsx    # Multi-tag input for tech stack
│       └── StatusPicker.tsx      # Status button group
│
├── ui/                      # Generic reusable primitives
│   ├── Avatar.tsx           # User avatar with initials fallback
│   ├── Badge.tsx            # Status badges (project status + application status)
│   └── Spinner.tsx          # Loading spinner
│
└── user/                    # Public user profile components
    ├── UserProfileSidebar.tsx     # Profile card + follow button + stats
    ├── UserTabBar.tsx             # Followers / Following tab selector
    └── UserFollowList.tsx         # List of follower/following user cards
```

**Why organized this way?** When a feature needs changing, all affected files are co-located. If the profile feature changes, you open `components/profile/`. You don't need to search across `components/buttons/`, `components/forms/`, `components/cards/`.

---

## `context/`

```
context/
└── ModalContext.tsx    # Auth modal state + open/close API
```

`ModalContext` is the global auth modal controller. It:
- Holds `authOpen` boolean and `mode` ("login" | "register") state
- Exposes `openAuth(mode?)` and `closeAuth()` via `useModal()` hook
- Listens for `open-auth-modal` CustomEvents (dispatched by the HTTP interceptor on 401)
- Reads `?auth=login` query params from the middleware redirect
- Renders the single `<AuthModal>` instance for the whole app

There is intentionally only **one** React Context in this project. Everything else uses Zustand.

---

## `hooks/`

Custom hooks separate data-fetching logic from rendering. Every significant page has a corresponding hook.

```
hooks/
├── useDebounce.ts           # Generic debounce for search inputs
├── useMyProjects.ts         # Projects owned by the current user
├── useNewProject.ts         # Form state + submit logic for creating a project
├── useNotifications.ts      # Owned projects + their pending applications (for /applications page)
├── useProfile.ts            # Own profile data + edit form + applied projects
├── useProjectApplications.ts # Applications for a single project (for ProjectApplicationsList)
├── useProjects.ts           # Project listing with filters, pagination, debounced search
├── useStats.ts              # Platform-wide stats for the landing page
└── useUserProfile.ts        # Public user profile + followers + following + follow action
```

**The rule:** a hook owns one concern. `useProjects` handles fetching and filtering. `useNewProject` handles form state and submission. They don't overlap.

---

## `i18n/`

```
i18n/
└── index.ts    # Full EN/ES dictionary + useI18n() hook + locale store
```

The entire translation system lives in one file. It exports:
- `useI18n()` — returns `{ t, locale, setLocale }` 
- `useLocaleStore` — the Zustand store that persists locale preference to `localStorage`

The `t` object is fully typed — TypeScript will error if you reference a key that doesn't exist in the dictionary.

---

## `lib/`

```
lib/
├── api/                     # One file per API resource
│   ├── index.ts             # Re-exports everything (import from @/app/lib/api)
│   ├── auth.api.ts          # Login, logout, register, refresh
│   ├── follows.api.ts       # Follow, unfollow, getFollowers, getFollowing
│   ├── metadata.api.ts      # Professional roles and skills (for registration)
│   ├── projects.api.ts      # All project endpoints
│   ├── stats.api.ts         # Platform statistics
│   ├── users.api.ts         # User profile endpoints
│   └── error.api.ts         # Error message extractor utility
│
├── http/                    # Axios setup — do not modify without care
│   ├── http-client.ts       # Axios instance with baseURL and credentials
│   ├── http-methods.ts      # Typed wrappers: get, post, patch, del
│   └── interceptors.ts      # Response unwrapping + 401 silent refresh
│
├── utils.ts                 # cn() class merger, formatDate(), truncate()
└── scrollToSection.ts       # Utility for anchor scroll on landing page
```

---

## `store/`

```
store/
├── auth.store.ts            # User identity, login/logout, fetchMe
├── notifications.store.ts   # Pending count (owner) + accepted count (applicant)
└── theme.store.ts           # Light/dark theme with DOM class toggling
```

All stores use Zustand with the `persist` middleware for `localStorage` hydration. See [state-management.md](state-management.md) for detailed documentation.

---

## `styles/`

```
styles/
└── globals.css    # Tailwind directives + CSS variables + component classes
```

One file. All global styles, the design token system (`--brand`, `--text-muted`, etc.), reusable component classes (`.dc-card`, `.dc-btn-primary`, `.dc-input`), animations, and the skeleton loader.

---

## `types/`

```
types/
├── api/
│   └── api.types.ts         # ApiResponse<T> and ApiSuccess<T> wrappers
├── dtos/                    # Request body shapes
│   ├── create-project.dto.ts
│   ├── update-project.dto.ts
│   ├── apply-project.dto.ts
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── ...
├── entities/                # Response shapes (mirror backend entities)
│   ├── user.entity.ts
│   ├── project.entity.ts
│   ├── project-application.entity.ts
│   ├── project-member.entity.ts
│   ├── applied-project.entity.ts   # Different shape from ProjectApplication!
│   ├── skill.entity.ts
│   └── ...
├── enums/
│   ├── application-status.enum.ts  # pending | accepted | rejected
│   ├── project-status.enum.ts      # idea | building | mvp | launched
│   └── role.enum.ts                # user | admin | moderator
├── metadata/
│   └── register-metadata.types.ts  # Professional roles + skills for registration form
└── pagination/
    └── pagination.types.ts          # PaginatedResponse<T> and PaginatedApplicationsResponse
```

**Why separate `entities/` from `dtos/`?** DTOs are what you **send** to the API (request bodies). Entities are what you **receive** from the API (response shapes). They are different: a DTO for creating a project has `title` and `description` as required strings; the Project entity has `id`, `createdAt`, `owner`, and many more fields that only exist after creation.

**Note on `applied-project.entity.ts`:** The `GET /projects/applied` endpoint returns a different shape from the standard `ProjectApplication`. It uses `applicationId` (not `id`) as the key. This is modeled as a separate type to prevent confusion.

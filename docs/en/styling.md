# Styling

DevConnect uses **Tailwind CSS v3** for layout and spacing combined with a **CSS custom property system** for the design tokens (colors, shadows, transitions). This document explains the system, why it was built this way, and how to use it correctly.

---

## Overview

```
styles/globals.css
  ├── Tailwind directives (@tailwind base/components/utilities)
  ├── CSS custom properties (design tokens)
  ├── Component classes (.dc-card, .dc-btn-primary, .dc-input, ...)
  ├── Animation keyframes and utility classes
  └── Typography helpers (.text-gradient, .bg-dots)
```

Components use a mix of:
- **Tailwind classes** for layout, spacing, flex, grid, border-radius
- **CSS variables** for colors, shadows (via `style={{ color: 'var(--text-muted)' }}`)
- **Design system classes** (`.dc-card`, `.dc-btn-primary`, etc.) for recurring patterns

---

## CSS Custom Properties (Design Tokens)

All colors and shadows are defined as CSS variables on `:root` (light) and `.dark` (dark mode):

```css
:root {
  --bg:          #ffffff;        /* Page background */
  --bg-raised:   #f7f8fa;        /* Cards, dropdowns */
  --bg-overlay:  #eef0f5;        /* Hover states, inputs */
  --border:      #e2e5ee;        /* All borders */
  --text:        #0f1226;        /* Primary text */
  --text-muted:  #3f4761;        /* Secondary text */
  --text-dim:    #6b7391;        /* Placeholder, metadata */
  --brand:       #6d4aff;        /* Primary accent (purple) */
  --brand-hover: #5a38ff;        /* Brand on hover */
  --accent:      #06b6d4;        /* Secondary accent (cyan) */
  --success:     #22c55e;
  --warning:     #f97316;
  --danger:      #ef4444;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05);
  --shadow-hover:0 4px 20px rgba(93,63,211,0.14);
  --shadow-glow: 0 0 24px rgba(93,63,211,0.35);
}

.dark {
  --bg:          #0f1021;
  --bg-raised:   #171930;
  --text:        #f2f5ff;
  --text-muted:  #b0b7d6;
  /* ... */
}
```

### How to use tokens in components

```tsx
// ✅ Correct — uses design token
<p style={{ color: 'var(--text-muted)' }}>Secondary text</p>
<div style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>

// ✅ Also correct for Tailwind-supported tokens via arbitrary values
<div className="border" style={{ borderColor: 'var(--border)' }}>

// ❌ Wrong — hardcoded hex color
<p style={{ color: '#b0b7d6' }}>Secondary text</p>

// ❌ Wrong — Tailwind dark: variant (harder to maintain, works but inconsistent)
<p className="text-gray-700 dark:text-gray-300">Secondary text</p>
```

### Why CSS variables instead of Tailwind theming?

Tailwind's `dark:` variants work but scale poorly — every color needs a `dark:` counterpart on every element. CSS variables change once and update everywhere. They also allow color mixing:

```css
/* Composable, no Tailwind equivalent */
background: color-mix(in srgb, var(--brand) 10%, transparent);
border-color: color-mix(in srgb, var(--accent) 22%, transparent);
```

---

## Design System Classes

Defined in `globals.css` under `@layer components`, these classes capture recurring patterns:

### Layout

```css
.dc-container   /* max-w-7xl, centered, responsive horizontal padding */
.dc-page        /* min-h-screen, pt-24 (navbar offset), pb-20 */
.dc-page-header /* flex row, space-between, mb-8 */
.dc-page-title  /* font-display, 3xl/4xl, font-bold, tracking-tight */
```

### Cards

```css
.dc-card            /* rounded-2xl, border, bg-raised, shadow-card */
.dc-card-interactive /* dc-card + cursor-pointer + hover: border brand, shadow-hover, translateY(-1px) */
```

Usage:

```tsx
<div className="dc-card p-6">
  {/* Non-clickable card */}
</div>

<Link href="/projects/123" className="dc-card-interactive p-5">
  {/* Clickable card — ProjectCard uses this */}
</Link>
```

### Buttons

```css
.dc-btn           /* base: inline-flex, rounded-xl, font-semibold, transitions */
.dc-btn-primary   /* dc-btn + brand background + glow on hover */
.dc-btn-ghost     /* dc-btn + border + transparent bg + brand on hover */
.dc-btn-danger    /* dc-btn + danger background */
```

Usage:

```tsx
<button className="dc-btn-primary py-2.5 px-6">
  Save Changes
</button>

<button className="dc-btn-ghost py-2 px-4 text-sm">
  Cancel
</button>
```

> Add spacing (`py-*`, `px-*`) and text size (`text-sm`, `text-base`) per usage. The base class does not include padding to stay flexible.

### Forms

```css
.dc-input        /* rounded-xl, bg-overlay, border, focus: brand border + ring */
.dc-input-error  /* overrides border to danger color */
.dc-label        /* text-sm, font-medium, mb-1.5, color text-muted */
```

Usage:

```tsx
<div>
  <label className="dc-label">Project Title</label>
  <input
    className={cn('dc-input', errors.title && 'dc-input-error')}
    {...register('title')}
  />
  {errors.title && (
    <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
      {errors.title.message}
    </p>
  )}
</div>
```

### Skeleton Loader

```css
.dc-skeleton    /* animated gradient shimmer for loading states */
```

```tsx
{loading ? (
  <div className="dc-skeleton h-4 w-1/3 rounded mb-2" />
) : (
  <p>{title}</p>
)}
```

---

## Animations

```css
.anim-fade-up    /* fade in + slide up — for page content */
.anim-fade-in    /* fade in only */
.anim-scale-in   /* scale from 88% to 100% — for modals, dropdowns */

/* Delay modifiers */
.delay-1   /* 80ms  */
.delay-2   /* 160ms */
.delay-3   /* 240ms */
.delay-4   /* 320ms */
.delay-5   /* 400ms */
```

Usage:

```tsx
{/* Staggered list animation */}
{projects.map((p, i) => (
  <ProjectCard
    key={p.id}
    project={p}
    className={`anim-fade-up delay-${Math.min(i + 1, 5)}`}
  />
))}

{/* Modal appears with scale-in */}
<div className="modal-overlay">
  <div className="dc-card p-8 anim-scale-in">
    {/* modal content */}
  </div>
</div>
```

---

## Theme Toggle

Theme switching is handled by `useThemeStore`:

```typescript
export const useThemeStore = create()(persist(
  (set, get) => ({
    theme: 'dark',
    toggle: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark'
      set({ theme: next })
      applyThemeToDOM(next)
    },
  }),
  { name: 'dc-theme' }
))

function applyThemeToDOM(theme: 'light' | 'dark') {
  const root = document.documentElement
  root.classList.add('theme-changing')        // enables CSS transition
  root.classList.toggle('dark', theme === 'dark')
  setTimeout(() => root.classList.remove('theme-changing'), 350)
}
```

The `theme-changing` class enables CSS transitions on all theme-sensitive properties (background, border, color). This creates a smooth 300ms transition instead of a jarring instant switch.

**Flash prevention in `layout.tsx`:**

```tsx
<script dangerouslySetInnerHTML={{
  __html: `(function(){
    try {
      var s = localStorage.getItem('dc-theme');
      var t = s ? JSON.parse(s).state?.theme : 'dark';
      if (t !== 'light') document.documentElement.classList.add('dark');
    } catch(e) {
      document.documentElement.classList.add('dark');
    }
  })()`
}} />
```

This inline script runs before React hydrates, applying the correct theme class immediately and preventing the white flash on dark-mode users' page load.

---

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',              // 'dark' class on <html>
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

**Fonts:**
- `font-display` (Fraunces) — headings, logo, page titles
- `font-sans` (DM Sans) — all body text (default)
- `font-mono` (DM Mono) — tech stack chips, code, metadata

---

## The `cn()` Utility

```typescript
// lib/utils.ts
import { clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

Use `cn()` for conditional class names:

```tsx
<button
  className={cn(
    'dc-btn-ghost py-2 px-4',
    isActive && 'border-[--brand] text-[--brand]',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

---

## Best Practices

1. **Colors always from CSS variables** — never hardcode hex values in components
2. **Layout always from Tailwind** — flex, grid, spacing, border-radius use utility classes
3. **Patterns always from design system** — use `.dc-card`, `.dc-btn-primary`, `.dc-input` before writing custom styles
4. **`cn()` for conditional classes** — not string interpolation
5. **Responsive breakpoints** — follow mobile-first: default styles for mobile, `sm:` for 640+, `lg:` for 1024+
6. **No inline styles for layout** — `style` prop is only for dynamic values that can't be Tailwind classes (e.g. CSS variables)

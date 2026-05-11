# Estilos

DevConnect utiliza **Tailwind CSS v3** para la estructura y espaciado, combinado con un **sistema de propiedades personalizadas de CSS** para los tokens de diseño (colores, sombras y transiciones). Este documento explica el sistema, por qué fue construido de esta manera y cómo utilizarlo correctamente.

---

## Visión General

```text
styles/globals.css
  ├── Directivas de Tailwind (@tailwind base/components/utilities)
  ├── Propiedades personalizadas CSS (tokens de diseño)
  ├── Clases de componentes (.dc-card, .dc-btn-primary, .dc-input, ...)
  ├── Keyframes de animación y clases utilitarias
  └── Helpers tipográficos (.text-gradient, .bg-dots)
```

Los componentes utilizan una combinación de:

- **Clases Tailwind** para layout, espaciado, flex, grid y border-radius
- **Variables CSS** para colores y sombras (mediante `style={{ color: 'var(--text-muted)' }}`)
- **Clases del sistema de diseño** (`.dc-card`, `.dc-btn-primary`, etc.) para patrones recurrentes

---

## Propiedades Personalizadas CSS (Tokens de Diseño)

Todos los colores y sombras se definen como variables CSS en `:root` (modo claro) y `.dark` (modo oscuro):

```css
:root {
  --bg:          #ffffff;        /* Fondo de página */
  --bg-raised:   #f7f8fa;        /* Cards, dropdowns */
  --bg-overlay:  #eef0f5;        /* Hover states, inputs */
  --border:      #e2e5ee;        /* Todos los bordes */
  --text:        #0f1226;        /* Texto principal */
  --text-muted:  #3f4761;        /* Texto secundario */
  --text-dim:    #6b7391;        /* Placeholder, metadata */
  --brand:       #6d4aff;        /* Color principal (morado) */
  --brand-hover: #5a38ff;        /* Hover del color principal */
  --accent:      #06b6d4;        /* Color secundario (cyan) */
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

---

## Cómo usar los tokens en componentes

```tsx
// ✅ Correcto — utiliza un token de diseño
<p style={{ color: 'var(--text-muted)' }}>Texto secundario</p>

<div
  style={{
    background: 'var(--bg-raised)',
    borderColor: 'var(--border)'
  }}
/>

// ✅ También correcto usando valores arbitrarios de Tailwind
<div className="border" style={{ borderColor: 'var(--border)' }}>

// ❌ Incorrecto — color hardcodeado
<p style={{ color: '#b0b7d6' }}>Texto secundario</p>

// ❌ Incorrecto — uso excesivo de dark:
<p className="text-gray-700 dark:text-gray-300">
  Texto secundario
</p>
```

---

## ¿Por qué variables CSS en lugar de theming de Tailwind?

Las variantes `dark:` de Tailwind funcionan, pero escalan mal — cada color necesita una contraparte `dark:` en cada elemento. Las variables CSS cambian una sola vez y actualizan todo automáticamente.

Además permiten mezcla de colores:

```css
/* Composable, sin equivalente directo en Tailwind */
background: color-mix(in srgb, var(--brand) 10%, transparent);

border-color: color-mix(
  in srgb,
  var(--accent) 22%,
  transparent
);
```

---

## Clases del Sistema de Diseño

Definidas en `globals.css` dentro de `@layer components`, estas clases encapsulan patrones recurrentes.

---

## Layout

```css
.dc-container   /* max-w-7xl, centrado, padding horizontal responsive */
.dc-page        /* min-h-screen, pt-24 (offset navbar), pb-20 */
.dc-page-header /* fila flex, space-between, mb-8 */
.dc-page-title  /* font-display, 3xl/4xl, font-bold, tracking-tight */
```

---

## Cards

```css
.dc-card             /* rounded-2xl, border, bg-raised, shadow-card */

.dc-card-interactive /* dc-card + cursor-pointer +
                         hover border brand,
                         shadow-hover,
                         translateY(-1px) */
```

### Uso

```tsx
<div className="dc-card p-6">
  {/* Card no clickeable */}
</div>

<Link
  href="/projects/123"
  className="dc-card-interactive p-5"
>
  {/* Card clickeable — ProjectCard usa esto */}
</Link>
```

---

## Botones

```css
.dc-btn           /* base: inline-flex, rounded-xl, font-semibold, transitions */

.dc-btn-primary   /* dc-btn + fondo brand + glow en hover */

.dc-btn-ghost     /* dc-btn + border + fondo transparente +
                      color brand en hover */

.dc-btn-danger    /* dc-btn + fondo danger */
```

### Uso

```tsx
<button className="dc-btn-primary py-2.5 px-6">
  Save Changes
</button>

<button className="dc-btn-ghost py-2 px-4 text-sm">
  Cancel
</button>
```

> Agrega espaciado (`py-*`, `px-*`) y tamaño de texto (`text-sm`, `text-base`) según el caso de uso.  
> La clase base no incluye padding para mantener flexibilidad.

---

## Formularios

```css
.dc-input        /* rounded-xl, bg-overlay, border,
                    focus: border brand + ring */

.dc-input-error  /* sobrescribe border con color danger */

.dc-label        /* text-sm, font-medium, mb-1.5,
                    color text-muted */
```

### Uso

```tsx
<div>
  <label className="dc-label">
    Project Title
  </label>

  <input
    className={cn(
      'dc-input',
      errors.title && 'dc-input-error'
    )}
    {...register('title')}
  />

  {errors.title && (
    <p
      className="text-xs mt-1"
      style={{ color: 'var(--danger)' }}
    >
      {errors.title.message}
    </p>
  )}
</div>
```

---

## Skeleton Loader

```css
.dc-skeleton /* shimmer animado para estados de carga */
```

### Uso

```tsx
{loading ? (
  <div className="dc-skeleton h-4 w-1/3 rounded mb-2" />
) : (
  <p>{title}</p>
)}
```

---

## Animaciones

```css
.anim-fade-up    /* fade in + slide up */
.anim-fade-in    /* fade in únicamente */
.anim-scale-in   /* escala de 88% a 100% */

/* Delays */
.delay-1   /* 80ms  */
.delay-2   /* 160ms */
.delay-3   /* 240ms */
.delay-4   /* 320ms */
.delay-5   /* 400ms */
```

### Uso

```tsx
{/* Lista con animación escalonada */}
{projects.map((p, i) => (
  <ProjectCard
    key={p.id}
    project={p}
    className={`anim-fade-up delay-${Math.min(i + 1, 5)}`}
  />
))}

{/* Modal con scale-in */}
<div className="modal-overlay">
  <div className="dc-card p-8 anim-scale-in">
    {/* contenido modal */}
  </div>
</div>
```

---

## Theme Toggle

El cambio de tema se maneja mediante `useThemeStore`:

```typescript
export const useThemeStore = create()(persist(
  (set, get) => ({
    theme: 'dark',

    toggle: () => {
      const next =
        get().theme === 'dark'
          ? 'light'
          : 'dark'

      set({ theme: next })

      applyThemeToDOM(next)
    },
  }),

  { name: 'dc-theme' }
))

function applyThemeToDOM(
  theme: 'light' | 'dark'
) {
  const root = document.documentElement

  root.classList.add('theme-changing')

  root.classList.toggle(
    'dark',
    theme === 'dark'
  )

  setTimeout(() => {
    root.classList.remove('theme-changing')
  }, 350)
}
```

La clase `theme-changing` habilita transiciones CSS sobre propiedades sensibles al tema (background, border, color). Esto crea una transición suave de 300ms en lugar de un cambio brusco.

---

## Prevención de Flash en `layout.tsx`

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){
      try {
        var s = localStorage.getItem('dc-theme');

        var t = s
          ? JSON.parse(s).state?.theme
          : 'dark';

        if (t !== 'light') {
          document.documentElement
            .classList
            .add('dark');
        }
      } catch(e) {
        document.documentElement
          .classList
          .add('dark');
      }
    })()`
  }}
/>
```

Este script inline se ejecuta antes de que React hidrate la aplicación, aplicando inmediatamente la clase correcta y evitando el “flash blanco” para usuarios en modo oscuro.

---

## Configuración de Tailwind

```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        display: [
          'var(--font-fraunces)',
          'Georgia',
          'serif'
        ],

        sans: [
          'var(--font-dm-sans)',
          'system-ui',
          'sans-serif'
        ],

        mono: [
          'var(--font-dm-mono)',
          'monospace'
        ],
      },
    },
  },

  plugins: [],
}
```

---

## Tipografías

- `font-display` (Fraunces) — headings, logo y títulos
- `font-sans` (DM Sans) — texto general
- `font-mono` (DM Mono) — chips tecnológicos, código y metadata

---

## Utilidad `cn()`

```typescript
// lib/utils.ts

import { clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

Utiliza `cn()` para clases condicionales:

```tsx
<button
  className={cn(
    'dc-btn-ghost py-2 px-4',

    isActive &&
      'border-[--brand] text-[--brand]',

    disabled &&
      'opacity-50 cursor-not-allowed'
  )}
>
```

---

## Buenas Prácticas

1. **Los colores siempre deben provenir de variables CSS**  
   Nunca hardcodear colores hexadecimales en componentes.

2. **El layout siempre debe venir de Tailwind**  
   Flex, grid, spacing y border-radius deben usar clases utilitarias.

3. **Los patrones deben venir del sistema de diseño**  
   Utilizar `.dc-card`, `.dc-btn-primary`, `.dc-input` antes de crear estilos personalizados.

4. **Usar `cn()` para clases condicionales**  
   No interpolación manual de strings.

5. **Breakpoints responsive mobile-first**  
   Estilos por defecto para móvil, `sm:` para 640+, `lg:` para 1024+.

6. **No usar inline styles para layout**  
   La prop `style` debe usarse solo para valores dinámicos que Tailwind no pueda manejar (por ejemplo variables CSS).
# Testing

Este documento cubre la estrategia de testing para DevConnect Web, las herramientas recomendadas y ejemplos prácticos para cada capa de la aplicación.

---

## Estado Actual

El proyecto actualmente no incluye una suite de tests. Esto es intencional para un MVP en etapa temprana — la prioridad fue lanzar un producto funcional. Este documento define la estrategia de testing a implementar conforme el proyecto madure.

Si eres un colaborador interesado en agregar tests, esta es la guía que debes seguir.

---

## Filosofía de Testing

Seguimos el enfoque **Testing Trophy** (popularizado por Kent C. Dodds):

```text
         /\
        /  \
       / E2E \          ← Pocos (solo flujos críticos)
      /────────\
     /Integration\      ← La mayoría de los tests viven aquí
    /──────────────\
   /   Unit Tests   \   ← Solo lógica pura
  /──────────────────\
 / Static (TS/ESLint)\ ← Ya implementado
```

### Guía práctica

- **Tests unitarios** para funciones utilitarias puras y esquemas Zod
- **Tests de integración** (React Testing Library) para componentes con interacción significativa
- **Tests E2E** (Playwright) solo para los flujos críticos felices (`register → apply → accept`)

### No testeamos

- Detalles de implementación (estado interno, funciones privadas)
- Componentes triviales sin lógica (`<Spinner />`)
- Librerías de terceros

---

## Herramientas Recomendadas

| Herramienta | Propósito |
|---|---|
| **Jest** | Runner de tests + assertions |
| **React Testing Library (RTL)** | Testing de componentes centrado en el usuario |
| **MSW (Mock Service Worker)** | Mocking de APIs para tests de integración |
| **Playwright** | Tests end-to-end en navegador |
| **@testing-library/jest-dom** | Matchers DOM extendidos (`toBeInTheDocument`, `toHaveValue`, etc.) |

---

## Instalación

```bash
yarn add -D \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  ts-jest
```

---

## Configuración de Jest (`jest.config.ts`)

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './'
})

const config: Config = {
  coverageProvider: 'v8',

  testEnvironment: 'jsdom',

  setupFilesAfterFramework: [
    '<rootDir>/jest.setup.ts'
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

---

## Archivo de Setup (`jest.setup.ts`)

```typescript
import '@testing-library/jest-dom'
```

---

# Qué Testear

---

## Capa 1: Utilidades (Tests Unitarios)

Las funciones puras sin efectos secundarios son las mejores candidatas para tests unitarios.

---

## `lib/utils.ts` — `cn()` y `formatDate()`

```typescript
// __tests__/lib/utils.test.ts

import {
  cn,
  formatDate
} from '@/app/lib/utils'

describe('cn()', () => {

  it('fusiona class names', () => {
    expect(cn('foo', 'bar'))
      .toBe('foo bar')
  })

  it('ignora valores falsy', () => {
    expect(
      cn(
        'foo',
        false && 'bar',
        null,
        undefined
      )
    ).toBe('foo')
  })

  it('maneja clases condicionales', () => {
    const isActive = true

    expect(
      cn(
        'base',
        isActive && 'active'
      )
    ).toBe('base active')
  })
})

describe('formatDate()', () => {

  it('formatea una fecha ISO en inglés', () => {
    const result = formatDate(
      '2024-01-15T10:00:00.000Z',
      'en'
    )

    expect(result)
      .toBe('Jan 15, 2024')
  })

  it('formatea una fecha ISO en español', () => {
    const result = formatDate(
      '2024-01-15T10:00:00.000Z',
      'es'
    )

    expect(result)
      .toBe('15 ene 2024')
  })
})
```

---

## Esquemas Zod (`useNewProject.ts`)

```typescript
// __tests__/hooks/useNewProject.schema.test.ts

import { schema } from '@/app/hooks/useNewProject'

describe('NewProject schema', () => {

  it('acepta datos válidos', () => {

    const result = schema.safeParse({
      title:       'My Project',
      description: 'At least 10 chars here',
      status:      'idea',
    })

    expect(result.success)
      .toBe(true)
  })

  it('rechaza títulos mayores a 100 caracteres', () => {

    const result = schema.safeParse({
      title:       'x'.repeat(101),
      description: 'Valid description here',
    })

    expect(result.success)
      .toBe(false)

    expect(result.error?.issues[0].path)
      .toContain('title')
  })

  it('rechaza descripciones menores a 10 caracteres', () => {

    const result = schema.safeParse({
      title:       'Valid',
      description: 'Short',
    })

    expect(result.success)
      .toBe(false)
  })
})
```

---

# Capa 2: Componentes
## (Tests de Integración con RTL)

Testeamos componentes desde la perspectiva del usuario — qué ve y con qué interactúa.

---

## `components/ui/Badge.tsx`

```typescript
// __tests__/components/ui/Badge.test.tsx

import {
  render,
  screen
} from '@testing-library/react'

import {
  ProjectStatusBadge
} from '@/app/components/ui/Badge'

import {
  ProjectStatus
} from '@/app/types/enums'

describe('ProjectStatusBadge', () => {

  it('renderiza correctamente "building" en inglés', () => {

    render(
      <ProjectStatusBadge
        status={ProjectStatus.BUILDING}
        locale="en"
      />
    )

    expect(
      screen.getByText('Building')
    ).toBeInTheDocument()
  })

  it('renderiza correctamente en español', () => {

    render(
      <ProjectStatusBadge
        status={ProjectStatus.LAUNCHED}
        locale="es"
      />
    )

    expect(
      screen.getByText('Lanzado')
    ).toBeInTheDocument()
  })
})
```

---

## `components/profile/ProfileSkills.tsx`

```typescript
// __tests__/components/profile/ProfileSkills.test.tsx

import {
  render,
  screen
} from '@testing-library/react'

import {
  ProfileSkills
} from '@/app/components/profile/ProfileSkills'

// Mock useI18n
jest.mock('@/app/i18n', () => ({
  useI18n: () => ({
    t: {
      profile: {
        skillsLabel: 'Skills'
      }
    }
  }),
}))

const mockSkills = [
  { id: '1', name: 'TypeScript' },
  { id: '2', name: 'React' },
]

describe('ProfileSkills', () => {

  it('renderiza todas las skills', () => {

    render(
      <ProfileSkills skills={mockSkills} />
    )

    expect(
      screen.getByText('TypeScript')
    ).toBeInTheDocument()

    expect(
      screen.getByText('React')
    ).toBeInTheDocument()
  })

  it('no renderiza nada si el array está vacío', () => {

    const { container } = render(
      <ProfileSkills skills={[]} />
    )

    expect(container)
      .toBeEmptyDOMElement()
  })

  it('no renderiza nada si skills es null', () => {

    const { container } = render(
      <ProfileSkills skills={null as any} />
    )

    expect(container)
      .toBeEmptyDOMElement()
  })
})
```

---

## `components/auth/LoginFormModal.tsx` — usando MSW

```typescript
// __tests__/components/auth/LoginFormModal.test.tsx

import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { setupServer } from 'msw/node'
import {
  http,
  HttpResponse
} from 'msw'

import {
  LoginForm
} from '@/app/components/auth/LoginFormModal'

const server = setupServer(

  http.post(
    'http://localhost:3000/api/auth/login',

    () => {
      return HttpResponse.json({
        success: true,
        data: {
          message: 'OK'
        }
      })
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('@/app/i18n', () => ({
  useI18n: () => ({
    t: {
      auth: {
        email: 'Email',
        password: 'Password',
        loginBtn: 'Sign In',
        loading: 'Loading...'
      }
    }
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('LoginForm', () => {

  it('muestra errores de validación al enviar vacío', async () => {

    const user = userEvent.setup()

    render(
      <LoginForm
        onSwitch={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: /sign in/i
      })
    )

    await waitFor(() => {

      expect(
        screen.getAllByRole('alert')
      ).toHaveLength(2)
    })
  })

  it('envía correctamente con credenciales válidas', async () => {

    const user = userEvent.setup()

    const onSuccess = jest.fn()

    render(
      <LoginForm
        onSwitch={jest.fn()}
        onSuccess={onSuccess}
      />
    )

    await user.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    )

    await user.type(
      screen.getByLabelText(/password/i),
      'password123'
    )

    await user.click(
      screen.getByRole('button', {
        name: /sign in/i
      })
    )

    await waitFor(() => {

      expect(onSuccess)
        .toHaveBeenCalledTimes(1)
    })
  })
})
```

---

# Capa 3: Hooks Personalizados

Los hooks pueden testearse usando `renderHook`:

```typescript
// __tests__/hooks/useDebounce.test.ts

import {
  renderHook,
  act
} from '@testing-library/react'

import {
  useDebounce
} from '@/app/hooks/useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {

  it('retorna inmediatamente el valor inicial', () => {

    const { result } = renderHook(
      () => useDebounce('hello', 300)
    )

    expect(result.current)
      .toBe('hello')
  })

  it('aplica debounce a las actualizaciones', () => {

    const {
      result,
      rerender
    } = renderHook(

      ({ value }) =>
        useDebounce(value, 300),

      {
        initialProps: {
          value: 'hello'
        }
      }
    )

    rerender({ value: 'world' })

    expect(result.current)
      .toBe('hello')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current)
      .toBe('world')
  })
})
```

---

# Ejecutar Tests

```bash
# Ejecutar todos los tests
yarn test

# Watch mode
yarn test --watch

# Coverage
yarn test --coverage

# Ejecutar archivo específico
yarn test __tests__/lib/utils.test.ts
```

---

# Convención de Ubicación de Tests

Coloca los archivos de tests dentro de `__tests__/` replicando la estructura del código fuente:

```text
__tests__/
├── lib/
│   └── utils.test.ts
├── hooks/
│   └── useDebounce.test.ts
└── components/
    ├── ui/
    │   └── Badge.test.tsx
    └── profile/
        └── ProfileSkills.test.tsx
```

También puedes colocar los tests junto al archivo fuente usando sufijos `.test.ts` o `.test.tsx`.

---

# Guías de Mocking

---

## Mock de `useI18n()`

```typescript
jest.mock('@/app/i18n', () => ({
  useI18n: () => ({
    t: {
      /* solo las claves utilizadas */
    },

    locale: 'en',
  }),
}))
```

---

## Mock de navegación de Next.js

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),

  useParams: () => ({
    id: 'test-id'
  }),

  usePathname: () => '/projects',
}))
```

---

## Mock de Stores Zustand

```typescript
jest.mock('@/app/store/auth.store', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      fullName: 'Test User',
      email: 'test@example.com'
    },

    isAuthenticated: true,

    logout: jest.fn(),
  }),
}))
```

---

## Usar MSW para llamadas API

Evita mockear `axios` o `httpClient` directamente.

MSW intercepta a nivel de red, lo que permite testear el flujo real de integración API:

```typescript
const server = setupServer(

  http.get(
    'http://localhost:3000/api/projects',

    () =>
      HttpResponse.json({
        success: true,

        data: {
          data: [],

          meta: {
            total: 0,
            limit: 12,
            offset: 0,
            totalPages: 0
          }
        }
      })
  )
)
```
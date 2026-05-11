# Testing

This document covers the testing strategy for DevConnect Web, the tools recommended, and practical examples for each layer of the application.

---

## Current State

The project ships without a test suite. This is intentional for an early-stage MVP — the priority was shipping a working product. This document defines the testing strategy to implement as the project matures.

If you are a contributor looking to add tests, this is the guide to follow.

---

## Testing Philosophy

We follow the **Testing Trophy** approach (popularized by Kent C. Dodds):

```
         /\
        /  \
       / E2E \          ← Few (critical paths only)
      /────────\
     /Integration\      ← Most tests live here
    /──────────────\
   /   Unit Tests   \   ← For pure logic only
  /──────────────────\
 /    Static (TS/ESLint)\  ← Already in place
```

**Practical guidance:**
- **Unit tests** for pure utility functions and Zod schemas
- **Integration tests** (React Testing Library) for components with meaningful interaction
- **E2E tests** (Playwright) only for the critical happy paths (register → apply → accept)

We do **not** test:
- Implementation details (internal state, private functions)
- Trivial components with no logic (a `<Spinner />` that renders a single div)
- Third-party libraries

---

## Recommended Tools

| Tool | Purpose |
|---|---|
| **Jest** | Test runner + assertions |
| **React Testing Library (RTL)** | Component testing (user-centric) |
| **MSW (Mock Service Worker)** | API mocking for integration tests |
| **Playwright** | End-to-end browser tests |
| **@testing-library/jest-dom** | Extended DOM matchers (`toBeInTheDocument`, `toHaveValue`, etc.) |

### Installation

```bash
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw ts-jest
```

### Jest Configuration (`jest.config.ts`)

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

### Setup File (`jest.setup.ts`)

```typescript
import '@testing-library/jest-dom'
```

---

## What to Test

### Layer 1: Utilities (Unit Tests)

Pure functions with no side effects are the best candidates for unit tests.

**`lib/utils.ts` — `cn()` and `formatDate()`**

```typescript
// __tests__/lib/utils.test.ts
import { cn, formatDate } from '@/app/lib/utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar', null, undefined)).toBe('foo')
  })

  it('handles conditional classes', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
  })
})

describe('formatDate()', () => {
  it('formats an ISO date string for English locale', () => {
    const result = formatDate('2024-01-15T10:00:00.000Z', 'en')
    expect(result).toBe('Jan 15, 2024')
  })

  it('formats an ISO date string for Spanish locale', () => {
    const result = formatDate('2024-01-15T10:00:00.000Z', 'es')
    expect(result).toBe('15 ene 2024')
  })
})
```

**Zod schemas (from `useNewProject.ts`)**

```typescript
// __tests__/hooks/useNewProject.schema.test.ts
import { schema } from '@/app/hooks/useNewProject'

describe('NewProject schema', () => {
  it('accepts valid data', () => {
    const result = schema.safeParse({
      title:       'My Project',
      description: 'At least 10 chars here',
      status:      'idea',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a title over 100 characters', () => {
    const result = schema.safeParse({
      title:       'x'.repeat(101),
      description: 'Valid description here',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('title')
  })

  it('rejects a description under 10 characters', () => {
    const result = schema.safeParse({
      title:       'Valid',
      description: 'Short',
    })
    expect(result.success).toBe(false)
  })
})
```

### Layer 2: Components (Integration Tests with RTL)

Test components from the user's perspective — what they see and interact with, not implementation details.

**`components/ui/Badge.tsx` — `ProjectStatusBadge`**

```typescript
// __tests__/components/ui/Badge.test.tsx
import { render, screen } from '@testing-library/react'
import { ProjectStatusBadge } from '@/app/components/ui/Badge'
import { ProjectStatus } from '@/app/types/enums'

describe('ProjectStatusBadge', () => {
  it('renders the correct label for "building" status in English', () => {
    render(<ProjectStatusBadge status={ProjectStatus.BUILDING} locale="en" />)
    expect(screen.getByText('Building')).toBeInTheDocument()
  })

  it('renders the correct label in Spanish', () => {
    render(<ProjectStatusBadge status={ProjectStatus.LAUNCHED} locale="es" />)
    expect(screen.getByText('Lanzado')).toBeInTheDocument()
  })
})
```

**`components/profile/ProfileSkills.tsx`**

```typescript
// __tests__/components/profile/ProfileSkills.test.tsx
import { render, screen } from '@testing-library/react'
import { ProfileSkills } from '@/app/components/profile/ProfileSkills'

// Mock useI18n
jest.mock('@/app/i18n', () => ({
  useI18n: () => ({ t: { profile: { skillsLabel: 'Skills' } } }),
}))

const mockSkills = [
  { id: '1', name: 'TypeScript' },
  { id: '2', name: 'React' },
]

describe('ProfileSkills', () => {
  it('renders all skill names', () => {
    render(<ProfileSkills skills={mockSkills} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('renders nothing when skills array is empty', () => {
    const { container } = render(<ProfileSkills skills={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when skills is null', () => {
    const { container } = render(<ProfileSkills skills={null as any} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

**`components/auth/LoginFormModal.tsx` — with MSW**

```typescript
// __tests__/components/auth/LoginFormModal.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { LoginForm } from '@/app/components/auth/LoginFormModal'

const server = setupServer(
  http.post('http://localhost:3000/api/auth/login', () => {
    return HttpResponse.json({ success: true, data: { message: 'OK' } })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('@/app/i18n', () => ({
  useI18n: () => ({ t: { auth: { email: 'Email', password: 'Password', loginBtn: 'Sign In', loading: 'Loading...' } } }),
}))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

describe('LoginForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSwitch={jest.fn()} onSuccess={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getAllByRole('alert')).toHaveLength(2)  // email + password
    })
  })

  it('submits successfully with valid credentials', async () => {
    const user   = userEvent.setup()
    const onSuccess = jest.fn()
    render(<LoginForm onSwitch={jest.fn()} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })
})
```

### Layer 3: Custom Hooks

Test hooks using `@testing-library/react`'s `renderHook`:

```typescript
// __tests__/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/app/hooks/useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('debounces updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    )

    rerender({ value: 'world' })
    expect(result.current).toBe('hello')  // not yet updated

    act(() => { jest.advanceTimersByTime(300) })
    expect(result.current).toBe('world')  // now updated
  })
})
```

---

## Running Tests

```bash
# Run all tests
yarn test

# Watch mode (re-runs on file change)
yarn test --watch

# With coverage report
yarn test --coverage

# Run a specific file
yarn test __tests__/lib/utils.test.ts
```

---

## Test File Location Convention

Place test files in `__tests__/` mirroring the source structure:

```
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

Alternatively, co-locate tests next to source files using `.test.ts` / `.test.tsx` suffixes — both conventions work with the Jest configuration above.

---

## Mocking Guidelines

### Mock `useI18n()` in every component test

```typescript
jest.mock('@/app/i18n', () => ({
  useI18n: () => ({
    t: { /* only the keys your component uses */ },
    locale: 'en',
  }),
}))
```

### Mock Next.js navigation

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useParams:  () => ({ id: 'test-id' }),
  usePathname: () => '/projects',
}))
```

### Mock Zustand stores

```typescript
jest.mock('@/app/store/auth.store', () => ({
  useAuthStore: () => ({
    user:            { id: '1', fullName: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    logout:          jest.fn(),
  }),
}))
```

### Use MSW for API calls

Avoid mocking `axios` or `httpClient` directly. MSW intercepts at the network level, which tests your actual API integration code:

```typescript
const server = setupServer(
  http.get('http://localhost:3000/api/projects', () =>
    HttpResponse.json({
      success: true,
      data: { data: [], meta: { total: 0, limit: 12, offset: 0, totalPages: 0 } }
    })
  )
)
```

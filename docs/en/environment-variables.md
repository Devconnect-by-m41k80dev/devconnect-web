# Environment Variables

DevConnect Web uses a minimal set of environment variables. This document covers every variable, what it does, and how to configure it for each environment.

---

## Overview

Next.js uses two types of environment variables:

- **`NEXT_PUBLIC_*`** — exposed to the browser. These are embedded into the client bundle at build time. Anyone can see them in the browser's DevTools.
- **Non-prefixed** — server-only. Never exposed to the client. Used in Server Components, Route Handlers, and Middleware.

DevConnect currently only has one variable, and it is `NEXT_PUBLIC_`:

---

## Variables Reference

### `NEXT_PUBLIC_API_URL`

| Field | Value |
|---|---|
| **Required** | Yes |
| **Type** | URL string (no trailing slash) |
| **Exposed to browser** | Yes |
| **Default fallback** | `http://localhost:3000/api` |

**What it does:**

Sets the base URL for all API requests. Every call made through the HTTP client uses this URL as the prefix.

```typescript
// lib/http/http-client.ts
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
```

**Examples:**

```env
# Local development
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Staging
NEXT_PUBLIC_API_URL=https://api-staging.devconnect.dev/api

# Production
NEXT_PUBLIC_API_URL=https://api.devconnect.dev/api
```

> **Note:** Do not include a trailing slash. The HTTP client constructs paths like `/projects`, `/auth/login`, etc. — a trailing slash would result in double slashes.

---

## Environment Files

Next.js loads environment files in the following order (higher priority overrides lower):

| File | Purpose | Committed to git? |
|---|---|---|
| `.env` | Base defaults for all environments | ✅ Yes (only non-secret defaults) |
| `.env.local` | Local overrides — never committed | ❌ No |
| `.env.development` | Development-specific values | ✅ Yes (if non-secret) |
| `.env.production` | Production-specific values | ✅ Yes (if non-secret) |
| `.env.development.local` | Local dev overrides | ❌ No |
| `.env.production.local` | Local production overrides | ❌ No |

**For local development**, create `.env.local`:

```bash
cp .env.example .env.local
```

`.env.local` is listed in `.gitignore` and will never be committed.

---

## `.env.example`

The repository includes a `.env.example` file with all variables and their descriptions:

```env
# ============================================================
# DevConnect Web — Environment Variables
# ============================================================
# Copy this file to .env.local and fill in the values.
# Never commit .env.local to version control.
# ============================================================

# Base URL of the DevConnect API (no trailing slash)
# Local development: http://localhost:3000/api
# Production example: https://api.devconnect.dev/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Production Setup

### Vercel (recommended)

In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**
2. Add each variable with its production value
3. Select the environments it applies to (Production, Preview, Development)
4. Redeploy — Vercel injects variables at build time

```
Variable Name            Value
NEXT_PUBLIC_API_URL      https://api.devconnect.dev/api
```

### Other Platforms

Set environment variables according to your platform's documentation. For Docker:

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://api.devconnect.dev/api
```

For a systemd service or a `.env` file on the server, remember that `NEXT_PUBLIC_*` variables are **baked into the build bundle** — they cannot be changed at runtime without rebuilding. Always set them before running `next build`.

---

## Security Notes

1. **`NEXT_PUBLIC_*` variables are public.** The API URL is not sensitive — it will be visible in the browser anyway since every API request goes to it. Do not put secrets here.

2. **The JWT secret lives in the backend.** The frontend never needs to know the JWT signing secret. Authentication is handled entirely by HttpOnly cookies — the browser manages them automatically and JavaScript cannot read them.

3. **Never put the following in `NEXT_PUBLIC_*`:**
   - Database credentials
   - API secret keys
   - Payment provider secrets
   - Email service credentials

   These belong in the backend (NestJS), not the frontend.

---

## Validating Environment Variables at Startup

Currently, the app has a single fallback for the missing variable:

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
```

If your team grows, consider adding startup validation:

```typescript
// lib/env.ts
const requiredVars = ['NEXT_PUBLIC_API_URL'] as const

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
}
```

This fails fast at startup with a clear error instead of silent undefined behavior.

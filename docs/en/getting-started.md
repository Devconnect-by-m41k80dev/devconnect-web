# Getting Started

This guide covers everything you need to run DevConnect Web locally — from zero to a working development environment.

---

## Prerequisites

Make sure you have the following installed before continuing:

| Tool | Minimum version | How to check |
|---|---|---|
| Node.js | 18.0.0 | `node --version` |
| Yarn | 1.22.0 | `yarn --version` |
| Git | Any | `git --version` |

You also need the **DevConnect API** running locally. The frontend is a pure API consumer — it does nothing without the backend.

→ Backend setup: [devconnect-api-nestjs — Getting Started](https://github.com/M41k80/devconnect-api-nestjs/blob/main/docs/getting-started.md)

The API must be accessible at `http://localhost:3000/api` before you start the frontend.

---

## Step 1 — Clone the Repository

If you are a **contributor**, fork first, then clone your fork:

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/devconnect-web.git
cd devconnect-web
git remote add upstream https://github.com/M41k80/devconnect-web.git
```

If you just want to run it locally:

```bash
git clone https://github.com/M41k80/devconnect-web.git
cd devconnect-web
```

---

## Step 2 — Install Dependencies

```bash
yarn install
```

This installs all dependencies listed in `package.json`. The project uses Yarn as its package manager. Do not use `npm install` — it will create a `package-lock.json` and conflict with the `yarn.lock` file.

---

## Step 3 — Configure Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Open `.env.local` and set the following:

```env
# The base URL of the DevConnect API — no trailing slash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

That's the only required variable for local development. See [environment-variables.md](environment-variables.md) for the full reference including production variables.

---

## Step 4 — Start the Development Server

```bash
yarn dev
```

Next.js will start on port `3001` (it auto-increments if the port is taken). Open [http://localhost:3001](http://localhost:3001) in your browser.

You should see the DevConnect landing page. If the backend is also running, login and registration will work immediately.

---

## Step 5 — Verify the Setup

To confirm everything is working:

1. Open [http://localhost:3001](http://localhost:3001) — the landing page loads
2. Click **Get Started** — the registration modal opens
3. Register an account — you are redirected to `/projects`
4. Open [http://localhost:3001/projects](http://localhost:3001/projects) — the project list loads

If step 3 or 4 fails, the backend is likely not running or not accessible. Check that `NEXT_PUBLIC_API_URL` points to the correct address.

---

## Development Workflow

### File watching

`yarn dev` uses Next.js's built-in hot module replacement. Changes to components, hooks, and styles reflect in the browser instantly without a full reload.

### TypeScript checking

Next.js performs TypeScript checking during build, not during `yarn dev`. To check types while developing:

```bash
# Type-check without building
npx tsc --noEmit
```

### Linting

```bash
yarn lint
```

This runs ESLint with the Next.js configuration. Fix all warnings before opening a PR.

---

## Project Scripts Reference

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build the production bundle |
| `yarn start` | Serve the production build (requires `yarn build` first) |
| `yarn lint` | Run ESLint across all source files |

---

## Common Setup Problems

### `ECONNREFUSED` errors in the browser console

The frontend can't reach the backend.

- Is the API running? (`yarn start:dev` in the API repo)
- Is `NEXT_PUBLIC_API_URL` correct in `.env.local`?
- Is there a port conflict? (default: `3000` for API, `3001` for web)

### `Module not found` errors

Try deleting and reinstalling dependencies:

```bash
rm -rf node_modules .next
yarn install
yarn dev
```

### TypeScript errors after pulling changes

A teammate may have added new types. Run:

```bash
npx tsc --noEmit
```

Read the errors and update your code accordingly.

### Port already in use

Next.js auto-increments to the next available port. Check the terminal output for the actual URL.

Or specify a port explicitly:

```bash
yarn dev -p 3002
```

---

## What to Explore First

Once the app is running, here's a suggested path to understand the codebase:

1. **`src/proxy.ts`** — the middleware that protects routes before they render
2. **`src/app/layout.tsx`** — the root layout that wraps everything
3. **`src/app/lib/http/`** — the HTTP client and interceptors
4. **`src/app/store/auth.store.ts`** — how auth state is managed
5. **`src/app/(public)/projects/page.tsx`** — a representative page using the hook pattern

→ Continue to [Project Structure](project-structure.md) for a full explanation of every folder.

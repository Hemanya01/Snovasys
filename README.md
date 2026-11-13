# BalanceVault Frontend

A responsive React + Vite admin dashboard prototype for the SNOVASYS BalanceVault challenge.

## Run locally (no Docker required)

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`. Deploy that folder to Vercel, Netlify, or another static hosting provider.

## Included screens

- Overview dashboard and account metrics
- Account listing, search, status filter, create-account modal
- Onboarding review with approve/reject interactions
- Users & roles overview
- Audit log viewer and search
- Workspace settings overview
- Responsive sidebar and mobile layout

## Important prototype boundary

This is a frontend-only prototype. Data is held in React state and resets on refresh. Authentication, authorization, account persistence, audit integrity, database migrations, Prisma, PostgreSQL, Redis rate limiting, and financial transaction processing are **not implemented**. Do not use this prototype with real financial data or present its mock interactions as secure backend functionality.

## Backend integration points

Replace local state and handlers in `src/App.jsx` with API calls:
- `POST /api/auth/login`
- `GET /api/accounts`, `POST /api/accounts`
- `GET /api/onboarding`, `PATCH /api/onboarding/:id`
- `GET /api/users`, `PATCH /api/users/:id/role`
- `GET /api/audit-logs`

Enforce authorization and validate every operation on the server. Never trust frontend role checks.

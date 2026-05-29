# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16**, which has breaking changes from prior versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Do not assume API conventions from older versions.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build — run this to verify TypeScript and compilation
npm run lint         # ESLint
npm run seed         # Re-seed the database with sample data

npx prisma generate          # Regenerate Prisma client after schema changes
npx tsx prisma/migrate.ts    # Apply schema changes to Turso (use this, NOT prisma db push)
npx tsc --noEmit             # Type-check without emitting files
```

> **Do not use `npx prisma db push` against Turso** — the Prisma CLI does not support `libsql://` URLs. Use `prisma/migrate.ts` instead, which applies SQL directly via `@libsql/client`.

## Environment variables

| Variable | Local (`.env`) | Vercel (injected by Turso integration) |
|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` | `db_v3_TURSO_DATABASE_URL` |
| `TURSO_AUTH_TOKEN` | your token | `db_v3_TURSO_AUTH_TOKEN` |

`src/lib/prisma.ts` checks `db_v3_` prefixed names first (Vercel), then falls back to the unprefixed names (local). Both point to the same Turso cloud database.

To pull Vercel's env vars locally: `vercel env pull .env.development.local`

## Architecture

### Data flow
Pages are **React Server Components** that call Server Actions directly to fetch data. There is no API route layer — the page renders, calls the action, and passes results to components as props.

```
page.tsx (RSC) → actions.ts ("use server") → src/lib/prisma.ts → Turso cloud
```

Client Components (`"use client"`) are used only at the leaf level for interactivity: forms, delete buttons, the sync button. They call the same Server Actions for mutations.

### Prisma setup (Prisma 7)
Prisma 7 uses a driver adapter pattern — `PrismaClient` **must** be constructed with an adapter or it throws. The singleton in `src/lib/prisma.ts` wraps `PrismaLibSql` from `@prisma/adapter-libsql`.

```typescript
// Always import from here — never instantiate PrismaClient directly
import { prisma } from "@/lib/prisma";
```

The generated client lives at `src/generated/prisma/client` (not `@prisma/client`). Types (`Transaction`, `StockAsset`) are imported from `@/generated/prisma/client`. The client is generated at install time via the `postinstall` script in `package.json`.

After any schema change: update `prisma/migrate.ts` with the new SQL, run it, then run `npx prisma generate`.

### Server Actions pattern
All mutations and queries live in two files:
- `src/app/transactions/actions.ts` — transaction CRUD
- `src/app/portfolio/actions.ts` — portfolio CRUD + `syncStockPrices()`

Every mutation calls `revalidatePath("/")` and the relevant route path so the dashboard and the affected page both get fresh data.

### Stock prices
`src/lib/api.ts` wraps `yahoo-finance2`. It always returns `number | null` — never throws. `syncStockPrices()` uses `Promise.allSettled` so one failed ticker doesn't abort the rest. The `lastPrice` in the DB is the fallback when the API returns null.

### Styling
Tailwind CSS v4. Use the `cn()` helper from `@/lib/utils` for conditional class merging. Inline `style` props are used for dynamic values Tailwind can't generate statically (e.g. percentage widths for progress bars).

### Page rendering
All three pages export `export const dynamic = "force-dynamic"` — required to prevent static prerendering on Vercel so pages fetch live data on every request.

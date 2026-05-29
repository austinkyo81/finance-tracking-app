# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16**, which has breaking changes from prior versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Do not assume API conventions from older versions.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build — run this to verify TypeScript and compilation
npm run lint         # ESLint
npm run seed         # Re-seed the local SQLite database with sample data

npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Apply schema changes to the database (no migration file created)
npx tsc --noEmit     # Type-check without emitting files
```

## Environment variables

| Variable | Local default | Production |
|---|---|---|
| `TURSO_DATABASE_URL` | `file:./dev.db` | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | _(empty)_ | Turso auth token |

For local dev, these fall back to a local SQLite file (`dev.db`) — no `.env` needed unless overriding. For Vercel, set both in the dashboard.

## Architecture

### Data flow
Pages are **React Server Components** that call Server Actions directly to fetch data. There is no API route layer — the page renders, calls the action, and passes results to components as props.

```
page.tsx (RSC) → actions.ts ("use server") → src/lib/prisma.ts → Turso/SQLite
```

Client Components (`"use client"`) are used only at the leaf level for interactivity: forms, delete buttons, the sync button. They import and call the same Server Actions for mutations.

### Prisma setup (Prisma 7)
Prisma 7 uses a driver adapter pattern instead of a binary engine. The client **must** be constructed with an adapter — calling `new PrismaClient()` with no arguments will throw.

```typescript
// Always import from here — never instantiate PrismaClient directly in app code
import { prisma } from "@/lib/prisma";
```

The generated client lives at `src/generated/prisma/client` (not the usual `@prisma/client`). Types (`Transaction`, `StockAsset`) are imported from `@/generated/prisma/client`.

After any schema change: run `npx prisma db push && npx prisma generate`.

### Server Actions pattern
All mutations and queries live in two files:
- `src/app/transactions/actions.ts` — transaction CRUD
- `src/app/portfolio/actions.ts` — portfolio CRUD + `syncStockPrices()`

Every mutation calls `revalidatePath("/")` and the relevant route path so the dashboard and the affected page both get fresh data.

### Stock prices
`src/lib/api.ts` wraps `yahoo-finance2`. It always returns `number | null` — never throws. The caller (`syncStockPrices`) uses `Promise.allSettled` so one failed ticker doesn't abort the rest. The `lastPrice` in the DB is used as the fallback when the API returns null.

### Styling
Tailwind CSS v4. Use the `cn()` helper from `@/lib/utils` for conditional class merging. Inline `style` props are used for dynamic values that Tailwind can't generate statically (e.g. percentage widths for progress bars, per-transaction color values).

### Page rendering
All three pages have `export const dynamic = "force-dynamic"` to prevent static prerendering on Vercel. Without this, data would be frozen at build time.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16**, which has breaking changes from prior versions. Do not assume API conventions from older versions.

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
Pages are **React Server Components** that call Server Actions directly to fetch data. There is no API route layer.

```
page.tsx (RSC) → actions.ts ("use server") → src/lib/prisma.ts → Turso cloud
```

Client Components (`"use client"`) are used only at the leaf level for interactivity: `TransactionForm`, `PortfolioForm`, `SyncButton`, and the two delete buttons. They call the same Server Actions for mutations.

**Critical RSC constraint:** Never add `onClick`, `onChange`, `onMouseEnter`, or any other event handler props to elements inside Server Components. Use Tailwind hover/focus classes instead (e.g. `hover:bg-slate-700/40`). Violating this causes a runtime 500 error, not a TypeScript error.

### Prisma setup (Prisma 7)
Prisma 7 uses a driver adapter pattern — `PrismaClient` **must** be constructed with an adapter or it throws. The singleton in `src/lib/prisma.ts` wraps `PrismaLibSql` from `@prisma/adapter-libsql`.

```typescript
// Always import from here — never instantiate PrismaClient directly
import { prisma } from "@/lib/prisma";
```

The generated client lives at `src/generated/prisma/client` (not `@prisma/client`). Types (`Transaction`, `StockAsset`) are imported from `@/generated/prisma/client`. The client is generated at install time via the `postinstall` script.

After any schema change: update `prisma/migrate.ts` with the new SQL, run it, then run `npx prisma generate`.

### Server Actions pattern
All mutations and queries live in two files:
- `src/app/transactions/actions.ts` — transaction CRUD
- `src/app/portfolio/actions.ts` — portfolio CRUD + `syncStockPrices()`

Every mutation calls `revalidatePath("/")` and the relevant route path so the dashboard and the affected page both get fresh data.

### Stock prices
`src/lib/api.ts` wraps `yahoo-finance2`. It always returns `number | null` — never throws. `syncStockPrices()` uses `Promise.allSettled` so one failed ticker doesn't abort the rest. The `lastPrice` in the DB is the fallback when the API returns null.

### Page rendering
All three pages export `export const dynamic = "force-dynamic"` — required to prevent static prerendering on Vercel so pages fetch live data on every request.

## Styling

**Stack:** Tailwind CSS v4 + inline `style` props for values Tailwind can't generate statically (e.g. percentage widths, dynamic colors).

- Use `cn()` from `@/lib/utils` for conditional class merging.
- CSS variables are defined in `@theme inline {}` in `src/app/globals.css` (Tailwind v4 syntax — no `@tailwind base/components/utilities`).

### Design system (dark fintech theme)

| Token | Value |
|---|---|
| Background | `#0F172A` (slate-900) |
| Surface (cards) | `#1E293B` (slate-800) |
| Surface raised | `#334155` (slate-700) |
| Border | `rgba(255,255,255,0.08)` |
| Text primary | `#F8FAFC` |
| Text secondary | `#94A3B8` |
| Text muted | `#64748B` |
| Accent / CTA | `#2563EB` (blue-600) |
| Income green | `#34D399` |
| Expense red | `#FB7185` |

**Fonts:** IBM Plex Sans (headings + body, variable `--font-display` / `--font-body`) + DM Mono (numbers, tickers, variable `--font-mono`).

**Card pattern:**
```tsx
<div style={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }} className="rounded-2xl overflow-hidden">
```

**Row hover pattern (RSC-safe):**
```tsx
className="... transition-colors duration-150 hover:bg-slate-700/40"
```

### UI component library
Reusable primitives in `src/components/ui/`:
- `Button` — variants: `primary` (solid blue with glow), `default`, `danger`, `success`, `ghost`
- `Input` — dark bg (`#0f172a`), slate-700 border, blue focus ring
- `Select` — same dark treatment as Input, with `ChevronDown` overlay and `appearance-none`
- `Card` — dark surface wrapper with optional title and `headerAction` slot

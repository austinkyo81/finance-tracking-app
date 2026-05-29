---
name: project-finance-tracker
description: Architecture and stack details for the Personal Finance & Portfolio Tracker Next.js project
metadata:
  type: project
---

Personal Finance & Portfolio Tracker built with Next.js 16 (App Router), TypeScript strict mode, Prisma 7 + SQLite + better-sqlite3 adapter.

**Why:** Personal finance dashboard — tracks income/expense transactions and a stock portfolio with live price syncing.

**How to apply:** Any backend work here follows the patterns below. Do not touch frontend files (page.tsx, layout.tsx, components).

## Key paths
- Prisma schema: `prisma/schema.prisma` (output to `src/generated/prisma`)
- Prisma singleton: `src/lib/prisma.ts` — always import `{ prisma }` from here, never construct a new PrismaClient
- Generated client types: `src/generated/prisma/client` — `Transaction` and `StockAsset` types live here
- Utility helpers: `src/lib/utils.ts` (formatCurrency, formatDate, formatMonth, cn)
- Stock price fetcher: `src/lib/api.ts` (fetchStockPrice via yahoo-finance2)
- Transaction server actions: `src/app/transactions/actions.ts`
- Portfolio server actions: `src/app/portfolio/actions.ts`

## Data models (SQLite via Prisma 7)
- `Transaction`: id (uuid), type (String: "INCOME"|"EXPENSE"), amount (Float), category (String), description (String?), date (DateTime), createdAt (DateTime)
- `StockAsset`: id (uuid), ticker (String @unique), shares (Float), lastPrice (Float @default(0.0)), updatedAt (DateTime @updatedAt)

## Patterns established
- Server Actions use `"use server"` directive at file top and `revalidatePath` from `next/cache`
- Revalidate both `"/"` and the route-specific path (e.g. `"/portfolio"`) after every mutation
- `addStockAsset` uses Prisma `upsert` on the unique `ticker` field to handle duplicates
- `syncStockPrices` uses `Promise.allSettled` for fault-tolerant parallel price fetching; returns `{ updated: number; errors: string[] }`
- yahoo-finance2 v3: `import yahooFinance from "yahoo-finance2"` then `yahooFinance.quote(ticker)` — `regularMarketPrice` is `number | undefined`
- `cn()` helper uses clsx + tailwind-merge (`ClassValue` type from clsx)
- `formatCurrency`/`formatDate`/`formatMonth` use `Intl` APIs (no external dependencies)

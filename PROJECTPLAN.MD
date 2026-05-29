# Technical Specification: Personal Finance & Portfolio Tracker

## 1. System Architecture & Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS
- **State Management/Data Fetching:** React Server Components + Server Actions
- **Icons:** Lucide React
- **Stock API:** yahoo-finance2 (no API key required)

## 2. Directory Structure

```
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── transactions/
│   │   └── portfolio/
│   ├── components/
│   │   ├── ui/
│   │   ├── DashboardSummary.tsx
│   │   ├── TransactionForm.tsx
│   │   └── PortfolioTable.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
└── package.json
```

## 3. Database Schema (Prisma / SQLite)

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Transaction {
  id          String   @id @default(uuid())
  type        String   // "INCOME" or "EXPENSE"
  amount      Float
  category    String
  description String?
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
}

model StockAsset {
  id        String   @id @default(uuid())
  ticker    String   @unique
  shares    Float
  lastPrice Float    @default(0.0)
  updatedAt DateTime @updatedAt
}
```

## 4. External Stock API Integration

- **Provider:** yahoo-finance2 (no key needed)
- **Fallback:** Return last known `lastPrice` from DB if API fails

## 5. Phased Implementation Plan

> Run compilation and DB migrations after each phase before proceeding.

### Phase 1: Environment & DB Setup
- [ ] Initialize Next.js app with TypeScript and Tailwind CSS
- [ ] Install dependencies: `@prisma/client`, `prisma`, `lucide-react`, `clsx`, `tailwind-merge`, `yahoo-finance2`
- [ ] Initialize Prisma, apply schema, run `npx prisma db push`
- [ ] Create seed file (`prisma/seed.ts`) with sample transactions and stocks

### Phase 2: Core Financial Ledger
- [ ] Build Server Actions in `src/app/transactions/actions.ts` (Create, Read, Delete)
- [ ] Build `TransactionForm` component (category dropdown: Rent, Food, Subscriptions, Utilities, Entertainment, Salary, Other)
- [ ] Build ledger table grouped by month

### Phase 3: Stock Portfolio Engine
- [ ] Create `src/lib/api.ts` for yahoo-finance2 stock price fetching
- [ ] Build Server Actions in `src/app/portfolio/actions.ts` (add/edit positions)
- [ ] Add "Sync Prices" button to update all `lastPrice` values

### Phase 4: Unified Dashboard
- [ ] Edit `src/app/page.tsx` for unified state
- [ ] Summary Cards: Net Income, Portfolio Value, Net Worth
- [ ] Expense category percentage bars

## 6. Verification Criteria (Definition of Done)

- [ ] Adding an expense deducts from Dashboard Cash Flow
- [ ] Valid ticker × shares = correct portfolio value
- [ ] `npm run build` passes with zero type errors

---

> **Rules:**
> - Use available skills/agents
> - Verify each phase compiles and runs before proceeding
> - Always refer back to this file when uncertain

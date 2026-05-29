Technical Specification: Personal Finance & Portfolio Tracker
1. System Architecture & Tech Stack

To ensure a self-contained, high-performance local or web environment, the application will use a modern TypeScript monorepo architecture:

    Framework: Next.js (App Router) for unified full-stack capabilities.

    Language: TypeScript (Strict mode enabled).

    Database: SQLite via Prisma ORM (lightweight, zero-config file database).

    Styling: Tailwind CSS for rapid, clean interface design.

    State Management/Data Fetching: React Server Components + Server Actions.

    Icons: Lucide React.

2. Directory Structure

Claude Code should initialize and follow this repository layout:

├── prisma/
│   └── schema.prisma        # Database models
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout & navbar
│   │   ├── page.tsx         # Combined Dashboard
│   │   ├── transactions/    # Income/Expense CRUD pages
│   │   └── portfolio/       # Stock Portfolio CRUD pages
│   ├── components/
│   │   ├── ui/              # Reusable UI elements (Button, Input, Card)
│   │   ├── DashboardSummary.tsx
│   │   ├── TransactionForm.tsx
│   │   └── PortfolioTable.tsx
│   ├── lib/
│   │   ├── api.ts           # External Stock API client (Yahoo Finance/Alpha Vantage)
│   │   └── utils.ts         # Formatting utilities (currency, dates)
└── package.json


3. Database Schema (Prisma / SQLite)

Define the following tables in prisma/schema.prisma:

"datasource db {
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
  category    String   // Rent, Food, Subscriptions, Salary, etc.
  description String?
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
}

model StockAsset {
  id          String   @id @default(uuid())
  ticker      String   @unique // e.g., "AAPL"
  shares      Float
  lastPrice   Float    @default(0.0)
  updatedAt   DateTime @updatedAt
}"

4. External Stock API Integration

    Provider: Use a lightweight node fetch module targeting Alpha Vantage or Yahoo Finance (via a library like yahoo-finance2 or a public fallback endpoint).

    Strategy: Implement a fallback caching mechanism. If the daily API limit is reached or keys are missing, gracefully return the last known lastPrice from the database.

5. Phased Implementation Plan for Claude Code

    Prompt for Claude Code: "Please execute the following implementation plan step-by-step. Run compilation and database migrations after each phase to verify runtime context integrity."

Phase 1: Environment & DB Setup

    [ ] Initialize the Next.js app with TypeScript and Tailwind CSS.

    [ ] Install dependencies: @prisma/client, prisma, lucide-react, clsx, tailwind-merge.

    [ ] Initialize Prisma, paste the schema above, and run npx prisma db push.

    [ ] Create a seed file (prisma/seed.ts) with sample transactions (Food, Rent, Salary) and a few stocks (AAPL, MSFT) to populate the UI.

Phase 2: Core Financial Ledger (Backend Actions & UI)

    [ ] Build Server Actions in src/app/transactions/actions.ts for Create, Read, and Delete transactions.

    [ ] Build the TransactionForm component using Tailwind styling. Ensure category selection includes a dropdown with Rent, Food, Subscriptions, Utilities, Entertainment, Salary, and Other.

    [ ] Build a ledger table showing history grouped by month.

Phase 3: Stock Portfolio Engine

    [ ] Create a utility service in src/lib/api.ts to fetch end-of-day stock closing prices.

    [ ] Build Server Actions in src/app/portfolio/actions.ts to add/edit stock positions (Ticker, Shares).

    [ ] Implement a background trigger or a "Sync Prices" button that calls the API, updates lastPrice for all rows in StockAsset, and saves them back to SQLite.

Phase 4: Unified Dashboard Implementation

    [ ] Edit src/app/page.tsx to construct the unified state.

    [ ] Calculate Summary Cards:

        Total Net Income: Sum of INCOME transactions minus EXPENSE transactions.

        Total Portfolio Value: Sum of all StockAsset.shares * StockAsset.lastPrice.

        Net Worth Balance: Total Net Income + Total Portfolio Value.

    [ ] Add a modern visual overview breakdown (e.g., simple CSS-based percentage bars for expense categories like Food and Subscriptions vs. total spend).

6. Verification Criteria (Definition of Done)

Before finishing, Claude Code must verify that:

    Adding an expense immediately deducts from the Dashboard's Cash Flow metrics.

    Entering a valid stock ticker correctly multiples the shares count by the fetched daily close price.

    No type errors remain when running npm run build.

*** PLEASE USE AVAILABLE SKILLS / AGENTS FOR THIS PROJECT
*** MAKE SURE TO CHECK  / VERIFY EVERY PROGRESS SHOULD WORK AND NO ERROR BEFORE PROGRESS TO NEXT PHASE
*** PLEASE SAVE THE PLAN IN MARKDOWN AND NAME IT "PROJECTPLAN.MD"
*** SHOULD ALWAYS REFER TO THE "PROJECTPLAN.MD" IF YOU NOT SURE. 
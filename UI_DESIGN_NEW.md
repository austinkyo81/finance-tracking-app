# Technical Specification & Design System: Personal Finance & Portfolio Tracker

## 1. System Architecture & Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS
- **State Management/Data Fetching:** React Server Components + Server Actions
- **Icons:** Lucide React
- **Stock API:** yahoo-finance2 (no API key required)

---

## 2. Directory Structure

```
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── transactions/
│   │       └── page.tsx
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

---

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

---

## 4. UI Design System Tokens (Inspired by app_design_03.jpg)

### Color Palette & Design Tokens
- **Main Layout Background:** Vibrant, deep celestial blue sky-to-royal-blue gradient canvas.
  - *Tailwind Configuration:* `bg-gradient-to-b from-[#1A4B9F] via-[#2563EB] to-[#3B82F6]`
- **Foreground Card Panels:** Crisp, solid white containers with highly rounded modern edges.
  - *Tailwind Configuration:* `bg-white rounded-t-[2.5rem] shadow-xl text-slate-900`
- **Accent / Target Colors:** Bright, neon mint green used for growth trends, primary tracker highlights, and positive cash flow indicators.
  - *Tailwind Configuration:* `text-[#3DE3B2]` or `bg-[#3DE3B2]`
- **Activity Items Background:** Soft, uniform off-white container tints to isolate grid elements without harsh dark dividing lines.
  - *Tailwind Configuration:* `bg-slate-50 border border-slate-100/50`
- **Navigation Tray:** Floating dark pill-shaped tray anchored at the bottom with clean, minimal monochromatic icon layouts.
  - *Tailwind Configuration:* `bg-slate-950/90 backdrop-blur-md rounded-full px-6 py-3`

---

## 5. UI Design Specifications & Core Code Codebase For Every Page

### A. Shared Layout Configuration

#### Design Spec:
- A centralized device frame container with responsive padding constraint rules.
- Contains the persistent fixed floating navbar floating relative to the safe-area frame bottom boundary context.

#### `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 15, 23, 42;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(180deg, #1A4B9F 0%, #2563EB 50%, #3B82F6 100%);
  min-height: 100vh;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

#### `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import Link from 'next/link';
import { Wallet, TrendingUp, Landmark } from 'lucide-react';
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Finance & Portfolio Tracker",
  description: "Clean tracking dashboard inspired by high-end design languages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-teal-500/30">
        <main className="max-w-md mx-auto min-h-screen relative flex flex-col px-4 pt-8 pb-24 text-white">
          {children}
          
          {/* Persistent Floating Safe Bottom Navigation Tray Layout */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-950/90 backdrop-blur-md rounded-full px-6 py-3 flex items-center justify-between shadow-2xl border border-white/5 z-50">
            <Link href="/" className="text-white p-2 hover:text-teal-300 transition-colors">
              <Landmark className="w-5 h-5" />
            </Link>
            <Link href="/transactions" className="text-slate-400 p-2 hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </Link>
            <Link href="/portfolio" className="text-slate-400 p-2 hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
```

---

### B. View 1: Unified Dashboard Main Entry

#### Design Spec:
- **Upper Stack:** Displays greeting metadata along with a central oversized glassmorphic circle container frame featuring an inner accent shadow loop mapping dynamic calculations.
- **Mid Section:** Side-by-side card balances configured with low opacity backgrounds and clear typography metrics.
- **Lower Stack:** High-contrast solid container sheet creating clean visual layering.

#### `src/app/page.tsx`
```tsx
import React from 'react';
import { Wallet, TrendingUp, Landmark, Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const netWorth = 12450.83;
  const cashFlow = 3450.00;
  const portfolioVal = 9000.83;

  return (
    <div className="w-full space-y-6 flex-1 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hello, Investor</h1>
        <p className="text-blue-200 text-xs">You're on track to financial freedom</p>
      </div>

      <div className="flex justify-center my-4">
        <div className="w-56 h-56 rounded-full border-4 border-teal-400/40 flex flex-col items-center justify-center relative bg-white/5 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <Landmark className="w-5 h-5 text-teal-300 mb-2" />
          <span className="text-3xl font-extrabold tracking-tight">${netWorth.toLocaleString()}</span>
          <span className="text-teal-300 text-[10px] font-medium mt-1 tracking-wider uppercase">Net Worth Level</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-200 font-medium">Cash Flow</span>
            <Wallet className="w-4 h-4 text-blue-200" />
          </div>
          <p className="text-lg font-bold text-white">${cashFlow.toFixed(2)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-200 font-medium">Portfolio</span>
            <TrendingUp className="w-4 h-4 text-teal-300" />
          </div>
          <p className="text-lg font-bold text-white">${portfolioVal.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-t-[2.5rem] p-6 text-slate-900 flex-1 -mx-4 shadow-inner mt-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
            <p className="text-xs text-slate-400">Overview Panel</p>
          </div>
          <Link href="/transactions" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <Plus className="w-5 h-5 text-slate-700" />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Netflix Subscription</p>
                <p className="text-[10px] text-slate-400">Subscriptions</p>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-700">-$15.49</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### C. View 2: Transaction Ledger & Intake Form

#### Design Spec:
- **Intake Form Placement:** Mounted at the top section as an inline folding action canvas sheet or container using input controls bounded within isolated container shapes.
- **Fields:** Large bold numbers for raw monetary value declarations. Select element structures omit raw default operating system layout wrappers, relying on customized Tailwind dropdown options.
- **Ledger Stack:** Chronological items arranged inside uniform rows featuring light dividing frames.

#### `src/components/TransactionForm.tsx`
```tsx
import React from 'react';
import { PlusCircle, Tag, DollarSign, FileText } from 'lucide-react';

export default function TransactionForm() {
  return (
    <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-4 shadow-sm text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
        <h3 className="text-sm font-bold text-slate-800">Add Transaction</h3>
        <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold px-2.5 py-0.5 rounded-full uppercase">Ledger Source</span>
      </div>

      <div className="space-y-3">
        {/* Type selector toggle block */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-xl">
          <button type="button" className="py-1.5 text-xs font-bold rounded-lg text-center bg-white shadow-sm text-slate-800">Expense</button>
          <button type="button" className="py-1.5 text-xs font-bold rounded-lg text-center text-slate-600 hover:text-slate-900">Income</button>
        </div>

        {/* Numeric Input */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Amount</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              className="w-full pl-9 pr-4 py-2 bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Category Picklist Selection Layout */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category</label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select className="w-full pl-9 pr-4 py-2 bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
              <option value="Rent">Rent & Living</option>
              <option value="Food">Food & Dining</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary Revenue</option>
              <option value="Other">Other Expenses</option>
            </select>
          </div>
        </div>

        {/* Text Description Box */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <textarea 
              placeholder="Optional notes..." 
              rows={2}
              className="w-full pl-9 pr-4 py-2 bg-white text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
        </div>
      </div>

      <button 
        type="button" 
        className="w-full py-2.5 bg-[#1A4B9F] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#153e85] transition-colors shadow-md"
      >
        <PlusCircle className="w-4 h-4" />
        Commit Ledger Item
      </button>
    </div>
  );
}
```

#### `src/app/transactions/page.tsx`
```tsx
import React from 'react';
import TransactionForm from '@/components/TransactionForm';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="w-full space-y-6 flex-1 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ledger Stream</h1>
        <p className="text-blue-200 text-xs">Manage cash operations records</p>
      </div>

      {/* Embedded Input Component View */}
      <TransactionForm />

      {/* Core Ledger Listing Sheet */}
      <div className="bg-white rounded-t-[2.5rem] p-6 text-slate-900 flex-1 -mx-4 shadow-inner space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transactions Records Log</h2>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Grocery Shopping</p>
                <p className="text-[10px] text-slate-400">Food & Dining • Today</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-slate-700">-$64.20</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Consulting Remittance</p>
                <p className="text-[10px] text-slate-400">Salary Revenue • Yesterday</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-emerald-600">+$1,200.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### D. View 3: Portfolio Asset Tracking Board

#### Design Spec:
- **Upper Sheet:** Total value display using high typography scale contrast matching the center indicator's core structure.
- **Control Bar:** Features an elevated action button linking price tracking components seamlessly.
- **Holdings Stream:** Renders individual portfolio nodes within standard responsive block grids with clean green labels pointing to live delta adjustments.

#### `src/app/portfolio/page.tsx`
```tsx
import React from 'react';
import { RefreshCw, ArrowUpRight, TrendingUp, Sliders } from 'lucide-react';

export default function PortfolioPage() {
  const assets = [
    { ticker: 'AAPL', shares: 12, lastPrice: 175.50, total: 2106.00, performance: '+1.25%' },
    { ticker: 'MSFT', shares: 8, lastPrice: 420.22, total: 3361.76, performance: '+0.88%' },
    { ticker: 'NVDA', shares: 4, lastPrice: 875.12, total: 3500.48, performance: '+4.52%' },
  ];

  return (
    <div className="w-full space-y-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Portfolio</h1>
          <p className="text-blue-200 text-xs">Market Engine Asset Tracker</p>
        </div>
        <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 flex items-center gap-1.5 text-xs font-bold transition-all">
          <RefreshCw className="w-3.5 h-3.5 text-teal-300" />
          Sync Valuations
        </button>
      </div>

      {/* Hero Financial Metric Box Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
        <span className="text-xs text-blue-200 font-medium">Aggregate Holdings Evaluation</span>
        <div className="text-4xl font-extrabold tracking-tight my-1 text-white">$8,968.24</div>
        <div className="flex items-center gap-1 text-xs text-[#3DE3B2] font-semibold mt-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time market delta outperforming expectations</span>
        </div>
      </div>

      {/* Allocations Data Sheet Container */}
      <div className="bg-white rounded-t-[2.5rem] p-6 text-slate-900 flex-1 -mx-4 shadow-inner space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Position Ledger Blocks</h2>
          <Sliders className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-3">
          {assets.map((asset) => (
            <div key={asset.ticker} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center">
                  {asset.ticker}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{asset.ticker} Asset Unit</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{asset.shares} Units Retained</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">${asset.total.toFixed(2)}</p>
                <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  {asset.performance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Phased Implementation Strategy

> **Rule:** Compile app binaries and run DB migrations after each phase before proceeding. Do not build higher metrics without verification.

### Phase 1: Environment & DB Setup
- Initialize Next.js app with TypeScript and Tailwind CSS matching the styling constraints above.
- Install dependencies: `@prisma/client`, `prisma`, `lucide-react`, `clsx`, `tailwind-merge`, `yahoo-finance2`.
- Initialize Prisma, apply provided database schema layout, run `npx prisma db push`.

### Phase 2: Core Financial Ledger
- Setup Ledger Actions to handle persistence workflows cleanly.
- Mount the Transaction Form UI routing user data straight to sqlite databases.

### Phase 3: Stock Portfolio Engine
- Bind yahoo-finance API handlers into server runtime systems.
- Connect interface actions directly to the Sync balance component workflows.

### Phase 4: Unified Dashboard Balance Orchestration
- Wire up tracking engines calculating and displaying real-time aggregated valuations instantly.
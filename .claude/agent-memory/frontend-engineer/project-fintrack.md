---
name: project-fintrack
description: FinTrack personal finance and portfolio tracker — frontend architecture, stack, and conventions established
metadata:
  type: project
---

FinTrack is a Next.js 16 App Router app for personal finance and stock portfolio tracking.

**Stack:**
- Next.js 16 App Router, TypeScript strict
- Tailwind CSS v4 (`@import "tailwindcss"` directive — no config file needed)
- Lucide React for icons (`lucide-react`)
- `clsx` + `tailwind-merge` via `cn()` at `@/lib/utils`
- Google Fonts: IBM Plex Sans (display + body, weights 300-700), DM Mono (mono — numbers/tickers)

**Design system (dark professional fintech theme — updated):**
- Body background: `linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)` fixed; `color-scheme: dark`
- Dark surface cards: `backgroundColor: "#1e293b"`, `border: "1px solid rgba(255,255,255,0.08)"`, `boxShadow: "0 8px 32px rgba(0,0,0,0.3)"` — no more white cards
- Table/form header rows use `backgroundColor: "rgba(15,23,42,0.5)"` for slight depth
- Page titles: `color: "#f8fafc"`, subtitles: `color: "#64748b"`
- Net worth hero: `42px` `#f8fafc` text directly on dark gradient, subtitle `#64748b`
- Card section headers: `text-xs font-semibold uppercase tracking-widest`, `color: "#64748b"`
- Income: `#34d399` (emerald-400), Expenses: `#fb7185` (rose-400), Portfolio/Accent: `#60a5fa` (blue-400)
- CTA blue: `#2563eb` (blue-600) with `boxShadow: "0 4px 14px rgba(37,99,235,0.4)"`
- Category badges on dark: semi-transparent tinted pills e.g. Rent: `rgba(96,165,250,0.12)` bg / `#93c5fd` text
- Expense chart bars: distinct named colors per category (`#60a5fa` blue, `#34d399` green, `#a78bfa` purple, `#fbbf24` amber, `#fb7185` rose) — not semi-transparent white
- Month headers: `color: "#94a3b8"`, separator line `rgba(255,255,255,0.08)`
- Row hover: `backgroundColor: "rgba(51,65,85,0.4)"` via inline onMouseEnter/Leave (not Tailwind class — dynamic)
- Row borders: `"1px solid rgba(255,255,255,0.06)"`
- Bottom tab bar: dark frosted glass `rgba(15,23,42,0.85)` + `backdrop-blur(20px)` + `border rgba(255,255,255,0.08)`, active item: text `#60a5fa`, bg pill `rgba(37,99,235,0.15)`, dot `#60a5fa`
- Inputs/Selects: `bg-slate-900` (`#0f172a`), `border-slate-700`, text `#f8fafc`, placeholder `#64748b`, focus ring `#3b82f6` + `box-shadow rgba(37,99,235,0.2)`
- Type toggle in forms: `bg-slate-900` track, active pill `#1e293b` with income/expense tinted border
- Buttons: primary = `#2563eb` + blue glow; danger = `#1f0a0d`/`#fb7185`; success = `#052e16`/`#34d399`; ghost = transparent/`#94a3b8`; all get `cursor-pointer hover:brightness-110`
- Quick stats on Transactions page: income `rgba(6,78,59,0.3)` bg + `rgba(52,211,153,0.2)` border; expense `rgba(76,5,25,0.3)` bg + `rgba(251,113,133,0.2)` border

**Key paths:**
- Server actions: `@/app/transactions/actions` and `@/app/portfolio/actions`
- Types: `Transaction` and `StockAsset` from `@/generated/prisma/client` (or inline type aliases)
- Utils: `formatCurrency`, `formatDate`, `formatMonth`, `cn` all at `@/lib/utils`
- UI primitives: `@/components/ui/Button`, `@/components/ui/Input`, `@/components/ui/Select`, `@/components/ui/Card` — **PascalCase filenames, imports must use PascalCase** (the original lowercase imports were pre-existing TS errors that got fixed)

**Architecture decisions:**
- All pages are Server Components; forms/delete buttons are Client Components
- NavBar is bottom tab bar (`fixed bottom-0`), Client Component due to `usePathname`
- `layout.tsx` wraps `<main className="flex-1 pb-28">` to account for bottom nav height
- Delete buttons split into small Client Components co-located in `src/app/` routes
- Forms use `useTransition` + `useRef` pattern for pending state and form reset
- Inline `style` props used heavily because Tailwind v4 can't generate dark-mode dynamic values statically
- Row hover effects use inline `onMouseEnter`/`onMouseLeave` because dynamic color values can't be expressed as static Tailwind classes

**How to apply:** New cards use dark surface (`#1e293b` bg, `rgba(255,255,255,0.08)` border). All text on the dark theme: primary `#f8fafc`, secondary `#94a3b8`, muted `#64748b`. No white cards. Numbers/tickers always use DM Mono with `tabular-nums`.

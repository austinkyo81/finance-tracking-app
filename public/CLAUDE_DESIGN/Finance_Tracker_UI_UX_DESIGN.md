# Handoff: Personal Finance & Portfolio Tracker (Mobile)

## Overview
A mobile-first personal finance app that tracks net worth, cash flow, transactions, a stock portfolio, and spending analytics. The design language is a deep-blue celestial gradient canvas with neon-mint growth accents, glassmorphic stat cards, and crisp white rounded-top "sheets" that hold list content. Navigation is a floating dark pill at the bottom with a center quick-add action.

The product has four primary screens — **Dashboard**, **Transactions (Ledger)**, **Portfolio**, **Analytics** — plus a **Quick Add** bottom-sheet modal.

---

## About the Design Files
The file in this bundle (`Finance Tracker.html`) is a **design reference created in HTML/CSS/vanilla JS** — a prototype demonstrating the intended look, layout, and interaction behavior. It is **not production code to copy directly**.

The task is to **recreate this design in the target codebase's environment** using its established patterns and libraries. The original technical spec targets:
- **Next.js (App Router)** + **TypeScript (strict)**
- **Tailwind CSS** for styling
- **Prisma ORM + SQLite** for persistence
- **Lucide React** for icons
- **yahoo-finance2** for live stock prices (no API key)
- **React Server Components + Server Actions** for data

If you are working in that stack, map the visual design onto it. If a different environment already exists, recreate the designs using that codebase's conventions instead.

---

## Fidelity
**High-fidelity (hifi).** Colors, typography scale, spacing, radii, and interactions are final. Recreate the UI pixel-faithfully using the codebase's component primitives. The HTML uses inline SVG icons that should be swapped for **Lucide React** equivalents (mapping noted per component below).

---

## Screens / Views

### Shared Layout
- **Frame:** mobile viewport, max-width ~390px, centered. App content sits on the blue gradient; list-heavy content sits inside a white sheet that starts mid-screen and extends to the bottom.
- **Status bar:** time `1:47` left; signal/wifi/battery icons right. (Native device chrome — omit in a real build; shown only in the mock.)
- **Bottom nav:** persistent floating dark pill, fixed near the safe-area bottom. 5 slots: Home, Transactions, **Add (+ center, mint)**, Portfolio, Analytics. Active item is white with a small mint dot beneath it.
- **White sheet pattern:** `border-radius: 34px 34px 0 0`, full-bleed width, `box-shadow: 0 -10px 40px rgba(8,30,70,.25)`, top padding 24px, bottom padding 130px (clears the nav).

---

### 1. Dashboard (`/`)
**Purpose:** At-a-glance financial health and recent activity.

**Layout (top → bottom):**
1. **Greeting header** — `padding: 6px 22px`. Left: `h1` "Hello, Olivia" (27px / 700 / -0.5px tracking) + subtitle "You're on track to financial freedom" (13px, `rgba(219,234,254,.8)`). Right: 42×42 circular glass avatar with a user glyph.
2. **Net-worth ring** — centered, 236×236.
   - SVG ring: track `rgba(255,255,255,.16)` 6px; progress stroke a mint linear-gradient (`#3DE3B2` → `#67e8c4`) 6px, rounded caps, `stroke-dasharray: 678.5`, `stroke-dashoffset: 170` (≈75%). A 6px mint dot marks the head.
   - Inner glass disc (`inset: 20px`): radial white highlight, 1px white border, inner shadows. Content centered: a small emblem (💎 in mock — replace with a brand/Lucide mark), "Total Net Worth" (12.5px), value **$12,450** (46px / 800 / -1.5px), and "Wealth Level · 83" in mint uppercase (10px, 1.4px tracking).
3. **Week selector** — `padding: 14px 26px`, 7 day circles 38×38. Default state = dashed 1px white border; selected ("W") = solid white fill, dark text, drop shadow; past/dim days = solid faint border, muted text.
4. **Stat cards** — 2-col grid, 12px gap, `padding: 0 22px`. Each: glass card `rgba(255,255,255,.12)`, 1px `rgba(255,255,255,.16)` border, `border-radius: 22px`, `backdrop-filter: blur(10px)`, 15px padding. Top row = label (12px, light blue) + icon. Below: value (20px / 700). Delta line (11px / 600) mint for positive.
   - Card A — **Cash Flow** `$3,450.00`, `▲ +12.4% this month` (Wallet icon).
   - Card B — **Portfolio** `$9,000.83`, `▲ +4.5% today` (TrendingUp icon, mint).
5. **White sheet — "Recent Activity"** — header `h2` 18px/700 + muted subline "Today, 30 May 2026 · 4 records"; right: dark circular **+** button (opens Quick Add). Then 4 activity rows.

**Activity row component** (reused across Dashboard & Transactions):
- Container: `background:#F8FAFC`, 1px `rgba(241,245,249,.9)` border, `border-radius: 20px`, `padding: 13px 14px`, 10px bottom margin. Hover → `#EEF4FF`.
- Left: 42×42 rounded-square badge (`border-radius: 13px`) tinted by type, then name (14.5px/600) + category·time meta (11px, `#94A3B8`).
- Right: amount (15px/700). Expense = ink with `−` prefix; income = `#059669` with `+` prefix.
- Badge color tokens: red `#FEE2E2/#EF4444`, green `#D1FAE5/#059669`, blue `#DBEAFE/#2563EB`, violet `#EDE9FE/#7C3AED`, amber `#FEF3C7/#D97706`.
- Sample rows: Netflix Subscription −$15.49 (red), Salary Deposit +$3,200.00 (green), Grocery Shopping −$64.20 (amber), NVDA Dividend +$48.00 (violet).

---

### 2. Transactions / Ledger (`/transactions`)
**Purpose:** Add transactions and review the full ledger.

**Layout:**
1. **Header** — `h1` "Ledger Stream" + subtitle "Manage your cash operations".
2. **Add Transaction form card** (`margin: 0 22px`) — `background:#F8FAFC`, 1px `#F1F5F9` border, `border-radius: 26px`, 18px padding.
   - Form header: "Add Transaction" (15px/700) + a "Ledger Source" chip (10px/800 uppercase, blue `#2563EB` on `#DBEAFE`, pill). Bottom border `#E9EEF5`.
   - **Type toggle:** 2-col segmented control on `#E7EDF5` track, 4px padding, `border-radius: 14px`. Active button = white, ink text, `box-shadow: 0 2px 8px rgba(15,23,42,.1)`. Options: **Expense** (default) / **Income**.
   - **Amount field:** label (10px/700 uppercase, `#94A3B8`). Input is large: 30px/800/-1px, leading `$` glyph at 26px. White bg, 1px `#E2E8F0`, `border-radius: 14px`. Focus → border `#2563EB` + 4px `rgba(37,99,235,.12)` ring.
   - **Category select:** custom-styled native select (`appearance:none`) with chevron-down on the right. Options: Rent & Living, Food & Dining, Subscriptions, Utilities, Entertainment, Salary Revenue, Other.
   - **Description:** single-line text input, placeholder "Optional notes…".
   - **Submit:** full-width button, `background:#1A4B9F`, white, `border-radius: 16px`, 15px padding, `box-shadow: 0 10px 22px -8px rgba(26,75,159,.7)`. Label "Commit Ledger Item" with a plus-circle icon. Hover → `#153e85`, lift 1px.
3. **White sheet — "Transaction Records Log"** (section label 11px/700 uppercase `#94A3B8`): list of activity rows (same component as Dashboard). Samples: Grocery Shopping −$64.20, Consulting Remittance +$1,200.00, Netflix −$15.49, Electric Bill −$88.40, Coffee & Brunch −$23.10.

---

### 3. Portfolio (`/portfolio`)
**Purpose:** Track stock holdings and aggregate value.

**Layout:**
1. **Header** — `h1` "Stock Portfolio" + subtitle "Market engine asset tracker". Right: **Sync** button (glass `rgba(255,255,255,.12)`, 1px white border, `border-radius: 13px`, mint refresh icon). On click, the icon spins 360° over ~0.6s (wire to a Server Action that refreshes prices via yahoo-finance2).
2. **Hero value card** — glass card (same tokens as stat cards but 26px radius, 20px/22px padding). Caption "Aggregate Holdings Evaluation" (12px), value **$8,968.24** (38px/800/-1.5px), trend line in mint: "+$248.16 (2.85%) outperforming today" with TrendingUp icon.
3. **White sheet — "Position Ledger Blocks"** with a sliders/filter icon at right. List of holding rows.

**Holding row component:**
- Same row container as activity rows.
- Left: 46×46 ticker tile (`border-radius: 14px`) with the symbol in 12px/800. Per-ticker tints — AAPL slate `#F1F5F9/#0F172A`, MSFT blue `#DBEAFE/#1D4ED8`, NVDA green `#DCFCE7/#15803D`, GOOG amber `#FEF3C7/#B45309`, TSLA red `#FEE2E2/#B91C1C`. Then company name (14.5px/600) + "{shares} shares · ${price}" meta.
- Right: total value (15px/700) above a delta pill — positive `#047857` on `#D1FAE5` (border `#A7F3D0`) with an up-arrow; negative `#B91C1C` on `#FEE2E2` (border `#FECACA`) with the arrow rotated down.
- Data (shares / lastPrice / total / perf):
  - AAPL Apple Inc. — 12 / $175.50 / $2,106.00 / +1.25%
  - MSFT Microsoft — 8 / $420.22 / $3,361.76 / +0.88%
  - NVDA NVIDIA — 4 / $875.12 / $3,500.48 / +4.52%
  - GOOG Alphabet — 6 / $172.40 / $1,034.40 / +0.42%
  - TSLA Tesla — 5 / $178.10 / $890.50 / −1.18%

---

### 4. Analytics (`/analytics`)
**Purpose:** Visualize spending over time and by category.

**Layout:**
1. **Header** — `h1` "Analytics" + subtitle "Where your money moves".
2. **Range segmented control** — glass track, 5 options `D / W / M / 6M / Y` ("W" active = white fill, ink text). 12.5px/700.
3. **Headline block** — kicker "Total Spending" (11px uppercase), value **$1,284** with `/ $2,000 budget` in muted 16px, and range subline "24 – 30 May 2026".
4. **Bar chart** — 170px tall, 7 bars, `padding: 24px 26px`, 10px gap, bars bottom-aligned.
   - Default bar: white→translucent vertical gradient, max-width 30px, `border-radius: 12px`. A value tag floats 22px above each bar (9.5px/700).
   - **"Today" bar:** mint gradient (`#3DE3B2` → `#27c79b`) with `box-shadow: 0 0 22px rgba(61,227,178,.55)`.
   - **Estimate bar (Thu):** transparent fill, 1.5px dashed white border, tag "est".
   - Day labels below (11px, muted). Values: Sun $92(32%), Mon $144(50%), Tue $80(28%), Wed $185(64%), Thu est(80%, ghost), Fri $127(44%), Today $210(72%).
5. **White sheet — "Spending Breakdown"** — header + "Show All" link (12px/700 blue). Four category bars, each: row of name (14px/600) + "$amount · %" (13px/700 `#64748B`), then an 8px progress track (`#E9EEF5`) with a green→mint gradient fill.
   - Rent & Living $620 · 48%; Food & Dining $312 · 24%; Subscriptions $188 · 15%; Utilities $164 · 13%.

---

### Quick Add (bottom-sheet modal)
Triggered by the center nav **+** or the Dashboard sheet **+**.
- Scrim: `rgba(4,12,30,.5)`, slight blur, fades in 0.25s; tap to dismiss.
- Panel: white, `border-radius: 30px 30px 0 0`, slides up 0.32s `cubic-bezier(.2,.8,.2,1)`, max-height 88%, scrollable. Grab handle on top; close-X top-right.
- Title "Quick Add" (19px/700) + subtitle "Log a transaction in seconds".
- Contains the same type toggle, large amount field, and category select as the Transactions form; submit label "Save Transaction".
- On submit: close modal, show a success **toast** (dark `#0F172A` pill, mint check, "Transaction saved") near the bottom for ~1.8s.

---

## Interactions & Behavior
- **Bottom-nav routing:** switches active screen; active button turns white with a mint dot; scroll resets to top on switch.
- **Type toggle:** clicking Expense/Income moves the active state within its segmented control.
- **Quick Add:** open from + buttons; close via scrim, X, or after save. Save → toast.
- **Sync (Portfolio):** triggers a 360° icon spin (~0.7s); hook to a price-refresh action.
- **Analytics range:** D/W/M/6M/Y toggles active state (wire each to re-query the period).
- **Hover states:** rows lighten to `#EEF4FF`; primary buttons darken + lift 1px; glass buttons raise opacity.
- **Animations:** screens fade+rise 0.35s on activate; modal rises 0.32s; toast fades/translates 0.3s.
- **Form validation (to implement):** amount required & numeric > 0; category required; description optional.

## State Management
- `activeScreen`: 'home' | 'tx' | 'port' | 'ana'.
- `txType`: 'EXPENSE' | 'INCOME'; `amount`, `category`, `description` (form fields).
- `modalOpen`: boolean; `toast`: {visible, message}.
- `analyticsRange`: 'D'|'W'|'M'|'6M'|'Y' → drives chart + breakdown queries.
- **Data:** Transactions (type, amount, category, description, date) and StockAssets (ticker, shares, lastPrice, updatedAt) per the Prisma schema in the spec. Dashboard net worth = portfolio value + cash flow aggregate. Portfolio value = Σ(shares × lastPrice). Sync refreshes lastPrice via yahoo-finance2.

## Design Tokens

**Colors**
| Token | Value |
|---|---|
| BG gradient | `linear-gradient(180deg,#1A4B9F 0%, #2563EB 48%, #3B82F6 100%)` (deep→mid→light blue) |
| Blue deep / mid / light | `#1A4B9F` / `#2563EB` / `#3B82F6` |
| Mint accent | `#3DE3B2` (gradient pair `#67e8c4`, deep `#27c79b`) |
| Ink (text) | `#0F172A` |
| Slate 400 / 500 | `#94A3B8` / `#64748B` |
| Slate 50 / 100 | `#F8FAFC` / `#F1F5F9` |
| Nav surface | `rgba(11,18,32,.92)` |
| Glass card | `rgba(255,255,255,.12)` + 1px `rgba(255,255,255,.16)` |
| Positive | `#059669` / pill `#047857` on `#D1FAE5` |
| Negative | `#EF4444` / `#B91C1C` on `#FEE2E2` |

**Typography** — system stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display/Text", Segoe UI, Roboto…`). Scale: hero value 46px/800, page value 38px/800, h1 27px/700, h2 18px/700, stat 20px/700, body 14–15px/600, meta 11–13px, labels 10–11px/700 uppercase with ~0.8–1.4px tracking. Negative letter-spacing (-0.3 to -1.5px) on large numerals.

**Spacing** — screen gutters 22px; card padding 15–22px; row padding 13–14px; gaps 10–12px.

**Radii** — sheets 34px (top corners), cards 22–26px, rows/tiles 13–20px, inputs 14px, buttons 16px, pills/nav fully rounded, badges 13px.

**Shadows** — sheet `0 -10px 40px rgba(8,30,70,.25)`; primary button `0 10px 22px -8px rgba(26,75,159,.7)`; nav `0 18px 40px -10px rgba(0,0,0,.6)`; mint add-button `0 8px 20px -4px rgba(61,227,178,.7)`; focus ring `0 0 0 4px rgba(37,99,235,.12)`.

## Assets
- **Icons:** inline SVG in the mock; replace with **Lucide React**. Mapping — Home→`Home`/`Landmark`, Transactions→`Wallet`, Add→`Plus`, Portfolio→`TrendingUp`, Analytics→`BarChart3`; rows use `ArrowUpRight`/`ArrowDownRight`, `RefreshCw`, `Sliders`, `PlusCircle`, `ShoppingBag`, `CreditCard`. The center-disc emblem (💎 placeholder) should become a brand mark or Lucide glyph.
- **No raster images or fonts** are required; the system font stack and gradients carry the look.

## Files
- `Finance Tracker.html` — full interactive prototype (all 4 screens + Quick Add modal). Open in a browser to inspect exact markup, CSS tokens, and JS interaction logic. All values in this README are drawn directly from it.

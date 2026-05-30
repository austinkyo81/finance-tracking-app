export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import { getStockAssets } from "@/app/portfolio/actions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Wallet,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
} from "lucide-react";
import TransactionDeleteButton from "@/app/transactions/TransactionDeleteButton";

/* ── Badge color map from spec ── */
const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Rent:          { bg: "#dbeafe", color: "#2563eb" },
  Food:          { bg: "#fef3c7", color: "#d97706" },
  Subscriptions: { bg: "#fee2e2", color: "#ef4444" },
  Utilities:     { bg: "#dbeafe", color: "#2563eb" },
  Entertainment: { bg: "#ede9fe", color: "#7c3aed" },
  Salary:        { bg: "#d1fae5", color: "#059669" },
  Other:         { bg: "#f1f5f9", color: "#64748b" },
};

function getBadge(category: string) {
  return BADGE_COLORS[category] ?? { bg: "#f1f5f9", color: "#64748b" };
}

function CategoryIcon({ category }: { category: string }) {
  const cls = "w-[18px] h-[18px]";
  switch (category) {
    case "Salary": return <ArrowUpRight className={cls} />;
    case "Food":   return <ShoppingBag className={cls} />;
    case "Subscriptions": return <CreditCard className={cls} />;
    default:       return <ArrowDownRight className={cls} />;
  }
}

/* ── Net-worth progress ring ── */
function NetWorthRing({ netWorth }: { netWorth: number }) {
  const r = 108;
  const circumference = 2 * Math.PI * r; // ≈ 678.6
  const progress = 0.75; // 75% fill as in spec
  const offset = circumference * (1 - progress);

  return (
    <div className="flex justify-center" style={{ margin: "18px 0 4px" }}>
      <div
        className="relative"
        style={{ width: "236px", height: "236px" }}
      >
        {/* SVG ring */}
        <svg
          width="236"
          height="236"
          viewBox="0 0 236 236"
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="118" cy="118" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="6"
          />
          {/* Progress — mint gradient */}
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3de3b2" />
              <stop offset="100%" stopColor="#67e8c4" />
            </linearGradient>
          </defs>
          <circle
            cx="118" cy="118" r={r}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          {/* Mint dot at head */}
          <circle cx="10" cy="118" r="6" fill="#3de3b2" />
        </svg>

        {/* Glass inner disc */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            inset: "20px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 60%, rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "inset 0 2px 18px rgba(255,255,255,0.25), inset 0 -16px 40px rgba(13,45,99,0.35)",
          }}
        >
          <Landmark className="w-5 h-5 mb-1.5" style={{ color: "#3de3b2" }} aria-hidden="true" />
          <p
            className="text-[12.5px] leading-tight max-w-[130px] mb-1.5"
            style={{ color: "rgba(226,240,255,0.92)" }}
          >
            Total Net Worth
          </p>
          <p
            className="font-extrabold leading-none"
            style={{
              fontSize: "46px",
              letterSpacing: "-1.5px",
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
            }}
          >
            {formatCurrency(Math.abs(netWorth))}
          </p>
          <p
            className="mt-1.5 font-semibold uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "1.4px",
              color: "#3de3b2",
            }}
          >
            Wealth Level · 83
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [transactions, assets] = await Promise.all([
    getTransactions(),
    getStockAssets(),
  ]);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const portfolioValue = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);
  const netCash = totalIncome - totalExpenses;
  const netWorth = netCash + portfolioValue;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* Week selector — compute current day of week */
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
  const jsDay = today.getDay(); // 0=Sun..6=Sat
  // Remap to Mon-based index (0=Mon..6=Sun)
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Greeting header ── */}
      <div
        className="flex items-flex-start justify-between"
        style={{ padding: "6px 22px 0" }}
      >
        <div>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "27px", letterSpacing: "-0.5px" }}
          >
            Hello, Investor
          </h1>
          <p
            className="mt-0.5"
            style={{ fontSize: "13px", color: "rgba(219,234,254,0.8)" }}
          >
            You&apos;re on track to financial freedom
          </p>
        </div>
        {/* Avatar */}
        <div
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{
            width: "42px",
            height: "42px",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Net-worth ring ── */}
      <NetWorthRing netWorth={netWorth} />

      {/* ── Week selector ── */}
      <div
        className="flex justify-between gap-1.5"
        style={{ padding: "14px 26px 16px" }}
        aria-label="Day of week selector"
      >
        {dayNames.map((d, i) => {
          const isPast = i < todayIdx;
          const isToday = i === todayIdx;
          return (
            <div
              key={i}
              className="flex items-center justify-center rounded-full text-sm font-semibold select-none"
              style={{
                width: "38px",
                height: "38px",
                ...(isToday
                  ? {
                      background: "#fff",
                      color: "#0f172a",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                    }
                  : isPast
                  ? {
                      border: "1px solid rgba(255,255,255,0.14)",
                      color: "rgba(255,255,255,0.4)",
                    }
                  : {
                      border: "1px dashed rgba(255,255,255,0.32)",
                      color: "rgba(255,255,255,0.75)",
                    }),
              }}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* ── Stat cards ── */}
      <div
        className="grid grid-cols-2"
        style={{ gap: "12px", padding: "0 22px 6px" }}
      >
        {/* Cash Flow */}
        <div
          className="rounded-[22px]"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "15px 16px",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span style={{ fontSize: "12px", color: "rgba(219,234,254,0.85)", fontWeight: 500 }}>
              Cash Flow
            </span>
            <Wallet className="w-4 h-4" style={{ color: "#bfdbfe" }} aria-hidden="true" />
          </div>
          <p
            className="font-bold text-white"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
            }}
          >
            {netCash >= 0 ? "+" : "−"}{formatCurrency(Math.abs(netCash))}
          </p>
          <p
            className="mt-0.5 font-semibold"
            style={{ fontSize: "11px", color: "#3de3b2" }}
          >
            ▲ net cash position
          </p>
        </div>

        {/* Portfolio */}
        <div
          className="rounded-[22px]"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "15px 16px",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span style={{ fontSize: "12px", color: "rgba(219,234,254,0.85)", fontWeight: 500 }}>
              Portfolio
            </span>
            <TrendingUp className="w-4 h-4" style={{ color: "#3de3b2" }} aria-hidden="true" />
          </div>
          <p
            className="font-bold text-white"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
            }}
          >
            {formatCurrency(portfolioValue)}
          </p>
          <p
            className="mt-0.5 font-semibold"
            style={{ fontSize: "11px", color: "#3de3b2" }}
          >
            ▲ {assets.length} position{assets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── White sheet — Recent Activity ── */}
      <div
        className="sheet animate-fade-in-up"
        style={{ marginTop: "18px" }}
      >
        {/* Sheet header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              className="font-bold"
              style={{ fontSize: "18px", letterSpacing: "-0.3px", color: "#0f172a" }}
            >
              Recent Activity
            </h2>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
              {dateStr} · {recentTransactions.length} records
            </p>
          </div>
          {/* Dark + button */}
          <Link
            href="/transactions"
            aria-label="Add new transaction"
            className="flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-slate-700"
            style={{
              width: "40px",
              height: "40px",
              background: "#0f172a",
              color: "#fff",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Activity rows */}
        <div className="space-y-2.5">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-sm font-medium" style={{ color: "#64748b" }}>No transactions yet</p>
              <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>Add your first transaction above</p>
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const badge = getBadge(tx.category);
              return (
                <div
                  key={tx.id}
                  className="row-item group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Category badge */}
                    <div
                      className="flex shrink-0 items-center justify-center rounded-[13px]"
                      style={{
                        width: "42px",
                        height: "42px",
                        background: badge.bg,
                        color: badge.color,
                      }}
                      aria-hidden="true"
                    >
                      <CategoryIcon category={tx.category} />
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ fontSize: "14.5px", letterSpacing: "-0.2px", color: "#0f172a" }}
                      >
                        {tx.description ?? tx.category}
                      </p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                        {tx.category} · {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        fontSize: "15px",
                        letterSpacing: "-0.3px",
                        color: isIncome ? "#059669" : "#0f172a",
                        fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      }}
                    >
                      {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <TransactionDeleteButton id={tx.id} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all link */}
        {transactions.length > 4 && (
          <Link
            href="/transactions"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold transition-colors duration-150 hover:opacity-75"
            style={{ color: "#2563eb" }}
          >
            View all transactions
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

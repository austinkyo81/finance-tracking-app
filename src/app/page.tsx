export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import { getStockAssets } from "@/app/portfolio/actions";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Wallet, BarChart3, Landmark } from "lucide-react";
import TransactionDeleteButton from "@/app/transactions/TransactionDeleteButton";

const CATEGORY_BAR_COLORS: Record<string, string> = {
  Rent:          "#1a4b9f",
  Food:          "#3de3b2",
  Subscriptions: "#a78bfa",
  Utilities:     "#fbbf24",
  Entertainment: "#fb7185",
  Salary:        "#3de3b2",
  Other:         "#94a3b8",
};
const CYCLING_COLORS = ["#1a4b9f", "#3de3b2", "#a78bfa", "#fbbf24", "#fb7185"];

function getCategoryBarColor(category: string, index: number): string {
  return CATEGORY_BAR_COLORS[category] ?? CYCLING_COLORS[index % CYCLING_COLORS.length];
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

  const expenseMap = new Map<string, number>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      expenseMap.set(t.category, (expenseMap.get(t.category) ?? 0) + t.amount);
    });

  const expensesByCategory = Array.from(expenseMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : null;

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Greeting ── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Hello, Investor
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
          You&apos;re on track to financial freedom
        </p>
      </div>

      {/* ── Circular net worth indicator ── */}
      <div className="flex justify-center my-4">
        <div
          className="w-56 h-56 rounded-full flex flex-col items-center justify-center relative glow-teal"
          style={{
            border: "4px solid rgba(61,227,178,0.35)",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <div
            className="absolute inset-2 rounded-full pointer-events-none"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          />
          <Landmark className="w-5 h-5 mb-2" style={{ color: "#3de3b2" }} />
          <span
            className="text-3xl font-extrabold text-white leading-none"
            style={{
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
              letterSpacing: "-0.03em",
            }}
          >
            {formatCurrency(Math.abs(netWorth))}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest mt-1.5"
            style={{ color: "#3de3b2" }}
          >
            Net Worth Level
          </span>
          <div className="flex gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-30" />
          </div>
        </div>
      </div>

      {/* ── Two-column sub-cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Cash Flow
            </span>
            <Wallet className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
          </div>
          <p
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace", letterSpacing: "-0.02em" }}
          >
            {netCash >= 0 ? "+" : "−"}{formatCurrency(Math.abs(netCash))}
          </p>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Portfolio
            </span>
            <BarChart3 className="w-4 h-4" style={{ color: "#3de3b2" }} />
          </div>
          <p
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace", letterSpacing: "-0.02em" }}
          >
            {formatCurrency(portfolioValue)}
          </p>
        </div>
      </div>

      {/* ── White sliding bottom sheet ── */}
      <div
        className="bg-white -mx-4 flex-1 px-5 pt-6 pb-32"
        style={{
          borderRadius: "2.5rem 2.5rem 0 0",
          boxShadow: "0 -12px 48px rgba(26,75,159,0.12)",
        }}
      >
        {/* Sheet header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Activity
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{dateStr}</p>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs font-semibold transition-colors duration-150 cursor-pointer"
            style={{ color: "#1a4b9f" }}
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Transaction rows */}
        <div className="space-y-2 mb-6">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No transactions yet</p>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === "INCOME";
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3.5 rounded-2xl group cursor-pointer transition-colors duration-150 hover:bg-slate-100"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: isIncome
                        ? "rgba(61,227,178,0.12)"
                        : "rgba(251,113,133,0.10)",
                    }}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
                    ) : (
                      <TrendingDown className="w-4 h-4" style={{ color: "#fb7185" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                      {tx.description ?? tx.category}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tx.category} · {formatDate(tx.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{
                        color: isIncome ? "#10b981" : "#64748b",
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

        {/* Expense allocation bars */}
        {expensesByCategory.length > 0 && (
          <div className="space-y-3 mb-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Expense Allocation
            </h3>
            <div className="space-y-3">
              {expensesByCategory.map((cat, idx) => {
                const barColor = getCategoryBarColor(cat.category, idx);
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-700">{cat.category}</span>
                      <span
                        className="text-slate-500 tabular-nums"
                        style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
                      >
                        {cat.percentage.toFixed(0)}% · {formatCurrency(cat.amount)}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: "6px", backgroundColor: "#e2e8f0" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.percentage}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Savings rate */}
        {savingsRate !== null && (
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ backgroundColor: "#eff6ff", border: "1px solid rgba(26,75,159,0.08)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Savings Rate
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{
                  color: savingsRate >= 0 ? "#10b981" : "#fb7185",
                  fontFamily: "var(--font-mono), 'DM Mono', monospace",
                }}
              >
                {savingsRate}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: "6px", backgroundColor: "#dbeafe" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(0, Math.min(100, savingsRate))}%`,
                  background: "linear-gradient(90deg, #1a4b9f, #3de3b2)",
                }}
              />
            </div>
          </div>
        )}

        {/* Holdings quick view */}
        {assets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Holdings
              </h3>
              <Link
                href="/portfolio"
                className="flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors duration-150"
                style={{ color: "#1a4b9f" }}
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {assets.slice(0, 3).map((asset) => {
                const value = asset.shares * asset.lastPrice;
                const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
                return (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors duration-150 hover:bg-slate-100"
                    style={{ backgroundColor: "#f8fafc" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #1a4b9f, #2563eb)" }}
                    >
                      <span
                        className="text-xs font-bold text-white"
                        style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
                      >
                        {asset.ticker.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold text-slate-800"
                        style={{
                          fontFamily: "var(--font-mono), 'DM Mono', monospace",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {asset.ticker}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {asset.shares.toLocaleString()} shares
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xs font-semibold text-slate-800 tabular-nums"
                        style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
                      >
                        {formatCurrency(value)}
                      </p>
                      <p className="text-[11px] text-slate-400">{pct.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

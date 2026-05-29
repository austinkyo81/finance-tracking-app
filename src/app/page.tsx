export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import { getStockAssets } from "@/app/portfolio/actions";
import DashboardSummary from "@/components/DashboardSummary";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import TransactionDeleteButton from "@/app/transactions/TransactionDeleteButton";

const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  Rent:          { bg: "rgba(96,165,250,0.12)", text: "#93c5fd" },
  Food:          { bg: "rgba(52,211,153,0.12)", text: "#6ee7b7" },
  Subscriptions: { bg: "rgba(167,139,250,0.12)", text: "#c4b5fd" },
  Utilities:     { bg: "rgba(251,191,36,0.12)", text: "#fcd34d" },
  Entertainment: { bg: "rgba(251,113,133,0.12)", text: "#fda4af" },
  Salary:        { bg: "rgba(52,211,153,0.12)", text: "#6ee7b7" },
  Other:         { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
};

function getCategoryBadge(category: string) {
  return CATEGORY_BADGE[category] ?? { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" };
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
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6 px-1">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            letterSpacing: "-0.02em",
            color: "#f8fafc",
          }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
          Financial overview &amp; portfolio summary
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary cards + breakdown — left 2 cols */}
        <div className="lg:col-span-2">
          <DashboardSummary
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            portfolioValue={portfolioValue}
            expensesByCategory={expensesByCategory}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent Activity — dark card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: "#64748b",
                  fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
                }}
              >
                Recent Activity
              </h2>
              <Link
                href="/transactions"
                className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
                style={{ color: "#60a5fa" }}
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm" style={{ color: "#64748b" }}>No transactions yet</p>
              </div>
            ) : (
              <div>
                {recentTransactions.map((tx, idx) => {
                  const isIncome = tx.type === "INCOME";
                  const badge = getCategoryBadge(tx.category);
                  const isLast = idx === recentTransactions.length - 1;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 group cursor-pointer hover:bg-slate-700/40"
                      style={{
                        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isIncome
                            ? "rgba(52,211,153,0.15)"
                            : "rgba(251,113,133,0.15)",
                        }}
                      >
                        {isIncome ? (
                          <TrendingUp className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" style={{ color: "#fb7185" }} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.text,
                            }}
                          >
                            {tx.category}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#475569" }}>
                          {tx.description ?? formatDate(tx.date)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{
                            color: isIncome ? "#34d399" : "#fb7185",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                          }}
                        >
                          {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <TransactionDeleteButton id={tx.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Portfolio quick view — dark card */}
          {assets.length > 0 && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{
                    color: "#64748b",
                    fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
                  }}
                >
                  Holdings
                </h2>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
                  style={{ color: "#60a5fa" }}
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div>
                {assets.slice(0, 4).map((asset, idx) => {
                  const value = asset.shares * asset.lastPrice;
                  const isLast = idx === Math.min(assets.length, 4) - 1;
                  const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;

                  return (
                    <div
                      key={asset.id}
                      className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 cursor-pointer hover:bg-slate-700/40"
                      style={{
                        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "rgba(37,99,235,0.2)" }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{
                            color: "#60a5fa",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                          }}
                        >
                          {asset.ticker.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-semibold"
                          style={{
                            color: "#f8fafc",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {asset.ticker}
                        </p>
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          {asset.shares.toLocaleString()} shares
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-xs font-semibold tabular-nums"
                          style={{
                            color: "#60a5fa",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                          }}
                        >
                          {formatCurrency(value)}
                        </p>
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          {pct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

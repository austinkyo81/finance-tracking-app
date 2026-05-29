export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import { getStockAssets } from "@/app/portfolio/actions";
import DashboardSummary from "@/components/DashboardSummary";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, TrendingUp, TrendingDown } from "lucide-react";
import TransactionDeleteButton from "@/app/transactions/TransactionDeleteButton";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Rent:          { bg: "rgba(251,113,133,0.12)", text: "#fb7185" },
  Food:          { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b" },
  Subscriptions: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa" },
  Utilities:     { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa" },
  Entertainment: { bg: "rgba(244,114,182,0.12)", text: "#f472b6" },
  Salary:        { bg: "rgba(52,211,153,0.12)",  text: "#34d399" },
  Other:         { bg: "rgba(139,164,192,0.12)", text: "#8ba4c0" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "rgba(139,164,192,0.12)", text: "#8ba4c0" };
}

export default async function DashboardPage() {
  const [transactions, assets] = await Promise.all([
    getTransactions(),
    getStockAssets(),
  ]);

  // Compute summary numbers
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const portfolioValue = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);

  // Expense breakdown by category
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

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(52,211,153,0.2) 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          <LayoutDashboard className="w-4 h-4" style={{ color: "#38bdf8" }} />
        </div>
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              color: "#f0f4ff",
              fontFamily: "var(--font-display), Syne, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#4a6080" }}>
            Financial overview &amp; portfolio summary
          </p>
        </div>
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

        {/* Recent transactions — right col */}
        <div className="space-y-4">
          {/* Recent transactions card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#111827",
              border: "1px solid #1e2d45",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid #1e2d45" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                Recent Activity
              </h2>
              <Link
                href="/transactions"
                className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "#38bdf8" }}
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm" style={{ color: "#4a6080" }}>No transactions yet</p>
              </div>
            ) : (
              <div>
                {recentTransactions.map((tx, idx) => {
                  const isIncome = tx.type === "INCOME";
                  const catStyle = getCategoryStyle(tx.category);
                  const isLast = idx === recentTransactions.length - 1;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02] group"
                      style={!isLast ? { borderBottom: "1px solid #162033" } : undefined}
                    >
                      {/* Icon */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isIncome
                            ? "rgba(52,211,153,0.1)"
                            : "rgba(251,113,133,0.1)",
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
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: catStyle.bg,
                              color: catStyle.text,
                            }}
                          >
                            {tx.category}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#4a6080" }}>
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

          {/* Portfolio quick view */}
          {assets.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1e2d45",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid #1e2d45" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
                >
                  Holdings
                </h2>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#38bdf8" }}
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
                      className="flex items-center gap-3 px-5 py-3"
                      style={!isLast ? { borderBottom: "1px solid #162033" } : undefined}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(56,189,248,0.1)",
                          border: "1px solid rgba(56,189,248,0.15)",
                        }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{
                            color: "#38bdf8",
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
                            color: "#f0f4ff",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {asset.ticker}
                        </p>
                        <p className="text-xs" style={{ color: "#4a6080" }}>
                          {asset.shares.toLocaleString()} shares
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-xs font-semibold tabular-nums"
                          style={{
                            color: "#38bdf8",
                            fontFamily: "var(--font-mono), 'DM Mono', monospace",
                          }}
                        >
                          {formatCurrency(value)}
                        </p>
                        <p className="text-xs" style={{ color: "#4a6080" }}>
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

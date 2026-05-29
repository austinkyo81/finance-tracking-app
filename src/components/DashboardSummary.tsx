import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart3, Wallet } from "lucide-react";

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface DashboardSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  portfolioValue: number;
  expensesByCategory: ExpenseCategory[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Rent: "#fb7185",
  Food: "#f59e0b",
  Subscriptions: "#a78bfa",
  Utilities: "#60a5fa",
  Entertainment: "#f472b6",
  Salary: "#34d399",
  Other: "#8ba4c0",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#8ba4c0";
}

export default function DashboardSummary({
  totalIncome,
  totalExpenses,
  portfolioValue,
  expensesByCategory,
}: DashboardSummaryProps) {
  const netIncome = totalIncome - totalExpenses;
  const netWorth = netIncome + portfolioValue;
  const isPositiveNet = netIncome >= 0;
  const isPositiveWorth = netWorth >= 0;

  const topCategories = expensesByCategory.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Net Worth — Large hero card */}
      <div
        className="rounded-xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f1e35 0%, #0d1929 50%, #0b1520 100%)",
          border: "1px solid #1e2d45",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isPositiveWorth
              ? "radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.07) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 80% 20%, rgba(251,113,133,0.07) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4" style={{ color: "#4a6080" }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Total Net Worth
            </span>
          </div>
          <div
            className="text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display), Syne, sans-serif",
              color: isPositiveWorth ? "#34d399" : "#fb7185",
              letterSpacing: "-0.03em",
            }}
          >
            {isPositiveWorth ? "+" : ""}{formatCurrency(netWorth)}
          </div>
          <p className="text-sm mt-1" style={{ color: "#4a6080" }}>
            Cash + Portfolio combined value
          </p>
        </div>
      </div>

      {/* 3-column metric row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Net Income */}
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #1e2d45",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isPositiveNet
                ? "radial-gradient(ellipse at 100% 0%, rgba(52,211,153,0.06) 0%, transparent 60%)"
                : "radial-gradient(ellipse at 100% 0%, rgba(251,113,133,0.06) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                Net Cash
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isPositiveNet
                    ? "rgba(52,211,153,0.12)"
                    : "rgba(251,113,133,0.12)",
                }}
              >
                {isPositiveNet ? (
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" style={{ color: "#fb7185" }} />
                )}
              </div>
            </div>
            <div
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                color: isPositiveNet ? "#34d399" : "#fb7185",
                letterSpacing: "-0.02em",
              }}
            >
              {isPositiveNet ? "+" : ""}{formatCurrency(netIncome)}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs" style={{ color: "#4a6080" }}>
                +{formatCurrency(totalIncome)} in
              </span>
              <span className="text-xs" style={{ color: "#4a6080" }}>
                -{formatCurrency(totalExpenses)} out
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Value */}
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #1e2d45",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 100% 0%, rgba(56,189,248,0.06) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                Portfolio
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(56,189,248,0.12)" }}
              >
                <BarChart3 className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} />
              </div>
            </div>
            <div
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                color: "#38bdf8",
                letterSpacing: "-0.02em",
              }}
            >
              {formatCurrency(portfolioValue)}
            </div>
            <p className="text-xs mt-2" style={{ color: "#4a6080" }}>
              Market value (live prices)
            </p>
          </div>
        </div>

        {/* Spending rate */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #1e2d45",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Savings Rate
            </span>
          </div>
          {totalIncome > 0 ? (
            <>
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-display), Syne, sans-serif",
                  color: netIncome >= 0 ? "#34d399" : "#fb7185",
                  letterSpacing: "-0.02em",
                }}
              >
                {Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)}%
              </div>
              <div
                className="mt-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "#0b0f1a", height: "6px" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((totalIncome - totalExpenses) / totalIncome) * 100))}%`,
                    background: "linear-gradient(90deg, #34d399, #38bdf8)",
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#4a6080" }}>No income data</p>
          )}
        </div>
      </div>

      {/* Expense breakdown */}
      {topCategories.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #1e2d45",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid #1e2d45" }}
          >
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Expense Breakdown
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {topCategories.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(cat.category) }}
                    />
                    <span className="text-sm font-medium" style={{ color: "#8ba4c0" }}>
                      {cat.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#4a6080" }}>
                      {cat.percentage.toFixed(1)}%
                    </span>
                    <span
                      className="text-sm font-medium tabular-nums"
                      style={{
                        color: "#fb7185",
                        fontFamily: "var(--font-mono), 'DM Mono', monospace",
                        minWidth: "80px",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ backgroundColor: "#0b0f1a", height: "4px" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: getCategoryColor(cat.category),
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

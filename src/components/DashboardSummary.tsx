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

// Distinct colors for dark background bars — cycling palette
const CATEGORY_BAR_COLORS: Record<string, string> = {
  Rent:          "#60a5fa",  // blue
  Food:          "#34d399",  // green
  Subscriptions: "#a78bfa",  // purple
  Utilities:     "#fbbf24",  // amber
  Entertainment: "#fb7185",  // rose
  Salary:        "#34d399",  // green
  Other:         "#94a3b8",  // slate
};

const CYCLING_COLORS = ["#60a5fa", "#34d399", "#a78bfa", "#fbbf24", "#fb7185"];

// Badge colors suited for dark surfaces
const CATEGORY_BADGE: Record<string, { bg: string; text: string }> = {
  Rent:          { bg: "rgba(96,165,250,0.12)", text: "#93c5fd" },
  Food:          { bg: "rgba(52,211,153,0.12)", text: "#6ee7b7" },
  Subscriptions: { bg: "rgba(167,139,250,0.12)", text: "#c4b5fd" },
  Utilities:     { bg: "rgba(251,191,36,0.12)", text: "#fcd34d" },
  Entertainment: { bg: "rgba(251,113,133,0.12)", text: "#fda4af" },
  Salary:        { bg: "rgba(52,211,153,0.12)", text: "#6ee7b7" },
  Other:         { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
};

function getCategoryBarColor(category: string, index: number): string {
  return CATEGORY_BAR_COLORS[category] ?? CYCLING_COLORS[index % CYCLING_COLORS.length];
}

function getCategoryBadge(category: string): { bg: string; text: string } {
  return CATEGORY_BADGE[category] ?? { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" };
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
  const maxAmount = topCategories.length > 0 ? topCategories[0].amount : 1;

  return (
    <div className="space-y-5">
      {/* Net Worth hero — text directly on dark gradient, no card */}
      <div className="px-1 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4" style={{ color: "#64748b" }} />
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{
              color: "#94a3b8",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            Total Net Worth
          </span>
        </div>
        <div
          className="font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            color: "#f8fafc",
            fontSize: "42px",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {isPositiveWorth ? "" : "−"}{formatCurrency(Math.abs(netWorth))}
        </div>
        <p className="text-sm mt-1.5" style={{ color: "#64748b" }}>
          Cash + Portfolio combined value
        </p>
      </div>

      {/* 3-column metric row — dark surface cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Net Cash */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              }}
            >
              Net Cash
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: isPositiveNet
                  ? "rgba(52,211,153,0.15)"
                  : "rgba(251,113,133,0.15)",
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
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              color: isPositiveNet ? "#34d399" : "#fb7185",
              letterSpacing: "-0.02em",
            }}
          >
            {isPositiveNet ? "+" : ""}{formatCurrency(netIncome)}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs" style={{ color: "#64748b" }}>
              +{formatCurrency(totalIncome)} in
            </span>
            <span className="text-xs" style={{ color: "#64748b" }}>
              −{formatCurrency(totalExpenses)} out
            </span>
          </div>
        </div>

        {/* Portfolio Value */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              }}
            >
              Portfolio
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(37,99,235,0.15)" }}
            >
              <BarChart3 className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              color: "#60a5fa",
              letterSpacing: "-0.02em",
            }}
          >
            {formatCurrency(portfolioValue)}
          </div>
          <p className="text-xs mt-2" style={{ color: "#64748b" }}>
            Market value (live prices)
          </p>
        </div>

        {/* Savings Rate */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              }}
            >
              Savings Rate
            </span>
          </div>
          {totalIncome > 0 ? (
            <>
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
                  color: netIncome >= 0 ? "#34d399" : "#fb7185",
                  letterSpacing: "-0.02em",
                }}
              >
                {Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)}%
              </div>
              <div
                className="mt-3 rounded-full overflow-hidden"
                style={{ height: "6px", backgroundColor: "#334155" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((totalIncome - totalExpenses) / totalIncome) * 100))}%`,
                    background: "linear-gradient(90deg, #34d399, #2563eb)",
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#64748b" }}>No income data</p>
          )}
        </div>
      </div>

      {/* Expense breakdown — bar chart on dark background */}
      {topCategories.length > 0 && (
        <div>
          {/* Section label */}
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4 px-1"
            style={{
              color: "#94a3b8",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            Expense Breakdown
          </p>

          {/* Bar chart — flex row of rounded columns */}
          <div className="flex items-end gap-3 h-28 mb-3 px-1">
            {topCategories.map((cat, index) => {
              const heightPct = maxAmount > 0 ? (cat.amount / maxAmount) * 100 : 0;
              const barColor = getCategoryBarColor(cat.category, index);
              return (
                <div
                  key={cat.category}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div className="w-full flex items-end" style={{ height: "80px" }}>
                    <div
                      className="w-full rounded-t-xl rounded-b-sm transition-all duration-700"
                      style={{
                        height: `${Math.max(8, heightPct)}%`,
                        backgroundColor: barColor,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Labels below bars */}
          <div className="flex gap-3 px-1">
            {topCategories.map((cat, index) => {
              const badge = getCategoryBadge(cat.category);
              return (
                <div key={cat.category} className="flex-1 flex flex-col items-center gap-1">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full truncate w-full text-center"
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.text,
                      fontSize: "10px",
                    }}
                  >
                    {cat.category}
                  </span>
                  <span
                    className="text-xs font-semibold tabular-nums"
                    style={{
                      color: "#94a3b8",
                      fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      fontSize: "11px",
                    }}
                  >
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

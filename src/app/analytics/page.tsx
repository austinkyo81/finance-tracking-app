export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import { formatCurrency } from "@/lib/utils";

/* ── Per-category spending breakdown ── */
const CATEGORY_COLORS: Record<string, string> = {
  Rent:          "#3b82f6",
  Food:          "#3de3b2",
  Subscriptions: "#a78bfa",
  Utilities:     "#fbbf24",
  Entertainment: "#fb7185",
  Salary:        "#3de3b2",
  Other:         "#94a3b8",
};

export default async function AnalyticsPage() {
  const transactions = await getTransactions();

  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  /* Category breakdown */
  const catMap = new Map<string, number>();
  for (const tx of expenses) {
    catMap.set(tx.category, (catMap.get(tx.category) ?? 0) + tx.amount);
  }
  const breakdown = Array.from(catMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      pct: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  /* Weekly bars — last 7 days */
  const today = new Date();
  const weekDays: { label: string; amount: number; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = i === 0 ? "Today" :
      d.toLocaleDateString("en-US", { weekday: "short" });
    const dayStr = d.toISOString().slice(0, 10);
    const amount = expenses
      .filter((t) => new Date(t.date).toISOString().slice(0, 10) === dayStr)
      .reduce((s, t) => s + t.amount, 0);
    weekDays.push({ label, amount, isToday: i === 0 });
  }

  const maxBar = Math.max(...weekDays.map((d) => d.amount), 1);

  const rangeLabel = (() => {
    const from = new Date(today); from.setDate(today.getDate() - 6);
    return `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  })();

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Header ── */}
      <div style={{ padding: "6px 22px 14px" }}>
        <h1
          className="font-bold text-white"
          style={{ fontSize: "27px", letterSpacing: "-0.5px" }}
        >
          Analytics
        </h1>
        <p
          className="mt-0.5"
          style={{ fontSize: "13px", color: "rgba(219,234,254,0.8)" }}
        >
          Where your money moves
        </p>
      </div>

      {/* ── Headline block ── */}
      <div style={{ padding: "0 24px 4px" }}>
        <p
          className="font-semibold uppercase"
          style={{ fontSize: "11px", letterSpacing: "1.2px", color: "rgba(219,234,254,0.75)" }}
        >
          Total Spending
        </p>
        <p
          className="font-extrabold text-white"
          style={{ fontSize: "32px", letterSpacing: "-1px", margin: "2px 0" }}
        >
          {formatCurrency(totalExpenses)}
        </p>
        <p style={{ fontSize: "12px", color: "rgba(219,234,254,0.7)" }}>
          {rangeLabel}
        </p>
      </div>

      {/* ── Bar chart ── */}
      <div
        className="flex items-end justify-between"
        style={{ gap: "10px", height: "170px", padding: "24px 26px 8px" }}
        role="img"
        aria-label="Spending bar chart for the last 7 days"
      >
        {weekDays.map((day, i) => {
          const heightPct = maxBar > 0 ? (day.amount / maxBar) * 100 : 0;
          return (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-end"
              style={{ gap: "8px", height: "100%" }}
            >
              {/* Bar column */}
              <div
                className="relative w-full"
                style={{
                  maxWidth: "30px",
                  height: `${Math.max(heightPct, day.amount > 0 ? 8 : 0)}%`,
                  borderRadius: "12px",
                  background: day.isToday
                    ? "linear-gradient(180deg,#3de3b2,#27c79b)"
                    : day.amount === 0
                    ? "transparent"
                    : "linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.55))",
                  boxShadow: day.isToday ? "0 0 22px rgba(61,227,178,0.55)" : "none",
                  border: day.amount === 0 ? "1.5px dashed rgba(255,255,255,0.35)" : "none",
                  minHeight: day.amount === 0 ? "24px" : undefined,
                }}
              >
                {/* Value tag */}
                {day.amount > 0 && (
                  <span
                    className="absolute font-bold text-white"
                    style={{
                      fontSize: "9.5px",
                      top: "-22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCurrency(day.amount).replace("$", "$")}
                  </span>
                )}
              </div>
              {/* Day label */}
              <span
                className="font-semibold"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── White sheet — Spending Breakdown ── */}
      <div
        className="sheet animate-fade-in-up"
        style={{ marginTop: "10px" }}
      >
        {/* Sheet header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              className="font-bold"
              style={{ fontSize: "18px", letterSpacing: "-0.3px", color: "#0f172a" }}
            >
              Spending Breakdown
            </h2>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>
              Top categories this period
            </p>
          </div>
        </div>

        {breakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-sm font-medium" style={{ color: "#64748b" }}>No expense data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {breakdown.map((cat) => {
              const barColor =
                CATEGORY_COLORS[cat.category] ?? "#94a3b8";
              return (
                <div key={cat.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="font-semibold"
                      style={{ fontSize: "14px", color: "#0f172a" }}
                    >
                      {cat.category === "Food"
                        ? "Food & Dining"
                        : cat.category === "Rent"
                        ? "Rent & Living"
                        : cat.category}
                    </span>
                    <span
                      className="font-bold"
                      style={{ fontSize: "13px", color: "#64748b" }}
                    >
                      {formatCurrency(cat.amount)} · {cat.pct.toFixed(0)}%
                    </span>
                  </div>
                  {/* Progress track */}
                  <div
                    className="overflow-hidden"
                    style={{
                      height: "8px",
                      borderRadius: "6px",
                      background: "#e9eef5",
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.pct}%`,
                        height: "100%",
                        borderRadius: "6px",
                        background: `linear-gradient(90deg, #34d399, ${barColor})`,
                        transition: "width 0.7s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { formatCurrency, formatDate, formatMonth } from "@/lib/utils";
import TransactionDeleteButton from "@/app/transactions/TransactionDeleteButton";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
  date: Date;
  createdAt: Date;
};

interface TransactionListProps {
  transactions: Transaction[];
}

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

function groupByMonth(transactions: Transaction[]): [string, Transaction[]][] {
  const groups = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const key = formatMonth(tx.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }

  return Array.from(groups.entries());
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center py-16"
        style={{
          backgroundColor: "#111827",
          border: "1px dashed #1e2d45",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: "#0b0f1a", border: "1px solid #1e2d45" }}
        >
          <span style={{ color: "#4a6080", fontSize: "20px" }}>$</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#4a6080" }}>
          No transactions yet
        </p>
        <p className="text-xs mt-1" style={{ color: "#2a3f5e" }}>
          Add your first transaction above
        </p>
      </div>
    );
  }

  const groups = groupByMonth(transactions);

  return (
    <div className="space-y-6">
      {groups.map(([month, txs]) => (
        <div key={month}>
          {/* Month header */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              {month}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#1e2d45" }} />
            <span className="text-xs" style={{ color: "#2a3f5e" }}>
              {txs.length} transaction{txs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Transaction rows */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#111827",
              border: "1px solid #1e2d45",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {txs.map((tx, idx) => {
              const isIncome = tx.type === "INCOME";
              const catStyle = getCategoryStyle(tx.category);
              const isLast = idx === txs.length - 1;

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-white/[0.02] group"
                  style={
                    !isLast
                      ? { borderBottom: "1px solid #162033" }
                      : undefined
                  }
                >
                  {/* Date */}
                  <div
                    className="w-10 text-center shrink-0"
                    style={{
                      fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      color: "#4a6080",
                      fontSize: "11px",
                    }}
                  >
                    {formatDate(tx.date)}
                  </div>

                  {/* Category badge */}
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: catStyle.bg,
                      color: catStyle.text,
                      fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    }}
                  >
                    {tx.category}
                  </span>

                  {/* Description */}
                  <span
                    className="flex-1 text-sm truncate"
                    style={{ color: tx.description ? "#8ba4c0" : "#2a3f5e" }}
                  >
                    {tx.description ?? "—"}
                  </span>

                  {/* Amount */}
                  <span
                    className="text-sm font-semibold tabular-nums shrink-0"
                    style={{
                      color: isIncome ? "#34d399" : "#fb7185",
                      fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      minWidth: "90px",
                      textAlign: "right",
                    }}
                  >
                    {isIncome ? "+" : "−"}{formatCurrency(tx.amount)}
                  </span>

                  {/* Delete */}
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <TransactionDeleteButton id={tx.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

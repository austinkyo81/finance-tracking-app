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
        className="rounded-2xl flex flex-col items-center justify-center py-16"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: "rgba(37,99,235,0.15)" }}
        >
          <span className="text-lg font-bold" style={{ color: "#60a5fa" }}>$</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
          No transactions yet
        </p>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
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
          <div className="flex items-center gap-3 mb-3 px-1">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#94a3b8",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              }}
            >
              {month}
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />
            <span
              className="text-xs"
              style={{ color: "#64748b" }}
            >
              {txs.length} transaction{txs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Transaction rows — dark card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            {txs.map((tx, idx) => {
              const isIncome = tx.type === "INCOME";
              const badge = getCategoryBadge(tx.category);
              const isLast = idx === txs.length - 1;

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 group cursor-pointer hover:bg-slate-700/40"
                  style={{
                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Date */}
                  <div
                    className="w-10 text-center shrink-0"
                    style={{
                      color: "#64748b",
                      fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      fontSize: "11px",
                    }}
                  >
                    {formatDate(tx.date)}
                  </div>

                  {/* Category badge */}
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.text,
                      fontFamily: "var(--font-body), 'IBM Plex Sans', sans-serif",
                    }}
                  >
                    {tx.category}
                  </span>

                  {/* Description */}
                  <span
                    className="flex-1 text-sm truncate"
                    style={{ color: tx.description ? "#94a3b8" : "#475569" }}
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

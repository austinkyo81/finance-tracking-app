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
  Rent:          { bg: "rgba(26,75,159,0.08)",  text: "#1a4b9f" },
  Food:          { bg: "rgba(16,185,129,0.10)", text: "#059669" },
  Subscriptions: { bg: "rgba(124,58,237,0.08)", text: "#7c3aed" },
  Utilities:     { bg: "rgba(217,119,6,0.10)",  text: "#b45309" },
  Entertainment: { bg: "rgba(251,113,133,0.10)", text: "#e11d48" },
  Salary:        { bg: "rgba(16,185,129,0.10)", text: "#059669" },
  Other:         { bg: "rgba(100,116,139,0.10)", text: "#475569" },
};

function getCategoryBadge(category: string) {
  return CATEGORY_BADGE[category] ?? { bg: "rgba(100,116,139,0.10)", text: "#475569" };
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
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: "#eff6ff" }}
        >
          <span className="text-lg font-bold" style={{ color: "#1a4b9f" }}>$</span>
        </div>
        <p className="text-sm font-medium text-slate-500">No transactions yet</p>
        <p className="text-xs mt-1 text-slate-400">Add your first transaction above</p>
      </div>
    );
  }

  const groups = groupByMonth(transactions);

  return (
    <div className="space-y-5">
      {groups.map(([month, txs]) => (
        <div key={month}>
          {/* Month header */}
          <div className="flex items-center gap-3 mb-2.5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
              style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}
            >
              {month}
            </span>
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] text-slate-400">
              {txs.length} item{txs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Transaction rows */}
          <div className="space-y-2">
            {txs.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const badge = getCategoryBadge(tx.category);

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-2xl group cursor-pointer transition-colors duration-150 hover:bg-slate-100"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid rgba(226,232,240,0.5)" }}
                >
                  {/* Date */}
                  <div
                    className="w-9 text-center shrink-0 text-[10px] tabular-nums text-slate-400"
                    style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
                  >
                    {formatDate(tx.date)}
                  </div>

                  {/* Category badge */}
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {tx.category}
                  </span>

                  {/* Description */}
                  <span className="flex-1 text-xs text-slate-500 truncate">
                    {tx.description ?? "—"}
                  </span>

                  {/* Amount */}
                  <span
                    className="text-sm font-bold tabular-nums shrink-0"
                    style={{
                      color: isIncome ? "#10b981" : "#64748b",
                      fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      minWidth: "80px",
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

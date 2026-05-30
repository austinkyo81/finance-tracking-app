import { formatMonth } from "@/lib/utils";
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

/* Category badge tokens from spec */
const BADGE: Record<string, { bg: string; color: string }> = {
  Rent:          { bg: "#dbeafe", color: "#2563eb" },
  Food:          { bg: "#fef3c7", color: "#d97706" },
  Subscriptions: { bg: "#fee2e2", color: "#ef4444" },
  Utilities:     { bg: "#dbeafe", color: "#2563eb" },
  Entertainment: { bg: "#ede9fe", color: "#7c3aed" },
  Salary:        { bg: "#d1fae5", color: "#059669" },
  Other:         { bg: "#f1f5f9", color: "#64748b" },
};

function getBadge(category: string) {
  return BADGE[category] ?? { bg: "#f1f5f9", color: "#64748b" };
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

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "#eff6ff" }}
        >
          <span className="text-lg font-bold" style={{ color: "#1a4b9f" }}>$</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#64748b" }}>No transactions yet</p>
        <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>Add your first transaction above</p>
      </div>
    );
  }

  const groups = groupByMonth(transactions);

  return (
    <div className="space-y-5">
      {groups.map(([month, txs]) => (
        <div key={month}>
          {/* Month separator */}
          <div className="mb-3 flex items-center gap-3">
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#94a3b8",
              }}
            >
              {month}
            </span>
            <div className="h-px flex-1" style={{ background: "#f1f5f9" }} />
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              {txs.length} item{txs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Transaction rows */}
          <div className="space-y-2.5">
            {txs.map((tx) => {
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
                      className="flex shrink-0 items-center justify-center rounded-[13px] font-bold"
                      style={{
                        width: "42px",
                        height: "42px",
                        background: badge.bg,
                        color: badge.color,
                        fontSize: "11px",
                        fontFamily: "var(--font-mono), 'DM Mono', monospace",
                        letterSpacing: "0.02em",
                      }}
                      aria-hidden="true"
                    >
                      {tx.category.slice(0, 3).toUpperCase()}
                    </div>

                    <div>
                      <p
                        className="font-semibold"
                        style={{ fontSize: "14.5px", letterSpacing: "-0.2px", color: "#0f172a" }}
                      >
                        {tx.description ?? tx.category}
                      </p>
                      <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                        {tx.category} · {formatShortDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        fontSize: "15px",
                        letterSpacing: "-0.3px",
                        color: isIncome ? "#059669" : "#0f172a",
                        fontFamily: "var(--font-mono), 'DM Mono', monospace",
                      }}
                    >
                      {isIncome ? "+" : "−"}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(tx.amount)}
                    </span>
                    <div className="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      <TransactionDeleteButton id={tx.id} />
                    </div>
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

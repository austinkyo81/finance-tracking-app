export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

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
          Transactions
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
          {transactions.length} total &nbsp;&middot;&nbsp;{" "}
          {transactions.filter((t) => t.type === "INCOME").length} income &nbsp;&middot;&nbsp;{" "}
          {transactions.filter((t) => t.type === "EXPENSE").length} expenses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form + quick stats — left column */}
        <div className="space-y-4">
          <TransactionForm />

          {/* Quick stats — dark tinted cards */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(6,78,59,0.3)",
                border: "1px solid rgba(52,211,153,0.2)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{
                  color: "#6ee7b7",
                  fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
                }}
              >
                Income
              </p>
              <p
                className="text-lg font-bold tabular-nums"
                style={{
                  color: "#34d399",
                  fontFamily: "var(--font-mono), 'DM Mono', monospace",
                }}
              >
                +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(76,5,25,0.3)",
                border: "1px solid rgba(251,113,133,0.2)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{
                  color: "#fda4af",
                  fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
                }}
              >
                Expenses
              </p>
              <p
                className="text-lg font-bold tabular-nums"
                style={{
                  color: "#fb7185",
                  fontFamily: "var(--font-mono), 'DM Mono', monospace",
                }}
              >
                −${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction list — right columns */}
        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { ArrowLeftRight } from "lucide-react";

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
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(52,211,153,0.2) 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          <ArrowLeftRight className="w-4 h-4" style={{ color: "#38bdf8" }} />
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
            Transactions
          </h1>
          <p className="text-sm" style={{ color: "#4a6080" }}>
            {transactions.length} total &nbsp;&middot;&nbsp; {transactions.filter(t => t.type === "INCOME").length} income &nbsp;&middot;&nbsp; {transactions.filter(t => t.type === "EXPENSE").length} expenses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form + quick stats — left column */}
        <div className="space-y-4">
          <TransactionForm />

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1e2d45",
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}>
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
              className="rounded-xl p-4"
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1e2d45",
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}>
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

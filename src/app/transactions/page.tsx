export const dynamic = "force-dynamic";

import { getTransactions } from "@/app/transactions/actions";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { formatCurrency } from "@/lib/utils";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex-1 flex flex-col space-y-5">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Ledger Stream
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
          Manage cash operations records
        </p>
      </div>

      {/* 2-col stat cards on gradient */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Income
          </p>
          <p
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
          >
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Expenses
          </p>
          <p
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
          >
            −{formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Transaction form — white card floating on gradient */}
      <TransactionForm />

      {/* White sliding sheet — transaction ledger */}
      <div
        className="bg-white -mx-4 flex-1 px-5 pt-6 pb-32"
        style={{
          borderRadius: "2.5rem 2.5rem 0 0",
          boxShadow: "0 -8px 40px rgba(26,75,159,0.12)",
        }}
      >
        <h2
          className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}
        >
          Transactions Records Log
        </h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}

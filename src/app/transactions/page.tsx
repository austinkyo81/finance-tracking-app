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
    <div className="flex flex-1 flex-col">
      {/* ── Page header ── */}
      <div style={{ padding: "6px 22px 18px" }}>
        <h1
          className="font-bold text-white"
          style={{ fontSize: "27px", letterSpacing: "-0.5px" }}
        >
          Ledger Stream
        </h1>
        <p
          className="mt-0.5"
          style={{ fontSize: "13px", color: "rgba(219,234,254,0.8)" }}
        >
          Manage your cash operations
        </p>
      </div>

      {/* ── 2-col stat cards on gradient ── */}
      <div
        className="grid grid-cols-2"
        style={{ gap: "12px", padding: "0 22px 18px" }}
      >
        <div
          className="rounded-[22px]"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "15px 16px",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(219,234,254,0.85)", fontWeight: 500, marginBottom: "9px" }}>
            Total Income
          </p>
          <p
            className="font-bold text-white"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
            }}
          >
            +{formatCurrency(totalIncome)}
          </p>
          <p className="mt-0.5 font-semibold" style={{ fontSize: "11px", color: "#3de3b2" }}>
            ▲ all time
          </p>
        </div>
        <div
          className="rounded-[22px]"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "15px 16px",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(219,234,254,0.85)", fontWeight: 500, marginBottom: "9px" }}>
            Total Expenses
          </p>
          <p
            className="font-bold text-white"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.4px",
              fontFamily: "var(--font-mono), 'DM Mono', monospace",
            }}
          >
            −{formatCurrency(totalExpenses)}
          </p>
          <p className="mt-0.5 font-semibold" style={{ fontSize: "11px", color: "#fca5a5" }}>
            ▼ all time
          </p>
        </div>
      </div>

      {/* ── Add Transaction form card ── */}
      <TransactionForm />

      {/* ── White sheet — Transaction Records Log ── */}
      <div
        className="sheet animate-fade-in-up"
        style={{ marginTop: "20px" }}
      >
        <p
          className="font-bold uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "1px",
            color: "#94a3b8",
            marginBottom: "12px",
          }}
        >
          Transaction Records Log
        </p>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}

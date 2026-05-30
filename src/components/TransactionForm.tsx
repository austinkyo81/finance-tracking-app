"use client";

import { useState, useTransition, useRef } from "react";
import { createTransaction } from "@/app/transactions/actions";
import { TrendingUp, TrendingDown, Plus, Loader2, DollarSign, Tag, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "Salary", label: "Salary Revenue" },
  { value: "Food", label: "Food & Dining" },
  { value: "Rent", label: "Rent & Living" },
  { value: "Utilities", label: "Utilities" },
  { value: "Subscriptions", label: "Subscriptions" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other Expenses" },
];

function getTodayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder:text-slate-400";

const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1";

export default function TransactionForm() {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const isIncome = type === "INCOME";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTransaction({
        type,
        amount: parseFloat(formData.get("amount") as string),
        category: formData.get("category") as string,
        description: (formData.get("description") as string) || undefined,
        date: formData.get("date") as string,
      });
      formRef.current?.reset();
    });
  }

  return (
    <div
      className="rounded-3xl p-5 space-y-4 shadow-sm"
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid rgba(226,232,240,0.8)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between pb-2"
        style={{ borderBottom: "1px solid rgba(226,232,240,0.6)" }}
      >
        <h3 className="text-sm font-bold text-slate-800">Add Transaction</h3>
        <span
          className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase"
          style={{ backgroundColor: "#eff6ff", color: "#1a4b9f" }}
        >
          Ledger Source
        </span>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ backgroundColor: "rgba(226,232,240,0.6)" }}>
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={cn(
              "py-1.5 text-xs font-bold rounded-lg text-center transition-all duration-200 cursor-pointer",
              !isIncome
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5 inline mr-1" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={cn(
              "py-1.5 text-xs font-bold rounded-lg text-center transition-all duration-200 cursor-pointer",
              isIncome
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className={labelClass}>Amount</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
              className={cn(inputClass, "pl-9")}
              style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              name="category"
              defaultValue="Other"
              required
              className={cn(inputClass, "pl-9 pr-8 appearance-none cursor-pointer")}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▾</div>
          </div>
        </div>

        {/* Description + Date row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Description</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                name="description"
                type="text"
                placeholder="Optional note..."
                className={cn(inputClass, "pl-9")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              name="date"
              type="date"
              defaultValue={getTodayDate()}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-60"
          style={{
            backgroundColor: "#1a4b9f",
            boxShadow: "0 4px 16px rgba(26,75,159,0.25)",
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Commit Ledger Item
            </>
          )}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useTransition, useRef } from "react";
import { createTransaction } from "@/app/transactions/actions";
import { PlusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "Salary", label: "Salary Revenue" },
  { value: "Food", label: "Food & Dining" },
  { value: "Rent", label: "Rent & Living" },
  { value: "Utilities", label: "Utilities" },
  { value: "Subscriptions", label: "Subscriptions" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];

function getTodayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const labelClass =
  "block text-[10px] font-bold uppercase tracking-[0.8px] mb-1.5";

const fieldInputClass =
  "w-full border bg-white text-[#0f172a] font-semibold outline-none transition-all duration-200 placeholder:font-medium";

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
      style={{
        background: "#f8fafc",
        border: "1px solid #f1f5f9",
        borderRadius: "26px",
        padding: "18px",
        margin: "0 22px",
      }}
    >
      {/* Form header */}
      <div
        className="mb-3.5 flex items-center justify-between pb-3"
        style={{ borderBottom: "1px solid #e9eef5" }}
      >
        <h3
          className="font-bold"
          style={{ fontSize: "15px", color: "#0f172a" }}
        >
          Add Transaction
        </h3>
        <span
          className="font-extrabold uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.5px",
            color: "#2563eb",
            background: "#dbeafe",
            padding: "4px 10px",
            borderRadius: "20px",
          }}
        >
          Ledger Source
        </span>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5">
        {/* Type toggle — segmented control */}
        <div
          className="grid grid-cols-2"
          style={{
            gap: "4px",
            background: "#e7edf5",
            padding: "4px",
            borderRadius: "14px",
          }}
        >
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={cn(
              "py-2 text-[13px] font-bold rounded-[11px] transition-all duration-200 cursor-pointer",
              !isIncome
                ? "bg-white text-[#0f172a]"
                : "text-[#64748b] hover:text-[#0f172a]"
            )}
            style={
              !isIncome
                ? { boxShadow: "0 2px 8px rgba(15,23,42,0.1)" }
                : {}
            }
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={cn(
              "py-2 text-[13px] font-bold rounded-[11px] transition-all duration-200 cursor-pointer",
              isIncome
                ? "bg-white text-[#0f172a]"
                : "text-[#64748b] hover:text-[#0f172a]"
            )}
            style={
              isIncome
                ? { boxShadow: "0 2px 8px rgba(15,23,42,0.1)" }
                : {}
            }
          >
            Income
          </button>
        </div>

        {/* Amount — large field */}
        <div>
          <label
            htmlFor="tx-amount"
            className={labelClass}
            style={{ color: "#94a3b8" }}
          >
            Amount
          </label>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold pointer-events-none select-none"
              style={{ fontSize: "26px", color: "#94a3b8" }}
              aria-hidden="true"
            >
              $
            </span>
            <input
              id="tx-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
              className={cn(
                fieldInputClass,
                "pl-10 pr-4 py-3 focus:border-[#2563eb]"
              )}
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-1px",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="tx-category"
            className={labelClass}
            style={{ color: "#94a3b8" }}
          >
            Category
          </label>
          <div className="relative">
            <select
              id="tx-category"
              name="category"
              defaultValue="Other"
              required
              className={cn(fieldInputClass, "px-3.5 py-2.5 appearance-none cursor-pointer")}
              style={{
                fontSize: "15px",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                paddingRight: "2.5rem",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="tx-description"
            className={labelClass}
            style={{ color: "#94a3b8" }}
          >
            Description
          </label>
          <input
            id="tx-description"
            name="description"
            type="text"
            placeholder="Optional notes…"
            className={cn(fieldInputClass, "px-3.5 py-2.5")}
            style={{
              fontSize: "15px",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Date (hidden, auto-set to today) */}
        <input
          name="date"
          type="hidden"
          defaultValue={getTodayDate()}
        />

        {/* Submit — full-width deep-blue button */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-1 flex w-full items-center justify-center gap-2 font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-60 hover:-translate-y-px active:translate-y-0"
          style={{
            background: "#1a4b9f",
            borderRadius: "16px",
            padding: "15px",
            fontSize: "14px",
            border: "none",
            boxShadow: "0 10px 22px -8px rgba(26,75,159,0.7)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#153e85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1a4b9f";
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Adding…
            </>
          ) : (
            <>
              <PlusCircle className="w-[18px] h-[18px]" aria-hidden="true" />
              Commit Ledger Item
            </>
          )}
        </button>
      </form>
    </div>
  );
}

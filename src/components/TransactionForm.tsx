"use client";

import { useState, useTransition, useRef } from "react";
import { createTransaction } from "@/app/transactions/actions";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TrendingUp, TrendingDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "Salary", label: "Salary" },
  { value: "Food", label: "Food" },
  { value: "Rent", label: "Rent" },
  { value: "Utilities", label: "Utilities" },
  { value: "Subscriptions", label: "Subscriptions" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];

function getTodayDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TransactionForm() {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const isIncome = type === "INCOME";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("type", type);

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
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(37,99,235,0.2)" }}
        >
          <Plus className="w-4 h-4" style={{ color: "#60a5fa" }} />
        </div>
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "#64748b",
            fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
          }}
        >
          New Transaction
        </h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Type Toggle */}
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{
              color: "#94a3b8",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            Type
          </span>
          <div
            className="flex gap-2 p-1 rounded-full"
            style={{ backgroundColor: "#0f172a" }}
          >
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              )}
              style={
                isIncome
                  ? {
                      backgroundColor: "#1e293b",
                      color: "#34d399",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      border: "1px solid rgba(52,211,153,0.2)",
                    }
                  : {
                      color: "#64748b",
                      backgroundColor: "transparent",
                    }
              }
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              )}
              style={
                !isIncome
                  ? {
                      backgroundColor: "#1e293b",
                      color: "#fb7185",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      border: "1px solid rgba(251,113,133,0.2)",
                    }
                  : {
                      color: "#64748b",
                      backgroundColor: "transparent",
                    }
              }
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </button>
          </div>
        </div>

        {/* Row: Amount + Category */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
          />
          <Select
            label="Category"
            name="category"
            options={CATEGORIES}
            defaultValue="Other"
            required
          />
        </div>

        {/* Row: Description + Date */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Description"
            name="description"
            type="text"
            placeholder="Optional note..."
          />
          <Input
            label="Date"
            name="date"
            type="date"
            defaultValue={getTodayDate()}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
          className="w-full"
          style={
            isIncome
              ? {
                  background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(52,211,153,0.3)",
                }
              : {
                  background: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(251,113,133,0.3)",
                }
          }
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add {isIncome ? "Income" : "Expense"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

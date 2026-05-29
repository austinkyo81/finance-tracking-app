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
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #1e2d45",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid #1e2d45" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <Plus className="w-4 h-4" style={{ color: "#38bdf8" }} />
        </div>
        <h2
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          New Transaction
        </h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-5 space-y-5">
        {/* Type Toggle */}
        <div className="flex flex-col gap-1.5">
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Type
          </span>
          <div
            className="flex gap-2"
            style={{
              backgroundColor: "#0b0f1a",
              padding: "4px",
              borderRadius: "10px",
              border: "1px solid #1e2d45",
            }}
          >
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              )}
              style={
                isIncome
                  ? {
                      backgroundColor: "rgba(52, 211, 153, 0.14)",
                      color: "#34d399",
                      border: "1px solid rgba(52, 211, 153, 0.25)",
                      boxShadow: "0 0 12px rgba(52, 211, 153, 0.12)",
                    }
                  : {
                      color: "#4a6080",
                      border: "1px solid transparent",
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
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              )}
              style={
                !isIncome
                  ? {
                      backgroundColor: "rgba(251, 113, 133, 0.14)",
                      color: "#fb7185",
                      border: "1px solid rgba(251, 113, 133, 0.25)",
                      boxShadow: "0 0 12px rgba(251, 113, 133, 0.12)",
                    }
                  : {
                      color: "#4a6080",
                      border: "1px solid transparent",
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
          variant={isIncome ? "success" : "danger"}
          size="md"
          disabled={isPending}
          className="w-full"
          style={
            isIncome
              ? {
                  background: "linear-gradient(135deg, rgba(52,211,153,0.9) 0%, rgba(16,185,129,0.9) 100%)",
                  color: "#ffffff",
                  border: "1px solid rgba(52,211,153,0.3)",
                  boxShadow: "0 0 20px rgba(52,211,153,0.2)",
                }
              : {
                  background: "linear-gradient(135deg, rgba(251,113,133,0.9) 0%, rgba(244,63,94,0.9) 100%)",
                  color: "#ffffff",
                  border: "1px solid rgba(251,113,133,0.3)",
                  boxShadow: "0 0 20px rgba(251,113,133,0.2)",
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

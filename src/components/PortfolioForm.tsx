"use client";

import { useTransition, useRef } from "react";
import { addStockAsset } from "@/app/portfolio/actions";
import { Plus, Loader2 } from "lucide-react";

export default function PortfolioForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addStockAsset({
        ticker: (formData.get("ticker") as string).toUpperCase(),
        shares: parseFloat(formData.get("shares") as string),
      });
      formRef.current?.reset();
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder:text-slate-400";

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid rgba(226,232,240,0.8)",
      }}
    >
      <p
        className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}
      >
        Add Position
      </p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Ticker
            </label>
            <input
              name="ticker"
              type="text"
              placeholder="AAPL"
              required
              maxLength={10}
              onChange={(e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase();
              }}
              className={inputClass}
              style={{
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            />
          </div>
          <div className="w-28">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Shares
            </label>
            <input
              name="shares"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0"
              required
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-60"
            style={{
              backgroundColor: "#1a4b9f",
              boxShadow: "0 4px 16px rgba(26,75,159,0.25)",
            }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isPending ? "..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

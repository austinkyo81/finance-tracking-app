"use client";

import { useTransition, useRef } from "react";
import { addStockAsset } from "@/app/portfolio/actions";
import { Plus, Loader2 } from "lucide-react";

const fieldInputClass =
  "w-full border border-[#e2e8f0] bg-white text-[#0f172a] font-semibold outline-none transition-all duration-200 placeholder:text-[#cbd5e1] placeholder:font-medium";

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

  const labelClass =
    "block text-[10px] font-bold uppercase tracking-[0.8px] mb-1.5";

  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #f1f5f9",
        borderRadius: "20px",
        padding: "14px",
      }}
    >
      <p
        className="font-bold uppercase"
        style={{ fontSize: "11px", letterSpacing: "1px", color: "#94a3b8", marginBottom: "12px" }}
      >
        Add Position
      </p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex items-end gap-2">
          {/* Ticker */}
          <div className="flex-1">
            <label htmlFor="pf-ticker" className={labelClass} style={{ color: "#94a3b8" }}>
              Ticker
            </label>
            <input
              id="pf-ticker"
              name="ticker"
              type="text"
              placeholder="AAPL"
              required
              maxLength={10}
              onChange={(e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase();
              }}
              className={fieldInputClass}
              style={{
                fontSize: "15px",
                padding: "10px 14px",
                borderRadius: "14px",
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
                letterSpacing: "0.05em",
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

          {/* Shares */}
          <div style={{ width: "100px" }}>
            <label htmlFor="pf-shares" className={labelClass} style={{ color: "#94a3b8" }}>
              Shares
            </label>
            <input
              id="pf-shares"
              name="shares"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0"
              required
              className={fieldInputClass}
              style={{
                fontSize: "15px",
                padding: "10px 14px",
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 inline-flex items-center gap-1.5 font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-60 active:scale-[0.97]"
            style={{
              background: "#1a4b9f",
              borderRadius: "14px",
              padding: "10px 14px",
              fontSize: "13px",
              border: "none",
              boxShadow: "0 4px 12px rgba(26,75,159,0.3)",
            }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="w-4 h-4" aria-hidden="true" />
            )}
            {isPending ? "…" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

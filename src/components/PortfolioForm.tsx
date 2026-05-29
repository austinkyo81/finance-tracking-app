"use client";

import { useTransition, useRef } from "react";
import { addStockAsset } from "@/app/portfolio/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Loader2, TrendingUp } from "lucide-react";

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
          <TrendingUp className="w-4 h-4" style={{ color: "#60a5fa" }} />
        </div>
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "#64748b",
            fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
          }}
        >
          Add Position
        </h2>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Ticker Symbol"
              name="ticker"
              type="text"
              placeholder="AAPL"
              required
              maxLength={10}
              onChange={(e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase();
              }}
              style={{
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            />
          </div>
          <div className="w-36">
            <Input
              label="Shares"
              name="shares"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0"
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="shrink-0"
            style={{
              paddingTop: "10px",
              paddingBottom: "10px",
              background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
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
                Add
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

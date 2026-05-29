"use client";

import { useState, useTransition } from "react";
import { syncStockPrices } from "@/app/portfolio/actions";
import { RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");

  function handleSync() {
    setStatus("idle");
    startTransition(async () => {
      try {
        await syncStockPrices();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    });
  }

  const statusConfig = {
    idle: {
      icon: isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />,
      label: isPending ? "Syncing..." : "Sync Prices",
      style: {
        backgroundColor: "rgba(56,189,248,0.1)",
        color: "#38bdf8",
        border: "1px solid rgba(56,189,248,0.2)",
      },
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Prices updated",
      style: {
        backgroundColor: "rgba(52,211,153,0.1)",
        color: "#34d399",
        border: "1px solid rgba(52,211,153,0.2)",
      },
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Sync failed",
      style: {
        backgroundColor: "rgba(251,113,133,0.1)",
        color: "#fb7185",
        border: "1px solid rgba(251,113,133,0.2)",
      },
    },
  };

  const current = statusConfig[status];

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
      style={current.style}
    >
      {current.icon}
      {current.label}
    </button>
  );
}

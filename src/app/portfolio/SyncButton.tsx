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
        backgroundColor: "#1e293b",
        color: "#60a5fa",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      },
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Prices updated",
      style: {
        backgroundColor: "#052e16",
        color: "#34d399",
        border: "1px solid rgba(52,211,153,0.2)",
        boxShadow: "0 2px 8px rgba(52,211,153,0.1)",
      },
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Sync failed",
      style: {
        backgroundColor: "#1f0a0d",
        color: "#fb7185",
        border: "1px solid rgba(251,113,133,0.2)",
        boxShadow: "0 2px 8px rgba(251,113,133,0.1)",
      },
    },
  };

  const current = statusConfig[status];

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
      style={current.style}
    >
      {current.icon}
      {current.label}
    </button>
  );
}

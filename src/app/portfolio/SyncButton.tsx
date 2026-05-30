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

  const configs = {
    idle: {
      icon: isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />,
      label: isPending ? "Syncing..." : "Sync Prices",
      color: "#3de3b2",
      bg: "rgba(255,255,255,0.10)",
      border: "rgba(61,227,178,0.25)",
    },
    success: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Updated",
      color: "#3de3b2",
      bg: "rgba(61,227,178,0.12)",
      border: "rgba(61,227,178,0.3)",
    },
    error: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Failed",
      color: "#fb7185",
      bg: "rgba(251,113,133,0.12)",
      border: "rgba(251,113,133,0.3)",
    },
  };

  const c = configs[status];

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]"
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {c.icon}
      {c.label}
    </button>
  );
}

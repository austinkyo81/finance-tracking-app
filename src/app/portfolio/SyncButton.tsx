"use client";

import { useState, useTransition } from "react";
import { syncStockPrices } from "@/app/portfolio/actions";
import { RefreshCw } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const [spinning, setSpinning] = useState(false);

  function handleSync() {
    setStatus("idle");
    setSpinning(true);
    startTransition(async () => {
      try {
        await syncStockPrices();
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      } finally {
        setTimeout(() => setSpinning(false), 700);
      }
    });
  }

  const label =
    status === "success" ? "Updated" :
    status === "error"   ? "Failed"  :
    isPending            ? "Syncing…" : "Sync";

  const iconColor =
    status === "error" ? "#fb7185" : "#3de3b2";

  return (
    <button
      onClick={handleSync}
      disabled={isPending}
      aria-label="Sync stock prices"
      className="inline-flex items-center gap-1.5 font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] hover:brightness-110"
      style={{
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.12)",
        borderRadius: "13px",
        padding: "9px 13px",
        fontSize: "12px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <RefreshCw
        className={spinning ? "animate-spin-once" : ""}
        style={{ width: "14px", height: "14px", color: iconColor, transition: "color 0.3s" }}
        aria-hidden="true"
      />
      {label}
    </button>
  );
}

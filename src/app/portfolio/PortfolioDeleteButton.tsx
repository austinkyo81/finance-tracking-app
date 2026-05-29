"use client";

import { useTransition } from "react";
import { deleteStockAsset } from "@/app/portfolio/actions";
import { Trash2, Loader2 } from "lucide-react";

interface PortfolioDeleteButtonProps {
  id: string;
}

export default function PortfolioDeleteButton({ id }: PortfolioDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteStockAsset(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete position"
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40 cursor-pointer hover:brightness-125"
      style={{
        backgroundColor: "rgba(251,113,133,0.1)",
        border: "1px solid rgba(251,113,133,0.15)",
        color: "#fb7185",
      }}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

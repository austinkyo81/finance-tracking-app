"use client";

import { useTransition } from "react";
import { deleteTransaction } from "@/app/transactions/actions";
import { Trash2, Loader2 } from "lucide-react";

interface TransactionDeleteButtonProps {
  id: string;
}

export default function TransactionDeleteButton({ id }: TransactionDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteTransaction(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete transaction"
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-40"
      style={{
        backgroundColor: "rgba(251,113,133,0.1)",
        border: "1px solid rgba(251,113,133,0.15)",
        color: "#fb7185",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(251,113,133,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(251,113,133,0.1)";
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

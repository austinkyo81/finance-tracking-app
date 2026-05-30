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
      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150 disabled:opacity-40 cursor-pointer hover:brightness-105"
      style={{
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
      }}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );
}

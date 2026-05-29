"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Transaction } from "@/generated/prisma/client";

/**
 * Returns all transactions ordered by date descending (most recent first).
 */
export async function getTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
}

/**
 * Creates a new transaction record.
 *
 * The incoming `date` is an ISO string from the client; it is converted to a
 * Date object before being persisted so Prisma receives the correct type.
 */
export async function createTransaction(data: {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description?: string;
  date: string;
}): Promise<void> {
  await prisma.transaction.create({
    data: {
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description ?? null,
      date: new Date(data.date),
    },
  });

  revalidatePath("/");
  revalidatePath("/transactions");
}

/**
 * Deletes a transaction by its primary key.
 */
export async function deleteTransaction(id: string): Promise<void> {
  await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/transactions");
}

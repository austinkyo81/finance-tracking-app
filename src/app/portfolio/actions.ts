"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fetchStockPrice } from "@/lib/api";
import type { StockAsset } from "@/generated/prisma/client";

/**
 * Returns all stock assets ordered alphabetically by ticker.
 */
export async function getStockAssets(): Promise<StockAsset[]> {
  return prisma.stockAsset.findMany({
    orderBy: { ticker: "asc" },
  });
}

/**
 * Adds a new stock asset. If the ticker already exists (unique constraint),
 * updates the share count instead of creating a duplicate record.
 *
 * Ticker is normalised to uppercase before persisting.
 */
export async function addStockAsset(data: {
  ticker: string;
  shares: number;
}): Promise<void> {
  const ticker = data.ticker.toUpperCase();

  await prisma.stockAsset.upsert({
    where: { ticker },
    create: { ticker, shares: data.shares },
    update: { shares: data.shares },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
}

/**
 * Updates the share count for an existing stock asset identified by id.
 */
export async function updateStockAsset(
  id: string,
  shares: number
): Promise<void> {
  await prisma.stockAsset.update({
    where: { id },
    data: { shares },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
}

/**
 * Deletes a stock asset by its primary key.
 */
export async function deleteStockAsset(id: string): Promise<void> {
  await prisma.stockAsset.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
}

/**
 * Fetches live prices for every tracked ticker via yahoo-finance2 and
 * persists successful results back to the database.
 *
 * Returns the count of successfully updated records and a list of tickers
 * whose price fetch failed (so the caller can surface errors to the user).
 */
export async function syncStockPrices(): Promise<{
  updated: number;
  errors: string[];
}> {
  const assets = await prisma.stockAsset.findMany();

  const results = await Promise.allSettled(
    assets.map(async (asset) => {
      const price = await fetchStockPrice(asset.ticker);
      if (price === null) {
        throw new Error(asset.ticker);
      }
      await prisma.stockAsset.update({
        where: { id: asset.id },
        data: { lastPrice: price },
      });
      return asset.ticker;
    })
  );

  let updated = 0;
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      updated++;
    } else {
      // The rejection reason is an Error whose message is the ticker symbol.
      const reason: unknown = result.reason;
      const ticker =
        reason instanceof Error ? reason.message : String(reason);
      errors.push(ticker);
    }
  }

  if (updated > 0) {
    revalidatePath("/");
    revalidatePath("/portfolio");
  }

  return { updated, errors };
}

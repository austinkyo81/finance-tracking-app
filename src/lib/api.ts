import yahooFinance from "yahoo-finance2";

/**
 * Fetches the current market price for a given stock ticker via yahoo-finance2.
 *
 * Returns null on any error so callers can gracefully fall back to the
 * lastPrice value already stored in the database.
 */
export async function fetchStockPrice(ticker: string): Promise<number | null> {
  try {
    const result = await yahooFinance.quote(ticker) as unknown as { regularMarketPrice?: number };
    return result.regularMarketPrice ?? null;
  } catch {
    return null;
  }
}

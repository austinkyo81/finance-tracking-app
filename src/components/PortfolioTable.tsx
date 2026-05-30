import PortfolioDeleteButton from "@/app/portfolio/PortfolioDeleteButton";

type StockAsset = {
  id: string;
  ticker: string;
  shares: number;
  lastPrice: number;
  updatedAt: Date;
};

interface PortfolioTableProps {
  assets: StockAsset[];
}

/* Per-ticker tint from spec — falls back to blue */
const TICKER_TINTS: Record<string, { bg: string; color: string }> = {
  AAPL: { bg: "#f1f5f9", color: "#0f172a" },
  MSFT: { bg: "#dbeafe", color: "#1d4ed8" },
  NVDA: { bg: "#dcfce7", color: "#15803d" },
  GOOG: { bg: "#fef3c7", color: "#b45309" },
  TSLA: { bg: "#fee2e2", color: "#b91c1c" },
};

function getTickerTint(ticker: string) {
  return TICKER_TINTS[ticker.toUpperCase()] ?? { bg: "#dbeafe", color: "#1d4ed8" };
}

function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PortfolioTable({ assets }: PortfolioTableProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "#eff6ff" }}
        >
          <span className="text-lg font-bold" style={{ color: "#1a4b9f" }}>$</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#64748b" }}>No positions yet</p>
        <p className="mt-1 text-xs" style={{ color: "#94a3b8" }}>Add your first stock position above</p>
      </div>
    );
  }

  const grandTotal = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);

  return (
    <div className="space-y-2.5">
      {assets.map((asset) => {
        const totalValue = asset.shares * asset.lastPrice;
        const tint = getTickerTint(asset.ticker);
        /* Portfolio weight — used as a proxy for a percentage display */
        const weight = grandTotal > 0 ? (totalValue / grandTotal) * 100 : 0;
        const isPositive = weight > 0;

        return (
          <div
            key={asset.id}
            className="row-item group flex items-center justify-between"
          >
            {/* Left: ticker tile + name + meta */}
            <div className="flex items-center gap-3">
              {/* Ticker tile — 46×46, 14px radius, per-ticker tint */}
              <div
                className="flex shrink-0 items-center justify-center rounded-[14px] font-extrabold"
                style={{
                  width: "46px",
                  height: "46px",
                  background: tint.bg,
                  color: tint.color,
                  fontSize: "12px",
                  letterSpacing: "0.3px",
                  fontFamily: "var(--font-mono), 'DM Mono', monospace",
                }}
                aria-hidden="true"
              >
                {asset.ticker.slice(0, 4)}
              </div>

              <div>
                <p
                  className="font-semibold"
                  style={{ fontSize: "14.5px", letterSpacing: "-0.2px", color: "#0f172a" }}
                >
                  {asset.ticker}
                </p>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                  {asset.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares
                  {" · "}
                  {formatCurrencyCompact(asset.lastPrice)}
                </p>
              </div>
            </div>

            {/* Right: total value + delta pill */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className="font-bold tabular-nums"
                style={{
                  fontSize: "15px",
                  letterSpacing: "-0.3px",
                  color: "#0f172a",
                  fontFamily: "var(--font-mono), 'DM Mono', monospace",
                }}
              >
                {formatCurrencyCompact(totalValue)}
              </span>

              {/* Delta pill — portfolio weight */}
              <span
                className="inline-flex items-center gap-1 font-extrabold"
                style={{
                  fontSize: "10.5px",
                  color: isPositive ? "#047857" : "#b91c1c",
                  background: isPositive ? "#d1fae5" : "#fee2e2",
                  border: `1px solid ${isPositive ? "#a7f3d0" : "#fecaca"}`,
                  borderRadius: "8px",
                  padding: "3px 7px",
                }}
              >
                {/* Arrow */}
                <svg
                  width="8" height="8" viewBox="0 0 12 12" fill="none"
                  style={{ transform: isPositive ? "none" : "rotate(180deg)" }}
                  aria-hidden="true"
                >
                  <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {weight.toFixed(2)}%
              </span>
            </div>

            {/* Delete — hover-reveal */}
            <div className="ml-2 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <PortfolioDeleteButton id={asset.id} />
            </div>
          </div>
        );
      })}

      {/* Grand total row */}
      <div
        className="flex items-center justify-between rounded-[20px] px-3.5 py-3"
        style={{
          background: "#eff6ff",
          border: "1px solid rgba(26,75,159,0.08)",
        }}
      >
        <span
          className="font-bold uppercase"
          style={{ fontSize: "11px", letterSpacing: "1px", color: "#64748b" }}
        >
          Total Portfolio
        </span>
        <span
          className="font-bold tabular-nums"
          style={{
            fontSize: "15px",
            color: "#1a4b9f",
            fontFamily: "var(--font-mono), 'DM Mono', monospace",
          }}
        >
          {formatCurrencyCompact(grandTotal)}
        </span>
      </div>
    </div>
  );
}

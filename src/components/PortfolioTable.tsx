import { formatCurrency, formatDate } from "@/lib/utils";
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

export default function PortfolioTable({ assets }: PortfolioTableProps) {
  if (assets.length === 0) {
    return (
      <div
        className="rounded-xl flex flex-col items-center justify-center py-16"
        style={{
          backgroundColor: "#111827",
          border: "1px dashed #1e2d45",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: "#0b0f1a", border: "1px solid #1e2d45" }}
        >
          <span style={{ color: "#4a6080", fontSize: "18px" }}>$</span>
        </div>
        <p className="text-sm font-medium" style={{ color: "#4a6080" }}>
          No positions yet
        </p>
        <p className="text-xs mt-1" style={{ color: "#2a3f5e" }}>
          Add your first stock position above
        </p>
      </div>
    );
  }

  const grandTotal = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #1e2d45",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Table header */}
      <div
        className="grid px-5 py-3"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr 44px",
          borderBottom: "1px solid #1e2d45",
          backgroundColor: "#0d1520",
        }}
      >
        {["Ticker", "Shares", "Last Price", "Total Value", ""].map((col) => (
          <span
            key={col}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: "#4a6080",
              fontFamily: "var(--font-display), Syne, sans-serif",
              textAlign: col === "Shares" || col === "Last Price" || col === "Total Value" ? "right" : "left",
            }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {assets.map((asset, idx) => {
        const totalValue = asset.shares * asset.lastPrice;
        const isLast = idx === assets.length - 1;

        return (
          <div
            key={asset.id}
            className="grid items-center px-5 py-3.5 transition-colors duration-150 hover:bg-white/[0.02] group"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr 44px",
              borderBottom: isLast ? "none" : "1px solid #162033",
            }}
          >
            {/* Ticker */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(56,189,248,0.1)",
                  border: "1px solid rgba(56,189,248,0.15)",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color: "#38bdf8",
                    fontFamily: "var(--font-mono), 'DM Mono', monospace",
                  }}
                >
                  {asset.ticker.charAt(0)}
                </span>
              </div>
              <div>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: "#f0f4ff",
                    fontFamily: "var(--font-mono), 'DM Mono', monospace",
                    letterSpacing: "0.04em",
                  }}
                >
                  {asset.ticker}
                </span>
                <p
                  className="text-xs"
                  style={{ color: "#4a6080" }}
                >
                  {formatDate(asset.updatedAt)}
                </p>
              </div>
            </div>

            {/* Shares */}
            <span
              className="text-sm tabular-nums text-right"
              style={{
                color: "#8ba4c0",
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
              }}
            >
              {asset.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>

            {/* Last Price */}
            <span
              className="text-sm tabular-nums text-right"
              style={{
                color: "#8ba4c0",
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
              }}
            >
              {formatCurrency(asset.lastPrice)}
            </span>

            {/* Total Value */}
            <span
              className="text-sm font-semibold tabular-nums text-right"
              style={{
                color: "#38bdf8",
                fontFamily: "var(--font-mono), 'DM Mono', monospace",
              }}
            >
              {formatCurrency(totalValue)}
            </span>

            {/* Delete */}
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <PortfolioDeleteButton id={asset.id} />
            </div>
          </div>
        );
      })}

      {/* Grand total row */}
      <div
        className="grid items-center px-5 py-3.5"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr 44px",
          borderTop: "1px solid #1e2d45",
          backgroundColor: "#0d1520",
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Total
        </span>
        <span />
        <span />
        <span
          className="text-base font-bold tabular-nums text-right"
          style={{
            color: "#38bdf8",
            fontFamily: "var(--font-mono), 'DM Mono', monospace",
          }}
        >
          {formatCurrency(grandTotal)}
        </span>
        <span />
      </div>
    </div>
  );
}

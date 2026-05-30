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
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: "#eff6ff" }}
        >
          <span className="text-lg font-bold" style={{ color: "#1a4b9f" }}>$</span>
        </div>
        <p className="text-sm font-medium text-slate-500">No positions yet</p>
        <p className="text-xs mt-1 text-slate-400">Add your first stock position above</p>
      </div>
    );
  }

  const grandTotal = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);

  return (
    <div className="space-y-2">
      {/* Column labels */}
      <div className="grid px-3 pb-1" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 36px" }}>
        {["Ticker", "Shares", "Price", "Value", ""].map((col) => (
          <span
            key={col}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400"
            style={{
              textAlign: col === "Shares" || col === "Price" || col === "Value" ? "right" : "left",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Asset rows */}
      {assets.map((asset) => {
        const totalValue = asset.shares * asset.lastPrice;

        return (
          <div
            key={asset.id}
            className="grid items-center p-3 rounded-2xl group cursor-pointer transition-colors duration-150 hover:bg-slate-100"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr 36px",
              backgroundColor: "#f8fafc",
              border: "1px solid rgba(226,232,240,0.5)",
            }}
          >
            {/* Ticker */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#eff6ff" }}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color: "#1a4b9f",
                    fontFamily: "var(--font-mono), 'DM Mono', monospace",
                  }}
                >
                  {asset.ticker.slice(0, 2)}
                </span>
              </div>
              <div>
                <span
                  className="text-xs font-bold text-slate-800"
                  style={{
                    fontFamily: "var(--font-mono), 'DM Mono', monospace",
                    letterSpacing: "0.04em",
                  }}
                >
                  {asset.ticker}
                </span>
                <p className="text-[10px] text-slate-400">{formatDate(asset.updatedAt)}</p>
              </div>
            </div>

            {/* Shares */}
            <span
              className="text-xs tabular-nums text-right text-slate-500"
              style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
            >
              {asset.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </span>

            {/* Last Price */}
            <span
              className="text-xs tabular-nums text-right text-slate-500"
              style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
            >
              {formatCurrency(asset.lastPrice)}
            </span>

            {/* Total Value */}
            <span
              className="text-sm font-bold tabular-nums text-right"
              style={{ color: "#1a4b9f", fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
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

      {/* Grand total */}
      <div
        className="grid items-center px-3 py-3 rounded-2xl"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr 36px",
          backgroundColor: "#eff6ff",
          border: "1px solid rgba(26,75,159,0.08)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
          style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}
        >
          Total
        </span>
        <span /><span />
        <span
          className="text-sm font-bold tabular-nums text-right"
          style={{ color: "#1a4b9f", fontFamily: "var(--font-mono), 'DM Mono', monospace" }}
        >
          {formatCurrency(grandTotal)}
        </span>
        <span />
      </div>
    </div>
  );
}

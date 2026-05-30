export const dynamic = "force-dynamic";

import { getStockAssets } from "@/app/portfolio/actions";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioTable from "@/components/PortfolioTable";
import SyncButton from "@/app/portfolio/SyncButton";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Sliders } from "lucide-react";

export default async function PortfolioPage() {
  const assets = await getStockAssets();
  const totalValue = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);
  const totalPositions = assets.length;

  return (
    <div className="flex-1 flex flex-col space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Stock Portfolio
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Market Engine Asset Tracker
          </p>
        </div>
        <SyncButton />
      </div>

      {/* Glassmorphic hero card */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>
          Aggregate Holdings Evaluation
        </span>
        <div
          className="text-4xl font-extrabold tracking-tight my-1.5 text-white"
          style={{
            fontFamily: "var(--font-mono), 'DM Mono', monospace",
            letterSpacing: "-0.03em",
          }}
        >
          {formatCurrency(totalValue)}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#3de3b2" }}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            {totalPositions} position{totalPositions !== 1 ? "s" : ""} · live market data
          </span>
        </div>
      </div>

      {/* White sliding sheet */}
      <div
        className="bg-white -mx-4 flex-1 px-5 pt-6 pb-32"
        style={{
          borderRadius: "2.5rem 2.5rem 0 0",
          boxShadow: "0 -8px 40px rgba(26,75,159,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif" }}
          >
            Position Ledger Blocks
          </h2>
          <Sliders className="w-4 h-4 text-slate-400" />
        </div>

        {/* Add position form inside sheet */}
        <div className="mb-5">
          <PortfolioForm />
        </div>

        {/* Holdings table */}
        <PortfolioTable assets={assets} />
      </div>
    </div>
  );
}

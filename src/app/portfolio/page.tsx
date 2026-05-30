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
    <div className="flex flex-1 flex-col">
      {/* ── Page header ── */}
      <div
        className="flex items-flex-start justify-between"
        style={{ padding: "6px 22px 16px" }}
      >
        <div>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "27px", letterSpacing: "-0.5px" }}
          >
            Stock Portfolio
          </h1>
          <p
            className="mt-0.5"
            style={{ fontSize: "13px", color: "rgba(219,234,254,0.8)" }}
          >
            Market engine asset tracker
          </p>
        </div>
        {/* Sync button — glass style from spec */}
        <SyncButton />
      </div>

      {/* ── Hero value card — glass, 26px radius ── */}
      <div
        style={{
          margin: "0 22px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: "26px",
          padding: "20px 22px",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <p
          className="font-medium"
          style={{ fontSize: "12px", color: "rgba(219,234,254,0.85)" }}
        >
          Aggregate Holdings Evaluation
        </p>
        <p
          className="font-extrabold text-white"
          style={{
            fontSize: "38px",
            letterSpacing: "-1.5px",
            margin: "4px 0 6px",
            fontFamily: "var(--font-mono), 'DM Mono', monospace",
          }}
        >
          {formatCurrency(totalValue)}
        </p>
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ fontSize: "12.5px", color: "#3de3b2" }}
        >
          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {totalPositions} position{totalPositions !== 1 ? "s" : ""} · live market data
          </span>
        </div>
      </div>

      {/* ── White sheet — Position Ledger ── */}
      <div
        className="sheet animate-fade-in-up"
        style={{ marginTop: "18px" }}
      >
        {/* Sheet header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p
              className="font-bold uppercase"
              style={{ fontSize: "11px", letterSpacing: "1px", color: "#94a3b8", marginBottom: "4px" }}
            >
              Holdings
            </p>
            <h2
              className="font-bold"
              style={{ fontSize: "18px", letterSpacing: "-0.3px", color: "#0f172a", margin: 0 }}
            >
              Position Ledger
            </h2>
          </div>
          <Sliders className="w-[18px] h-[18px]" style={{ color: "#94a3b8" }} aria-hidden="true" />
        </div>

        {/* Add position form */}
        <div className="mb-5">
          <PortfolioForm />
        </div>

        {/* Holdings */}
        <PortfolioTable assets={assets} />
      </div>
    </div>
  );
}

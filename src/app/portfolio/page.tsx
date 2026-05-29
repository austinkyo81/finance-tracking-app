export const dynamic = "force-dynamic";

import { getStockAssets } from "@/app/portfolio/actions";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioTable from "@/components/PortfolioTable";
import SyncButton from "@/app/portfolio/SyncButton";
import { BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function PortfolioPage() {
  const assets = await getStockAssets();
  const totalValue = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);
  const totalPositions = assets.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.1) 100%)",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
          >
            <BarChart3 className="w-4 h-4" style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                color: "#f0f4ff",
                fontFamily: "var(--font-display), Syne, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Portfolio
            </h1>
            <p className="text-sm" style={{ color: "#4a6080" }}>
              {totalPositions} position{totalPositions !== 1 ? "s" : ""} &nbsp;&middot;&nbsp; {formatCurrency(totalValue)} total value
            </p>
          </div>
        </div>

        <SyncButton />
      </div>

      <div className="space-y-6">
        {/* Add position form */}
        <PortfolioForm />

        {/* Portfolio table */}
        <PortfolioTable assets={assets} />
      </div>
    </div>
  );
}

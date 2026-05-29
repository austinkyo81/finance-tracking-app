export const dynamic = "force-dynamic";

import { getStockAssets } from "@/app/portfolio/actions";
import PortfolioForm from "@/components/PortfolioForm";
import PortfolioTable from "@/components/PortfolioTable";
import SyncButton from "@/app/portfolio/SyncButton";
import { formatCurrency } from "@/lib/utils";

export default async function PortfolioPage() {
  const assets = await getStockAssets();
  const totalValue = assets.reduce((sum, a) => sum + a.shares * a.lastPrice, 0);
  const totalPositions = assets.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header — on the blue gradient */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-white"
            style={{
              fontFamily: "var(--font-display), Syne, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Portfolio
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
            {totalPositions} position{totalPositions !== 1 ? "s" : ""} &nbsp;&middot;&nbsp; {formatCurrency(totalValue)} total value
          </p>
        </div>

        <SyncButton />
      </div>

      <div className="space-y-6">
        {/* Add position form — white card */}
        <PortfolioForm />

        {/* Portfolio table — white card */}
        <PortfolioTable assets={assets} />
      </div>
    </div>
  );
}

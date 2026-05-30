"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Plus, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transactions", label: "Ledger", icon: Wallet },
  { href: "/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingBottom: "max(22px, env(safe-area-inset-bottom))" }}
    >
      {/* Floating pill — 330px wide matching spec */}
      <div
        className="flex items-center justify-around px-3.5"
        style={{
          width: "330px",
          height: "64px",
          borderRadius: "40px",
          background: "rgba(11,18,32,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 18px 40px -10px rgba(0,0,0,0.6)",
        }}
      >
        {/* Home */}
        <NavItem href="/" label="Home" icon={Home} active={pathname === "/"} />

        {/* Ledger */}
        <NavItem
          href="/transactions"
          label="Ledger"
          icon={Wallet}
          active={pathname.startsWith("/transactions")}
        />

        {/* Center add button — mint circle */}
        <Link
          href="/transactions"
          aria-label="Add transaction"
          className="flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "#3de3b2",
            color: "#06281f",
            boxShadow: "0 8px 20px -4px rgba(61,227,178,0.7)",
          }}
        >
          <Plus strokeWidth={2.4} className="w-6 h-6" />
        </Link>

        {/* Portfolio */}
        <NavItem
          href="/portfolio"
          label="Portfolio"
          icon={TrendingUp}
          active={pathname.startsWith("/portfolio")}
        />

        {/* Analytics */}
        <NavItem
          href="/analytics"
          label="Analytics"
          icon={BarChart3}
          active={pathname.startsWith("/analytics")}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
        "w-11 h-11 rounded-full",
        active ? "text-white" : "text-white/40 hover:text-white/65"
      )}
    >
      <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.8} />
      {/* Mint dot indicator */}
      <span
        className="absolute bottom-0.5 w-1 h-1 rounded-full transition-all duration-200"
        style={{ background: active ? "#3de3b2" : "transparent" }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </Link>
  );
}

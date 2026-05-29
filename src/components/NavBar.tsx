"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, LayoutDashboard, ArrowLeftRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="relative z-50 border-b"
      style={{
        backgroundColor: "rgba(11, 15, 26, 0.92)",
        borderColor: "#1e2d45",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #34d399 100%)",
                boxShadow: "0 0 16px rgba(56, 189, 248, 0.3)",
              }}
            >
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-lg font-bold tracking-tight transition-opacity group-hover:opacity-80"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
              }}
            >
              Fin<span style={{ color: "#38bdf8" }}>Track</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-white"
                      : "hover:text-white"
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: "rgba(56, 189, 248, 0.12)",
                          color: "#38bdf8",
                          boxShadow: "inset 0 0 0 1px rgba(56, 189, 248, 0.2)",
                        }
                      : {
                          color: "#8ba4c0",
                        }
                  }
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                  <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif" }}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

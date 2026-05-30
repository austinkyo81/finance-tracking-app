"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, Wallet, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: Landmark },
  { href: "/transactions", label: "Transactions", icon: Wallet },
  { href: "/portfolio", label: "Portfolio", icon: TrendingUp },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className="w-full max-w-sm flex items-center justify-around px-2 py-2.5 rounded-full"
        style={{
          backgroundColor: "rgba(2,6,23,0.90)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-5 py-2 rounded-full transition-all duration-200 cursor-pointer",
                isActive ? "" : "text-slate-600 hover:text-slate-400"
              )}
              style={
                isActive
                  ? { backgroundColor: "rgba(61,227,178,0.14)", color: "#3de3b2" }
                  : undefined
              }
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-xs font-medium">{label}</span>
              <span
                className="w-1 h-1 rounded-full transition-all duration-200"
                style={{ backgroundColor: isActive ? "#3de3b2" : "transparent" }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

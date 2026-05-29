"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, BarChart3 } from "lucide-react";
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
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className="max-w-sm mx-auto flex items-center justify-around px-2 py-2 rounded-2xl"
        style={{
          backgroundColor: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
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
                "flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors duration-150",
                isActive
                  ? "text-blue-400"
                  : "text-slate-600 hover:text-slate-400"
              )}
              style={
                isActive
                  ? { backgroundColor: "rgba(37,99,235,0.15)" }
                  : undefined
              }
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className="text-xs font-medium"
                style={{ fontFamily: "var(--font-body), 'IBM Plex Sans', sans-serif" }}
              >
                {label}
              </span>
              {/* Active dot indicator */}
              <span
                className="w-1 h-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isActive ? "#60a5fa" : "transparent",
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

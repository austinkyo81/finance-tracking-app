import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  /** "glass" = glassmorphic on gradient (default), "sheet" = inside white sheet */
  variant?: "glass" | "sheet";
}

function Card({ title, children, className, headerAction, variant = "glass" }: CardProps) {
  const isGlass = variant === "glass";

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={
        isGlass
          ? {
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "26px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }
          : {
              background: "#f8fafc",
              border: "1px solid rgba(241,245,249,0.9)",
              borderRadius: "22px",
            }
      }
    >
      {(title || headerAction) && (
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 16px",
            borderBottom: isGlass
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid #e9eef5",
          }}
        >
          {title && (
            <p
              className="font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "1px",
                color: isGlass ? "rgba(219,234,254,0.85)" : "#94a3b8",
              }}
            >
              {title}
            </p>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

export { Card };
export type { CardProps };

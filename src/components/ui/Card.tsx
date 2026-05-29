import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

function Card({ title, children, className, headerAction }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {(title || headerAction) && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {title && (
            <h2
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
              }}
            >
              {title}
            </h2>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export { Card };
export type { CardProps };

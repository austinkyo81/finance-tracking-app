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
      className={cn("rounded-xl overflow-hidden", className)}
      style={{
        backgroundColor: "#111827",
        border: "1px solid #1e2d45",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {(title || headerAction) && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #1e2d45" }}
        >
          {title && (
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{
                color: "#4a6080",
                fontFamily: "var(--font-display), Syne, sans-serif",
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

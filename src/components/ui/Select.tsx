import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  /** "light" = inside white sheet (default), "dark" = on gradient */
  context?: "light" | "dark";
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, context = "light", ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isLight = context === "light";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[10px] font-bold uppercase tracking-[0.8px]"
            style={{ color: "#94a3b8" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none cursor-pointer outline-none transition-all duration-200 font-semibold",
              className
            )}
            style={{
              fontSize: "15px",
              padding: "10px 14px",
              paddingRight: "2.5rem",
              borderRadius: "14px",
              border: `1px solid ${error ? "#fca5a5" : isLight ? "#e2e8f0" : "rgba(255,255,255,0.2)"}`,
              background: isLight ? "#ffffff" : "rgba(255,255,255,0.08)",
              color: isLight ? "#0f172a" : "#ffffff",
              boxShadow: error ? "0 0 0 4px rgba(251,113,133,0.12)" : "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? "#fca5a5"
                : isLight ? "#e2e8f0" : "rgba(255,255,255,0.2)";
              e.currentTarget.style.boxShadow = error
                ? "0 0 0 4px rgba(251,113,133,0.12)"
                : "none";
              props.onBlur?.(e);
            }}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {error && (
          <p className="text-xs font-medium" style={{ color: "#ef4444" }}>{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };

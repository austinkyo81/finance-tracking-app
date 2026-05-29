import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium uppercase tracking-widest"
            style={{
              color: "#94a3b8",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-xl px-3.5 py-2.5 text-sm appearance-none cursor-pointer transition-all duration-200",
              "border text-slate-100",
              "focus:outline-none",
              error ? "border-rose-500" : "border-slate-700",
              className
            )}
            style={{
              backgroundColor: "#0f172a",
              boxShadow: error
                ? "0 0 0 3px rgba(251,113,133,0.15)"
                : "none",
              paddingRight: "2.5rem",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.2)";
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "#f43f5e" : "#334155";
              e.currentTarget.style.boxShadow = error
                ? "0 0 0 3px rgba(251,113,133,0.15)"
                : "none";
              props.onBlur?.(e);
            }}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ backgroundColor: "#1e293b", color: "#f8fafc" }}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "#64748b" }}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };

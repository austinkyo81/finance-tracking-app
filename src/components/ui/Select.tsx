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
            style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full rounded-lg px-3.5 py-2.5 text-sm appearance-none cursor-pointer transition-all duration-200",
              "focus:outline-none",
              className
            )}
            style={{
              backgroundColor: "#111827",
              color: "#f0f4ff",
              border: error ? "1px solid rgba(251, 113, 133, 0.5)" : "1px solid #1e2d45",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
              paddingRight: "2.5rem",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(56, 189, 248, 0.4)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 2px rgba(0,0,0,0.3), 0 0 0 3px rgba(56, 189, 248, 0.06)";
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = error
                ? "1px solid rgba(251, 113, 133, 0.5)"
                : "1px solid #1e2d45";
              e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.3)";
              props.onBlur?.(e);
            }}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                style={{ backgroundColor: "#111827", color: "#f0f4ff" }}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "#4a6080" }}
          />
        </div>
        {error && (
          <p className="text-xs" style={{ color: "#fb7185" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-widest"
            style={{
              color: "#94a3b8",
              fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200",
            "border",
            "placeholder:text-slate-500",
            "focus:outline-none",
            error
              ? "border-rose-500 text-slate-100"
              : "border-slate-700 text-slate-100",
            className
          )}
          style={{
            backgroundColor: "#0f172a",
            boxShadow: error
              ? "0 0 0 3px rgba(251,113,133,0.15)"
              : "none",
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
        />
        {error && (
          <p className="text-xs text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };

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
            style={{ color: "#4a6080", fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200",
            "placeholder:text-slate-600",
            "focus:outline-none",
            error ? "" : "",
            className
          )}
          style={{
            backgroundColor: "#111827",
            color: "#f0f4ff",
            border: error ? "1px solid rgba(251, 113, 133, 0.5)" : "1px solid #1e2d45",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
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
        />
        {error && (
          <p className="text-xs" style={{ color: "#fb7185" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };

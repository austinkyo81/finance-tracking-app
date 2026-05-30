import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Use "light" for inputs inside white sheets (default), "dark" for inputs on gradient */
  context?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, context = "light", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isLight = context === "light";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-bold uppercase tracking-[0.8px]"
            style={{ color: "#94a3b8" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full outline-none transition-all duration-200",
            "font-semibold placeholder:font-medium",
            className
          )}
          style={{
            fontSize: "15px",
            padding: "10px 14px",
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
        />
        {error && (
          <p className="text-xs font-medium" style={{ color: "#ef4444" }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };

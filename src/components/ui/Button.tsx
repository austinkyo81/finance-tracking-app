import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "primary" | "danger" | "success" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  primary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
  },
  danger: {
    backgroundColor: "#1f0a0d",
    color: "#fb7185",
    border: "1px solid rgba(251,113,133,0.2)",
  },
  success: {
    backgroundColor: "#052e16",
    color: "#34d399",
    border: "1px solid rgba(52,211,153,0.2)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.1)",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      className,
      disabled,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "hover:brightness-110 active:scale-[0.98]",
          sizeStyles[size],
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };

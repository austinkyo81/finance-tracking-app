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
    backgroundColor: "#1a2235",
    color: "#8ba4c0",
    border: "1px solid #1e2d45",
  },
  primary: {
    background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    color: "#ffffff",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    boxShadow: "0 0 16px rgba(56, 189, 248, 0.2)",
  },
  danger: {
    backgroundColor: "rgba(251, 113, 133, 0.12)",
    color: "#fb7185",
    border: "1px solid rgba(251, 113, 133, 0.2)",
  },
  success: {
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    color: "#34d399",
    border: "1px solid rgba(52, 211, 153, 0.2)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#8ba4c0",
    border: "1px solid transparent",
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
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
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

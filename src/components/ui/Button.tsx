import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "primary" | "danger" | "success" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/* Variant styles match the spec's design tokens */
const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  primary: {
    backgroundColor: "#1a4b9f",
    color: "#ffffff",
    border: "none",
    boxShadow: "0 10px 22px -8px rgba(26,75,159,0.7)",
  },
  danger: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
  success: {
    backgroundColor: "#d1fae5",
    color: "#047857",
    border: "1px solid #a7f3d0",
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.16)",
    backdropFilter: "blur(10px)",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
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
          "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "hover:brightness-110 active:scale-[0.97]",
          sizeStyles[size],
          className
        )}
        style={{
          borderRadius: "14px",
          ...variantStyles[variant],
          ...style,
        }}
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

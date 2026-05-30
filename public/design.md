# Design System — Finance App

## Design Theme

Dark fintech theme using Tailwind CSS v4 + inline `style` props for dynamic values.

**Fonts:**
- IBM Plex Sans — headings + body (`--font-display`, `--font-body`)
- DM Mono — numbers, tickers (`--font-mono`)

---

## globals.css

```css
@import "tailwindcss";

@theme inline {
  --font-display: "IBM Plex Sans", sans-serif;
  --font-body: "IBM Plex Sans", sans-serif;
  --font-mono: "DM Mono", monospace;

  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-raised: #334155;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-subtle: rgba(255, 255, 255, 0.05);

  --color-income: #34d399;
  --color-income-dim: rgba(52, 211, 153, 0.15);
  --color-expense: #fb7185;
  --color-expense-dim: rgba(251, 113, 133, 0.15);
  --color-accent: #2563eb;
  --color-accent-dim: rgba(37, 99, 235, 0.15);

  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
}

:root {
  --background: #0f172a;
  --foreground: #f8fafc;
}

html {
  color-scheme: dark;
}

body {
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  background-attachment: fixed;
  min-height: 100vh;
  color: var(--foreground);
  font-family: "IBM Plex Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling — dark theme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Date input color fix for dark context */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
  cursor: pointer;
  opacity: 0.6;
}

/* Number input hide spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
  50% { box-shadow: 0 0 16px 2px rgba(52, 211, 153, 0.25); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

.glow-income {
  animation: pulse-glow 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .glow-income {
    animation: none;
  }
}
```

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#0f172a` | Page background (slate-900) |
| `--color-surface` | `#1e293b` | Cards, panels (slate-800) |
| `--color-surface-raised` | `#334155` | Raised elements (slate-700) |
| `--color-border` | `rgba(255,255,255,0.08)` | Default borders |
| `--color-border-subtle` | `rgba(255,255,255,0.05)` | Subtle dividers |
| `--color-income` | `#34d399` | Positive values, income |
| `--color-income-dim` | `rgba(52,211,153,0.15)` | Income backgrounds |
| `--color-expense` | `#fb7185` | Negative values, expenses |
| `--color-expense-dim` | `rgba(251,113,133,0.15)` | Expense backgrounds |
| `--color-accent` | `#2563eb` | CTA, primary actions (blue-600) |
| `--color-accent-dim` | `rgba(37,99,235,0.15)` | Accent backgrounds |
| `--color-text-primary` | `#f8fafc` | Main text |
| `--color-text-secondary` | `#94a3b8` | Secondary text (slate-400) |
| `--color-text-muted` | `#64748b` | Muted labels (slate-500) |

---

## UI Components

### Button — `src/components/ui/Button.tsx`

```tsx
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
  ({ variant = "default", size = "md", className, disabled, style, children, ...props }, ref) => {
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
```

---

### Card — `src/components/ui/Card.tsx`

```tsx
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
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {(title || headerAction) && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {title && (
            <h2
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: "#64748b",
                fontFamily: "var(--font-display), 'IBM Plex Sans', sans-serif",
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
```

---

### Input — `src/components/ui/Input.tsx`

```tsx
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
            boxShadow: error ? "0 0 0 3px rgba(251,113,133,0.15)" : "none",
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
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
```

---

### Select — `src/components/ui/Select.tsx`

```tsx
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
              boxShadow: error ? "0 0 0 3px rgba(251,113,133,0.15)" : "none",
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
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };
```

---

## Patterns

### Card pattern
```tsx
<div
  style={{
    backgroundColor: "#1e293b",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  }}
  className="rounded-2xl overflow-hidden"
>
```

### Row hover (RSC-safe — no onClick)
```tsx
className="... transition-colors duration-150 hover:bg-slate-700/40"
```

### Section label
```tsx
<h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>
  Title
</h2>
```

### Mono numbers / tickers
```tsx
<span style={{ fontFamily: "var(--font-mono), 'DM Mono', monospace" }}>
  $1,234.56
</span>
```

### Income / expense pill
```tsx
// Income
<span style={{ color: "#34d399", backgroundColor: "rgba(52,211,153,0.15)" }}
  className="rounded-full px-2.5 py-0.5 text-xs font-medium">
  +$500
</span>

// Expense
<span style={{ color: "#fb7185", backgroundColor: "rgba(251,113,133,0.15)" }}
  className="rounded-full px-2.5 py-0.5 text-xs font-medium">
  -$200
</span>
```

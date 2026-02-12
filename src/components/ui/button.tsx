import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean; // accepted for compatibility; we render a normal <button>
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-black text-white hover:opacity-90",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100",
    };
    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 px-3",
      md: "h-10 px-4",
      lg: "h-11 px-6",
    };

    // We intentionally ignore asChild to avoid extra deps (Radix Slot).
    void asChild;

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

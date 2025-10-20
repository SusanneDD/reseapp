// file: src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

type Variant = "default" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center rounded-2xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  default: "bg-black text-white border-black hover:bg-black/90",
  outline:
    "bg-transparent text-black dark:text-white border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900",
  ghost:
    "bg-transparent text-black dark:text-white border-transparent hover:bg-gray-50 dark:hover:bg-gray-900",
  secondary:
    "bg-gray-200 dark:bg-gray-800 text-black dark:text-white border-transparent hover:bg-gray-300 dark:hover:bg-gray-700",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, variant = "outline", size = "md", disabled, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    const disabledStyles = disabled ? "opacity-50 pointer-events-none" : "";
    return (
      <Comp
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], disabledStyles, className)}
        disabled={!asChild ? disabled : undefined}
        aria-disabled={asChild ? disabled : undefined}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export default Button;

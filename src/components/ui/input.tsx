import clsx from "clsx";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-2xl border px-3 py-2 bg-white text-gray-900 placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50",
        "dark:bg-gray-900/70 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-800",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

import clsx from "clsx";
import * as React from "react";

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
  label?: string;
};

export function Spinner({ className, size = 28, label = "Laddar…", ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx("inline-flex items-center gap-2 text-gray-500 dark:text-gray-300", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          className="opacity-25"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path d="M22 12a10 10 0 0 1-10 10" className="opacity-75" fill="currentColor" />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
}

import clsx from "clsx";
import * as React from "react";

type Base = React.HTMLAttributes<HTMLDivElement>;
export function Card({ className, ...props }: Base) {
  return (
    <div
      className={clsx(
        "rounded-2xl border bg-white text-slate-900 shadow-sm",
        "dark:bg-[#212325] dark:text-neutral-100 dark:border-neutral-800",
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }: Base) {
  return (
    <div
      className={clsx("p-4 border-b border-neutral-200 dark:border-neutral-800", className)}
      {...props}
    />
  );
}
export function CardContent({ className, ...props }: Base) {
  return <div className={clsx("p-4", className)} {...props} />;
}
export function CardFooter({ className, ...props }: Base) {
  return (
    <div
      className={clsx("p-4 border-t border-neutral-200 dark:border-neutral-800", className)}
      {...props}
    />
  );
}

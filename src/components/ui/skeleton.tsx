import clsx from "clsx";
import * as React from "react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  );
}

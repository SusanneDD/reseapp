import * as React from "react";

import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

export default function LoadingGrid() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Spinner label="Laddar länder…" />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="rounded-xl border p-4">
            <Skeleton className="h-24 w-full mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// file: src/components/RegionFilters.tsx
"use client";
import { regionLabels, type Region } from "../lib/utils";

import { Button } from "./ui/button";

type Props = { value: Region; onChange: (r: Region) => void };

export default function RegionFilters({ value, onChange }: Props) {
  return (
    <nav aria-label="Filtera på region" className="flex flex-wrap gap-2">
      {regionLabels.map((r) => (
        <Button
          key={r}
          variant={value === r ? "default" : "outline"}
          onClick={() => onChange(r)}
          aria-pressed={value === r}
        >
          {r}
        </Button>
      ))}
    </nav>
  );
}

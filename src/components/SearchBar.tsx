"use client";
import * as React from "react";

import { Input } from "./ui/input";

type Props = { value: string; onChange: (q: string) => void };

export default function SearchBar({ value, onChange }: Props) {
  const id = "search-countries";
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        Sök länder
      </label>
      <Input
        id={id}
        type="search"
        placeholder="Skriv land…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sök länder"
        autoComplete="off"
      />
    </div>
  );
}

"use client";
import * as React from "react";

import { Button } from "./ui/button";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Paginering">
      {isFirst ? (
        <div aria-hidden className="w-[8.5rem]" />
      ) : (
        <Button type="button" variant="outline" onClick={onPrev} aria-label="Föregående sida">
          Föregående
        </Button>
      )}

      <span className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
        Sida {page} av {totalPages}
      </span>

      {isLast ? (
        <div aria-hidden className="w-[5.5rem]" />
      ) : (
        <Button type="button" variant="outline" onClick={onNext} aria-label="Nästa sida">
          Nästa
        </Button>
      )}
    </nav>
  );
}

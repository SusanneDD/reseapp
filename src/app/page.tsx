"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import CountryCard from "../components/CountryCard";
import ErrorState from "../components/ErrorState";
import LoadingGrid from "../components/LoadingGrid";
import Pagination from "../components/Pagination";
import RegionFilters from "../components/RegionFilters";
import SearchBar from "../components/SearchBar";
import { fetchAllCountries } from "../lib/fetchers";
import { pageSizeOptions, type Region } from "../lib/utils";

import type { Country } from "../lib/types";

export default function HomePage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(params.get("pageSize") || String(pageSizeOptions[0]), 10));
  const query = (params.get("query") || "").trim();
  const region = (params.get("region") || "All") as Region;

  const {
    data = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: fetchAllCountries,
    staleTime: 3600000,
  });

  const filtered = useMemo<Country[]>(() => {
    const q = query.toLowerCase();
    return data
      .filter((c) => (region === "All" ? true : c.region === region))
      .filter((c) => (q ? c.name.common.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  }, [data, query, region]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const start = (pageClamped - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  function setParams(next: Record<string, string | number | undefined>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) sp.delete(k);
      else sp.set(k, String(v));
    });
    router.push(`${pathname}?${sp.toString()}`);
  }
  const handleSearch = (nextQuery: string) => setParams({ query: nextQuery || undefined, page: 1 });
  const handleRegion = (nextRegion: Region) =>
    setParams({ region: nextRegion === "All" ? undefined : nextRegion, page: 1 });
  const handlePrev = () => {
    if (pageClamped > 1) setParams({ page: pageClamped - 1 });
  };
  const handleNext = () => {
    if (pageClamped < totalPages) setParams({ page: pageClamped + 1 });
  };

  return (
    <section className="space-y-6" aria-labelledby="countries-heading">
      <h1 id="countries-heading" className="sr-only">
        Lista över länder
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1 w-full">
          <SearchBar value={query} onChange={handleSearch} />
          <div className="mt-2 text-xs text-gray-500">Ny sökning nollställer till sida 1.</div>
        </div>
        <div>
          <label className="block text-sm font-medium">Page size</label>
          <select
            className="rounded-2xl border px-3 py-2 bg-white dark:bg-gray-900"
            value={pageSize}
            onChange={(e) => setParams({ pageSize: parseInt(e.target.value, 10), page: 1 })}
            aria-label="Antal per sida"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <RegionFilters value={region} onChange={handleRegion} />

      {isLoading || isRefetching ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState
          message={`Något gick fel när länder hämtades. ${(error as Error)?.message ?? ""}`}
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <p role="status" className="text-gray-600">
          Inga länder matchar dina kriterier.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {current.map((c) => (
              <CountryCard
                key={c.cca3}
                code={c.cca3}
                name={c.name.common}
                region={c.region ?? "Unknown"}
                capital={c.capital?.[0] ?? ""}
                flagUrl={c.flags.png || c.flags.svg || ""}
              />
            ))}
          </ul>
          <Pagination
            page={pageClamped}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}
    </section>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import ErrorState from "../../../components/ErrorState";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { fetchCountryByCode, fetchImages, fetchWeather, fetchWikiSummary } from "../../../lib/fetchers";
import { formatNumber } from "../../../lib/types";

import type { Country, UnsplashPhoto, UnsplashSearch, Weather, WikiSummary } from "../../../lib/types";


export default function CountryPage() {
  // 1) Hämta landkod från URL
  const params = useParams<{ code: string[] }>();
  const code = (params.code?.[params.code.length - 1] ?? "").toUpperCase();

  // 2) Landdata
  const countryQ = useQuery<Country>({
    queryKey: ["country", code],
    queryFn: () => fetchCountryByCode(code),
    retry: 1,
    enabled: code.length > 0,
  });
  const country = countryQ.data;

  // 3) Koordinater (capitalInfo.latlng → fallback latlng)
  const coords =
    country?.capitalInfo?.latlng?.length === 2
      ? country.capitalInfo.latlng
      : country?.latlng?.length === 2
      ? country.latlng
      : undefined;

  const lat = coords?.[0];
  const lon = coords?.[1];
  const hasCoords = typeof lat === "number" && typeof lon === "number";

  // 4) Väder 
  const weatherQ = useQuery<Weather>({
    queryKey: ["weather", code, lat, lon],
    queryFn: () => fetchWeather(lat as number, lon as number),
    enabled: hasCoords,
  });

  // 5) Media
  const countryName = country?.name.common ?? "";

  const imagesQ = useQuery<UnsplashSearch>({
    queryKey: ["images", countryName],
    queryFn: () => fetchImages(countryName),
    enabled: !!countryName,
    placeholderData: { results: [] },
  });

  const wikiQ = useQuery<WikiSummary>({
    queryKey: ["wiki", countryName],
    queryFn: () => fetchWikiSummary(countryName),
    enabled: !!countryName,
  });

  // 6) Laddning/fel
  if (countryQ.isLoading) return <DetailSkeleton />;
  if (countryQ.isError || !country) {
    return (
      <ErrorState
        message={`Kunde inte ladda landet. ${(countryQ.error as Error)?.message ?? ""}`}
        onRetry={() => countryQ.refetch()}
      />
    );
  }

  // 7) Deriverade fält
  const weather = weatherQ.data?.current_weather;
  const temp =
    typeof weather?.temperature === "number" ? weather.temperature : weather?.temperature_2m;
  const wind =
    typeof weather?.windspeed === "number" ? weather.windspeed : weather?.wind_speed_10m;

  const currencies = country.currencies
    ? (Object.values(country.currencies) as Array<{ name?: string; symbol?: string }>)
        .map((c) => c?.name)
        .filter(Boolean)
        .join(", ")
    : "—";

  const languages = country.languages ? Object.values(country.languages).join(", ") : "—";

  // 8) UI
  return (
    <article className="space-y-6">
      <Button asChild variant="outline">
        <Link href="/">← Tillbaka</Link>
      </Button>

      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {(country.flags.svg || country.flags.png) && (
          <Image
            src={country.flags.svg || (country.flags.png as string)}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            width={160}
            height={96}
            className="h-20 w-auto rounded-md border"
            style={{ height: "5rem", width: "auto" }}
            priority
            sizes="(max-width: 640px) 120px, 160px"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{country.name.common}</h1>
          {country.name.official && (
            <p className="text-sm text-gray-600">Officiellt: {country.name.official}</p>
          )}
        </div>
      </header>

      {/* Basfakta */}
      <section aria-labelledby="facts">
        <h2 id="facts" className="text-xl font-semibold mb-3">
          Basfakta
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Fact label="Region" value={country.region || "—"} />
          <Fact label="Subregion" value={country.subregion || "—"} />
          <Fact label="Huvudstad" value={country.capital?.[0] || "—"} />
          <Fact label="Befolkning" value={formatNumber(country.population)} />
          <Fact label="Språk" value={languages} />
          <Fact label="Valuta" value={currencies} />
          <Fact label="Toppdomän" value={country.tld?.join(", ") || "—"} />
        </div>
      </section>

      {/* Väder */}
      <section aria-labelledby="weather">
        <h2 id="weather" className="text-xl font-semibold mb-3">
          Aktuellt väder
        </h2>
        {weatherQ.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : weatherQ.isError ? (
          <ErrorState
            message={`Kunde inte hämta väder. ${(weatherQ.error as Error)?.message ?? ""}`}
            onRetry={() => weatherQ.refetch()}
          />
        ) : !hasCoords ? (
          <p>Ingen position hittades.</p>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">
                  {typeof temp === "number" ? `${temp}°C` : "—"}
                </div>
                <div className="text-sm text-gray-600">
                  Vind: {typeof wind === "number" ? `${wind} m/s` : "—"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Bilder & Wikipedia */}
      <section aria-labelledby="media">
        <h2 id="media" className="text-xl font-semibold mb-3">
          Bilder & intro
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            {wikiQ.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : wikiQ.isError ? (
              <ErrorState
                message={`Kunde inte hämta Wikipedia-text. ${(wikiQ.error as Error)?.message ?? ""}`}
                onRetry={() => wikiQ.refetch()}
              />
            ) : (
              <Card>
                <CardContent>
                  <p className="mb-3">
                    {wikiQ.data?.extract || "Ingen sammanfattning tillgänglig."}
                  </p>
                  {wikiQ.data?.content_urls?.desktop?.page && (
                    <a
                      className="underline"
                      href={wikiQ.data.content_urls.desktop.page}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Källa: Wikipedia
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {imagesQ.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : imagesQ.isError ? (
              <ErrorState
                message={`Kunde inte hämta bilder. ${(imagesQ.error as Error)?.message ?? ""}`}
                onRetry={() => imagesQ.refetch()}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(imagesQ.data?.results ?? []).slice(0, 6).map((p: UnsplashPhoto) => (
                  <a
                    key={p.id}
                    href={p.links.html}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                    title={p.alt_description || `Photo related to ${country.name.common}`}
                  >
                    <div className="relative w-full aspect-[5/2]">
                      <Image
                        src={p.urls.small}
                        alt={p.alt_description || `Photo related to ${country.name.common}`}
                        fill
                        className="rounded-xl object-cover"
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Card>
        <CardFooter className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/">← Till listan</Link>
          </Button>
          <Share url={typeof window !== "undefined" ? window.location.href : ""} />
        </CardFooter>
      </Card>
    </article>
  );
}

/* ===== Helpers ===== */

type FactProps = { label: string; value: React.ReactNode };
function Fact({ label, value }: FactProps) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function Share({ url }: { url: string }) {
  async function share() {
    try {
      if (navigator.share) await navigator.share({ url, title: document.title });
      else await navigator.clipboard.writeText(url);
      alert("Länken har delats/kopierats.");
    } catch {
      alert("Kunde inte dela länken.");
    }
  }
  return (
    <Button variant="outline" onClick={share} aria-label="Dela sidan">
      Dela
    </Button>
  );
}

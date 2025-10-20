import { CountriesSchema, CountrySchema, WeatherSchema } from "./types";

import type { WikiSummary, UnsplashSearch } from "./types";

export async function fetchAllCountries() {
  const res = await fetch("/api/countries", { cache: "no-store" });
  if (!res.ok) throw new Error(`Länder kunde inte hämtas (HTTP ${res.status}).`);
  const data = await res.json();
  return CountriesSchema.parse(data);
}

export async function fetchCountryByCode(code: string) {
  const res = await fetch(`/api/country?code=${encodeURIComponent(code)}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Land (${code}) kunde inte hämtas (HTTP ${res.status}).`);
  const data = await res.json();
  return CountrySchema.parse(Array.isArray(data) ? data[0] : data);
}

export async function fetchWeather(lat: number, lon: number) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte hämta väder (HTTP " + res.status + ").");
  const data = await res.json();
  return WeatherSchema.parse(data);
}

export async function fetchWikiSummary(title: string): Promise<WikiSummary> {
  const safe = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${safe}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok)
    throw new Error("Kunde inte hämta Wikipedia-sammanfattning (HTTP " + res.status + ").");
  return res.json() as Promise<WikiSummary>;
}

export async function fetchImages(query: string): Promise<UnsplashSearch> {
  const res = await fetch(`/api/images?query=${encodeURIComponent(query)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte hämta bilder (HTTP " + res.status + ").");
  return res.json() as Promise<UnsplashSearch>;
}

// file: src/lib/types.ts
import { z } from "zod";

// === REST Countries ===
export const CountrySchema = z.object({
  cca3: z.string(),
  cca2: z.string().optional(),
  name: z.object({ common: z.string(), official: z.string().optional() }),
  flags: z.object({
    png: z.string().url().optional(),
    svg: z.string().url().optional(),
    alt: z.string().optional(),
  }),
  region: z.string().optional(),
  subregion: z.string().optional(),
  capital: z.array(z.string()).optional(),
  population: z.number().optional(),

  // Explicit key+value-typer
  languages: z.record(z.string(), z.string()).optional(),
  currencies: z
    .record(z.string(), z.object({ name: z.string().optional(), symbol: z.string().optional() }))
    .optional(),

  // 🛠️ Viktigt: tillåt valfri längd (0/1/2+). Vi filtrerar i UI vid användning.
  capitalInfo: z.object({ latlng: z.array(z.number()).optional() }).optional(),
  latlng: z.array(z.number()).optional(),

  tld: z.array(z.string()).optional(),
});
export type Country = z.infer<typeof CountrySchema>;
export const CountriesSchema = z.array(CountrySchema);

// === Open-Meteo ===
export type CurrentWeather = {
  temperature?: number;
  temperature_2m?: number;
  windspeed?: number;
  wind_speed_10m?: number;
  weathercode?: number;
  time?: string;
};
export const WeatherSchema = z.object({
  current_weather: z
    .object({
      temperature: z.number().optional(),
      temperature_2m: z.number().optional(),
      windspeed: z.number().optional(),
      wind_speed_10m: z.number().optional(),
      weathercode: z.number().optional(),
      time: z.string().optional(),
    })
    .optional(),
});
export type Weather = z.infer<typeof WeatherSchema>;

// === Wikipedia Summary ===
export type WikiSummary = {
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

// === Unsplash ===
export type UnsplashPhoto = {
  id: string;
  alt_description?: string | null;
  urls: { small: string; regular?: string };
  links: { html: string };
  user?: { name?: string };
};
export type UnsplashSearch = { results: UnsplashPhoto[] };

// === Delad util ===
export const formatNumber = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "—");

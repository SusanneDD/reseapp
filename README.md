Reseapp – Next.js + TanStack Query + Zod + Tailwind

TL;DR: Lista & filtrera länder, detaljsida med väder (OpenWeather), bilder (Unsplash/Pexels) och Wikipedia-intro. Tillgänglig, snabb, URL-styrd.

Innehåll:

Funktioner

Teknikstack

Mappstruktur

Kom igång

Miljövariabler

Kör lokalt

API-routes (server)

Data & validering

Tillgänglighet (a11y)

Prestanda

Felsökning

Deploy

Versionshantering

Licens

Funktioner:

Startsida: paginerad lista över länder (10–48/sida), sökfält, regionfilter (Africa, Americas, Asia, Europe, Oceania, Antarctic, All).

URL-state: ?page=&pageSize=&query=&region= styr vy och bevaras vid navigering.

Detaljsida (/country/[...]): basfakta, aktuellt väder (OpenWeather via server), minst 3 bilder (Unsplash→Pexels fallback), Wikipedia-summary med källa.

Laddning/fel: skeleton + spinner, tydliga felmeddelanden och “Försök igen”.

Tillgänglighet: semantisk HTML, meningsfulla alt-texter, aria-labels; tangentbordsnavigerbar paginering.

Robusthet: Zod-parse av svar, fallback för latlng, resilient image-sök (sv/eng + “travel”).

Teknikstack:

Next.js 15 (App Router, TypeScript, src/)

Tailwind CSS 4

TanStack Query v5

Zod (schema/validering)

shadcn/ui (egna minimala UI-komponenter)

Next/Image (optimerade bilder)

Mappstruktur:
src/
app/
api/
countries/route.ts # REST Countries proxy + fallback
country/route.ts # (om du har den) land enligt code
images/route.ts # Unsplash + Pexels fallback
weather/route.ts # OpenWeather proxy (lokal tid)
country/[...code]/page.tsx
favicon.ico
globals.css
layout.tsx
page.tsx
providers.tsx # React Query Provider
components/
CountryCard.tsx
ErrorState.tsx
LoadingGrid.tsx
Pagination.tsx
RegionFilters.tsx
SearchBar.tsx
ui/
badge.tsx
button.tsx
card.tsx
input.tsx
skeleton.tsx
lib/
fetchers.ts # fetch\* helpers som anropar API routes
types.ts # Zod-scheman + typer
utils.ts # formatNumber, konstanter
next.config.ts # images.remotePatterns + turbopack root
tailwind.config (via v4 preset)

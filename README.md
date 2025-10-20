Reseapp – Next.js + TanStack Query + Zod + Tailwind

TL;DR: En snabb och tillgänglig reseapp som listar länder med sök & filter. Varje land har en detaljsida med basfakta, aktuellt väder (OpenWeather via server-proxy), bilder (Unsplash → Pexels fallback) och Wikipedia-intro. Allt är URL-styrt och resilient med Zod-validering.


Startsida:

Paginerad lista över länder (valbar page size).

Sökfält (filtrerar på landsnamn).

Regionfilter: Africa, Americas, Asia, Europe, Oceania, Antarctic, All.

URL-state: ?page=&pageSize=&query=&region= bevaras vid navigering.


Detaljsida /country/[...] :

Basfakta: flagga (meningsfull alt), namn + officiellt namn (om finns), region/subregion, huvudstad, befolkning, språk, valuta, toppdomän.

Väder: OpenWeather (via server-route), fall back till latlng om capitalInfo.latlng saknas.

Bilder: minst 3 st (Unsplash, med Pexels som fallback).

Wikipedia: kort sammanfattning + tydlig källhänvisning.

Laddning/Fel: skeleton/spinner, tydliga felmeddelanden, “Försök igen”.


Robusthet:

Zod för att parse:a och säkra datan från alla externa API:er.

Resilient bildsök (sv/eng + “travel” fallback).

Next/Image med tillåtna remotePatterns.


Teknikstack:

Next.js 15 (App Router, TypeScript, src/)

Tailwind CSS v4

TanStack Query v5 (datahämtning/caching)

Zod (schema/validering)

Egna UI-komponenter i shadcn-stil (badge, button, card, input, skeleton, spinner)

Next/Image (bildoptimering)

Mappstruktur:
.
├─ .env.example
├─ next.config.ts
├─ package.json
├─ tsconfig.json
├─ postcss.config.mjs
├─ eslint.config.mjs
├─ .prettierrc.json
├─ .prettierignore
└─ src/
   ├─ app/
   │  ├─ api/
   │  │  ├─ countries/route.ts     # REST Countries-proxy (+ Zod)
   │  │  ├─ country/route.ts       # Land via code (om du använder den)
   │  │  ├─ images/route.ts        # Unsplash + Pexels fallback
   │  │  └─ weather/route.ts       # OpenWeather-proxy
   │  ├─ country/[...code]/page.tsx
   │  ├─ favicon.ico
   │  ├─ globals.css
   │  ├─ layout.tsx
   │  ├─ page.tsx
   │  └─ providers.tsx             # React Query Provider
   ├─ components/
   │  ├─ CountryCard.tsx
   │  ├─ ErrorState.tsx
   │  ├─ LoadingGrid.tsx
   │  ├─ Pagination.tsx
   │  ├─ RegionFilters.tsx
   │  ├─ SearchBar.tsx
   │  └─ ui/
   │     ├─ badge.tsx
   │     ├─ button.tsx
   │     ├─ card.tsx
   │     ├─ input.tsx
   │     ├─ skeleton.tsx
   │     └─ spinner.tsx
   └─ lib/
      ├─ fetchers.ts               # fetch* som anropar API-routes
      ├─ types.ts                  # Zod-scheman & typer
      └─ utils.ts                  # hjälpfunktioner (formatNumber m.m.)

Kom igång:

Kopiera miljövariabler

cp .env.example .env.local


Fyll i dina API-nycklar (se Miljövariabler
).

Installera paket:

npm i


Starta dev:

npm run dev


Öppna: http://localhost:3000

Miljövariabler

./.env.local (använd egna nycklar):

UNSPLASH_ACCESS_KEY=din_unsplash_nyckel
PEXELS_API_KEY=din_pexels_nyckel
OPENWEATHER_API_KEY=din_openweather_nyckel


Tips: Committa aldrig .env.local. Dela endast .env.example utan hemligheter.

Kör lokalt
# dev
npm run dev

# bygga & starta prod-läge
npm run build
npm start

# kodkvalitet
npm run lint        # ESLint
npm run lint:fix    # ESLint --fix
npm run format      # Prettier --write


API-routes (server):

GET /api/countries – Hämtar & normaliserar alla länder (REST Countries).

GET /api/country?code=SE – Hämtar ett land via kod (om använd).

GET /api/weather?lat=..&lon=.. – Proxy till OpenWeather, returnerar nuvarande väder.

GET /api/images?query=Sweden – Hämtar bilder via Unsplash, fallback Pexels.

Alla routes använder no-store eller rimlig cache & Zod där det är motiverat.

Data & validering:

Zod-scheman i src/lib/types.ts säkrar att svaren är i rätt form.

Fält som ofta saknas (t.ex. capitalInfo.latlng) hanteras med fallbacks.

Listvy & detaljvy använder TanStack Query med tydlig loading/error-hantering.

Tillgänglighet (a11y)

Semantisk HTML: <main>, <header>, <nav>, <ul>/<li>, <button>.

Meningsfull alt-text för flaggor/bilder.

ARIA-label där det hjälper.

Tydliga fokusstilar och tangentbordsnavigerbar paginering.

Prestanda:

Next/Image med approved remotePatterns (Unsplash, Pexels, flagcdn, m.fl.).

Rationell staleTime/cache för listan av länder.

Skeletons vid laddning för snabb upplevd prestanda.

Små, återanvändbara UI-komponenter.

Felsökning:

Väder visar inget?

Kontrollera OPENWEATHER_API_KEY i .env.local.

Bilder visas inte?

Kontrollera att UNSPLASH_ACCESS_KEY eller PEXELS_API_KEY är ifyllda.

Säkerställ att images.remotePatterns i next.config.ts innehåller:
images.unsplash.com, images.pexels.com, flagcdn.com, upload.wikimedia.org.

API 400/500?

Kolla serverloggar i terminalen och enskilda API-routes i src/app/api/*.

Tailwind eller styles saknas?

Verifiera importen av globals.css i layout.tsx.

Deploy:

Vercel (rekommenderas):

Importera repo:t på vercel.com.

Lägg in miljövariablerna för Production.

Deploya. Klart.

Versionshantering

Exempel-workflow:

git checkout -b feat/sokfilter
# gör ändringar…
git add -A
git commit -m "feat: förbättrad sök + reset page"
git push -u origin feat/sokfilter
# öppna Pull Request på GitHub


Rekommenderade konventioner:

Prefix: feat:, fix:, chore:, refactor:, docs:, test:.

Små, meningsfulla commits med tydliga beskrivningar.

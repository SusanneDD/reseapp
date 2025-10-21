# Reseapp

TL;DR: Lista & filtrera länder, öppna detaljsida med basfakta, aktuellt väder (OpenWeather), bilder (Unsplash/Pexels) och Wikipedia-intro. Tillgänglig, snabb och URL-styrd.

Demo: https://din-produktions-url.vercel.app

# Innehåll

Funktioner

Teknikstack

Mappstruktur

Kom igång

Miljövariabler

Köra lokalt

API-rutter (server)

Data & validering

Tillgänglighet

Prestanda

Felsökning

Deploy (GitHub → Vercel)

Licens

# Funktioner

Startsida: paginerad lista över länder (konfigurerbar per sida), sökfält, regionfilter (Africa, Americas, Asia, Europe, Oceania, Antarctic, All).

URL-state: ?page=&pageSize=&query=&region= bevaras vid navigering & delning.

Detaljsida (/country/[...]):
Basfakta (flagga, namn/ev. officiellt namn, region/subregion, huvudstad, befolkning, språk, valuta, tld)
Väder (OpenWeather via serverroute, med lokala koordinater från REST Countries)
Bilder (minst 3; Unsplash med Pexels-fallback)
Wikipedia-sammanfattning med källhänvisning

Laddning/fel: skeleton + spinner, tydliga felmeddelanden och “Försök igen”.

A11y: semantisk HTML (<main>, <header>, <nav>, <ul>/<li>, etc), meningsfulla alt-texter, tangentbordsnavigering.

# Teknikstack

Next.js 15 (App Router, TypeScript, src/)

TanStack Query v5 (datahämtning/caching)

Tailwind CSS v4 (utility-first UI)

Zod (scheman/validering)

Next/Image (optimerade bilder)

Egna UI-komponenter i src/components/ui/*

# Mappstruktur
reseapp/
├─ .gitignore
├─ .prettierrc.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tsconfig.json
└─ src/
   ├─ app/
   │  ├─ api/
   │  │  ├─ countries/route.ts     # REST Countries proxy + Zod-parse/fallback
   │  │  ├─ country/route.ts       # Hämta ett land via code
   │  │  ├─ images/route.ts        # Unsplash + Pexels fallback
   │  │  └─ weather/route.ts       # OpenWeather proxy (metriker)
   │  ├─ country/[...code]/page.tsx
   │  ├─ globals.css
   │  ├─ layout.tsx
   │  ├─ page.tsx                  # Startsida (sök, filter, pagination)
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
   │     └─ skeleton.tsx
   └─ lib/
      ├─ fetchers.ts               # fetch* helpers som anropar API routes
      ├─ types.ts                  # Zod-scheman + typer
      └─ utils.ts                  # formatNumber, konstanter

# Kom igång
# 1) Installera
npm ci         # eller: npm install

# 2) Skapa .env.local (se nästa sektion)
cp .env.example .env.local   # om .env.example finns
# och fyll i dina riktiga nycklar i .env.local

# 3) Kör dev
npm run dev

# 4) Lint & format (valfritt men bra)
npm run lint
npm run format

# Miljövariabler

Skapa .env.local (checka inte in riktiga nycklar i Git):

OPENWEATHER_API_KEY=din_openweather_nyckel
UNSPLASH_ACCESS_KEY=din_unsplash_nyckel
PEXELS_API_KEY=din_pexels_nyckel


Tips: På Vercel lägger du in dessa under Project → Settings → Environment Variables (Production + Preview + Development) och gör en Redeploy.

# Köra lokalt
npm run dev        # utvecklingsläge
npm run build      # produktionsbygge
npm run start      # starta prod-server lokalt
npm run lint       # ESLint
npm run format     # Prettier write

# API-rutter (server)

GET /api/countries – proxy mot REST Countries + Zod-validering

GET /api/country?code=SE – hämta ett land

GET /api/weather?lat=59.33&lon=18.06 – OpenWeather proxy, metriker

GET /api/images?query=Sweden – Unsplash med fallback till Pexels

# Bilder: next.config.ts tillåter dessa domäner:

flagcdn.com, upload.wikimedia.org, restcountries.com,

images.unsplash.com, images.pexels.com

# Data & validering

Zod (src/lib/types.ts) säkerställer att inkommande JSON följer förväntat schema.

Vi hanterar kända avvikelser (t.ex. capitalInfo.latlng) med säkra fallbacks.

# Tillgänglighet

Semantisk HTML överallt (<main>, <header>, <nav>, <ul>/<li>).

Meningsfull alt-text för flaggor och bilder.

Tangentbordsnavigerbar paginering och trygga fokusstilar.

ARIA-attribut där det hjälper.

# Prestanda

TanStack Query caching/staleTime för snabb navigering.

Next/Image optimerade bilder, korrekta sizes.

Lätta UI-komponenter (Tailwind utilities).

# Felsökning

500 på /api/weather → saknad/fel OPENWEATHER_API_KEY eller rate limit.
Testa direkt i browser: /api/weather?lat=59.33&lon=18.06.

Inga bilder → saknad/fel UNSPLASH_ACCESS_KEY/PEXELS_API_KEY.
Testa /api/images?query=France. Se till att images.unsplash.com och images.pexels.com finns i next.config.ts.
På Unsplash: tillåt din Vercel-domän i appens inställningar om nödvändigt.

Hydration/CSR-varningar → säkerställ att klient-hooks används i Client Components (de här sidorna är redan markerade med "use client").

# Deploy (GitHub → Vercel)

Push till GitHub:

git add -A
git commit -m "feat: första versionen"
git push origin main


På vercel.com: Add New → Project → Importera ditt repo.

Lägg Environment Variables (se ovan) → Deploy.

Klart! Nästa git push triggar ny deploy.

# Licens

MIT – använd fritt, men utan garanti.
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  const key = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }
  if (!key) {
    return NextResponse.json({ error: "Missing OPENWEATHER_API_KEY" }, { status: 500 });
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "sv");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: `Kunde inte hämta väder (HTTP ${res.status}).` },
      { status: 502 }
    );
  }

  const data = await res.json();

  const payload = {
    current_weather: {
      temperature: data?.main?.temp ?? undefined,
      windspeed: data?.wind?.speed ?? undefined,
      weathercode: data?.weather?.[0]?.id ?? undefined,
    },
    city: data?.name ?? null,
    country: data?.sys?.country ?? null,
  };

  return NextResponse.json(payload, { status: 200 });
}

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const BASE = "https://restcountries.com/v3.1";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code saknas" }, { status: 400 });

  const full =
    "cca3,cca2,name,flags,region,subregion,capital,population,languages,currencies,capitalInfo,latlng,tld";

  let url = `${BASE}/alpha/${encodeURIComponent(code)}?fields=${encodeURIComponent(full)}`;
  let res = await fetch(url, { cache: "no-store" });
  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  }

  if (res.status === 400) {
    url = `${BASE}/alpha/${encodeURIComponent(code)}?fields=${encodeURIComponent("cca3,name,flags,region,capital,capitalInfo,latlng")}`;
    res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(Array.isArray(data) ? data[0] : data);
    }
    url = `${BASE}/alpha/${encodeURIComponent(code)}`;
    res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(Array.isArray(data) ? data[0] : data);
    }
  }

  const text = await res.text().catch(() => "");
  return NextResponse.json(
    { error: `REST Countries fel (${res.status}). ${text}` },
    { status: 502 },
  );
}

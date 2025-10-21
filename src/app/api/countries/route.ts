import { NextResponse } from "next/server";

export const revalidate = 3600; 
const BASE = "https://restcountries.com/v3.1";

async function fetchWithFallback() {
  
  const full =
    "cca3,cca2,name,flags,region,subregion,capital,population,languages,currencies,capitalInfo,latlng,tld";
  let url = `${BASE}/all?fields=${encodeURIComponent(full)}`;
  let res = await fetch(url, { next: { revalidate } });
  if (res.ok) return res.json();

  if (res.status === 400) {
    url = `${BASE}/all?fields=${encodeURIComponent(
      "cca3,name,flags,region,capital,capitalInfo,latlng",
    )}`;
    res = await fetch(url, { next: { revalidate } });
    if (res.ok) return res.json();
  }

  url = `${BASE}/all`;
  res = await fetch(url, { next: { revalidate } });
  if (res.ok) return res.json();

  const text = await res.text().catch(() => "");
  return NextResponse.json(
    { error: `REST Countries fel (${res.status}). ${text}` },
    { status: 502 },
  );
}

export async function GET() {
  const data = await fetchWithFallback();
  if (data instanceof NextResponse) return data; 
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

type UnsplashPhoto = {
  id: string;
  alt_description?: string | null;
  urls: { small: string };
  links: { html: string };
  user?: { name?: string };
};

type PexelsPhoto = {
  id: number;
  url: string;
  alt?: string | null;
  src: { medium: string; large?: string; original?: string };
  photographer?: string;
};

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("query") || "travel").trim();

  const uKey = process.env.UNSPLASH_ACCESS_KEY;
  const pKey = process.env.PEXELS_API_KEY;

  const results: {
    id: string;
    alt_description?: string | null;
    urls: { small: string };
    links: { html: string };
    user?: { name?: string };
  }[] = [];

  // Robust fetch helper
  async function safeJson(input: RequestInfo | URL, init?: RequestInit) {
    const res = await fetch(input, init).catch(() => null);
    if (!res || !res.ok) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  // 1) Unsplash (om key finns)
  if (uKey) {
    const u = new URL("https://api.unsplash.com/search/photos");
    u.searchParams.set("query", q);
    u.searchParams.set("per_page", "12");
    u.searchParams.set("orientation", "landscape");

    const uData = (await safeJson(u, {
      headers: { Authorization: `Client-ID ${uKey}` },
      // next: { revalidate: 600 }, // valfri cache
    })) as unknown;

    const uPhotos: UnsplashPhoto[] =
      uData && typeof uData === "object" && "results" in uData
        ? ((uData as { results?: UnsplashPhoto[] }).results ?? [])
        : [];
    uPhotos.forEach((p) =>
      results.push({
        id: `unsplash_${p.id}`,
        alt_description: p.alt_description ?? null,
        urls: { small: p.urls.small },
        links: { html: p.links.html },
        ...(p.user?.name ? { user: { name: p.user.name } } : {}),
      }),
    );
  }

  // 2) Pexels fallback (om < 3 bilder och pKey finns)
  if (results.length < 3 && pKey) {
    const p = new URL("https://api.pexels.com/v1/search");
    p.searchParams.set("query", q);
    p.searchParams.set("per_page", "12");

    const pData = await safeJson(p, {
      headers: { Authorization: pKey },
      // next: { revalidate: 600 }, // valfri cache
    });

    const pPhotos: PexelsPhoto[] = (pData as { photos?: PexelsPhoto[] })?.photos || [];
    pPhotos.forEach((pp) =>
      results.push({
        id: `pexels_${pp.id}`,
        alt_description: pp.alt || null,
        urls: { small: pp.src.medium },
        links: { html: pp.url },
        ...(pp.photographer ? { user: { name: pp.photographer } } : {}),
      }),
    );
  }

  // 3) Sista utväg: tom lista
  return NextResponse.json({ results });
}

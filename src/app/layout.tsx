// file: src/app/layout.tsx
import "./globals.css";
import Link from "next/link";

import Providers from "./providers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reseapp",
  description: "Länder, väder och bilder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className="bg-white text-gray-900">
        <Providers>
          <header className="border-b sticky top-0 bg-white/80 backdrop-blur z-10">
            <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold" aria-label="Start">
                🌍 Reseapp
              </Link>
            </div>
          </header>

          <main className="container mx-auto max-w-6xl px-4 py-6">{children}</main>

          <footer className="border-t mt-10">
            <div className="container mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
              Byggd med Next.js, TanStack Query, Tailwind. Bilder via Unsplash/Pexels, text via
              Wikipedia.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

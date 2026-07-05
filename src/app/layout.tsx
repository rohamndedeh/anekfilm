import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { FavoritesProvider } from "@/lib/favorites-context";
import { WatchHistoryProvider } from "@/lib/watch-history-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nekonime App - Cari & Nonton Anime",
  description: "Cari anime favoritmu, filter genre, lihat detail, dan tonton episode terbaru dari Nekonime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <FavoritesProvider>
          <WatchHistoryProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400">
              Data sourced from Nekonime. Not affiliated with Nekonime.
            </footer>
          </WatchHistoryProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

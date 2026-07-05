'use client'

import { useState, useCallback, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import GenreFilter from '@/components/GenreFilter'
import AnimeCard from '@/components/AnimeCard'
import ContinueWatchingCard from '@/components/ContinueWatchingCard'
import { useWatchHistory } from '@/lib/watch-history-context'
import type { SearchResult, HomepageData, LatestUpdate } from '@/lib/types'
import Link from 'next/link'

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [allGenres, setAllGenres] = useState<string[]>([])
  const [homeData, setHomeData] = useState<HomepageData | null>(null)
  const [homeLoading, setHomeLoading] = useState(true)
  const { recentItems } = useWatchHistory()
  const continueWatching = recentItems(8)

  useEffect(() => {
    async function loadHome() {
      try {
        const res = await fetch('/api/home')
        if (res.ok) {
          const data: HomepageData = await res.json()
          setHomeData(data)
        }
      } catch {
      } finally {
        setHomeLoading(false)
      }
    }
    loadHome()
  }, [])

  const searchAnime = useCallback(async (q: string) => {
    setLoading(true)
    setSearched(true)
    setQuery(q)
    setSelectedGenres([])
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data: SearchResult[] = await res.json()
      const animeOnly = data.filter((a) => a.category === 'anime')
      setResults(animeOnly)
      const genres = [...new Set(animeOnly.flatMap((a) => a.genres))].sort()
      setAllGenres(genres)
    } catch {
      setResults([])
      setAllGenres([])
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const filteredResults = selectedGenres.length > 0
    ? results.filter((a) => selectedGenres.some((g) => a.genres.includes(g)))
    : results

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
          Cari Anime Favoritmu
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-5">
          Cari berdasarkan judul, filter dengan genre
        </p>
        <SearchBar onSearch={searchAnime} />
      </div>

      {/* Mode pencarian */}
      {searched && (
        <>
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-zinc-300 dark:text-zinc-600">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-lg text-zinc-500 dark:text-zinc-400">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="mb-6">
                <GenreFilter
                  genres={allGenres}
                  selectedGenres={selectedGenres}
                  onToggle={toggleGenre}
                />
              </div>

              <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                {selectedGenres.length > 0
                  ? `${filteredResults.length} dari ${results.length} hasil`
                  : `${results.length} hasil ditemukan`}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredResults.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Home browsing mode */}
      {!searched && (
        <>
          {homeLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : homeData ? (
            <div className="space-y-10">
              {/* Continue Watching */}
              {continueWatching.length > 0 && (
                <div>
                  <SectionHeader title="Lanjutkan Menonton" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {continueWatching.map((item) => (
                      <ContinueWatchingCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Featured */}
              {homeData.featured.length > 0 && (
                <div>
                  <SectionHeader title="Featured" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {homeData.featured.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Updates */}
              {homeData.latestUpdates.length > 0 && (
                <div>
                  <SectionHeader title="Update Terbaru" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {homeData.latestUpdates.map((item) => (
                      <LatestCard key={`${item.id}-${item.episode_number}`} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular */}
              {homeData.popular.length > 0 && (
                <div>
                  <SectionHeader title="Populer" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {homeData.popular.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended */}
              {homeData.recommended.length > 0 && (
                <div>
                  <SectionHeader title="Rekomendasi" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {homeData.recommended.map((anime) => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <p className="text-lg">Gagal memuat data. Coba refresh halaman.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
      <span className="w-1 h-6 bg-blue-600 rounded-full inline-block" />
      {title}
    </h2>
  )
}

function LatestCard({ item }: { item: LatestUpdate }) {
  const animeSlug = item.slug
  return (
    <Link
      href={`/anime/${animeSlug}/episode/${item.episode_number}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="w-14 h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Episode {item.episode_number}
        </p>
        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.genres.slice(0, 2).map((g) => (
              <span key={g} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

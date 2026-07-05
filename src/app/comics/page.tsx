'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Manga, Genre } from '@/lib/manga-types'

export default function ComicsPage() {
  const [comics, setComics] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState<Genre[]>([])

  useEffect(() => {
    loadHome()
    loadGenres()
  }, [])

  const loadHome = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/manga/home')
      if (res.ok) {
        const data = await res.json()
        setComics(data.popular || [])
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const loadGenres = async () => {
    try {
      const res = await fetch('/api/manga/genres')
      if (res.ok) setGenres(await res.json())
    } catch {}
  }

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchMode(false)
      loadHome()
      return
    }
    setSearchMode(true)
    setLoading(true)
    try {
      const res = await fetch(`/api/manga/search?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) setComics(await res.json())
    } catch {} finally { setLoading(false) }
  }, [])

  const handleGenre = useCallback(async (genre: string) => {
    setSelectedGenre(genre)
    setSearchMode(false)
    setLoading(true)
    try {
      const res = await fetch(`/api/manga/search?q=${encodeURIComponent(genre)}`)
      if (res.ok) setComics(await res.json())
    } catch {} finally { setLoading(false) }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
          Komik
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-5">
          Baca manga, manhwa, dan komik online
        </p>

        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Cari komik..."
            className="w-full px-5 py-3 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => handleGenre(g.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedGenre === g.name
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comics.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <p>Tidak ada komik ditemukan</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full inline-block" />
            {searchMode ? `Hasil: "${query}"` : selectedGenre ? selectedGenre : 'Komik Terbaru'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {comics.map((comic) => (
              <MangaCard key={comic.id} comic={comic} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MangaCard({ comic }: { comic: Manga }) {
  return (
    <Link
      href={`/comics/${comic.id}`}
      className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        {comic.thumbnail ? (
          <img
            src={comic.thumbnail}
            alt={comic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
        )}
        {comic.rating > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-500 text-white flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {comic.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {comic.title}
        </h3>
        {comic.author && (
          <p className="text-[11px] text-zinc-400 mt-1 truncate">{comic.author}</p>
        )}
        {comic.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {comic.genres.slice(0, 2).map((g) => (
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

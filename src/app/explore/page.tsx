'use client'

import { useState, useEffect, useCallback } from 'react'
import AnimeCard from '@/components/AnimeCard'
import type { SearchResult, ExploreResponse } from '@/lib/types'
import Link from 'next/link'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function ExplorePage() {
  const [data, setData] = useState<ExploreResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('')
  const [letter, setLetter] = useState('')
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchExplore = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (genre) params.set('genre', genre)
      if (letter) params.set('letter', letter)
      if (page > 1) params.set('page', String(page))

      const qs = params.toString()
      const res = await fetch(`/api/explore${qs ? `?${qs}` : ''}`)
      if (res.ok) {
        const result: ExploreResponse = await res.json()
        setData(result)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [genre, letter, page])

  useEffect(() => {
    fetchExplore()
  }, [fetchExplore])

  const handleGenreClick = (slug: string) => {
    setGenre(genre === slug ? '' : slug)
    setPage(1)
  }

  const handleLetterClick = (l: string) => {
    setLetter(letter === l ? '' : l)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const animes = data?.animes

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari anime di sini..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Alphabet filter */}
      <div className="mb-5">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setLetter(''); setPage(1) }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              !letter ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {ALPHABET.map((l) => (
            <button
              key={l}
              onClick={() => handleLetterClick(l.toLowerCase())}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                letter === l.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Genre filter */}
      {data && data.genres.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {data.genres.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenreClick(g.slug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  genre === g.slug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters info */}
      {(genre || letter) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Filter aktif:</span>
          {genre && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              {data?.genres.find((g) => g.slug === genre)?.name || genre}
              <button onClick={() => { setGenre(''); setPage(1) }} className="hover:text-blue-900 dark:hover:text-blue-100">&times;</button>
            </span>
          )}
          {letter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
              Awalan: {letter.toUpperCase()}
              <button onClick={() => { setLetter(''); setPage(1) }} className="hover:text-green-900 dark:hover:text-green-100">&times;</button>
            </span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {!loading && animes && (
        <>
          <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            Menampilkan {animes.data.length} dari {animes.total} anime
            {animes.current_page > 1 && ` (halaman ${animes.current_page})`}
          </div>

          {animes.data.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
              Tidak ada anime ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animes.data.map((anime: SearchResult) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {animes.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!animes.prev_page_url}
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(animes.last_page, 7) }, (_, i) => {
                  let pageNum: number
                  if (animes.last_page <= 7) {
                    pageNum = i + 1
                  } else if (animes.current_page <= 4) {
                    pageNum = i + 1
                  } else if (animes.current_page >= animes.last_page - 3) {
                    pageNum = animes.last_page - 6 + i
                  } else {
                    pageNum = animes.current_page - 3 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === animes.current_page
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(animes.last_page, p + 1))}
                disabled={!animes.next_page_url}
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

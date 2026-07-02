'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Lk21Movie, Lk21BrowseResult } from '@/lib/lk21-types'

const GENRES: [string, string][] = [
  ['action', 'Action'], ['adventure', 'Adventure'], ['animation', 'Animation'],
  ['biography', 'Biography'], ['comedy', 'Comedy'], ['crime', 'Crime'],
  ['documentary', 'Documentary'], ['drama', 'Drama'], ['family', 'Family'],
  ['fantasy', 'Fantasy'], ['history', 'History'], ['horror', 'Horror'],
  ['musical', 'Musical'], ['mystery', 'Mystery'], ['romance', 'Romance'],
  ['sci-fi', 'Sci-Fi'], ['sport', 'Sport'], ['thriller', 'Thriller'],
  ['war', 'War'], ['western', 'Western'],
]

const SORT_OPTIONS: [string, string][] = [
  ['populer', 'Populer'],
  ['latest', 'Terbaru'],
  ['rating', 'Rating Tertinggi'],
  ['release', 'Tahun Rilis'],
]

const YEARS = Array.from({ length: 2026 - 1920 + 1 }, (_, i) => String(2026 - i))

export default function MoviesPage() {
  const [movies, setMovies] = useState<Lk21Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [sortType, setSortType] = useState('populer')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchMode && searchQuery.trim()) {
        const res = await fetch(`/api/lk21/search?q=${encodeURIComponent(searchQuery.trim())}`)
        if (res.ok) {
          const data: Lk21Movie[] = await res.json()
          setMovies(data)
          setTotalPages(1)
        }
        setLoading(false)
        return
      }

      if (genre) {
        params.set('type', 'genre')
        params.set('slug', genre)
      } else if (year) {
        params.set('type', 'year')
        params.set('slug', year)
      } else {
        params.set('type', sortType)
      }
      params.set('page', String(page))

      const res = await fetch(`/api/lk21/browse?${params.toString()}`)
      if (res.ok) {
        const data: Lk21BrowseResult = await res.json()
        setMovies(data.movies)
        setTotalPages(data.lastPage || 1)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [sortType, genre, year, page, searchQuery, searchMode])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleSort = (t: string) => {
    setSortType(t)
    setGenre('')
    setYear('')
    setSearchMode(false)
    setPage(1)
  }

  const handleGenre = (g: string) => {
    setGenre(genre === g ? '' : g)
    setYear('')
    setSearchMode(false)
    setPage(1)
  }

  const handleYear = (y: string) => {
    setYear(year === y ? '' : y)
    setGenre('')
    setSearchMode(false)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchMode(true)
      setGenre('')
      setYear('')
      setPage(1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Film</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Jelajahi koleksi film dari LK21</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari film..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Cari
        </button>
      </form>

      {/* Sort tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SORT_OPTIONS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortType === key && !genre && !year && !searchMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Genre filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map(([slug, name]) => (
            <button
              key={slug}
              onClick={() => handleGenre(slug)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                genre === slug
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Year filter */}
      <div className="mb-6">
        <details className="group">
          <summary className="text-xs font-medium text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 select-none">
            Filter Tahun
          </summary>
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-40 overflow-y-auto">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => handleYear(y)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  year === y
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Active filters */}
      {(genre || year || searchMode) && (
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Filter:</span>
          {searchMode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              Cari: {searchQuery}
              <button onClick={() => { setSearchMode(false); setPage(1) }} className="hover:text-blue-900 dark:hover:text-blue-100">&times;</button>
            </span>
          )}
          {genre && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
              {GENRES.find(([s]) => s === genre)?.[1] || genre}
              <button onClick={() => { setGenre(''); setPage(1) }} className="hover:text-green-900 dark:hover:text-green-100">&times;</button>
            </span>
          )}
          {year && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
              Tahun: {year}
              <button onClick={() => { setYear(''); setPage(1) }} className="hover:text-purple-900 dark:hover:text-purple-100">&times;</button>
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
      {!loading && (
        <>
          <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            {movies.length} film ditemukan
          </div>

          {movies.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
              Tidak ada film ditemukan
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !searchMode && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3.5 py-2 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 7) {
                    pageNum = i + 1
                  } else if (page <= 4) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = page - 3 + i
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === page
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
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

function MovieCard({ movie }: { movie: Lk21Movie }) {
  return (
    <Link
      href={`/movies/${movie.slug}`}
      className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {movie.rating && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-yellow-500/90 text-white flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {movie.rating}
          </div>
        )}
        {movie.quality && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-black/70 text-white">
            {movie.quality}
          </div>
        )}
        {movie.duration && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-blue-600/90 text-white">
            {movie.duration}
          </div>
        )}
        {movie.year && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-zinc-800/80 text-zinc-200">
            {movie.year}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {movie.title}
        </h3>
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genres.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import type { Lk21MovieDetail, Lk21Movie } from '@/lib/lk21-types'

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<Lk21MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePlayer, setActivePlayer] = useState<string>('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lk21/detail?slug=${encodeURIComponent(slug)}`)
        if (res.status === 404) {
          return
        }
        if (res.ok) {
          const d: Lk21MovieDetail = await res.json()
          setData(d)
          const castPlayer = d.players?.find((p) => p.name === 'CAST')
          setActivePlayer(castPlayer?.url || d.players?.[0]?.url || d.iframeUrl)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-zinc-300 dark:text-zinc-600">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-zinc-500 dark:text-zinc-400">Gagal memuat detail film. Coba refresh halaman.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
          Muat Ulang
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/movies"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke Film
      </Link>

      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="shrink-0 w-full md:w-64">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            {data.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.rating && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {data.rating}
              </span>
            )}
            {data.quality && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {data.quality}
              </span>
            )}
            {data.resolution && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                {data.resolution}
              </span>
            )}
            {data.duration && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {data.duration}
              </span>
            )}
            {data.country && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {data.country}
              </span>
            )}
          </div>

          {data.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {data.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {data.description && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Sinopsis
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                {data.description}
              </p>
            </div>
          )}

          {/* Download */}
          {data.downloadUrl && (
            <a
              href={data.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download
            </a>
          )}
        </div>
      </div>

      {/* Extra info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
        {data.director && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Sutradara:</span> {data.director}
          </div>
        )}
        {data.cast.length > 0 && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Pemain:</span> {data.cast.join(', ')}
          </div>
        )}
        {data.releaseDate && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Rilis:</span> {data.releaseDate}
          </div>
        )}
        {data.subtitle && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Subtitle:</span> {data.subtitle}
          </div>
        )}
      </div>

      {/* Player */}
      {activePlayer && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Nonton
          </h2>

          {/* Player selection buttons */}
          {data.players.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {data.players.map((p) => (
                <button
                  key={p.url}
                  onClick={() => setActivePlayer(p.url)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePlayer === p.url
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-lg relative">
            <iframe
              key={activePlayer}
              src={activePlayer}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {/* Related Movies */}
      {data.relatedMovies.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
              <line x1="17" y1="17" x2="22" y2="17" />
            </svg>
            Film Terkait
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.relatedMovies.map((m) => (
              <MovieCard key={m.slug} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MovieCard({ movie }: { movie: { slug: string; title: string; poster: string } }) {
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
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {movie.title}
        </h3>
      </div>
    </Link>
  )
}

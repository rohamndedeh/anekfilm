'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { ParaMovieDetail } from '@/lib/para-types'
import FavoriteButton from '@/components/FavoriteButton'
import WatchHistoryTracker from '@/components/WatchHistoryTracker'

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<ParaMovieDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/para/detail?id=${encodeURIComponent(slug)}`)
        if (res.ok) setData(await res.json())
      } catch {} finally { setLoading(false) }
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
        <p className="text-zinc-500">Film tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WatchHistoryTracker
        id={`movie-${slug}`}
        title={data.title}
        poster={data.poster}
        type="movie"
        slug={String(data.id)}
        url={`/movies/${data.id}`}
      />

      <Link
        href="/movies"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke Film
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="shrink-0 w-full md:w-64">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            {data.poster ? (
              <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            {data.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.quality && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {data.quality}
              </span>
            )}
            {data.year && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {data.year}
              </span>
            )}
          </div>

          {data.synopsis && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Sinopsis</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">{data.synopsis}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Nonton Sekarang
            </a>
            <FavoriteButton
              id={`movie-${slug}`}
              title={data.title}
              poster={data.poster}
              type="movie"
              slug={String(data.id)}
              url={`/movies/${data.id}`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
        {data.director && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Sutradara:</span> {data.director}
          </div>
        )}
        {data.cast && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Pemain:</span> {data.cast}
          </div>
        )}
        {data.date && (
          <div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Rilis:</span> {new Date(data.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        )}
      </div>

      {data.content && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Detail</h2>
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      )}
    </div>
  )
}

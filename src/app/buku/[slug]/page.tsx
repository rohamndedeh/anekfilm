'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { PerpusBookDetail } from '@/lib/perpus-scraper'
import FavoriteButton from '@/components/FavoriteButton'

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<PerpusBookDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/buku/detail?slug=${encodeURIComponent(slug)}`)
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
        <p className="text-zinc-500">Buku tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/buku"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke Buku
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="shrink-0 w-full md:w-64">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            {data.cover ? (
              <img src={data.cover} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
            {data.category && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 capitalize">
                {data.category.replace(/-/g, ' ')}
              </span>
            )}
            {data.pages > 0 && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {data.pages} halaman
              </span>
            )}
            {data.views > 0 && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {data.views.toLocaleString('id-ID')} dilihat
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Baca Sekarang
            </a>
            <FavoriteButton
              id={`buku-${slug}`}
              title={data.title}
              poster={data.cover}
              type="book"
              slug={slug}
              url={`/buku/${slug}`}
            />
          </div>
        </div>
      </div>

      {data.images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Halaman Buku</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.images.map((img, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img src={img} alt={`Halaman ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MangaSearchResult, MangaChapter } from '@/lib/manga-types'

export default function ComicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('')
  const [comic, setComic] = useState<MangaSearchResult | null>(null)
  const [chapters, setChapters] = useState<MangaChapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ id: comicId }) => {
      setId(comicId)
      loadComic(comicId)
    })
  }, [params])

  const loadComic = async (comicId: string) => {
    setLoading(true)
    try {
      const [detailRes, chaptersRes] = await Promise.all([
        fetch(`/api/manga/detail?id=${comicId}`),
        fetch(`/api/manga/chapters?id=${comicId}&limit=100`),
      ])
      if (detailRes.ok) setComic(await detailRes.json())
      if (chaptersRes.ok) {
        const data = await chaptersRes.json()
        setChapters(data.chapters || [])
      }
    } catch {} finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Komik tidak ditemukan</p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    ongoing: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    completed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    hiatus: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/comics" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali ke Komik
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="shrink-0 w-full md:w-56">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            {comic.coverUrl ? (
              <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{comic.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {comic.status && (
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[comic.status] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                {comic.status}
              </span>
            )}
            {comic.year && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {comic.year}
              </span>
            )}
            {comic.author && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {comic.author}
              </span>
            )}
          </div>

          {comic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {comic.tags.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{g}</span>
              ))}
            </div>
          )}

          {comic.description && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Sinopsis</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">{comic.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          Chapter ({chapters.length})
        </h2>

        {chapters.length === 0 ? (
          <p className="text-zinc-400 text-sm">Belum ada chapter tersedia</p>
        ) : (
          <div className="space-y-1">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/comics/${id}/chapter/${ch.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {ch.volume ? `Vol. ${ch.volume} ` : ''}
                    {ch.chapter ? `Chapter ${ch.chapter}` : 'Oneshot'}
                    {ch.title ? ` - ${ch.title}` : ''}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {ch.scanlationGroup && `${ch.scanlationGroup} · `}
                    {new Date(ch.publishAt).toLocaleDateString('id-ID')}
                    {ch.pages > 0 && ` · ${ch.pages} halaman`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

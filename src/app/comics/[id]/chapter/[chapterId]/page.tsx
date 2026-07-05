'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface MangaPage {
  images: string[]
}

export default function ChapterReaderPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>
}) {
  const [resolved, setResolved] = useState<{ id: string; chapterId: string } | null>(null)
  const [pages, setPages] = useState<MangaPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => {
      setResolved(p)
      loadPages(p.chapterId)
    })
  }, [params])

  const loadPages = async (slug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/manga/pages?slug=${encodeURIComponent(slug)}`)
      if (res.ok) setPages(await res.json())
    } catch {} finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pages || !resolved) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Chapter tidak ditemukan</p>
        <Link href={resolved ? `/comics/${resolved.id}` : '/comics'} className="mt-4 inline-block text-blue-600 hover:underline text-sm">
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <Link
          href={`/comics/${resolved.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Daftar Chapter
        </Link>
        <span className="text-xs text-zinc-400">
          {pages.images.length} halaman
        </span>
      </div>

      <div className="flex flex-col items-center gap-0">
        {pages.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Page ${i + 1}`}
            loading={i < 3 ? 'eager' : 'lazy'}
            className="w-full h-auto"
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 mb-12">
        <Link
          href={`/comics/${resolved.id}`}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Kembali ke Daftar Chapter
        </Link>
      </div>
    </div>
  )
}

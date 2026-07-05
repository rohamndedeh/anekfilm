'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { PerpusBook } from '@/lib/perpus-scraper'

interface Category { slug: string; name: string; icon: string }

export default function BukuPage() {
  const [books, setBooks] = useState<PerpusBook[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('ebook-gratis')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState(false)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      if (searchMode && searchQuery.trim()) {
        const res = await fetch(`/api/buku/search?q=${encodeURIComponent(searchQuery.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setBooks(data.books || [])
        }
        setLoading(false)
        return
      }

      const params = new URLSearchParams({ page: String(page), category })
      const res = await fetch(`/api/buku/books?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setBooks(data.books || [])
        setTotalPages(data.totalPages || 1)
        if (data.categories) setCategories(data.categories)
      }
    } catch {} finally { setLoading(false) }
  }, [category, page, searchQuery, searchMode])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleCategory = (c: string) => {
    setCategory(c)
    setSearchMode(false)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchMode(true)
      setPage(1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Buku</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Jelajahi koleksi ebook gratis dari perpus.org</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari buku..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          Cari
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5 mb-6">
        <button
          onClick={() => handleCategory('ebook-gratis')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
            category === 'ebook-gratis'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => handleCategory(c.slug)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              category === c.slug
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">Tidak ada buku ditemukan</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>

          {!searchMode && totalPages > 1 && (
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
                  if (totalPages <= 7) pageNum = i + 1
                  else if (page <= 4) pageNum = i + 1
                  else if (page >= totalPages - 3) pageNum = totalPages - 6 + i
                  else pageNum = page - 3 + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pageNum === page ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
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

function BookCard({ book }: { book: PerpusBook }) {
  return (
    <Link
      href={`/buku/${book.slug}`}
      className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {book.title}
        </h3>
        <p className="text-[11px] text-zinc-400 mt-1 capitalize">{book.category.replace(/-/g, ' ')}</p>
      </div>
    </Link>
  )
}

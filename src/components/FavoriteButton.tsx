'use client'

import { useFavorites } from '@/lib/favorites-context'

interface FavoriteButtonProps {
  id: string
  title: string
  poster: string
  type: 'anime' | 'movie'
  slug: string
  url: string
  className?: string
}

export default function FavoriteButton({ id, title, poster, type, slug, url, className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(id)

  return (
    <button
      onClick={() => toggleFavorite({ id, title, poster, type, slug, url })}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${className} ${
        active
          ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
      }`}
      title={active ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {active ? 'Tersimpan' : 'Favorit'}
    </button>
  )
}

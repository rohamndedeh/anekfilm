import Link from 'next/link'
import type { SearchResult } from '@/lib/types'

interface AnimeCardProps {
  anime: SearchResult
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const slug = anime.url.replace(/^\//, '')

  return (
    <Link
      href={`/${slug}`}
      className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-black/70 text-white">
          {anime.type}
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold bg-blue-600 text-white">
          {anime.status}
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {anime.title}
        </h3>
        {anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {anime.genres.slice(0, 3).map((g) => (
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

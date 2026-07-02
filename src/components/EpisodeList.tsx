import Link from 'next/link'
import type { Episode } from '@/lib/types'

interface EpisodeListProps {
  animeSlug: string
  episodes: Episode[]
}

export default function EpisodeList({ animeSlug, episodes }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        <p className="text-lg">Belum ada episode tersedia</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
      {episodes
        .sort((a, b) => b.number - a.number)
        .map((ep) => (
          <Link
            key={ep.number}
            href={`/anime/${animeSlug}/episode/${ep.number}`}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 shrink-0">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Ep. {ep.number}
          </Link>
        ))}
    </div>
  )
}

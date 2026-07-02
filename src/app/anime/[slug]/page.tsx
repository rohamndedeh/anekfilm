import { scrapeAnimeDetail } from '@/lib/scraper'
import EpisodeList from '@/components/EpisodeList'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detail = await scrapeAnimeDetail(slug)

  if (!detail) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Kembali
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="shrink-0 w-full md:w-64">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            <img
              src={detail.poster}
              alt={detail.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {detail.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {detail.type && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {detail.type}
              </span>
            )}
            {detail.status && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                {detail.status}
              </span>
            )}
            {detail.releaseYear && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {detail.releaseYear}
              </span>
            )}
            {detail.rating && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300">
                ⭐ {detail.rating}
              </span>
            )}
          </div>

          {detail.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {detail.genres.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {detail.synopsis && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Sinopsis
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                {detail.synopsis}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Daftar Episode
        </h2>
        <EpisodeList animeSlug={slug} episodes={detail.episodes} />
      </div>
    </div>
  )
}

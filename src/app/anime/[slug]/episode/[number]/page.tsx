import { scrapeEpisodeDetail } from '@/lib/scraper'
import { scrapeAnimeDetail } from '@/lib/scraper'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>
}) {
  const { slug, number } = await params
  const episodeNumber = parseInt(number)

  if (isNaN(episodeNumber)) {
    notFound()
  }

  const [episode, anime] = await Promise.all([
    scrapeEpisodeDetail(slug, episodeNumber),
    scrapeAnimeDetail(slug),
  ])

  if (!episode) {
    notFound()
  }

  const animeEpisodes = anime?.episodes || []
  const prevEpisode = episodeNumber > 1 ? episodeNumber - 1 : null
  const nextEpisode = animeEpisodes.some((ep) => ep.number === episodeNumber + 1)
    ? episodeNumber + 1
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link
          href={`/anime/${slug}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[200px]"
        >
          {anime?.title || slug}
        </Link>
        <span>/</span>
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">Episode {episodeNumber}</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        {anime?.title || episode.animeTitle} - Episode {episodeNumber}
      </h1>

      <VideoPlayer embedUrl={episode.embedUrl} title={episode.title} />

      <div className="flex items-center justify-center gap-4 mt-6">
        {prevEpisode ? (
          <Link
            href={`/anime/${slug}/episode/${prevEpisode}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Episode {prevEpisode}
          </Link>
        ) : (
          <div />
        )}

        {nextEpisode ? (
          <Link
            href={`/anime/${slug}/episode/${nextEpisode}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm font-medium shadow-md shadow-blue-500/20"
          >
            Episode {nextEpisode}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {episode.downloadUrl && (
        <div className="mt-6 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Download
          </h3>
          <a
            href={episode.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-zinc-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Link Download
          </a>
        </div>
      )}
    </div>
  )
}

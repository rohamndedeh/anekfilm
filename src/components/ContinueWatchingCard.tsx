'use client'

import Link from 'next/link'
import type { WatchHistoryItem } from '@/lib/watch-history-context'

export default function ContinueWatchingCard({ item }: { item: WatchHistoryItem }) {
  const progressPct = item.duration > 0 ? Math.min((item.progress / item.duration) * 100, 100) : 0

  return (
    <Link
      href={item.url}
      className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700 hover:-translate-y-1"
    >
      <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xs text-white line-clamp-1">{item.title}</h3>
            {item.episode && (
              <p className="text-[10px] text-zinc-300">Episode {item.episode}</p>
            )}
          </div>
        </div>
        <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
          item.type === 'anime' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
        }`}>
          {item.type}
        </span>
      </div>
      <div className="px-3 py-2">
        <div className="h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-400 mt-1 text-right">
          {formatDuration(item.progress)} / {formatDuration(item.duration)}
        </p>
      </div>
    </Link>
  )
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

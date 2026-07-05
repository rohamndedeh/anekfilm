'use client'

import { useEffect, useRef } from 'react'
import { useWatchHistory } from '@/lib/watch-history-context'

interface WatchHistoryTrackerProps {
  id: string
  title: string
  poster: string
  type: 'anime' | 'movie'
  slug: string
  url: string
  episode?: number
}

export default function WatchHistoryTracker({
  id, title, poster, type, slug, url, episode,
}: WatchHistoryTrackerProps) {
  const { saveProgress } = useWatchHistory()
  const savedRef = useRef(false)

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true

    saveProgress({
      id,
      title,
      poster,
      type,
      slug,
      url,
      episode,
      progress: 0,
      duration: 0,
    })
  }, [id, title, poster, type, slug, url, episode, saveProgress])

  return null
}

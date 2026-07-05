'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface WatchHistoryItem {
  id: string
  title: string
  poster: string
  type: 'anime' | 'movie'
  slug: string
  url: string
  episode?: number
  progress: number
  duration: number
  watchedAt: number
}

interface WatchHistoryContextType {
  history: WatchHistoryItem[]
  saveProgress: (item: Omit<WatchHistoryItem, 'watchedAt'>) => void
  getProgress: (id: string) => WatchHistoryItem | undefined
  removeHistory: (id: string) => void
  recentItems: (count?: number) => WatchHistoryItem[]
}

const WatchHistoryContext = createContext<WatchHistoryContextType | null>(null)
const STORAGE_KEY = 'neko-watch-history'
const MAX_ITEMS = 50

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  }, [history, loaded])

  const saveProgress = useCallback((item: Omit<WatchHistoryItem, 'watchedAt'>) => {
    setHistory((prev) => {
      const existing = prev.findIndex((h) => h.id === item.id)
      const updated: WatchHistoryItem = { ...item, watchedAt: Date.now() }

      if (existing >= 0) {
        const newList = [...prev]
        newList[existing] = updated
        return newList
      }

      return [updated, ...prev].slice(0, MAX_ITEMS)
    })
  }, [])

  const getProgress = useCallback((id: string) => {
    return history.find((h) => h.id === id)
  }, [history])

  const removeHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const recentItems = useCallback((count = 10) => {
    return [...history]
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .slice(0, count)
  }, [history])

  return (
    <WatchHistoryContext.Provider value={{ history, saveProgress, getProgress, removeHistory, recentItems }}>
      {children}
    </WatchHistoryContext.Provider>
  )
}

export function useWatchHistory() {
  const ctx = useContext(WatchHistoryContext)
  if (!ctx) throw new Error('useWatchHistory must be used within WatchHistoryProvider')
  return ctx
}

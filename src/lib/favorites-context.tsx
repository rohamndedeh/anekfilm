'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { FavoriteItem } from './favorite-type'

interface FavoritesContextType {
  favorites: FavoriteItem[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
  removeFavorite: (id: string) => void
  count: number
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('neko-favorites')
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('neko-favorites', JSON.stringify(favorites))
    }
  }, [favorites, loaded])

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites])

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id)
      if (exists) return prev.filter((f) => f.id !== item.id)
      return [{ ...item, addedAt: Date.now() }, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite, count: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

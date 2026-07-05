export interface FavoriteItem {
  id: string
  title: string
  poster: string
  type: 'anime' | 'movie' | 'book'
  slug: string
  url: string
  addedAt: number
}

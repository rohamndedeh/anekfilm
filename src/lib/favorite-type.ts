export interface FavoriteItem {
  id: string
  title: string
  poster: string
  type: 'anime' | 'movie'
  slug: string
  url: string
  addedAt: number
}

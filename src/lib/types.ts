export interface SearchResult {
  id: number
  title: string
  slug: string
  poster: string
  type: string
  status: string
  category: string
  url: string
  genres: string[]
}

export interface Episode {
  number: number
  title: string
  slug: string
  url: string
  poster?: string
}

export interface AnimeDetail {
  id: number
  title: string
  slug: string
  poster: string
  synopsis: string
  type: string
  status: string
  rating: string
  releaseYear: string
  genres: string[]
  episodes: Episode[]
}

export interface EpisodeDetail {
  title: string
  animeSlug: string
  animeTitle: string
  episodeNumber: number
  embedUrl: string
  downloadUrl?: string
  mirrorUrls?: string[]
}

export interface HomepageData {
  featured: SearchResult[]
  popular: SearchResult[]
  latestUpdates: LatestUpdate[]
  recommended: SearchResult[]
}

export interface LatestUpdate {
  id: number
  title: string
  slug: string
  poster: string
  episode_number: number
  episode_url: string
  type: string
  genres: string[]
}

export interface ExploreFilters {
  genre?: string
  letter?: string
  q?: string
}

export interface ExploreResponse {
  animes: {
    current_page: number
    data: SearchResult[]
    last_page: number
    per_page: number
    total: number
    next_page_url: string | null
    prev_page_url: string | null
  }
  genres: { id: number; name: string; slug: string }[]
  filters: ExploreFilters
}

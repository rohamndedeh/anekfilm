export interface Lk21Movie {
  slug: string
  title: string
  poster: string
  rating: string
  year: string
  quality: string
  duration: string
  genres: string[]
  url: string
}

export interface Lk21MovieDetail {
  slug: string
  title: string
  poster: string
  rating: string
  quality: string
  resolution: string
  duration: string
  genres: string[]
  country: string
  description: string
  director: string
  cast: string[]
  releaseDate: string
  updatedDate: string
  votes: string
  subtitle: string
  iframeUrl: string
  players: Lk21PlayerOption[]
  downloadUrl: string
  relatedMovies: Lk21Movie[]
}

export interface Lk21PlayerOption {
  name: string
  url: string
}

export interface Lk21BrowseResult {
  movies: Lk21Movie[]
  currentPage: number
  lastPage: number
  totalPages: number
  nextPageUrl: string | null
  prevPageUrl: string | null
}

export interface Lk21Genre {
  slug: string
  name: string
}

export interface Lk21Country {
  slug: string
  name: string
}

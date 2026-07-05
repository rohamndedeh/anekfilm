export interface Manga {
  id: number
  source: string
  title: string
  slug: string
  alternativeName: string
  author: string
  synopsis: string
  thumbnail: string
  coverBackground: string
  categoryId: number
  contentType: string
  countryId: number
  color: string
  hot: boolean
  isProject: boolean
  isSafe: boolean
  rating: number
  bookmarkCount: number
  views: number
  release: string
  status: string
  categoryName: string
  votes: number
  genres: string[]
  lastChapter: string | null
}

export interface MangaChapter {
  id: number
  mangaId: number
  title: string
  slug: string
  chapterNumber: string
  cover: string | null
  views: number
  createdAt: string
  updatedAt: string
  imageCount: number
}

export interface MangaPages {
  images: string[]
}

export interface Genre {
  id: number
  name: string
  slug: string
}

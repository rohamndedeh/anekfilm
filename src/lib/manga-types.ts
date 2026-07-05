export interface MangaSearchResult {
  id: string
  title: string
  altTitles: string[]
  description: string
  status: string
  year: number | null
  contentRating: string
  tags: string[]
  coverUrl: string
  author: string
  artist: string
  lastChapter: string | null
}

export interface MangaDetail extends MangaSearchResult {
  volumes: Record<string, number>
  chapters: MangaChapter[]
}

export interface MangaChapter {
  id: string
  volume: string | null
  chapter: string | null
  title: string | null
  translatedLanguage: string
  pages: number
  publishAt: string
  scanlationGroup: string
}

export interface MangaPage {
  baseUrl: string
  chapterHash: string
  images: string[]
  dataSaver: string[]
}

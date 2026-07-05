import type { Manga, MangaChapter, MangaPages, Genre } from './manga-types'

const API = 'https://api-be.komiknesia.my.id/api'

function toManga(data: any): Manga {
  return {
    id: data.id,
    source: data.source || '',
    title: data.title || '',
    slug: data.slug || '',
    alternativeName: data.alternative_name || '',
    author: data.author || '',
    synopsis: data.synopsis || '',
    thumbnail: data.thumbnail || '',
    coverBackground: data.cover_background || '',
    categoryId: data.category_id || 0,
    contentType: data.content_type || '',
    countryId: data.country_id || 0,
    color: data.color || '',
    hot: data.hot || false,
    isProject: data.is_project || false,
    isSafe: data.is_safe || false,
    rating: data.rating || 0,
    bookmarkCount: data.bookmark_count || 0,
    views: data.views || 0,
    release: data.release || '',
    status: data.status || '',
    categoryName: data.category_name || '',
    votes: data.votes || 0,
    genres: data.genres || [],
    lastChapter: data.last_chapter || null,
  }
}

function toChapter(data: any): MangaChapter {
  return {
    id: data.id,
    mangaId: data.manga_id,
    title: data.title || '',
    slug: data.slug || '',
    chapterNumber: data.chapter_number || '',
    cover: data.cover || null,
    views: data.views || 0,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
    imageCount: data.image_count || 0,
  }
}

export async function searchManga(query: string, limit = 20): Promise<Manga[]> {
  const resp = await fetch(`${API}/manga?search=${encodeURIComponent(query)}&limit=${limit}`)
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.manga || []).map(toManga)
}

export async function getMangaDetail(id: string): Promise<Manga | null> {
  const resp = await fetch(`${API}/manga?page=1&limit=1`)
  if (!resp.ok) return null
  const json = await resp.json()
  const manga = (json.manga || []).find((m: any) => String(m.id) === id || m.slug === id)
  if (!manga) return null
  return toManga(manga)
}

export async function getMangaChapters(id: string): Promise<MangaChapter[]> {
  const resp = await fetch(`${API}/manga/${id}/chapters`)
  if (!resp.ok) return []
  const json = await resp.json()
  if (!Array.isArray(json)) return []
  return json.map(toChapter)
}

export async function getChapterPages(slug: string): Promise<MangaPages | null> {
  const resp = await fetch(`${API}/chapters/slug/${encodeURIComponent(slug)}`)
  if (!resp.ok) return null
  const json = await resp.json()
  if (!json.status || !json.data) return null
  return { images: json.data.images || [] }
}

export async function getPopularManga(limit = 20): Promise<Manga[]> {
  const resp = await fetch(`${API}/manga?page=1&limit=${limit}`)
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.manga || []).map(toManga)
}

export async function getRecentlyUpdated(limit = 20): Promise<Manga[]> {
  const resp = await fetch(`${API}/manga?page=1&limit=${limit}`)
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.manga || []).map(toManga)
}

export async function getGenres(): Promise<Genre[]> {
  const resp = await fetch(`${API}/contents/genres`)
  if (!resp.ok) return []
  const json = await resp.json()
  if (!json.status || !json.data) return []
  return json.data
}

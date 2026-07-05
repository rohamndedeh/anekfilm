import type { Manga, MangaChapter, MangaPages, Genre } from './manga-types'

const API = 'https://api-be.komiknesia.my.id/api'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Referer': 'https://id.komiknesia.net/',
  'Origin': 'https://id.komiknesia.net',
}

async function apiFetch(path: string): Promise<any> {
  const resp = await fetch(`${API}${path}`, { headers: HEADERS, next: { revalidate: 60 } })
  if (!resp.ok) throw new Error(`KomikNesia API error: ${resp.status}`)
  return resp.json()
}

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
    rating: Number(data.rating) || 0,
    bookmarkCount: data.bookmark_count || 0,
    views: data.views || 0,
    release: data.release || '',
    status: data.status || '',
    categoryName: data.category_name || '',
    votes: data.votes || 0,
    genres: (data.genres || []).map((g: any) => typeof g === 'string' ? g : g.name || ''),
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
  try {
    const json = await apiFetch(`/manga?search=${encodeURIComponent(query)}&limit=${limit}`)
    return (json.manga || []).map(toManga)
  } catch { return [] }
}

export async function getMangaDetail(id: string): Promise<Manga | null> {
  try {
    const json = await apiFetch(`/manga?page=1&limit=50`)
    const manga = (json.manga || []).find((m: any) => String(m.id) === String(id))
    if (!manga) return null
    return toManga(manga)
  } catch { return null }
}

export async function getMangaChapters(id: string): Promise<MangaChapter[]> {
  try {
    const json = await apiFetch(`/manga/${id}/chapters`)
    if (!Array.isArray(json)) return []
    return json.map(toChapter)
  } catch { return [] }
}

export async function getChapterPages(slug: string): Promise<MangaPages | null> {
  try {
    const json = await apiFetch(`/chapters/slug/${encodeURIComponent(slug)}`)
    if (!json.status || !json.data) return null
    return { images: json.data.images || [] }
  } catch { return null }
}

export async function getPopularManga(limit = 20): Promise<Manga[]> {
  try {
    const json = await apiFetch(`/manga?page=1&limit=${limit}`)
    return (json.manga || []).map(toManga)
  } catch { return [] }
}

export async function getRecentlyUpdated(limit = 20): Promise<Manga[]> {
  try {
    const json = await apiFetch(`/manga?page=1&limit=${limit}`)
    return (json.manga || []).map(toManga)
  } catch { return [] }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const json = await apiFetch(`/contents/genres`)
    if (!json.status || !json.data) return []
    return json.data
  } catch { return [] }
}

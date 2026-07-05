import type { MangaSearchResult, MangaDetail, MangaChapter, MangaPage } from './manga-types'

const API = 'https://api.mangadex.org'

function coverUrl(mangaId: string, fileName: string): string {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`
}

function mangaTitle(attributes: any): string {
  if (attributes.title) {
    const keys = Object.keys(attributes.title)
    if (keys.length > 0) return attributes.title[keys[0]]
  }
  if (attributes.altTitles && attributes.altTitles.length > 0) {
    for (const alt of attributes.altTitles) {
      const keys = Object.keys(alt)
      if (keys.length > 0) return alt[keys[0]]
    }
  }
  return 'Unknown'
}

function mangaDescription(attributes: any): string {
  if (attributes.description) {
    const en = attributes.description.en
    if (en) return en.substring(0, 1000)
    const keys = Object.keys(attributes.description)
    if (keys.length > 0) return attributes.description[keys[0]].substring(0, 1000)
  }
  return ''
}

function extractCover(data: any): string {
  for (const rel of data.relationships || []) {
    if (rel.type === 'cover_art' && rel.attributes) {
      return coverUrl(data.id, rel.attributes.fileName)
    }
  }
  return ''
}

function extractAuthor(data: any): string {
  for (const rel of data.relationships || []) {
    if (rel.type === 'author' && rel.attributes) {
      return rel.attributes.name || ''
    }
  }
  return ''
}

function extractScanlation(chapter: any): string {
  for (const rel of chapter.relationships || []) {
    if (rel.type === 'scanlation_group' && rel.attributes) {
      return rel.attributes.name || ''
    }
  }
  return ''
}

function toSearchResult(data: any): MangaSearchResult {
  const attrs = data.attributes
  return {
    id: data.id,
    title: mangaTitle(attrs),
    altTitles: (attrs.altTitles || []).slice(0, 5).map((a: any) => {
      const k = Object.keys(a)[0]
      return k ? a[k] : ''
    }),
    description: mangaDescription(attrs),
    status: attrs.status || 'unknown',
    year: attrs.year,
    contentRating: attrs.contentRating || 'safe',
    tags: (attrs.tags || []).map((t: any) => t.attributes?.name?.en || '').filter(Boolean),
    coverUrl: extractCover(data),
    author: extractAuthor(data),
    artist: '',
    lastChapter: attrs.lastChapter,
  }
}

export async function searchManga(query: string, limit = 20): Promise<MangaSearchResult[]> {
  const params = new URLSearchParams({
    title: query,
    limit: String(limit),
    'includes[]': 'cover_art',
    'order[relevance]': 'desc',
    'availableTranslatedLanguage[]': 'en',
  })
  const resp = await fetch(`${API}/manga?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.data || []).map(toSearchResult)
}

export async function getMangaDetail(id: string): Promise<MangaDetail | null> {
  const params = new URLSearchParams()
  params.append('includes[]', 'cover_art')
  params.append('includes[]', 'author')
  params.append('includes[]', 'artist')
  const resp = await fetch(`${API}/manga/${id}?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return null
  const json = await resp.json()
  const data = json.data
  if (!data) return null

  const result = toSearchResult(data)
  const artistRel = data.relationships?.find((r: any) => r.type === 'artist')
  result.artist = artistRel?.attributes?.name || ''

  return {
    ...result,
    volumes: {},
    chapters: [],
  }
}

export async function getMangaChapters(
  mangaId: string,
  lang = 'en',
  limit = 100,
  offset = 0
): Promise<{ chapters: MangaChapter[]; total: number }> {
  const params = new URLSearchParams({
    'translatedLanguage[]': lang,
    'order[chapter]': 'desc',
    limit: String(limit),
    offset: String(offset),
    'includes[]': 'scanlation_group',
  })
  const resp = await fetch(`${API}/manga/${mangaId}/feed?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return { chapters: [], total: 0 }
  const json = await resp.json()

  const chapters: MangaChapter[] = (json.data || []).map((ch: any) => ({
    id: ch.id,
    volume: ch.attributes?.volume || null,
    chapter: ch.attributes?.chapter || null,
    title: ch.attributes?.title || null,
    translatedLanguage: ch.attributes?.translatedLanguage || lang,
    pages: ch.attributes?.pages || 0,
    publishAt: ch.attributes?.publishAt || '',
    scanlationGroup: extractScanlation(ch),
  }))

  return { chapters, total: json.total || 0 }
}

export async function getChapterPages(chapterId: string): Promise<MangaPage | null> {
  const resp = await fetch(`${API}/at-home/server/${chapterId}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return null
  const json = await resp.json()

  return {
    baseUrl: json.baseUrl || '',
    chapterHash: json.chapter?.hash || '',
    images: json.chapter?.data || [],
    dataSaver: json.chapter?.dataSaver || [],
  }
}

export async function getPopularManga(limit = 20): Promise<MangaSearchResult[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    'includes[]': 'cover_art',
    'order[followedCount]': 'desc',
    'hasAvailableChapters': 'true',
    'availableTranslatedLanguage[]': 'en',
  })
  const resp = await fetch(`${API}/manga?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.data || []).map(toSearchResult)
}

export async function getRecentlyUpdated(limit = 20): Promise<MangaSearchResult[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    'includes[]': 'cover_art',
    'order[latestUploadedChapter]': 'desc',
    'hasAvailableChapters': 'true',
    'availableTranslatedLanguage[]': 'en',
  })
  const resp = await fetch(`${API}/manga?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.data || []).map(toSearchResult)
}

export async function getMangaByGenre(genre: string, limit = 20): Promise<MangaSearchResult[]> {
  const tagResp = await fetch(`${API}/manga/tag`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!tagResp.ok) return []
  const tagJson = await tagResp.json()
  const tag = (tagJson.data || []).find((t: any) =>
    t.attributes?.name?.en?.toLowerCase() === genre.toLowerCase()
  )
  if (!tag) return []

  const params = new URLSearchParams({
    limit: String(limit),
    'includes[]': 'cover_art',
    'includeTags[]': tag.id,
    'order[relevance]': 'desc',
    'hasAvailableChapters': 'true',
    'availableTranslatedLanguage[]': 'en',
  })
  const resp = await fetch(`${API}/manga?${params}`, {
    headers: { 'User-Agent': 'MangaApp/1.0' },
  })
  if (!resp.ok) return []
  const json = await resp.json()
  return (json.data || []).map(toSearchResult)
}

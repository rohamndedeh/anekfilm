import type { ParaMovie, ParaMovieDetail } from './para-types'

const API = 'https://parachutedrone.com/wp-json/wp/v2'
const SITE = 'https://parachutedrone.com'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
}

async function apiFetch(path: string): Promise<any> {
  const resp = await fetch(`${API}${path}`, { headers: HEADERS, next: { revalidate: 300 } })
  if (!resp.ok) throw new Error(`API error: ${resp.status}`)
  return resp.json()
}

async function getMediaUrl(id: number): Promise<string> {
  if (!id) return ''
  try {
    const data = await apiFetch(`/media/${id}`)
    return data.source_url || ''
  } catch { return '' }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function parsePost(post: any, posterUrl: string): ParaMovie {
  return {
    id: post.id,
    title: stripHtml(post.title?.rendered || ''),
    slug: post.slug || '',
    link: post.link || '',
    poster: posterUrl,
    synopsis: stripHtml(post.content?.rendered || post.excerpt?.rendered || ''),
    director: (post.muvidirector || []).join(', '),
    cast: (post.muvicast || []).join(', '),
    year: String(post.muviyear || ''),
    country: String(post.muvicountry || ''),
    quality: String(post.muviquality || ''),
    categories: (post.categories || []).map(String),
    date: post.date || '',
  }
}

export async function getParaMovies(page = 1, perPage = 24, category?: string): Promise<{ movies: ParaMovie[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      _fields: 'id,slug,title,link,excerpt,content,featured_media,categories,date,muvidirector,muvicast,muviyear,muvicountry,muviquality',
    })
    if (category) params.set('categories', category)
    const data = await apiFetch(`/posts?${params}`)
    const total = parseInt(data.headers?.get?.('x-wp-total') || '0')
    const totalPages = parseInt(data.headers?.get?.('x-wp-totalpages') || '0')

    const movies: ParaMovie[] = []
    for (const post of data) {
      const poster = await getMediaUrl(post.featured_media)
      movies.push(parsePost(post, poster))
    }
    return { movies, total, totalPages }
  } catch {
    return { movies: [], total: 0, totalPages: 0 }
  }
}

export async function getParaMovieDetail(idOrSlug: string): Promise<ParaMovieDetail | null> {
  try {
    let post: any
    if (/^\d+$/.test(idOrSlug)) {
      const data = await apiFetch(`/posts/${idOrSlug}`)
      post = data
    } else {
      const data = await apiFetch(`/posts?slug=${encodeURIComponent(idOrSlug)}&per_page=1`)
      post = data[0]
    }
    if (!post) return null
    const poster = await getMediaUrl(post.featured_media)
    const base = parsePost(post, poster)
    return { ...base, content: post.content?.rendered || '' }
  } catch { return null }
}

export async function searchParaMovies(query: string, page = 1, perPage = 24): Promise<{ movies: ParaMovie[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams({
      search: query,
      page: String(page),
      per_page: String(perPage),
      _fields: 'id,slug,title,link,excerpt,content,featured_media,categories,date,muvidirector,muvicast,muviyear,muvicountry,muviquality',
    })
    const data = await apiFetch(`/posts?${params}`)
    const total = parseInt(data.headers?.get?.('x-wp-total') || '0')
    const totalPages = parseInt(data.headers?.get?.('x-wp-totalpages') || '0')

    const movies: ParaMovie[] = []
    for (const post of data) {
      const poster = await getMediaUrl(post.featured_media)
      movies.push(parsePost(post, poster))
    }
    return { movies, total, totalPages }
  } catch {
    return { movies: [], total: 0, totalPages: 0 }
  }
}

export async function getParaCategories(): Promise<{ id: number; name: string; slug: string; count: number }[]> {
  try {
    const data = await apiFetch('/categories?per_page=100')
    return data
      .filter((c: any) => c.count > 50)
      .map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }))
      .sort((a: any, b: any) => b.count - a.count)
  } catch { return [] }
}

export const CATEGORY_MAP: Record<string, string> = {
  action: '2',
  comedy: '4',
  drama: '6',
  horror: '9',
  thriller: '13',
  romance: '11',
  'science-fiction': '12',
  adventure: '3',
  fantasy: '7',
  crime: '5',
  mystery: '10',
  animation: '1076',
  family: '1159',
  movies: '1068',
  'serial-tv': '1074',
  'box-office': '1243',
}

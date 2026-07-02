import * as cheerio from 'cheerio'
import type { AnimeDetail, Episode, EpisodeDetail, HomepageData, SearchResult, LatestUpdate, ExploreResponse } from './types'

const BASE_URL = 'https://nekonimeid.net'

function parseDataPage(html: string): any | null {
  const match = html.match(/data-page="([^"]+)"/)
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1].replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))))
  } catch {
    return null
  }
}

export async function scrapeAnimeDetail(slug: string): Promise<AnimeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/anime/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    const html = await res.text()
    const page = parseDataPage(html)
    if (!page?.props?.anime) return null

    const a = page.props.anime
    const episodesRaw: any[] = (a.episodes || page.props.episodes || [])

    const genres: string[] = (a.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name))

    const episodes: Episode[] = episodesRaw.map((ep: any) => ({
      number: ep.number,
      title: ep.title || `Episode ${ep.number}`,
      slug: `${slug}/episode/${ep.number}`,
      url: `/anime/${slug}/episode/${ep.number}`,
      poster: a.poster || '',
    }))

    return {
      id: a.id || 0,
      title: a.title || slug,
      slug,
      poster: a.poster || a.cover || '',
      synopsis: a.synopsis || '',
      type: a.type || '',
      status: a.status || '',
      rating: a.rating ? String(a.rating) : '',
      releaseYear: a.release_date ? a.release_date.substring(0, 4) : '',
      genres,
      episodes,
    }
  } catch (e) {
    console.error('Scrape detail error:', e)
    return null
  }
}

export async function scrapeEpisodeDetail(
  slug: string,
  number: number
): Promise<EpisodeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/anime/${slug}/episode/${number}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    const html = await res.text()
    const page = parseDataPage(html)
    if (!page?.props?.episode) {
      const detail = await scrapeAnimeDetail(slug)
      const ep = detail?.episodes.find((e) => e.number === number)
      if (ep) {
        return {
          title: ep.title,
          animeSlug: slug,
          animeTitle: detail?.title || slug,
          episodeNumber: number,
          embedUrl: '',
          downloadUrl: '',
          mirrorUrls: [],
        }
      }
      return null
    }

    const ep = page.props.episode
    const mirrors: { label: string; url: string }[] = ep.mirror_streams || []
    const downloads: { label: string; url: string }[] = ep.download_urls || []

    const embedUrl = ep.video_url || (mirrors.length > 0 ? mirrors[0].url : '')

    const parseStreamObj = (items: any[]): { label: string; url: string }[] => {
      return items.map((item) => {
        if (typeof item === 'string') {
          const m = item.match(/label=([^;]+);\s*url=([^\s}]+)/)
          return m ? { label: m[1].trim(), url: m[2].trim() } : { label: '', url: item }
        }
        return item
      })
    }

    const parsedMirrors = parseStreamObj(mirrors)
    const parsedDownloads = parseStreamObj(downloads)

    return {
      title: ep.title || `Episode ${number}`,
      animeSlug: slug,
      animeTitle: (ep.anime?.title) || slug,
      episodeNumber: number,
      embedUrl,
      downloadUrl: parsedDownloads.length > 0 ? parsedDownloads[0].url : '',
      mirrorUrls: parsedMirrors.map((m) => m.url),
    }
  } catch (e) {
    console.error('Scrape episode error:', e)
    return null
  }
}

export async function scrapeHomepage(): Promise<HomepageData | null> {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    const html = await res.text()
    const page = parseDataPage(html)
    if (!page?.props) return null

    const mapAnime = (item: any): SearchResult => ({
      id: item.id || 0,
      title: item.title || '',
      slug: item.slug || '',
      poster: item.poster || item.cover || '',
      type: item.type || '',
      status: item.status || '',
      category: 'anime',
      url: `/anime/${item.slug}`,
      genres: (item.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name)),
    })

    const mapUpdate = (item: any): LatestUpdate => ({
      id: item.id || 0,
      title: item.title || '',
      slug: item.slug || '',
      poster: item.poster || '',
      episode_number: item.episode_number || 0,
      episode_url: item.episode_url || '',
      type: item.type || '',
      genres: (item.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name)),
    })

    const extractArray = (data: any): any[] => {
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object' && data.All) return data.All
      if (data && typeof data === 'object') {
        return Object.values(data).flat().filter(Boolean)
      }
      return []
    }

    return {
      featured: (page.props.featured || []).map(mapAnime),
      popular: extractArray(page.props.popular).map(mapAnime),
      latestUpdates: (page.props.latestUpdates || []).map(mapUpdate),
      recommended: (page.props.recommended || []).map(mapAnime),
    }
  } catch (e) {
    console.error('Scrape home error:', e)
    return null
  }
}

export async function scrapeExplore(params: Record<string, string> = {}): Promise<ExploreResponse | null> {
  try {
    const query = new URLSearchParams(params).toString()
    const url = `${BASE_URL}/explore${query ? `?${query}` : ''}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    })
    const html = await res.text()
    const page = parseDataPage(html)
    if (!page?.props) return null

    const srcAnimes = page.props.animes
    const srcGenres: any[] = page.props.genres || []

    const mapAnime = (item: any): SearchResult => ({
      id: item.id || 0,
      title: item.title || '',
      slug: item.slug || '',
      poster: item.poster || '',
      type: item.type || '',
      status: item.status || '',
      category: 'anime',
      url: `/anime/${item.slug}`,
      genres: (item.genres || []).map((g: any) => (typeof g === 'string' ? g : g.name)),
    })

    return {
      animes: {
        current_page: srcAnimes.current_page || 1,
        data: (srcAnimes.data || []).map(mapAnime),
        last_page: srcAnimes.last_page || 1,
        per_page: srcAnimes.per_page || 24,
        total: srcAnimes.total || 0,
        next_page_url: srcAnimes.next_page_url || null,
        prev_page_url: srcAnimes.prev_page_url || null,
      },
      genres: srcGenres.map((g: any) => ({ id: g.id, name: g.name, slug: g.slug })),
      filters: page.props.filters || {},
    }
  } catch (e) {
    console.error('Scrape explore error:', e)
    return null
  }
}

export async function scrapeEpisodeList(slug: string): Promise<Episode[]> {
  const detail = await scrapeAnimeDetail(slug)
  return detail?.episodes || []
}

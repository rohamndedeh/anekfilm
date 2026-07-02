import * as cheerio from 'cheerio'
import type { Lk21Movie, Lk21MovieDetail, Lk21BrowseResult } from './lk21-types'

const BASE_URL = 'https://tv11.lk21official.cc'

function fetchHtml(url: string): Promise<string> {
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
  }).then((r) => r.text())
}

function parseMovieCard(el: any, $: cheerio.CheerioAPI): Lk21Movie | null {
  const $el = $(el)
  const link = $el.find('a[href]').first()
  const href = link.attr('href') || ''
  const slug = href.replace(/^\//, '')

  const title =
    $el.find('[itemprop="name"]').attr('content') ||
    $el.find('.poster-title').text().trim() ||
    $el.find('img').first().attr('alt') ||
    ''

  const poster =
    $el.find('img[itemprop="image"]').attr('src') ||
    $el.find('img').first().attr('src') ||
    $el.find('img').first().attr('data-src') ||
    ''

  const rating = $el.find('[itemprop="ratingValue"]').text().trim()
  const year = $el.find('.year').text().trim()
  const quality = $el.find('.label').first().text().trim()
  const duration = $el.find('.duration').text().trim()

  const genreMeta = $el.find('[itemprop="genre"]').attr('content') || ''
  const genres = genreMeta.split(',').map((g) => g.trim()).filter(Boolean)

  return {
    slug,
    title,
    poster,
    rating: rating || '',
    year: year || '',
    quality: quality || '',
    duration: duration || '',
    genres,
    url: `/${slug}`,
  }
}

function parseMovieCardFromLi(el: any, $: cheerio.CheerioAPI): Lk21Movie | null {
  const $el = $(el)
  const link = $el.find('a[href]').first()
  const href = link.attr('href') || ''
  const slug = href.replace(/^\//, '')

  const title = $el.find('img').attr('alt') || ''
  const poster = $el.find('img').attr('data-src') || $el.find('img').attr('src') || ''

  const yearEl = $el.find('.video-year')
  const year = yearEl.text().trim()

  return {
    slug,
    title,
    poster,
    rating: '',
    year: year || '',
    quality: '',
    duration: '',
    genres: [],
    url: `/${slug}`,
  }
}

function parseListPage(html: string): Lk21BrowseResult {
  const $ = cheerio.load(html)

  const movies: Lk21Movie[] = []
  $('article').each((_, el) => {
    const m = parseMovieCard(el, $)
    if (m && m.title) movies.push(m)
  })

  if (movies.length === 0) {
    $('li').each((_, el) => {
      const $el = $(el)
      if ($el.find('a[href]').length && $el.find('img').length && !$el.closest('.gmr-omb-info').length) {
        const m = parseMovieCardFromLi(el, $)
        if (m && m.title) movies.push(m)
      }
    })
  }

  const pageLinks = $('.pagination a, .page-numbers a, a.page-numbers')
  const pages: number[] = []
  pageLinks.each((_, el) => {
    const t = $(el).text().trim()
    const n = parseInt(t, 10)
    if (!isNaN(n)) pages.push(n)
  })

  const currentActive = $('.pagination .current, .page-numbers.current, span.page-numbers.current')
  const currentPage = currentActive.length
    ? parseInt(currentActive.text().trim(), 10) || 1
    : 1

  const lastPage = pages.length > 0 ? Math.max(...pages) : 1

  const nextLink = $('.pagination .next, a.next.page-numbers').attr('href') || null
  const prevLink = $('.pagination .prev, a.prev.page-numbers').attr('href') || null

  return {
    movies,
    currentPage,
    lastPage,
    totalPages: lastPage,
    nextPageUrl: nextLink ? `https://tv11.lk21official.cc${nextLink}` : null,
    prevPageUrl: prevLink ? `https://tv11.lk21official.cc${prevLink}` : null,
  }
}

export async function scrapeLk21Browse(
  type?: string,
  slug?: string,
  page: number = 1
): Promise<Lk21BrowseResult | null> {
  try {
    let url: string
    if (type && slug) {
      url = `${BASE_URL}/${type}/${slug}/`
    } else if (type) {
      url = `${BASE_URL}/${type}/`
    } else {
      url = `${BASE_URL}/`
    }
    if (page > 1) url += `page/${page}/`

    const html = await fetchHtml(url)
    return parseListPage(html)
  } catch (e) {
    console.error('Scrape LK21 browse error:', e)
    return null
  }
}

export async function scrapeLk21Home(): Promise<{
  latest: Lk21Movie[]
  popular: Lk21Movie[]
  featured: Lk21Movie[]
}> {
  try {
    const html = await fetchHtml(`${BASE_URL}/`)
    const $ = cheerio.load(html)
    const all: Lk21Movie[] = []

    $('article').each((_, el) => {
      const m = parseMovieCard(el, $)
      if (m && m.title && !all.some((x) => x.slug === m.slug)) all.push(m)
    })

    return {
      featured: all.slice(0, 8),
      popular: all.slice(0, 12),
      latest: all,
    }
  } catch (e) {
    console.error('Scrape LK21 home error:', e)
    return { latest: [], popular: [], featured: [] }
  }
}

export async function scrapeLk21Detail(slug: string): Promise<Lk21MovieDetail | null> {
  try {
    const html = await fetchHtml(`${BASE_URL}/${slug}`)
    const $ = cheerio.load(html)

    const title = $('h1').first().text().trim()
    if (!title) return null

    const poster =
      $('img[itemprop="image"]').first().attr('src') ||
      $('.entry-content img, .movie-info img, .detail img').first().attr('data-src') ||
      $('.entry-content img, .movie-info img, .detail img').first().attr('src') ||
      ''

    const rating = $('.info-tag strong').text().trim() || $('[itemprop="ratingValue"]').text().trim()

    let iframeUrl = $('iframe').first().attr('src') || ''

    // Extract all player options
    const players: { name: string; url: string }[] = []
    $('#player-list li a').each((_, el) => {
      const server = $(el).attr('data-server') || ''
      const url = $(el).attr('data-url') || $(el).attr('href') || ''
      if (server && url) {
        players.push({ name: server.toUpperCase(), url })
      }
    })

    // Convert playeriframe.sbs URLs to direct embeddable player URLs
    const convertedPlayers = players.map((p) => {
      const match = p.url.match(/playeriframe\.sbs\/iframe\/([^/]+)\/(.+)/)
      if (match) {
        const type = match[1]
        const id = match[2]
        switch (type) {
          case 'p2p':
            return { name: p.name, url: `https://cloud.hownetwork.xyz/video.php?id=${id}` }
          case 'cast':
            return { name: p.name, url: `https://gn1r5n.org/e/${id}` }
          case 'turbovip':
            return { name: p.name, url: `https://turbo.embed-player.xyz/${id}` }
          case 'hydrax':
            return { name: p.name, url: `https://abyssplayer.com/${id}` }
          default:
            return p
        }
      }
      return p
    })

    // If no players found from list, create one from iframe
    if (convertedPlayers.length === 0 && iframeUrl) {
      convertedPlayers.push({ name: 'DEFAULT', url: iframeUrl })
    }

    // Prefer CAST as first player since P2P is often under maintenance
    convertedPlayers.sort((a, b) => {
      if (a.name === 'CAST') return -1
      if (b.name === 'CAST') return 1
      return 0
    })

    // Set default iframeUrl to first available player
    iframeUrl = convertedPlayers[0]?.url || iframeUrl

    // Fallback: if iframeUrl still has playeriframe.sbs, convert it
    const fallbackMatch = iframeUrl.match(/playeriframe\.sbs\/iframe\/([^/]+)\/(.+)/)
    if (fallbackMatch) {
      const type = fallbackMatch[1]
      const id = fallbackMatch[2]
      if (type === 'cast') {
        iframeUrl = `https://gn1r5n.org/e/${id}`
      } else if (type === 'p2p') {
        iframeUrl = `https://cloud.hownetwork.xyz/video.php?id=${id}`
      } else if (type === 'turbovip') {
        iframeUrl = `https://turbo.embed-player.xyz/${id}`
      } else if (type === 'hydrax') {
        iframeUrl = `https://abyssplayer.com/${id}`
      }
    }

    const downloadUrl =
      $('a[href*="dl.lk21"]').first().attr('href') ||
      $('a:contains("DOWNLOAD")').first().attr('href') ||
      ''

    const infoTags: string[] = []
    $('.info-tag span').each((_, el) => {
      const t = $(el).text().trim()
      if (t) infoTags.push(t)
    })

    const quality = infoTags.find((t) => /^(HD|CAM|WEB|DVD|BluRay|WEBDL)/i.test(t)) || ''
    const resolution = infoTags.find((t) => /[0-9]+p/i.test(t)) || ''
    const duration = infoTags.find((t) => /^[0-9]+h\s[0-9]+m|[0-9]+:[0-9]+/.test(t)) || ''

    const genres: string[] = []
    $('.tag-list .tag a').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (href.startsWith('/genre/')) {
        genres.push($(el).text().trim())
      }
    })

    let country = ''
    $('.tag-list .tag a').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (href.startsWith('/country/')) {
        country = $(el).text().trim()
      }
    })

    let description = ''
    const textNodes = $.root().find('h1').first().parent().contents()
    let found = false
    textNodes.each((_, el) => {
      if (el.type === 'text' && $(el).text().trim().length > 30) {
        description = $(el).text().trim()
        found = true
        return false
      }
    })

    if (!found) {
      const h1 = $('h1').first()
      let next = h1.next()
      for (let i = 0; i < 5; i++) {
        if (next.length && next.text().trim().length > 20) {
          description = next.text().trim()
          break
        }
        next = next.next()
      }
    }

    let director = ''
    let cast: string[] = []
    let releaseDate = ''
    let updatedDate = ''
    let votes = ''
    let subtitle = ''

    $('.detail p').each((_, el) => {
      const text = $(el).text().trim()
      const label = $(el).find('span').first().text().trim().replace(':', '')

      if (label === 'Sutradara') {
        director = $(el).text().replace(label, '').replace(':', '').trim()
      } else if (label === 'Bintang Film') {
        const links = $(el).find('a')
        links.each((_, a) => {
          cast.push($(a).text().trim())
        })
      } else if (label === 'Negara') {
        country = $(el).find('a').first().text().trim() || country
      } else if (label === 'Votes') {
        votes = $(el).text().replace(label, '').replace(':', '').trim()
      } else if (label === 'Release') {
        releaseDate = $(el).text().replace(label, '').replace(':', '').trim()
      } else if (label === 'Updated') {
        updatedDate = $(el).text().replace(label, '').replace(':', '').trim()
      } else if (label === 'Subtitle') {
        subtitle = $(el).find('a').first().text().trim()
      }
    })

    const relatedMovies: Lk21Movie[] = []
    $('.gmr-rp-content li, .related-movies li, .movie-related li').each((_, el) => {
      const m = parseMovieCardFromLi(el, $)
      if (m && m.title) relatedMovies.push(m)
    })

    if (relatedMovies.length === 0) {
      $('article').each((_, el) => {
        const m = parseMovieCard(el, $)
        if (m && m.title && m.slug !== slug) relatedMovies.push(m)
      })
    }

    const cleanTitle = title
      .replace(/^Nonton\s+/i, '')
      .replace(/\s+Sub\s*Indo.*$/i, '')
      .replace(/\s+di\s+Lk21.*$/i, '')
      .trim()

    return {
      slug,
      title: cleanTitle,
      poster,
      rating,
      quality,
      resolution,
      duration,
      genres,
      country,
      description,
      director,
      cast,
      releaseDate,
      updatedDate,
      votes,
      subtitle,
      iframeUrl,
      players: convertedPlayers,
      downloadUrl,
      relatedMovies: relatedMovies.slice(0, 20),
    }
  } catch (e) {
    console.error('Scrape LK21 detail error:', e)
    return null
  }
}

export async function scrapeLk21Search(query: string): Promise<Lk21Movie[]> {
  try {
    const resp = await fetch(`https://gudangvape.com/search.php?s=${encodeURIComponent(query)}&page=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://tv11.lk21official.cc/',
        'Accept': 'application/json, text/plain, */*',
      },
    })
    if (resp.ok) {
      const json: any = await resp.json()
      const items: any[] = json?.data || json?.items || []
      return items.map((item: any) => ({
        slug: item.slug || '',
        title: (item.title || '').replace(/\(\d{4}\)$/, '').trim(),
        poster: item.poster ? `https://poster.showcdnx.com/wp-content/uploads/${item.poster}` : '',
        rating: String(item.rating || ''),
        year: String(item.year || ''),
        quality: String(item.quality || ''),
        duration: item.runtime || item.season ? `S.${item.season}` : '',
        genres: [],
        url: `/${item.slug}`,
      }))
    }
    const html = await fetchHtml(`${BASE_URL}/search/?s=${encodeURIComponent(query)}`)
    const result = parseListPage(html)
    return result.movies
  } catch (e) {
    console.error('Scrape LK21 search error:', e)
    return []
  }
}

const GENRE_SLUGS: [string, string][] = [
  ['action', 'Action'],
  ['adventure', 'Adventure'],
  ['animation', 'Animation'],
  ['biography', 'Biography'],
  ['comedy', 'Comedy'],
  ['crime', 'Crime'],
  ['documentary', 'Documentary'],
  ['drama', 'Drama'],
  ['family', 'Family'],
  ['fantasy', 'Fantasy'],
  ['history', 'History'],
  ['horror', 'Horror'],
  ['musical', 'Musical'],
  ['mystery', 'Mystery'],
  ['romance', 'Romance'],
  ['sci-fi', 'Sci-Fi'],
  ['sport', 'Sport'],
  ['thriller', 'Thriller'],
  ['war', 'War'],
  ['western', 'Western'],
]

const COUNTRY_SLUGS: [string, string][] = [
  ['united-states', 'United States'],
  ['united-kingdom', 'United Kingdom'],
  ['japan', 'Japan'],
  ['south-korea', 'South Korea'],
  ['china', 'China'],
  ['india', 'India'],
  ['france', 'France'],
  ['canada', 'Canada'],
  ['germany', 'Germany'],
  ['hong-kong', 'Hong Kong'],
  ['australia', 'Australia'],
  ['spain', 'Spain'],
  ['italy', 'Italy'],
  ['thailand', 'Thailand'],
  ['malaysia', 'Malaysia'],
  ['belgium', 'Belgium'],
  ['philippines', 'Philippines'],
  ['mexico', 'Mexico'],
  ['sweden', 'Sweden'],
  ['ireland', 'Ireland'],
  ['denmark', 'Denmark'],
  ['taiwan', 'Taiwan'],
  ['poland', 'Poland'],
  ['netherlands', 'Netherlands'],
  ['russia', 'Russia'],
  ['brazil', 'Brazil'],
  ['turkey', 'Turkey'],
  ['argentina', 'Argentina'],
  ['south-africa', 'South Africa'],
  ['norway', 'Norway'],
  ['new-zealand', 'New Zealand'],
  ['switzerland', 'Switzerland'],
  ['singapore', 'Singapore'],
  ['finland', 'Finland'],
  ['czech-republic', 'Czech Republic'],
  ['romania', 'Romania'],
  ['austria', 'Austria'],
  ['vietnam', 'Vietnam'],
  ['greece', 'Greece'],
  ['colombia', 'Colombia'],
  ['israel', 'Israel'],
  ['iran', 'Iran'],
  ['portugal', 'Portugal'],
]

export function getGenres(): [string, string][] {
  return GENRE_SLUGS
}

export function getCountries(): [string, string][] {
  return COUNTRY_SLUGS
}

import * as cheerio from 'cheerio'

export interface PerpusBook {
  title: string
  slug: string
  category: string
  cover: string
  link: string
}

export interface PerpusBookDetail extends PerpusBook {
  views: number
  pages: number
  images: string[]
  description: string
}

const BASE = 'https://www.perpus.org'
const IMG_BASE = 'https://image-v2.free-ebook.my.id'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
}

async function fetchHtml(url: string): Promise<string> {
  const resp = await fetch(url, { headers: HEADERS, next: { revalidate: 600 } })
  if (!resp.ok) throw new Error(`Fetch error: ${resp.status}`)
  return resp.text()
}

function extractSlugFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1] || parts[parts.length - 2] || ''
}

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function getPerpusBooks(category = 'ebook-gratis', page = 1): Promise<{ books: PerpusBook[]; totalPages: number }> {
  try {
    const url = page > 1 ? `${BASE}/${category}?page=${page}` : `${BASE}/${category}`
    const html = await fetchHtml(url)
    const $ = cheerio.load(html)

    const books: PerpusBook[] = []
    $('.ebook-product-wrap').each((_, el) => {
      const $el = $(el)
      const link = $el.find('a').attr('href') || ''
      const cover = $el.find('img').attr('data-src') || $el.find('img').attr('src') || ''
      const title = $el.find('.book-title').text().trim() || titleFromSlug(extractSlugFromUrl(link))
      const slug = extractSlugFromUrl(link)
      const cat = link.split('/')[3] || category

      if (link && title) {
        books.push({ title, slug, category: cat, cover, link })
      }
    })

    // Try to find total pages from pagination
    let totalPages = 1
    const pageLinks = $('ul.pagination li a')
    pageLinks.each((_, el) => {
      const href = $(el).attr('href') || ''
      const match = href.match(/page=(\d+)/)
      if (match) {
        const p = parseInt(match[1])
        if (p > totalPages) totalPages = p
      }
    })

    return { books, totalPages }
  } catch {
    return { books: [], totalPages: 0 }
  }
}

export async function getPerpusBookDetail(slug: string): Promise<PerpusBookDetail | null> {
  try {
    // Try common categories
    const categories = ['komik', 'pengembangan-diri', 'bisnis-dan-ekonomi', 'teknologi', 'sastra', 'sains', 'fiksi', 'agama', 'lainnya']
    let html = ''
    let foundCategory = ''

    for (const cat of categories) {
      try {
        const resp = await fetch(`${BASE}/${cat}/${slug}`, { headers: HEADERS, next: { revalidate: 600 } })
        if (resp.ok) {
          html = await resp.text()
          foundCategory = cat
          break
        }
      } catch {}
    }

    if (!html) return null

    const $ = cheerio.load(html)
    const title = $('h2, h3, .book-title').first().text().trim() || titleFromSlug(slug)
    const cover = $('img[src*="free-ebook.my.id"]').first().attr('src') || ''
    const viewsMatch = $('body').text().match(/(\d[\d,]*)\s*x\s*dilihat/)
    const pagesMatch = $('body').text().match(/(\d+)\s*hal/)

    const images: string[] = []
    $('img[src*="free-ebook.my.id"]').each((_, el) => {
      const src = $(el).attr('src')
      if (src && src.includes('/sketch/') && !src.includes('-min.')) {
        images.push(src)
      }
    })

    return {
      title,
      slug,
      category: foundCategory,
      cover: cover || `${IMG_BASE}/sketch/${slug}/${slug}-min.jpg`,
      link: `${BASE}/${foundCategory}/${slug}`,
      views: viewsMatch ? parseInt(viewsMatch[1].replace(/,/g, '')) : 0,
      pages: pagesMatch ? parseInt(pagesMatch[1]) : 0,
      images,
      description: '',
    }
  } catch { return null }
}

export async function searchPerpusBooks(query: string): Promise<PerpusBook[]> {
  try {
    const html = await fetchHtml(`${BASE}/ebook-gratis?search=${encodeURIComponent(query)}`)
    const $ = cheerio.load(html)

    const books: PerpusBook[] = []
    $('.ebook-product-wrap').each((_, el) => {
      const $el = $(el)
      const link = $el.find('a').attr('href') || ''
      const cover = $el.find('img').attr('data-src') || $el.find('img').attr('src') || ''
      const title = $el.find('.book-title').text().trim() || titleFromSlug(extractSlugFromUrl(link))
      const slug = extractSlugFromUrl(link)
      const cat = link.split('/')[3] || ''

      if (link && title) {
        books.push({ title, slug, category: cat, cover, link })
      }
    })

    return books
  } catch { return [] }
}

export const PERPUS_CATEGORIES = [
  { slug: 'komik', name: 'Komik', icon: '📖' },
  { slug: 'pengembangan-diri', name: 'Pengembangan Diri', icon: '🌱' },
  { slug: 'bisnis-dan-ekonomi', name: 'Bisnis & Ekonomi', icon: '💼' },
  { slug: 'teknologi', name: 'Teknologi', icon: '💻' },
  { slug: 'sastra', name: 'Sastra', icon: '📚' },
  { slug: 'sains', name: 'Sains', icon: '🔬' },
  { slug: 'fiksi', name: 'Fiksi', icon: '📕' },
  { slug: 'agama', name: 'Agama', icon: '🙏' },
  { slug: 'motivasi', name: 'Motivasi', icon: '⚡' },
  { slug: 'kisah-inspiratif', name: 'Kisah Inspiratif', icon: '🌈' },
  { slug: 'pendidikan', name: 'Pendidikan', icon: '🎒' },
  { slug: 'kedokteran', name: 'Kedokteran', icon: '🩺' },
]

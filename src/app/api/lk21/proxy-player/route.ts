import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://tv11.lk21official.cc/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    const contentType = resp.headers.get('content-type') || ''
    const text = await resp.text()

    if (contentType.includes('json')) {
      return NextResponse.json(JSON.parse(text))
    }

    // Extract origin from the target URL for rewriting relative paths
    let origin = ''
    try {
      origin = new URL(url).origin
    } catch {}

    const $ = cheerio.load(text)

    // Remove ad overlay
    $('#uyeouyeo').remove()
    $('#loading-spinner').remove()

    // Remove ad-related and anti-devtools scripts
    $('script').each((_, el) => {
      const content = $(el).html() || ''
      if (
        content.includes('uyeouyeo') ||
        content.includes('adLastClicked') ||
        content.includes('showAdIfNeeded') ||
        content.includes('devtoolIsOpening') ||
        content.includes('window.self === window.top')
      ) {
        $(el).remove()
      }
    })

    // Rewrite relative asset URLs to absolute (so JS/CSS/images load from original domain)
    const fixAttr = (tag: string, attr: string) => {
      $(tag).each((_, el) => {
        const $el = $(el)
        const val = $el.attr(attr)
        if (val && val.startsWith('/')) {
          $el.attr(attr, `${origin}${val}`)
        }
      })
    }
    fixAttr('script', 'src')
    fixAttr('link', 'href')
    fixAttr('img', 'src')
    fixAttr('source', 'srcset')

    // Add inline style
    $('head').append(`
      <style>
        #uyeouyeo, .spinner-overlay, #loading-spinner { display: none !important; }
        .embed-container { z-index: 1 !important; }
        iframe { opacity: 1 !important; }
      </style>
    `)

    $('body').append(`
      <script>try { localStorage.setItem('adLastClicked', '9999999999999') } catch(e) {}</script>
    `)

    // Proxy nested iframes
    $('iframe').each((_, el) => {
      const $el = $(el)
      const src = $el.attr('src')
      if (src && src.startsWith('http') && !src.includes('/api/lk21/proxy-player')) {
        $el.attr('src', `/api/lk21/proxy-player?url=${encodeURIComponent(src)}`)
      }
    })

    $('meta[http-equiv="Content-Security-Policy"]').remove()

    const html = $.html()

    return new NextResponse(html, {
      status: resp.status,
      headers: {
        'Content-Type': contentType || 'text/html',
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
      },
    })
  } catch {
    return new NextResponse('Failed to fetch player', { status: 502 })
  }
}

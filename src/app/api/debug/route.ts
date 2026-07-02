import { NextResponse } from 'next/server'
export async function GET() {
  const mirrors = [
    'https://tv.lk21official.dev/',
    'https://tv.lk21official.dev/enola-holmes-3-2026',
  ]
  const results: Record<string, any> = {}
  for (const url of mirrors) {
    try {
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html',
        },
      })
      const text = await resp.text()
      results[url] = { status: resp.status, length: text.length, hasArticle: text.includes('article'), isChallenge: text.includes('Just a moment') }
    } catch (e: any) {
      results[url] = { error: e.message }
    }
  }
  return NextResponse.json(results)
}

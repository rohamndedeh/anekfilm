import { NextResponse } from 'next/server'
export async function GET() {
  const target = 'https://tv11.lk21official.cc/'
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
  ]
  const results: Record<string, any> = {}
  for (const url of proxies) {
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(15000),
      })
      const text = await resp.text()
      const name = new URL(url).hostname
      results[name] = { status: resp.status, length: text.length, hasArticle: text.includes('article'), isChallenge: text.includes('Just a moment') }
    } catch (e: any) {
      const name = new URL(url).hostname
      results[name] = { error: e.message }
    }
  }
  return NextResponse.json(results)
}

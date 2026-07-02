import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const resp = await fetch('https://tv11.lk21official.cc/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
    const text = await resp.text()
    return NextResponse.json({ status: resp.status, length: text.length, hasArticle: text.includes('article'), snippet: text.substring(0, 500) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}

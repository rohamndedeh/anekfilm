import { NextRequest, NextResponse } from 'next/server'
import { scrapeLk21Detail } from '@/lib/lk21-scraper'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'Parameter slug is required' }, { status: 400 })
  }
  const data = await scrapeLk21Detail(slug)
  if (!data) {
    return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
  }
  return NextResponse.json(data)
}

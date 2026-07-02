import { NextRequest, NextResponse } from 'next/server'
import { scrapeLk21Browse } from '@/lib/lk21-scraper'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || undefined
  const slug = searchParams.get('slug') || undefined
  const page = parseInt(searchParams.get('page') || '1', 10)

  const data = await scrapeLk21Browse(type, slug, page)
  if (!data) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
  return NextResponse.json(data)
}

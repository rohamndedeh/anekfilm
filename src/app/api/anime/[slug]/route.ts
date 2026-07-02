import { NextRequest } from 'next/server'
import { scrapeAnimeDetail } from '@/lib/scraper'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const detail = await scrapeAnimeDetail(slug)
    if (!detail) {
      return Response.json({ error: 'Anime not found' }, { status: 404 })
    }
    return Response.json(detail)
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

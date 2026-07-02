import { NextRequest } from 'next/server'
import { scrapeEpisodeDetail } from '@/lib/scraper'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; number: string }> }
) {
  const { slug, number } = await params
  const episodeNumber = parseInt(number)

  if (isNaN(episodeNumber)) {
    return Response.json({ error: 'Invalid episode number' }, { status: 400 })
  }

  try {
    const detail = await scrapeEpisodeDetail(slug, episodeNumber)
    if (!detail) {
      return Response.json({ error: 'Episode not found' }, { status: 404 })
    }
    return Response.json(detail)
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

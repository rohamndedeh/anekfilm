import { scrapeHomepage } from '@/lib/scraper'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await scrapeHomepage()
    if (!data) {
      return Response.json({ error: 'Failed to fetch homepage data' }, { status: 500 })
    }
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

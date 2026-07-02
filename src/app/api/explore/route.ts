import { NextRequest } from 'next/server'
import { scrapeExplore } from '@/lib/scraper'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string> = {}
    request.nextUrl.searchParams.forEach((value, key) => {
      params[key] = value
    })

    const data = await scrapeExplore(params)
    if (!data) {
      return Response.json({ error: 'Failed to fetch explore data' }, { status: 500 })
    }
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

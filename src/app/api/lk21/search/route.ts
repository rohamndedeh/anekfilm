import { NextRequest, NextResponse } from 'next/server'
import { scrapeLk21Search } from '@/lib/lk21-scraper'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 })
  }
  const data = await scrapeLk21Search(q)
  return NextResponse.json(data)
}

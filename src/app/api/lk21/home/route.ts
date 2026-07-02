import { NextResponse } from 'next/server'
import { scrapeLk21Home } from '@/lib/lk21-scraper'

export async function GET() {
  const data = await scrapeLk21Home()
  if (!data) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 })
  }
  return NextResponse.json(data)
}

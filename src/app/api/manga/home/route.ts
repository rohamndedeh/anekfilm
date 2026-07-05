import { NextResponse } from 'next/server'
import { getPopularManga, getRecentlyUpdated } from '@/lib/manga-api'

export async function GET() {
  const [popular, recent] = await Promise.all([
    getPopularManga(12),
    getRecentlyUpdated(12),
  ])
  return NextResponse.json({ popular, recent })
}

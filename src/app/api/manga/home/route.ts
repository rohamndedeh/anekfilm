import { NextResponse } from 'next/server'
import { getPopularManga } from '@/lib/manga-api'

export async function GET() {
  const popular = await getPopularManga(20)
  return NextResponse.json({ popular })
}

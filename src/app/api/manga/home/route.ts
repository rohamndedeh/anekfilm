import { NextResponse } from 'next/server'
import { getPopularManga } from '@/lib/manga-api'

export async function GET() {
  try {
    const popular = await getPopularManga(20)
    return NextResponse.json({ popular })
  } catch (e) {
    return NextResponse.json({ popular: [] })
  }
}

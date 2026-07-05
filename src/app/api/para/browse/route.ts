import { NextRequest, NextResponse } from 'next/server'
import { getParaMovies, CATEGORY_MAP } from '@/lib/para-scraper'

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const genre = req.nextUrl.searchParams.get('genre') || ''
    const sort = req.nextUrl.searchParams.get('sort') || 'latest'
    const category = CATEGORY_MAP[genre] || genre || '1068'
    const data = await getParaMovies(page, 24, category)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ movies: [], total: 0, totalPages: 0 })
  }
}

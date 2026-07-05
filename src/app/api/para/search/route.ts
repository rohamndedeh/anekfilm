import { NextRequest, NextResponse } from 'next/server'
import { searchParaMovies } from '@/lib/para-scraper'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || ''
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    if (!q) return NextResponse.json({ movies: [], total: 0, totalPages: 0 })
    const data = await searchParaMovies(q, page)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ movies: [], total: 0, totalPages: 0 })
  }
}

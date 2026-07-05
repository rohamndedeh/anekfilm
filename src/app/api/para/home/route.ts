import { NextResponse } from 'next/server'
import { getParaMovies } from '@/lib/para-scraper'

export async function GET() {
  try {
    const data = await getParaMovies(1, 24, '1068')
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ movies: [], total: 0, totalPages: 0 })
  }
}

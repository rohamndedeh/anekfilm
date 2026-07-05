import { NextRequest, NextResponse } from 'next/server'
import { searchPerpusBooks } from '@/lib/perpus-scraper'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || ''
    if (!q) return NextResponse.json({ books: [] })
    const data = await searchPerpusBooks(q)
    return NextResponse.json({ books: data })
  } catch {
    return NextResponse.json({ books: [] })
  }
}

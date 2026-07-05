import { NextRequest, NextResponse } from 'next/server'
import { getPerpusBooks, PERPUS_CATEGORIES } from '@/lib/perpus-scraper'

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category') || 'ebook-gratis'
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const data = await getPerpusBooks(category, page)
    return NextResponse.json({ ...data, categories: PERPUS_CATEGORIES })
  } catch {
    return NextResponse.json({ books: [], totalPages: 0, categories: PERPUS_CATEGORIES })
  }
}

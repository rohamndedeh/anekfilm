import { NextRequest, NextResponse } from 'next/server'
import { searchManga } from '@/lib/manga-api'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20', 10)
  if (!q) return NextResponse.json([])
  const results = await searchManga(q, limit)
  return NextResponse.json(results)
}

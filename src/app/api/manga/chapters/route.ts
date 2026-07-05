import { NextRequest, NextResponse } from 'next/server'
import { getMangaChapters } from '@/lib/manga-api'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const lang = req.nextUrl.searchParams.get('lang') || 'en'
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100', 10)
  const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0', 10)
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const data = await getMangaChapters(id, lang, limit, offset)
  return NextResponse.json(data)
}

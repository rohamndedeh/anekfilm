import { NextRequest, NextResponse } from 'next/server'
import { getMangaDetail, getMangaChapters } from '@/lib/manga-api'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const [detail, chapters] = await Promise.all([
      getMangaDetail(id),
      getMangaChapters(id),
    ])
    if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...detail, chapters })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

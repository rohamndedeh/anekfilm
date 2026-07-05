import { NextRequest, NextResponse } from 'next/server'
import { getMangaChapters } from '@/lib/manga-api'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const chapters = await getMangaChapters(id)
  return NextResponse.json({ chapters })
}

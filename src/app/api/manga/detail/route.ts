import { NextRequest, NextResponse } from 'next/server'
import { getMangaDetail } from '@/lib/manga-api'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const data = await getMangaDetail(id)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

import { NextResponse } from 'next/server'
import { getGenres } from '@/lib/manga-api'

export async function GET() {
  const genres = await getGenres()
  return NextResponse.json(genres)
}

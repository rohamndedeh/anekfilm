import { NextResponse } from 'next/server'
import { getGenres } from '@/lib/manga-api'

export async function GET() {
  try {
    const genres = await getGenres()
    return NextResponse.json(genres)
  } catch {
    return NextResponse.json([])
  }
}

import { NextResponse } from 'next/server'
import { getParaCategories } from '@/lib/para-scraper'

export async function GET() {
  try {
    const cats = await getParaCategories()
    return NextResponse.json(cats)
  } catch {
    return NextResponse.json([])
  }
}

import { NextRequest } from 'next/server'

const NEKONIME_API = 'https://nekonimeid.net/api/search'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q) {
    return Response.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`${NEKONIME_API}?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch from Nekonime API' }, { status: res.status })
    }

    const data = await res.json()
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

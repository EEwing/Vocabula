import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  })
} 
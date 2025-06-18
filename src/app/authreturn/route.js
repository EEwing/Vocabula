import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const redirectPath = searchParams.get('redirect') || '/'
  // Redirect to the specified path or home if none specified
  return NextResponse.redirect(new URL(redirectPath, request.url))
} 
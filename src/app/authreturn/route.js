import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabaseServer'

export async function GET(request) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectPath = searchParams.get('redirect') || '/'

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to the specified path or home if none specified
  return NextResponse.redirect(new URL(redirectPath, request.url))
} 
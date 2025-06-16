import { NextResponse } from 'next/server'
import { createClient } from '../lib/supabaseServer'

export async function GET(request) {
  const supabase = await createClient()

  // First check if there's a session
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Logout error:', error)
    }
  }

  // Create response with redirect
  const response = NextResponse.redirect(new URL('/', request.url), {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  })
  
  return response
} 
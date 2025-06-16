'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabaseServer'

export async function signInWithGoogle() {
  const supabase = await createClient()

  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    redirect('/')
  }

  const headersList = await headers()
  const url = new URL(headersList.get('referer') || '')
  const redirectPath = url.searchParams.get('redirect') || '/'

  // Get the OAuth URL for Google
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/authreturn?redirect=${encodeURIComponent(redirectPath)}`,
    },
  })

  if (error) {
    throw new Error('Authentication failed')
  }

  // Redirect to the OAuth URL
  redirect(data.url)
} 
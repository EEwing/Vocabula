"use client"

import { supabase, useAuth } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Test() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
        await supabase.auth.signOut()
        router.replace('/')
    };

    logout()
  }, [router])

  return <p>Logging out...</p>
}

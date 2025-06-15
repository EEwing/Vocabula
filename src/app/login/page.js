"use client"

import { supabase, useAuth } from '@/lib/supabaseClient';
import Home from '@/app/page';
import { Auth } from '@supabase/auth-ui-react';

export default function Test() {
  const { user } = useAuth();

  if(!user)
  {
    return <>
      <p>Please Log In!</p>
      <Auth supabaseClient={supabase} providers={["google"]} onlyThirdPartyProviders />
    </>
  }

  return <Home />
}

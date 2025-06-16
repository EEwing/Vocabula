import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const shouldLog = !(request.nextUrl.pathname.startsWith('/socket.io') || request.nextUrl.pathname.startsWith('/monitoring'))
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => {
          const cookies = request.cookies.getAll()
          return cookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value
          }))
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /login or /authreturn
  if (!session && !['/login', '/authreturn', '/'].includes(request.nextUrl.pathname)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  }

  // If user is signed in and the current path is /login
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url), {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - /authreturn (auth callback)
     * - /api (API routes)
     * - /public (public routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|authreturn|api|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
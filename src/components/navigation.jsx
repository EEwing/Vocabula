"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    
    checkAuth()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  const isActive = (path) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">V</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Vocabula
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {isAuthenticated && (
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="flex items-center space-x-6">
                <Link 
                  href="/courses" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/courses') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  My Courses
                </Link>
                <Link 
                  href="/review" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/review') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Daily Review
                </Link>
                <Link 
                  href="/settings" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/settings') 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Settings
                </Link>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-4"
              >
                <span className="hidden md:inline-block">Sign Out</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 md:hidden"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleSignIn}
                className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-4"
              >
                <span className="hidden md:inline-block">Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 md:hidden"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
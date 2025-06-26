"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/vocabula.png" alt="Vocabula Logo" className="h-full w-auto max-h-14 rounded-lg object-contain" width={56} height={56}/>
            <span className="hidden font-bold sm:inline-block">
              Vocabula
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <SignedIn>
                <div className="w-full flex-1 md:w-auto md:flex-none">
                    <div className="flex items-center space-x-6">
                        <Link 
                        href="/courses" 
                        className={`text-sm font-medium transition-colors hover:text-primary`}
                        >
                        My Courses
                        </Link>
                        <Link 
                        href="/review" 
                        className={`text-sm font-medium transition-colors hover:text-primary`}
                        >
                        Daily Review
                        </Link>
                        <Link 
                        href="/settings" 
                        className={`text-sm font-medium transition-colors hover:text-primary`}
                        >
                        Settings
                        </Link>
                    </div>
                </div>
            </SignedIn>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
            <SignedIn>
                <SignOutButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
} 
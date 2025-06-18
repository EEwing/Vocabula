"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs"

export function Navigation() {
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
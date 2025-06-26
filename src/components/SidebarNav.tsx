import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs"
import Image from "next/image"
import type { User } from "@clerk/nextjs/server"

export default function SidebarNav({ user }: { user: User | null }) {
  console.log(user)
  return (
    <nav className="flex flex-col h-full w-full gap-6 px-8">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex flex-col items-center gap-2">
          <Image src="/vocabula.png" alt="Vocabula Logo" className="h-16 w-16 rounded-lg object-contain" width={64} height={64} />
          <span className="font-bold text-lg">Vocabula</span>
        </Link>
      </div>
      {user ? (
        <div className="flex flex-col gap-8 mb-8 text-center lg:text-left">
          <Link href="/courses" className="text-base font-medium transition-colors hover:text-primary">My Courses</Link>
          <Link href="/review" className="text-base font-medium transition-colors hover:text-primary">Daily Review</Link>
          <Link href="/settings" className="text-base font-medium transition-colors hover:text-primary">Account</Link>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 mt-auto">
        <ThemeToggle />
        {!user && (
          <>
            <SignInButton />
            <SignUpButton />
          </>
        )}
        {user && (
          <>
            <div className="flex flex-col items-center gap-1 mt-4">
              <Image src={user.imageUrl} alt="User profile" className="h-12 w-12 rounded-full border object-cover" width={48} height={48} />
              <span className="text-xs text-muted-foreground">Signed in as {user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <SignOutButton />
          </>
        )}
      </div>
    </nav>
  )
} 
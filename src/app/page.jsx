import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOwnedCourses } from "@/app/lib/database"
import { auth } from '@clerk/nextjs/server'
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default async function Home() {
  const { userId } = await auth()

  const courses = await getOwnedCourses(userId)

  if (!courses.length) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Vocabula</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <SignedOut>
                Please sign in to view your courses.
              </SignedOut>
              <SignedIn>
                You don't own any courses yet. Create one to get started!
              </SignedIn>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link 
            key={course.id} 
            href={`/course/${course.id}`}
            className="block transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

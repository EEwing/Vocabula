import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEnrolledCourses, getOwnedCourses } from "@/app/lib/database"
import { auth } from '@clerk/nextjs/server'
import { SignedIn, SignedOut } from "@clerk/nextjs"

export default async function Home() {
  const { userId } = await auth()

  const myCourses = await getOwnedCourses(userId)
  const enrolledCourses = await getEnrolledCourses(userId)

  return <div className="container py-8">
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Vocabula</CardTitle>
      </CardHeader>
    </Card>
    <SignedOut>
      <Card>
        <CardTitle>
          Please sign in to view your courses.
        </CardTitle>
      </Card>
    </SignedOut>
    <SignedIn>
      <Card>
        { myCourses.length ?
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">My Courses</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Link 
                  key={course.id} 
                  href={`/course/${course.owner.username}/${course.slug}`}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Course:{course.title}</CardTitle>
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
          : 
          <CardContent>
                You don&apos;t own any courses yet. <Link href="/course/new" className="text-accent hover:underline">Create one</Link> to get started!
          </CardContent>
        }
      </Card>
    </SignedIn>
  </div>
}

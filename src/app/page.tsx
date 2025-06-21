import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from '@clerk/nextjs/server'
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { prisma } from "./lib/prisma"

export default async function Home() {
  const { isAuthenticated, userId } = await auth()

  const allCourses = isAuthenticated ? await prisma.course.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { enrollments: { some: { userId: userId } } }
      ]
    },
    include: {
      owner: {
        select: {
          username: true
        }
      },
      enrollments: {
        where: { userId: userId }
      }
    }
  }) : []

  const myCourses = allCourses.filter(c => c.ownerId === userId)
  const enrolledCourses = allCourses.filter(c => c.enrollments.some(e => e.userId === userId))

  return <>
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
      <Card>
        { enrolledCourses.length ?
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Enrolled Courses</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
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
                You&apos;re not enrolled in any courses yet!
          </CardContent>
        }
      </Card>
    </SignedIn>
  </>
}

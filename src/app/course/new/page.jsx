import { auth } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getAllTopics, createCourseWithTopics, getCurrentUser } from '@/app/lib/database'
import dynamic from 'next/dynamic'

// const CourseForm = dynamic(() => import('./CourseForm'), { ssr: false })
import CourseForm from "@/app/course/new/CourseForm"

export default async function NewCourse() {
  const { userId } = await auth()
  if(!userId) {
      return <RedirectToSignIn />
  }
  
  const topics = await getAllTopics()
  const currentUser = await getCurrentUser(userId)
  
  // Get base URL from environment or construct it
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  // Server action for course creation
  async function createCourse({ name, slug, topicIds }) {
    'use server'
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')
    await createCourseWithTopics({
      name,
      slug,
      ownerId: userId,
      topicIds,
    })
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm 
            topics={topics} 
            createCourse={createCourse} 
            baseUrl={`${baseUrl}/course/${currentUser?.username}`}
          />
        </CardContent>
      </Card>
    </div>
  )
} 
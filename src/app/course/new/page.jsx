import { auth } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getAllTopics, createCourseWithTopics } from '@/app/lib/database'
import dynamic from 'next/dynamic'

// const CourseForm = dynamic(() => import('./CourseForm'), { ssr: false })
import CourseForm from "@/app/course/new/CourseForm"

export default async function NewCourse() {
  const { userId } = await auth()
  if(!userId) {
      return <RedirectToSignIn />
  }
  const topics = await getAllTopics()

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
          <CourseForm topics={topics} createCourse={createCourse} />
        </CardContent>
      </Card>
    </div>
  )
} 
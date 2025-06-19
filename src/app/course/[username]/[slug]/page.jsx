import { getCourseByUsernameAndSlug } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import { CourseProvider } from '@/contexts/CourseContext'
import CoursePageClient from './CoursePageClient'

export default async function CoursePage({ params }) {
  const { username, slug } = await params
  const course = await getCourseByUsernameAndSlug(username, slug)
  if (!course) {
    notFound()
  }
  return (
    <CourseProvider course={course}>
      <CoursePageClient course={course} />
    </CourseProvider>
  )
} 
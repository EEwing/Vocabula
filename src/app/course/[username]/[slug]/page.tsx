import { getCourseByUsernameAndSlug } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import { CourseProvider } from '@/contexts/CourseContext'
import CoursePageClient from './CoursePageClient'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/app/lib/prisma'
import { PermissionsProvider } from '@/contexts/PermissionsContext'

export default async function CoursePage({ params }) {
  const { username, slug } = await params

  const {userId} = await auth()

  const courseOwner = await prisma.user.findUnique({
    where: { username: username },
    select: { id: true }
  })
  const pageData = await prisma.course.findUnique({
    where: { ownerId_slug: { ownerId: courseOwner.id, slug: slug } },
    include: {
      chapters: true,
      Enrollment: true
    }
  })
  const isOwner = pageData.ownerId === userId
  const isEnrolled = pageData.Enrollment.some(e => e.userId === userId)
  const course = await getCourseByUsernameAndSlug(username, slug)
  if (!course) {
    notFound()
  }
  return (
    <CourseProvider course={course}>
      <PermissionsProvider isOwner={isOwner} isEnrolled={isEnrolled}>
        <CoursePageClient course={course} />
      </PermissionsProvider>
    </CourseProvider>
  )
} 
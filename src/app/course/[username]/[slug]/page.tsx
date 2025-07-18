import { notFound } from 'next/navigation'
import { CourseProvider } from '@/contexts/CourseContext'
import CoursePageClient from './CoursePageClient'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/app/lib/prisma'
import { PermissionsProvider } from '@/contexts/PermissionsContext'

export type CourseParams = {
  username: string
  slug: string
}

export default async function CoursePage({ params }: { params: Promise<CourseParams> }) {
  const { username, slug } = await params

  const {userId} = await auth()

  const pageData = await prisma.course.findFirst({
    where: { owner: { username: username }, slug: slug },
    include: {
      chapters: {
        include: {
          lessons: {
            include: {
              _count: {
                select: {
                  cards: true
                }
              }
            }
          }
        }
      },
      enrollments: true,
      topics: {
        include: {
          topic: true
        }
      },
      owner: true
    }
  })

  if (!pageData) notFound()
  const isOwner = pageData.ownerId === userId
  const isEnrolled = pageData.enrollments.some(e => e.userId === userId)
  return (
    <CourseProvider course={pageData}>
      <PermissionsProvider isOwner={isOwner} isEnrolled={isEnrolled}>
        <CoursePageClient />
      </PermissionsProvider>
    </CourseProvider>
  )
} 
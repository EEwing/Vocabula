import { notFound } from 'next/navigation'
import Link from 'next/link'
import LessonManager from './LessonManager'
import { CourseProvider } from '@/contexts/CourseContext'
import { ChapterProvider } from '@/contexts/ChapterContext'
import { PermissionsProvider, usePermissions } from '@/contexts/PermissionsContext'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/app/lib/prisma'

export default async function ChapterPage({ params }) {
  const { username, slug: courseSlug, chapter: chapterSlug } = await params

  const {userId} = await auth()

  const courseOwner = await prisma.user.findUnique({
    where: { username: username },
    select: { id: true }
  })
  const pageData = await prisma.course.findUnique({
    where: { ownerId_slug: { ownerId: courseOwner.id, slug: courseSlug } },
    include: {
      chapters: {
        where: { slug: chapterSlug },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              title: true,
              orderIndex: true,
              isOptional: true,
              _count: {
                select: { cards: true }
              }
            }
          }
        }
      },
      enrollments: true
    }
  })
  const isOwner = pageData.ownerId === userId
  const isEnrolled = pageData.enrollments.some(e => e.userId === userId)

  if(!pageData?.chapters[0]) notFound()

  return (
    <CourseProvider course={pageData}>
      <ChapterProvider chapter={pageData.chapters[0]}>
        <PermissionsProvider isOwner={isOwner} isEnrolled={isEnrolled}>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{pageData.chapters[0].title}</h1>
            {pageData.chapters[0].lessons.length === 0 ? (
              <div className="text-gray-500">No lessons in this chapter yet.</div>
            ) : (
              <ul className="space-y-2">
                {pageData.chapters[0].lessons.map(lesson => (
                  <li key={lesson.id} className="p-3 my-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Link href={`/course/${username}/${courseSlug}/${chapterSlug}/${lesson.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                      {lesson.title}
                    </Link>
                    {typeof lesson._count?.cards === 'number' && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                        {lesson._count.cards} card{lesson._count.cards !== 1 ? 's' : ''}
                      </span>
                    )}
                    {lesson.isOptional && (
                      <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Optional</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <LessonManager chapterId={pageData.chapters[0].id} chapterSlug={pageData.chapters[0].slug} />
          </div>
        </PermissionsProvider>
      </ChapterProvider>
    </CourseProvider>
  )
} 
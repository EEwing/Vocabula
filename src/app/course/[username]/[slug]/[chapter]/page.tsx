import { notFound } from 'next/navigation'
import Link from 'next/link'
import LessonManager from './LessonManager'
import { CourseProvider } from '@/contexts/CourseContext'
import { ChapterProvider } from '@/contexts/ChapterContext'
import { PermissionsProvider, usePermissions } from '@/contexts/PermissionsContext'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/app/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseParams } from '../page'

export type ChapterParams = CourseParams & {
  chapter: string
}

export default async function ChapterPage({ params }: { params: Promise<ChapterParams> }) {
  const { username, slug: courseSlug, chapter: chapterSlug } = await params

  const {userId} = await auth()

  const courseOwner = await prisma.user.findUnique({
    where: { username: username },
    select: { id: true }
  })
  
  if (!courseOwner) notFound()
  
  const pageData = await prisma.course.findUnique({
    where: { ownerId_slug: { ownerId: courseOwner.id, slug: courseSlug } },
    include: {
      owner: true,
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
      enrollments: true,
      topics: {
        include: {
          topic: true
        }
      }
    }
  })
  
  if (!pageData) notFound()
  
  const isOwner = pageData.ownerId === userId
  const isEnrolled = pageData.enrollments.some(e => e.userId === userId)

  if(!pageData?.chapters[0]) notFound()

  return (
    <CourseProvider course={pageData}>
      <ChapterProvider chapter={pageData.chapters[0]}>
        <PermissionsProvider isOwner={isOwner} isEnrolled={isEnrolled}>
            <h1 className="text-3xl font-bold mb-4">{pageData.chapters[0].title}</h1>
            {pageData.chapters[0].lessons.length === 0 ? (
              <Card className="text-muted-foreground">No lessons in this chapter yet.</Card>
            ) : (
              <div className="space-y-2">
                {pageData.chapters[0].lessons.map(lesson => (
                  <Card key={lesson.id}>
                    <CardHeader>
                      <CardContent>
                        <Link href={`/course/${username}/${courseSlug}/${chapterSlug}/${lesson.id}`} className="hover:underline text-blue-600">
                          {lesson.title}
                        </Link>
                        {lesson._count.cards > 0 && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {lesson._count.cards} card{lesson._count.cards !== 1 ? 's' : ''}
                          </span>
                        )}
                        {lesson.isOptional && (
                          <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">Optional</span>
                        )}
                      </CardContent>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
            <LessonManager chapterId={pageData.chapters[0].id} />
        </PermissionsProvider>
      </ChapterProvider>
    </CourseProvider>
  )
} 
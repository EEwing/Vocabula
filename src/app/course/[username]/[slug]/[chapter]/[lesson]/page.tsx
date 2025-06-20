import { notFound } from 'next/navigation'
import { CourseProvider } from '@/contexts/CourseContext'
import { ChapterProvider } from '@/contexts/ChapterContext'
import { LessonProvider } from '@/contexts/LessonContext'
import CardTable from './CardTable'
import { AddCardButton, SaveCardsButton } from './CardField'
import Flashcard from './Flashcard'
import { prisma } from '@/app/lib/prisma'
import { PermissionsProvider } from '@/contexts/PermissionsContext'
import { auth } from '@clerk/nextjs/server'

export default async function LessonPage({ params }) {
  const { username, slug: courseSlug, chapter: chapterSlug, lesson: lessonId } = await params

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
            where: { id: lessonId },
            include: {
              cards: true
            }
          }
        }
      },
      Enrollment: {
        where: { userId: userId }
      }
    }
  })

  if(!pageData?.chapters[0]?.lessons[0]) notFound()

  const isOwner = pageData.ownerId === userId
  const isEnrolled = pageData.Enrollment.length > 0

  return (
    <CourseProvider course={pageData}>
      <ChapterProvider chapter={pageData.chapters[0]}>
        <LessonProvider lesson={pageData.chapters[0].lessons[0]}>
          <PermissionsProvider isOwner={isOwner} isEnrolled={isEnrolled}>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl font-bold mb-4">{pageData.chapters[0].lessons[0].title}</h1>
              <Flashcard />
              <div className="mb-4">
                <CardTable />
                {isOwner && <AddCardButton/>}
                {isOwner && <SaveCardsButton/>}
              </div>
            </div>
          </PermissionsProvider>
        </LessonProvider>
      </ChapterProvider>
    </CourseProvider>
  )
} 
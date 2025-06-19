import { notFound } from 'next/navigation'
import { getLessonById, getChapterByUsernameAndSlugs, getCourseByUsernameAndSlug } from '@/app/lib/database'
import { CourseProvider } from '@/contexts/CourseContext'
import { ChapterProvider } from '@/contexts/ChapterContext'
import { LessonProvider } from '@/contexts/LessonContext'
import CardTable from './CardTable'
import Flashcard from './Flashcard'

export default async function LessonPage({ params }) {
  const { username, slug: courseSlug, chapter: chapterSlug, lesson: lessonId } = await params
  const lesson = await getLessonById(lessonId)
  if (!lesson) notFound()
  const chapter = await getChapterByUsernameAndSlugs(username, courseSlug, chapterSlug)
  if (!chapter) notFound()
  const course = await getCourseByUsernameAndSlug(username, courseSlug)
  if (!course) notFound()
  return (
    <CourseProvider course={course}>
      <ChapterProvider chapter={chapter}>
        <LessonProvider lesson={lesson}>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
            <Flashcard />
            <CardTable />
          </div>
        </LessonProvider>
      </ChapterProvider>
    </CourseProvider>
  )
} 
import { notFound } from 'next/navigation'
import { getChapterByUsernameAndSlugs, getCourseByUsernameAndSlug } from '@/app/lib/database'
import Link from 'next/link'
import LessonManager from './LessonManager'
import { CourseProvider } from '@/contexts/CourseContext'
import { ChapterProvider } from '@/contexts/ChapterContext'

export default async function ChapterPage({ params }) {
  const { username, slug: courseSlug, chapter: chapterSlug } = await params
  const course = await getCourseByUsernameAndSlug(username, courseSlug)
  if (!course) {
    notFound()
  }
  const chapter = await getChapterByUsernameAndSlugs(username, courseSlug, chapterSlug)
  if (!chapter) {
    notFound()
  }
  return (
    <CourseProvider course={course}>
      <ChapterProvider chapter={chapter}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
          <LessonManager chapterId={chapter.id} chapterSlug={chapter.slug} />
          {chapter.lessons.length === 0 ? (
            <div className="text-gray-500">No lessons in this chapter yet.</div>
          ) : (
            <ul className="space-y-2">
              {chapter.lessons.map(lesson => (
                <li key={lesson.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Link href={`/course/${username}/${courseSlug}/${chapterSlug}/${lesson.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {lesson.title}
                  </Link>
                  {lesson.isOptional && (
                    <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">Optional</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </ChapterProvider>
    </CourseProvider>
  )
} 
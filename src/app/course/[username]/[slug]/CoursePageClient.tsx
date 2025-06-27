"use client"

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ChapterFormModal from '@/components/ChapterFormModal'
import Link from 'next/link'
import { usePermissions } from '@/contexts/PermissionsContext'
import { useCourse } from '@/contexts/CourseContext'
import { enroll, unenroll } from '@/server/course'

function EnrollButton() {
  const { isEnrolled, isOwner, setEnrolled } = usePermissions();
  const { course } = useCourse();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true);
    if(isEnrolled) {
      const enrollment = await unenroll(course.id) 
      setEnrolled(enrollment === null);
    } else {
      const enrollment = await enroll(course.id)
      setEnrolled(enrollment !== null)
    }
    setLoading(false);
  };

  if (isOwner) return null;
  return (
    <Button onClick={handleClick} disabled={loading} variant={isEnrolled ? 'secondary' : 'default'} className="ml-2">
      {loading ? (isEnrolled ? 'Unenrolling...' : 'Enrolling...') : (isEnrolled ? 'Unenroll' : 'Enroll')}
    </Button>
  );
}

export default function CoursePageClient() {
  const {course} = useCourse();
  const [modalOpen, setModalOpen] = useState(false)
  const { isOwner } = usePermissions()

  return (
    <>
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Created by {course.owner.name || course.owner.username}
        </p>
        {course.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {course.topics.map(({topic}) => (
              <span
                key={topic.id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {topic.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Course Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Chapters
          </h2>
          <div className="flex items-center">
            {isOwner && <>
              <Button onClick={() => setModalOpen(true)}>
                New Chapter
              </Button>
              <ChapterFormModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                courseSlug={course.slug}
                courseId={course.id}
                onChapterCreated={() => window.location.reload()}
              />
            </>}
            <EnrollButton />
          </div>
        </div>
        {course.chapters.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No chapters available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {course.chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link
                      href={`/course/${course.owner.username}/${course.slug}/${chapter.slug}`}
                      className="text-lg text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {chapter.title}
                    </Link>
                    {chapter.isOptional && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Optional
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chapter.lessons.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No lessons in this chapter yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-background text-foreground rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {lesson.orderIndex}.
                            </span>
                            <Link
                              href={`/course/${course.owner.username}/${course.slug}/${chapter.slug}/${lesson.id}`}
                              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {lesson.title}
                            </Link>
                            {lesson._count.cards > 0 && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                {lesson._count.cards} card{lesson._count.cards !== 1 ? 's' : ''}
                              </span>
                            )}
                            {lesson.isOptional && (
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
} 
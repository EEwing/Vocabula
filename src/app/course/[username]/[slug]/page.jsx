import { getCourseByUsernameAndSlug } from '@/app/lib/database'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function CoursePage({ params }) {
  const { username, slug } = await params
  
  const course = await getCourseByUsernameAndSlug(username, slug)
  
  if (!course) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
              {course.topics.map(({ topic }) => (
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Chapters
          </h2>
          
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
                      <span className="text-lg">{chapter.title}</span>
                      {chapter.isOptional && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
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
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {lesson.orderIndex}.
                              </span>
                              <span className="font-medium">
                                {lesson.title}
                              </span>
                              {lesson.isOptional && (
                                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
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
      </div>
    </div>
  )
} 
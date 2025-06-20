'use server'

import { dbCard, emptyCard } from './cardutils'
import { prisma } from './prisma'

/**
 * Server action to fetch courses owned by a user.
 * @param {string} userId - The user's ID (UUID)
 * @returns {Promise<Array<{id: string, title: string, createdAt: string, slug: string, owner: {username: string}}>>}
 */
export async function getOwnedCourses(userId) {
  if (!userId) return []
  const courses = await prisma.course.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      slug: true,
      owner: {
        select: {
          username: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
  return courses
}

/**
 * Server action to fetch courses a user is enrolled in.
 * @param {string} userId - The user's ID (UUID)
 * @returns {Promise<Array<{id: string, title: string, createdAt: string, slug: string, owner: {username: string}}>>}
 */
export async function getEnrolledCourses(userId) {
  if (!userId) return []
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          slug: true,
          owner: {
            select: {
              username: true,
            }
          }
        },
      },
    },
    orderBy: { entrolledAt: 'desc' },
  })
  // Return just the course objects
  return enrollments.map(e => e.course)
}

/**
 * Server action to create a course and its topic associations.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.slug
 * @param {string} params.ownerId
 * @param {string[]} params.topicIds
 * @returns {Promise<{course: Object, courseTopics: Object[]}>}
 */
export async function createCourseWithTopics({ name, slug, ownerId, topicIds }) {
  const course = await prisma.course.create({
    data: {
      title: name,
      slug,
      ownerId,
    },
  })
  const courseTopics = await Promise.all(
    (topicIds || []).map(topicId =>
      prisma.courseTopic.create({
        data: {
          courseId: course.id,
          topicId,
        },
      })
    )
  )
  return { course, courseTopics }
}

/**
 * Server action to fetch all topics.
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getAllTopics() {
  return prisma.topic.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
}

/**
 * Server action to create a new topic.
 * @param {string} name - The name of the topic
 * @returns {Promise<{id: string, name: string}>}
 */
export async function createTopic(name) {
  if (!name || typeof name !== 'string') throw new Error('Invalid topic name')
  return prisma.topic.create({
    data: { name },
    select: { id: true, name: true },
  })
}

/**
 * Server action to fetch a course by username and slug.
 * @param {string} username - The username of the course owner
 * @param {string} slug - The course slug
 * @returns {Promise<Object|null>}
 */
export async function getCourseByUsernameAndSlug(username, slug) {
  if (!username || !slug) return null
  
  const course = await prisma.course.findFirst({
    where: {
      slug,
      owner: {
        username
      }
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
        }
      },
      topics: {
        include: {
          topic: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      chapters: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              title: true,
              orderIndex: true,
              isOptional: true,
            }
          }
        }
      }
    }
  })
  
  return course
}

/**
 * Server action to get current user data.
 * @param {string} userId - The user's ID (UUID)
 * @returns {Promise<{id: string, username: string, name: string}|null>}
 */
export async function getCurrentUser(userId) {
  if (!userId) return null
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
    }
  })
}

/**
 * Server action to create a new chapter for a course.
 * @param {Object} params
 * @param {string} params.courseId
 * @param {string} params.title
 * @param {string} params.slug
 * @param {boolean} params.isOptional
 * @param {number} params.orderIndex
 * @returns {Promise<Object>} The created chapter
 */
export async function createChapter({ courseId, title, slug, isOptional = false, orderIndex }) {
  if (!courseId || !title || !slug || typeof orderIndex !== 'number') throw new Error('Missing required fields')
  return prisma.chapter.create({
    data: {
      courseId,
      title,
      slug,
      isOptional,
      orderIndex,
    },
  })
}

/**
 * Fetch a chapter by username, courseSlug, and chapterSlug.
 * @param {string} username
 * @param {string} courseSlug
 * @param {string} chapterSlug
 * @returns {Promise<Object|null>}
 */
export async function getChapterByUsernameAndSlugs(username, courseSlug, chapterSlug) {
  if (!username || !courseSlug || !chapterSlug) return null
  const chapter = await prisma.chapter.findFirst({
    where: {
      slug: chapterSlug,
      course: {
        slug: courseSlug,
        owner: { username }
      }
    },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          orderIndex: true,
          isOptional: true,
        }
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          owner: { select: { username: true } }
        }
      }
    }
  })
  return chapter
}

/**
 * Server action to create a new lesson for a chapter.
 * @param {Object} params
 * @param {string} params.chapterId
 * @param {string} params.title
 * @param {string} params.slug
 * @param {boolean} params.isOptional
 * @param {number} params.orderIndex
 * @returns {Promise<Object>} The created lesson
 */
export async function createLesson({ chapterId, title, isOptional = false, orderIndex }) {
  if (!chapterId || !title || typeof orderIndex !== 'number') throw new Error('Missing required fields')
  return prisma.lesson.create({
    data: {
      chapterId,
      title,
      isOptional,
      orderIndex,
    },
  })
}

/**
 * Fetch a lesson by its id.
 * @param {string} lessonId
 * @returns {Promise<Object|null>}
 */
export async function getLessonById(lessonId) {
  if (!lessonId) return null
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      orderIndex: true,
      isOptional: true,
      cards: {
        select: {
          id: true,
          term: true,
          translation: true,
        }
      }
    }
  })
  return lesson
}

/**
 * Fetch a lesson by chapterId and orderIndex.
 * @param {string} chapterId
 * @param {number} orderIndex
 * @returns {Promise<Object|null>}
 */
export async function getLessonByOrderIndex(chapterId, orderIndex) {
  if (!chapterId || typeof orderIndex !== 'number') return null
  const lesson = await prisma.lesson.findFirst({
    where: {
      chapterId,
      orderIndex,
    },
    select: {
      id: true,
      title: true,
      orderIndex: true,
      isOptional: true,
      slug: true,
    }
  })
  return lesson
}

/**
 * Fetch all cards for a lesson.
 * @param {string} lessonId
 * @returns {Promise<Array<{id: string, term: string, translation: string}>>}
 */
export async function getCardsForLesson(lessonId) {
  if (!lessonId) return []
  return prisma.card.findMany({
    where: { lessonId },
    select: { id: true, term: true, translation: true },
    orderBy: { id: 'asc' },
  })
}

export async function deleteCards(cardIds) {
  return prisma.card.deleteMany({
    where: { id: { in: cardIds } },
  })
}

/**
 * Upsert cards for a lesson. Updates existing cards by id, creates new ones if no valid id.
 * @param {string} lessonId
 * @param {Array<{id?: string, term: string, translation: string}>} cards
 * @returns {Promise<Array<Object>>}
 */
export async function saveCardsForLesson(lessonId, cardViews) {
  if (!lessonId || !Array.isArray(cardViews)) throw new Error('Invalid input')
  const results = []
  for (const card of cardViews) {
    if (card.term.trim() === '' && card.translation.trim() === '') {
      results.push(card)
      continue
    }
    if (card.isNew) {
      const created = await prisma.card.create({
        data: {
          lessonId,
          term: card.term,
          translation: card.translation,
          orderIndex: card.orderIndex,
          wordType: '', // default, adjust as needed
        }
      })
      results.push(dbCard(created))
    } else {
      const updated = await prisma.card.update({
        where: { id: card.id },
        data: {
          term: card.term,
          translation: card.translation,
          orderIndex: card.orderIndex,
        }
      })
      results.push(dbCard(updated))
    }
    // Create new
  }
  return results
} 

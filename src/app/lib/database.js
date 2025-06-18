'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
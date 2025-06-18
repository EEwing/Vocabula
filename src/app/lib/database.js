'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Server action to fetch courses owned by a user.
 * @param {string} userId - The user's ID (UUID)
 * @returns {Promise<Array<{id: string, title: string, createdAt: string}>>}
 */
export async function getOwnedCourses(userId) {
  if (!userId) return []
  const courses = await prisma.course.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return courses
}

/**
 * Server action to fetch courses a user is enrolled in.
 * @param {string} userId - The user's ID (UUID)
 * @returns {Promise<Array<{id: string, title: string, createdAt: string}>>}
 */
export async function getEnrolledCourses(userId) {
  if (!userId) throw new Error('User ID is required')
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    },
    orderBy: { entrolledAt: 'desc' },
  })
  // Return just the course objects
  return enrollments.map(e => e.course)
} 
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
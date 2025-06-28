'use server'

import { CardView, dbCard } from './cardutils'
import { prisma } from './prisma'

/**
 * Server action to create a course and its topic associations.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.slug
 * @param {string} params.ownerId
 * @param {string[]} params.topicIds
 * @returns {Promise<{course: Object, courseTopics: Object[]}>}
 */
type CreateCourseWithTopicsParams = {
  name: string
  slug: string
  ownerId: string
  topicIds: string[]
}

export async function createCourseWithTopics({ name, slug, ownerId, topicIds }: CreateCourseWithTopicsParams) {
  const course = await prisma.course.create({
    data: {
      title: name,
      slug,
      ownerId,
    },
  })
  const courseTopics = await Promise.all(
    (topicIds || []).map((topicId: string) =>
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
 * Server action to create a new topic.
 * @param {string} name - The name of the topic
 * @returns {Promise<{id: string, name: string}>}
 */
export async function createTopic(name: string) {
  if (!name) throw new Error('Invalid topic name')
  return prisma.topic.create({
    data: { name },
    select: { id: true, name: true },
  })
}

type CreateChapterParams = {
  courseId: string
  title: string
  slug: string
  isOptional?: boolean
  orderIndex: number
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
export async function createChapter({ courseId, title, slug, isOptional = false, orderIndex }: CreateChapterParams) {
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

type CreateLessonParams = {
  chapterId: string
  title: string
  isOptional?: boolean
  orderIndex: number
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
export async function createLesson({ chapterId, title, isOptional = false, orderIndex }: CreateLessonParams) {
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

export async function deleteCards(cardIds: string[]) {
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
export async function saveCardsForLesson(lessonId: string, cardViews: CardView[]) {
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

/**
 * Save a single card for a lesson. Creates new card if isNew is true, updates existing otherwise.
 * @param {string} lessonId
 * @param {CardView} cardView
 * @returns {Promise<CardView>}
 */
export async function saveCardForLesson(lessonId: string, cardView: CardView) {
  if (!lessonId || !cardView) throw new Error('Invalid input')
  
  if (cardView.term.trim() === '' && cardView.translation.trim() === '') {
    return cardView
  }
  
  if (cardView.isNew) {
    const created = await prisma.card.create({
      data: {
        lessonId,
        term: cardView.term,
        translation: cardView.translation,
        orderIndex: cardView.orderIndex,
        wordType: '', // default, adjust as needed
      }
    })
    return dbCard(created)
  } else {
    const updated = await prisma.card.update({
      where: { id: cardView.id },
      data: {
        term: cardView.term,
        translation: cardView.translation,
        orderIndex: cardView.orderIndex,
      }
    })
    return dbCard(updated)
  }
}

/**
 * Delete a single card by its ID.
 * @param {string} cardId
 * @returns {Promise<Object>}
 */
export async function deleteCard(cardId: string) {
  if (!cardId) throw new Error('Card ID is required')
  return prisma.card.delete({
    where: { id: cardId },
  })
}

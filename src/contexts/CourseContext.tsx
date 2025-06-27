"use client"

import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Course, Prisma } from '@prisma/client'

export type CourseWithOwner = Prisma.CourseGetPayload<{ 
  include: { 
    owner: true, 
    chapters: {
      include: {
        lessons: {
          include: {
            cards: true,
            _count: {
              select: {
                cards: true
              }
            }
          }
        }
      }
    },
    topics: { 
      include: { topic: true } 
    } 
  } 
}>;

export type CourseContextValue = {
  course: CourseWithOwner
  isOwner: boolean
  isLoaded: boolean
}

const CourseContext = createContext<CourseContextValue | null>(null)

type CourseProviderProps = {
  children: React.ReactNode
  course: CourseWithOwner
}

/**
 * Provider component that wraps course data and provides it through context.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The children components
 * @param {Object} props.course - The course object with owner information
 */
export function CourseProvider({ children, course }: CourseProviderProps) {
  const { userId, isLoaded } = useAuth()

  const contextValue: CourseContextValue = useMemo(() => ({
    course,
    isOwner: isLoaded && userId && course?.owner?.id ? userId === course.owner.id : false,
    isLoaded
  }), [course, isLoaded, userId])

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  )
}

/**
 * Hook to access course context data.
 * Must be used within a CourseProvider.
 * 
 * @returns {Object} Course context data
 * @throws {Error} If used outside of CourseProvider
 */
export function useCourse() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}
"use client"

import { createContext, useContext, useMemo } from 'react'
import { useAuth } from '@clerk/nextjs'

const CourseContext = createContext(null)

/**
 * Provider component that wraps course data and provides it through context.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The children components
 * @param {Object} props.course - The course object with owner information
 */
export function CourseProvider({ children, course }) {
  const { userId, isLoaded } = useAuth()
  
  const contextValue = useMemo(() => ({
    course,
    isOwner: isLoaded && userId && course?.owner?.id ? userId === course.owner.id : false,
    isLoaded,
    userId
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

/**
 * Component that renders its children only if the current user is the owner of the course.
 * Must be used within a CourseProvider.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render if user is owner
 * @param {React.ReactNode} props.fallback - Optional fallback content to show if user is not owner
 * 
 * @example
 * // Basic usage - only show button to course owner
 * <CourseOwnerOnly>
 *   <Button>Edit Course</Button>
 * </CourseOwnerOnly>
 * 
 * @example
 * // With fallback content for non-owners
 * <CourseOwnerOnly fallback={<p>Only the course owner can edit this content.</p>}>
 *   <Button>Edit Course</Button>
 * </CourseOwnerOnly>
 */
export function CourseOwnerOnly({ children, fallback = null }) {
  const { isOwner, isLoaded } = useCourse()
  
  // Don't render anything while auth is loading
  if (!isLoaded) {
    return null
  }

  // Render children if user is owner, otherwise render fallback
  return isOwner ? children : fallback
} 
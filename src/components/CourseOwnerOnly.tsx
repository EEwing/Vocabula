"use client"

import { useCourse } from '@/contexts/CourseContext'

/**
 * Component that renders its children only if the current user is the owner of the course.
 * Must be used within a CourseProvider context.
 * If the user is not the course owner, nothing is rendered.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render if user is owner
 * 
 * @example
 * <CourseOwnerOnly>
 *   <Button>Edit Course</Button>
 * </CourseOwnerOnly>
 */
export default function CourseOwnerOnly({ children }) {
  const { isOwner, isLoaded } = useCourse()

  // Don't render anything while auth is loading or if user is not owner
  if (!isLoaded || !isOwner) {
    return null
  }

  // Render children only if user is owner
  return children
} 
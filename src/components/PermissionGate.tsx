import { auth } from '@clerk/nextjs/server'
import { getEnrolledCourses } from '@/app/lib/database'
import React from 'react'

function getOwnerId(objectType, object) {
    if (objectType === 'course') {
        return object.ownerId
    } else if (objectType === 'chapter') {
        return object.course?.ownerId
    } else if (objectType === 'lesson') {
        return object.chapter?.course?.ownerId
    }
}

/**
 * Server component for permission gating.
 * @param {object} props
 * @param {'course'|'chapter'|'lesson'|'card'} props.objectType
 * @param {object} props.object - The object to check permissions for (must include id and relevant parent IDs)
 * @param {'always'|'never'|'enrolled'|'owner'} props.check - The type of permission to check
 * @param {boolean} [props.negate] - If true, inverts the check
 * @param {React.ReactNode} props.children - Content to render if check passes
 */
export default async function PermissionGate({ objectType, object, check, negate = false, children }) {
    if (check === 'always') return <>{children}</>
    if (check === 'never') return null

    const { userId } = await auth()
    if (!userId) return null

    let isOwner = getOwnerId(objectType, object) === userId
    let isEnrolled = false

    if (objectType === 'course') {
        if (check === 'enrolled' && !isOwner) {
        // Only check enrollment if not owner
        const enrolledCourses = await getEnrolledCourses(userId)
        isEnrolled = enrolledCourses.some(c => c.id === object.id)
        }
    } else if (objectType === 'chapter') {
        // Chapter must have courseId and course.ownerId
        if (check === 'enrolled' && !isOwner) {
        const enrolledCourses = await getEnrolledCourses(userId)
        isEnrolled = enrolledCourses.some(c => c.id === object.courseId)
        }
    } else if (objectType === 'lesson') {
        // Lesson must have chapter and chapter.course
        if (check === 'enrolled' && !isOwner) {
        const enrolledCourses = await getEnrolledCourses(userId)
        isEnrolled = enrolledCourses.some(c => c.id === object.chapter?.courseId)
        }
    } else if (objectType === 'card') {
        // Card must have lesson, lesson.chapter, lesson.chapter.course
        if (check === 'enrolled' && !isOwner) {
        const enrolledCourses = await getEnrolledCourses(userId)
        isEnrolled = enrolledCourses.some(c => c.id === object.lesson?.chapter?.courseId)
        }
    }

    let hasPermission = false
    if (check === 'owner') {
        hasPermission = isOwner
    } else if (check === 'enrolled') {
        hasPermission = isOwner || isEnrolled
    }

    if (negate ? !hasPermission : hasPermission) {
        return <>{children}</>
    }
    return null
} 
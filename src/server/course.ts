"use server"

import { prisma } from "@/app/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function enroll(courseId: string) {
    const { userId } = await auth()
    if(!userId) return null

    try {
        const enrollment = await prisma.enrollment.create({
        data: { userId, courseId: courseId },
        })
        return enrollment
    } catch (error) {
        console.error('Failed to enroll user:', error, userId, courseId)
        return null
    }
}

export async function unenroll(courseId: string) {
    const { userId } = await auth()
    if(!userId) return null

    try {
        return await prisma.enrollment.delete({
        where: { userId_courseId: { userId: userId, courseId: courseId } },
        })
    } catch (error) {
        console.error('Failed to unenroll user:', error, userId, courseId)
        return null
    }
}

export async function updateLessonDescription(lessonId: string, description: string) {
    const { userId } = await auth()
    if(!userId) return null

    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { chapter: { include: { course: { select: { ownerId: true } } } } }
    })
    console.log(lesson)
    if (lesson?.chapter.course.ownerId !== userId) {
        console.error('Permission denied:', userId, lesson?.chapter.course.ownerId, lessonId)
        return null
    }
    try {
        return await prisma.lesson.update({
            where: { id: lessonId },
            data: { description: description }
        })
    } catch (error) {
        console.error('Failed to update lesson description:', error, userId, lessonId)
        return null
    }
}

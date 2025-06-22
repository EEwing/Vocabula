"use server"

import { prisma } from "@/app/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function enroll(courseId: string) {
    const { userId } = await auth()
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
    try {
        return await prisma.enrollment.delete({
        where: { userId_courseId: { userId: userId, courseId: courseId } },
        })
    } catch (error) {
        console.error('Failed to unenroll user:', error, userId, courseId)
        return null
    }
}

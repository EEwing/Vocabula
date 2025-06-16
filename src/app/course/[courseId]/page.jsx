"use client"

import { useParams } from "next/navigation"

export default function CoursePage() {
    const params = useParams()
    const { courseId } = params

    return <>
        <p>You're logged in!</p>
        <p>Course ID: {courseId}</p>
    </>
}

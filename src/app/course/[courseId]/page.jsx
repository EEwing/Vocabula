import { auth } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'

export default async function CoursePage({ params}) {
    const { userId } = await auth()
    if(!userId) {
        return <RedirectToSignIn />
    }

    const { courseId } = params
    console.log("Course ID:", courseId)

    return <>
        <p>You're logged in!</p>
        <p>Course ID: {courseId}</p>
    </>
}

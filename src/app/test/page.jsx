import { auth } from '@clerk/nextjs/server'
import { RedirectToSignIn, useUser } from '@clerk/nextjs'

export default async function Test(){
    const { userId } = await auth()
    if(!userId) {
        return <RedirectToSignIn />
    }
    return <p>On Test Page!</p>
}
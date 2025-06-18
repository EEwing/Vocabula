import { auth } from '@clerk/nextjs/server'
import { RedirectToSignIn } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewCourse() {
    const { userId } = await auth()
    if(!userId) {
        return <RedirectToSignIn />
    }
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Course creation is currently unavailable.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
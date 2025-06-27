import { createTopic } from '@/app/lib/database'
import TopicManager from './TopicManager'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { prisma } from '@/app/lib/prisma'

export default async function NewTopicPage() {
  const topics = await prisma.topic.findMany()

  // Define a server action for creating a topic
  async function handleCreateTopic(name: string) {
    'use server'
    if (!name || typeof name !== 'string') throw new Error('Invalid topic name')
    return await createTopic(name)
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicManager initialTopics={topics} createTopic={handleCreateTopic} />
        </CardContent>
      </Card>
    </div>
  )
} 
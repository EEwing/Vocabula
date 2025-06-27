"use client"
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CardFooter } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

type CourseFormProps = {
  topics: Array<{ id: string; name: string }>
  createCourse: (data: { name: string; slug: string; topicIds: string[] }) => Promise<void>
  baseUrl: string
}

export default function CourseForm({ topics, createCourse, baseUrl }: CourseFormProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [loading, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setSlug(slugify(name))
  }, [name])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    startTransition(async () => {
      try {
        await createCourse({
          name,
          slug,
          topicIds: selectedTopics,
        })
        setSuccess(true)
        setName('')
        setSlug('')
        setSelectedTopics([])
        router.refresh()
      } catch (err) {
        setError((err as Error).message || 'Failed to create course')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={name}
          onInput={e => setName((e.target as HTMLInputElement).value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Course URL</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 bg-muted-foreground/10 font-mono"
          value={`${baseUrl}/${slug || ''}`}
          readOnly
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Topics</label>
        <select
          multiple
          className="w-full border rounded px-3 py-2 h-32"
          value={selectedTopics}
          onInput={e => setSelectedTopics(Array.from((e.target as HTMLSelectElement).selectedOptions, o => o.value))}
        >
          {topics.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
          ))}
        </select>
        <div className="text-xs text-muted-foreground mt-1">Hold Ctrl (Cmd on Mac) to select multiple topics.</div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Course created successfully!</div>}
      <CardFooter>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Course'}</Button>
      </CardFooter>
    </form>
  )
} 
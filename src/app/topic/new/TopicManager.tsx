"use client"

import { useState, useRef } from 'react'

interface TopicManagerProps {
  initialTopics: Array<{ id: string; name: string }>
  createTopic: (name: string) => Promise<{ id: string; name: string }>
}

export default function TopicManager({ initialTopics, createTopic }: TopicManagerProps) {
  const [topics, setTopics] = useState(initialTopics)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddTopic(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const topic = await createTopic(input.trim())
      setTopics([...topics, topic])
      setInput('')
      inputRef.current?.focus()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleAddTopic} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter new topic name"
          value={input}
          onInput={e => setInput((e.target as HTMLInputElement).value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          Add
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul className="space-y-2">
        {topics.map(topic => (
          <li key={topic.id} className="border rounded px-2 py-1">
            {topic.name}
          </li>
        ))}
      </ul>
    </>
  )
} 
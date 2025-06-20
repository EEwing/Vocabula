"use client"

import { useState, useRef } from 'react'

export default function TopicManager({ initialTopics, createTopic }) {
  const [topics, setTopics] = useState(initialTopics)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAddTopic(e) {
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
      setError(err.message)
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
          onChange={e => setInput(e.target.value)}
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
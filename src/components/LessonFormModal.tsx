"use client"

import { useState, useEffect } from 'react'
import { createLesson } from '@/app/lib/database'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function LessonFormModal({ open, onOpenChange, chapterId, onLessonCreated }) {
  const [name, setName] = useState('')
  const [isOptional, setIsOptional] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setName('')
      setIsOptional(false)
      setError('')
    }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Slug is generated on the backend from the name
      const lesson = await createLesson({
        chapterId,
        title: name,
        isOptional,
        orderIndex: 1,
      })
      setName('')
      setIsOptional(false)
      onOpenChange(false)
      if (onLessonCreated) onLessonCreated(lesson)
    } catch (err) {
      setError(err.message || 'Failed to create lesson')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lesson-name">Name</Label>
            <Input
              id="lesson-name"
              value={name}
              onChange={e => setName((e.target as HTMLInputElement).value)}
              required
              placeholder="Enter lesson name"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="lesson-optional"
              checked={isOptional}
              onCheckedChange={checked => setIsOptional(checked === 'indeterminate' ? false : checked)}
            />
            <Label htmlFor="lesson-optional">Optional</Label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading || !name}>
              {loading ? 'Creating...' : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import { useState, useMemo, useEffect } from 'react'
import { createChapter } from '@/app/lib/database'
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

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function getSiteOrigin() {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return ''
}

export default function ChapterFormModal({ open, onOpenChange, courseSlug, courseId, onChapterCreated }) {
  const [name, setName] = useState('')
  const [isOptional, setIsOptional] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset form fields when modal is closed
  useEffect(() => {
    if (!open) {
      setName('')
      setIsOptional(false)
      setError('')
    }
  }, [open])

  const chapterSlug = useMemo(() => slugify(name), [name])
  const siteOrigin = getSiteOrigin()
  const urlPreview = `${siteOrigin}/course/${courseSlug}/${chapterSlug || ''}`

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // For orderIndex, you may want to fetch the current count or pass as prop. For now, set to 1.
      const chapter = await createChapter({
        courseId,
        title: name,
        slug: chapterSlug,
        isOptional,
        orderIndex: 1,
      })
      setName('')
      setIsOptional(false)
      onOpenChange(false)
      if (onChapterCreated) onChapterCreated(chapter)
    } catch (err) {
      setError(err.message || 'Failed to create chapter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="chapter-name">Name</Label>
            <Input
              id="chapter-name"
              value={name}
              onInput={e => setName((e.target as HTMLInputElement).value)}
              required
              placeholder="Enter chapter name"
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="chapter-url">URL</Label>
            <Input
              id="chapter-url"
              value={urlPreview}
              readOnly
              className="bg-gray-100 dark:bg-gray-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="chapter-optional"
              checked={isOptional}
              onCheckedChange={checked => setIsOptional(checked === 'indeterminate' ? false : checked)}
            />
            <Label htmlFor="chapter-optional">Optional</Label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading || !name || !chapterSlug}>
              {loading ? 'Creating...' : 'Create Chapter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import { useState } from 'react'
import LessonFormModal from '@/components/LessonFormModal'

export default function LessonManager({ chapterId, chapterSlug }) {
  const [lessonModalOpen, setLessonModalOpen] = useState(false)

  return (
    <>
      <button
        className="mb-4 px-4 py-2 bg-primary text-white rounded"
        onClick={() => setLessonModalOpen(true)}
      >
        New Lesson
      </button>
      <LessonFormModal
        open={lessonModalOpen}
        onOpenChange={setLessonModalOpen}
        chapterId={chapterId}
        onLessonCreated={() => window.location.reload()}
      />
    </>
  )
} 
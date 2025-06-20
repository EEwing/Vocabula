"use client"

import { useState } from 'react'
import LessonFormModal from '@/components/LessonFormModal'
import { usePermissions } from '@/contexts/PermissionsContext'

export default function LessonManager({ chapterId, chapterSlug }) {
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const { isOwner } = usePermissions()

  return (isOwner && <>
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
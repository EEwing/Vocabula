"use client"

import { Prisma } from '@prisma/client';
import { createContext, useContext } from 'react'

export type ChapterWithLessons = Prisma.ChapterGetPayload<{ include: { lessons: { include: { _count: { select: { cards: true } } } } } }>;

const ChapterContext = createContext<ChapterWithLessons | null>(null)

type ChapterProviderProps = {
  children: React.ReactNode
  chapter: ChapterWithLessons
}

export function ChapterProvider({ children, chapter }: ChapterProviderProps) {
  return (
    <ChapterContext.Provider value={chapter}>
      {children}
    </ChapterContext.Provider>
  )
}

export function useChapter() {
  const context = useContext(ChapterContext)
  if (!context) {
    throw new Error('useChapter must be used within a ChapterProvider')
  }
  return context
} 
"use client"

import { createContext, useContext } from 'react'

const ChapterContext = createContext(null)

export function ChapterProvider({ children, chapter }) {
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
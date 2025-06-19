"use client"

import { createContext, useContext, useReducer } from 'react'

const LessonContext = createContext(null)

export function LessonProvider({ children, lesson }) {
  return (
    <LessonContext.Provider value={lesson}>
      {children}
    </LessonContext.Provider>
  )
}

export function useLesson() {
  const context = useContext(LessonContext)
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider')
  }
  return context
} 
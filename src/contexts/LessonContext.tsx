"use client"

import { createContext, useContext, useState } from 'react'
import { dbCard, emptyCard } from '@/app/lib/cardutils'

const LessonContext = createContext(null)


export function LessonProvider({ children, lesson }) {
  // Initialize cards state from lesson.cards
  const [cards, setCards] = useState((lesson.cards || []).map(c => dbCard(c)));
  const [deletedCards, setDeletedCards] = useState([]);

  // Add more actions as needed
  const addCard = () => setCards(prev => [...prev, emptyCard(lesson.id, cards.length)])
  const updateCard = (cardId, term, translation) => setCards(cards.map(c => (cardId === c.id) ? {...c, term: term, translation: translation} : c))
  const removeCard = (cardView) => {
    // First remove the card from the main list
    setCards([...cards.filter(c => c.id !== cardView.id)])

    //Then mark the card for delete if it isn't new
    if(cardView.isNew) return;
    setDeletedCards([...deletedCards, cardView.id])
  }

  const value = {
    lesson,
    cards,
    deletedCards,
    setCards,
    addCard,
    updateCard,
    removeCard,
    // ...other actions
  }

  return (
    <LessonContext.Provider value={value}>
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

export function useCard(cardId) {
  const {cards} = useLesson()
  return cards.find(c => c.id === cardId)
}
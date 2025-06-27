"use client"

import { createContext, useContext, useState } from 'react'
import { CardView, dbCard, emptyCard } from '@/app/lib/cardutils'
import { Prisma } from '@prisma/client';

export type LessonWithCards = Prisma.LessonGetPayload<{ include: { cards: true } }>;
type Card = Prisma.CardGetPayload<{}>;

type LessonContextValue = {
  lesson: LessonWithCards;
  cards: CardView[];
  deletedCards: string[];
  setCards: React.Dispatch<React.SetStateAction<CardView[]>>;
  addCard: () => void;
  updateCard: (cardId: string, term: string, translation: string) => void;
  removeCard: (cardView: any) => void;
};

const LessonContext = createContext<LessonContextValue | null>(null)

interface LessonProviderProps {
  children: React.ReactNode;
  lesson: LessonWithCards;
}

export function LessonProvider({ children, lesson }: LessonProviderProps) {
  // Initialize cards state from lesson.cards
  const [cards, setCards] = useState((lesson.cards || []).map((c: any) => dbCard(c)));
  const [deletedCards, setDeletedCards] = useState<string[]>([]);

  // Add more actions as needed
  const addCard = () => setCards((prev: any[]) => [...prev, emptyCard(lesson.id, cards.length)])
  const updateCard = (cardId: string, term: string, translation: string) => setCards(cards.map((c: any) => (cardId === c.id) ? { ...c, term: term, translation: translation } : c))
  const removeCard = (cardView: any) => {
    // First remove the card from the main list
    setCards([...cards.filter((c: any) => c.id !== cardView.id)])

    //Then mark the card for delete if it isn't new
    if (cardView.isNew) return;
    setDeletedCards([...deletedCards, cardView.id])
  }

  const value: LessonContextValue = {
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

export function useCard(cardId: string) {
  const { cards } = useLesson()
  return cards.find(c => c.id === cardId)
}
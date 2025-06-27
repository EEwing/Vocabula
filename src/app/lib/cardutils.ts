import { Prisma } from "@prisma/client"

export type CardView = {
  id: string;
  term: string;
  translation: string;
  orderIndex: number;
  lessonId: string;
  modified: boolean;
  isNew: boolean;
}

export function dbCard(card: Prisma.CardGetPayload<{}>): CardView {
  return {
    id: card.id,
    term: card.term,
    translation: card.translation,
    orderIndex: card.orderIndex,
    lessonId: card.lessonId,
    modified: false,
    isNew: false
  }
}
export function emptyCard(lessonId: string, orderIndex: number): CardView {
  return {
    id: "temp_" + crypto.randomUUID().substring(0, 8),
    term: '',
    translation: '',
    orderIndex: orderIndex,
    lessonId: lessonId,
    modified: false,
    isNew: true
  }
}
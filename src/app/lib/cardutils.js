export function dbCard(card) {
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

export function emptyCard(lessonId, orderIndex) {
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
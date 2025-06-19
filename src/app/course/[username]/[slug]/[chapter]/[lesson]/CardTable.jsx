"use client"
import { useState, useRef } from "react"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLesson } from '@/contexts/LessonContext'
import { saveCardsForLesson } from '@/app/lib/database'

export default function CardTable() {
  const lesson = useLesson()
  console.log(lesson)
  // Mock initial cards
  const [cards, setCards] = useState(lesson.cards.length > 0 ? lesson.cards : [{ id: null, term: '', translation: '' }])
  const tableRef = useRef(null)

  // Focus management for new row
  const focusFirstCell = (rowIdx) => {
    const input = tableRef.current?.querySelector(
      `input[data-row='${rowIdx}'][data-col='term']`
    )
    if (input) input.focus()
  }

  // Add a new card row
  const addCard = () => {
    setCards((prev) => [...prev, { id: null, term: '', translation: '' }])
    setTimeout(() => focusFirstCell(cards.length), 0)
  }

  const saveCards = () => {
    saveCardsForLesson(lesson.id, cards)
  }

  // Handle input change
  const handleChange = (idx, field, value) => {
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
  }

  // Handle keydown for Tab/Enter in last cell
  const handleKeyDown = (e, idx, field) => {
    if ((e.key === 'Tab' || e.key === 'Enter') && idx === cards.length - 1 && field === 'translation') {
      e.preventDefault()
      addCard()
    }
  }

  return (
    <div className="mb-4">
      <div ref={tableRef} className="overflow-x-auto">
        <table className="min-w-full border rounded-xl bg-white dark:bg-gray-900">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Term</th>
              <th className="px-4 py-2 text-left">Translation</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, idx) => (
              <tr key={card.id}>
                <td className="px-4 py-2">
                  <Input
                    data-row={idx}
                    data-col="term"
                    value={card.term}
                    onChange={e => handleChange(idx, 'term', e.target.value)}
                    onKeyDown={e => handleKeyDown(e, idx, 'term')}
                    placeholder="Enter term"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    data-row={idx}
                    data-col="translation"
                    value={card.translation}
                    onChange={e => handleChange(idx, 'translation', e.target.value)}
                    onKeyDown={e => handleKeyDown(e, idx, 'translation')}
                    placeholder="Enter translation"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button className="w-full mt-2" type="button" onClick={addCard}>+ Add Card</Button>
      <Button className="w-full mt-2" type="button" onClick={saveCards}>Save</Button>
    </div>
  )
} 
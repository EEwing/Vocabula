"use client"

import { CardField, RemoveCardButton } from './CardField'
import { useLesson } from "@/contexts/LessonContext"

export default function CardTable() {
  const {cards} = useLesson()
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-xl bg-white dark:bg-gray-900">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Term</th>
            <th className="px-4 py-2 text-left">Translation</th>
              {/* <PermissionGate 
                objectType={"Lesson"} 
                object={lesson}
                check="owner"
                >
                <th className="px-4 py-2"></th>
              </PermissionGate> */}
          </tr>
        </thead>
        <tbody>
          {cards && cards.map((card, idx) => (
            <tr key={card.id}>
              <td className="px-4 py-2">
                <CardField
                  cardId={card.id}
                  field="term"
                  idx={idx}
                />
              </td>
              <td className="px-4 py-2">
                <CardField
                  cardId={card.id}
                  field="translation"
                  idx={idx}
                />
              </td>
              <td className="px-2 py-2 text-center">
                <RemoveCardButton cardId={card.id}>X</RemoveCardButton>
              </td>
              {/* <PermissionGate 
                objectType={"Lesson"} 
                object={lesson}
                check="owner"
                negate
                >
                <td className="px-2 py-2 text-center">
                  <RemoveCardButton cardId={card.id}>X</RemoveCardButton>
                </td>
              </PermissionGate> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
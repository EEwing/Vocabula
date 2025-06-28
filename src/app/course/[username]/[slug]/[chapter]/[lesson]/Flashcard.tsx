"use client"

import { useState } from "react"
import { useLesson } from '@/contexts/LessonContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditableTextBox } from "@/components/ui/EditableTextBox"

export default function Flashcard() {
  const {cards} = useLesson()
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!cards.length) {
    return <div className="mb-6">No cards available.</div>
  }

  const card = cards[current]

  const handleFlip = () => setFlipped(f => !f)
  const handlePrev = () => {
    setCurrent(i => (i > 0 ? i - 1 : i))
    setFlipped(false)
  }
  const handleNext = () => {
    setCurrent(i => (i < cards.length - 1 ? i + 1 : i))
    setFlipped(false)
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-full lg:w-1/2 mb-4 cursor-pointer" style={{ perspective: '1000px' }} onClick={handleFlip}>
        <div className={`relative w-full aspect-video transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}> 
          {/* Front Face */}
          <Card className="absolute w-full h-full flex items-center justify-center text-2xl font-semibold select-none [backface-visibility:hidden]">
            <CardContent className="flex items-center justify-center w-full h-full">
              <EditableTextBox 
                  value={card?.term} 
                  canEdit={false} 
                  />
            </CardContent>
          </Card>
          {/* Back Face */}
          <Card className="absolute w-full h-full flex items-center justify-center text-2xl font-semibold select-none [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <CardContent className="flex items-center justify-center w-full h-full">
              <EditableTextBox 
                  value={card?.translation} 
                  canEdit={false} 
                  />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <Button onClick={handlePrev} disabled={current === 0} variant="outline">Previous</Button>
        <span className="text-sm text-gray-600 dark:text-gray-300">{current + 1} / {cards.length}</span>
        <Button onClick={handleNext} disabled={current === cards.length - 1} variant="outline">Next</Button>
      </div>
      <div className="text-xs text-gray-400">Click the card to flip</div>
    </div>
  )
} 
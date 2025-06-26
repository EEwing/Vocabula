"use client"
import { Input } from "@/components/ui/input"
import { useLesson, useCard } from "@/contexts/LessonContext"
import { Button } from "@/components/ui/button"
import { deleteCards, saveCardsForLesson } from "@/app/lib/database"
import { usePermissions } from "@/contexts/PermissionsContext"
import { Textarea } from "@/components/ui/textarea"

export function CardField({ cardId, field, idx }) {
    const { updateCard, cards, addCard } = useLesson()
    const card = useCard(cardId)
    const { isOwner } = usePermissions();

    const updateField = (value) => {
        if (field === "term")
            updateCard(cardId, value, card.translation)
        else if (field === "translation")
            updateCard(cardId, card.term, value)
        else
            throw new Error("Invalid field")
    }

    // Handle keydown for Tab/Enter in last cell
    const handleKeyDown = (e, idx) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && idx === cards.length - 1 && field === 'translation') {
            e.preventDefault()
            addCard()
        }
    }

    if (isOwner) {
        return <Textarea
            data-row={idx}
            data-col={field}
            value={field === "term" ? card?.term : card?.translation}
            onChange={value => updateField(value)}
            onKeyDown={e => handleKeyDown(e, idx)}
            placeholder="Enter term"
            className="w-full border-none rounded-none resize-none"
        />
    } else {
        return <p>{field === "term" ? card?.term : card?.translation}</p>
    }
}

export function AddCardButton() {
    const { addCard } = useLesson()
    return <Button variant="secondary" className="w-full mt-2" type="button" onClick={addCard}>+ Add Card</Button>
}

export function SaveCardsButton() {
    const { lesson, cards, setCards, deletedCards } = useLesson()
    const saveCards = () => {
        const doSave = async () => {
            const [_, savedCards] = await Promise.all([
                deleteCards(deletedCards),
                saveCardsForLesson(lesson.id, cards)
            ])
            setCards(savedCards)
        }
        doSave();
    }
    return <Button className="w-full mt-2" type="button" onClick={saveCards}>Save</Button>
}

export function RemoveCardButton({ cardView, children }) {
    const { removeCard } = useLesson()

    return <Button variant="destructive" type="button" onClick={() => removeCard(cardView)}>
        {children}
    </Button>
}
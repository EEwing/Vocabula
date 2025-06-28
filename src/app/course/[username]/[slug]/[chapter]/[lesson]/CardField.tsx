"use client"
import { useLesson, useCard } from "@/contexts/LessonContext"
import { Button } from "@/components/ui/button"
import { deleteCard, deleteCards, saveCardForLesson, saveCardsForLesson } from "@/app/lib/database"
import { usePermissions } from "@/contexts/PermissionsContext"
import { CardView } from "@/app/lib/cardutils"
import { EditableTextBox } from "@/components/ui/EditableTextBox"

interface CardFieldProps {
    cardId: string;
    field: "term" | "translation";
    idx: number;
    placeholder?: string;
}

export function CardField({ cardId, field, idx, placeholder }: CardFieldProps) {
    const { updateCard, cards, addCard, lesson, setCards } = useLesson()
    const card = useCard(cardId)
    const { isOwner } = usePermissions();

    if(card === undefined) return null

    const updateField = async (value: string) => {
        const newCard = { ...card, [field]: value }
        updateCard(cardId, newCard.term, card.translation)

        const savedCard = await saveCardForLesson(lesson.id, newCard);
        setCards(cards.map(c => c.id === cardId ? savedCard : c));
        return true;
    }

    // Handle keydown for Tab/Enter in last cell
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && idx === cards.length - 1 && field === 'translation') {
            e.preventDefault()
            addCard()
        }
    }

    return <EditableTextBox 
        value={field === "term" ? card?.term : card?.translation} 
        canEdit={isOwner} 
        onCommit={updateField}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        />
}

export function AddCardButton() {
    const { addCard } = useLesson()
    return <Button variant="secondary" className="w-full mt-2" type="button" onClick={addCard}>+ Add Card</Button>
}

export function SaveCardsButton() {
    const { lesson, cards, setCards, deletedCards } = useLesson()
    const saveCards = () => {
        const doSave = async () => {
            const [, savedCards] = await Promise.all([
                deleteCards(deletedCards),
                saveCardsForLesson(lesson.id, cards)
            ])
            setCards(savedCards)
        }
        doSave();
    }
    return <Button className="w-full mt-2" type="button" onClick={saveCards}>Save</Button>
}

type RemoveCardButtonProps = {
    cardView: CardView;
    children: React.ReactNode;
};

export function RemoveCardButton({ cardView, children }: RemoveCardButtonProps) {
    const { removeCard } = useLesson()

    const handleClick = async () => {
        await deleteCard(cardView.id);
        removeCard(cardView);
    }

    return <Button variant="destructive" type="button" onClick={handleClick}>
        {children}
    </Button>
}
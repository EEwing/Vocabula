"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardField, RemoveCardButton } from './CardField'
import { useLesson } from "@/contexts/LessonContext"
import { usePermissions } from '@/contexts/PermissionsContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CardTable() {
  const {cards} = useLesson()
  const {isOwner} = usePermissions()

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <h2>Lesson Terms</h2>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full rounded-xl bg-card">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left text-primary dark:text-secondary">Term</TableHead>
              <TableHead className="px-4 py-2 text-left text-primary dark:text-secondary">Translation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards && cards.map((card, idx) => (
              <TableRow key={card.id}>
                <TableCell className="px-4 py-2">
                  <CardField cardId={card.id} field="term" idx={idx} />
                </TableCell>
                <TableCell className="px-4 py-2">
                  <CardField cardId={card.id} field="translation" idx={idx} />
                </TableCell>
                { isOwner && 
                <TableCell className="px-2 py-2 text-center">
                  <RemoveCardButton cardId={card.id}>X</RemoveCardButton>
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
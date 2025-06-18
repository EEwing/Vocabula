"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NewCourse() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Course creation is currently unavailable.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
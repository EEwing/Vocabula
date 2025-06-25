"use client";

import { updateLessonDescription } from "@/server/course";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EditableTextBox } from "@/components/ui/EditableTextBox";


export default function LessonDescription({ description, lessonId, isOwner }: { description: string | null, lessonId: string, isOwner: boolean }) {
  const handleSave = async (value: string) => {
    const updated = await updateLessonDescription(lessonId, value);
    return updated !== null;
  };

  return <>
    <div>
        <span className="font-semibold block text-3xl text-semibold my-8">Lesson Resources</span>
    </div>
    <Card>
        <CardContent>
            <EditableTextBox 
                value={description} 
                canEdit={isOwner} 
                onCommit={handleSave}
                placeholder="Click here to add a description for this lesson"
                />
        </CardContent>
    </Card>
  </>
} 
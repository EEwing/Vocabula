"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { updateLessonDescription } from "@/server/course";
import React from "react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Card, CardContent } from "@/components/ui/card";

function BasicDescription({ sanitizedDescription, clickable = false, ...props }: { sanitizedDescription: string, clickable?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
    return (
    <div className="mb-6" {...props}>
        {sanitizedDescription.length === 0 
          ? <p>No resources available.</p> 
          : <Card><CardContent className={`prose dark:prose-invert ${clickable ? "cursor-pointer" : ""}`} dangerouslySetInnerHTML={{ __html: sanitizedDescription }} /></Card> }
      </div>
    );
}

function sanitize(description: string) {
    return DOMPurify.sanitize(description).replace(/<p><\/p>/g, "<p>&nbsp;</p>");
}

export default function LessonDescription({ description, lessonId, isOwner }: { description: string | null, lessonId: string, isOwner: boolean }) {
  const [revertValue, setRevertValue] = useState(description || "");
  const [value, setValue] = useState(description || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sanitizedDescription, setSanitizedDescription] = useState("");

  useEffect(() => {
    setSanitizedDescription(sanitize(value));
  }, [value])

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    const updated = await updateLessonDescription(lessonId, value);
    if(updated !== null) {
        // console.log(value, value.replace(/<p><\/p>/g, "<p>&nbsp;</p>"));
        // setSanitizedDescription(DOMPurify.sanitize(value).replace(/<p><\/p>/g, "<p>&nbsp;</p>"));
        setRevertValue(value);
    }
    setSuccess(updated !== null);
    setEditing(false);
    setSaving(false);
  };

  return <>
    <div>
        <span className="font-semibold block text-3xl text-semibold my-8">Lesson Resources</span>
    </div>
    {value === "" && !editing && <p onClick={() => setEditing(true)}>Click here to add a description for this lesson</p>}
    {isOwner && editing && <>
            <RichTextEditor value={value} onChange={setValue} height="400px" />
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => { setEditing(false); setValue(revertValue); }}>
                Cancel
              </button>
            </div>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-1">Saved!</div>}
    </>}
    {!editing && <>
        <hr className="mb-4"/>
        <BasicDescription clickable={isOwner} sanitizedDescription={sanitizedDescription} onClick={() => setEditing(true)}/>
        {/* <BasicDescription sanitizedDescription={sanitizedDescription} /> */}
    </>}
  </>
} 
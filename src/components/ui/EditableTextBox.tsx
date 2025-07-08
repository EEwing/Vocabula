"use client"

import { useEffect, useMemo, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { cn, sanitizeUserInput } from "@/lib/utils";
import { Prose } from "@/components/ui/Text/Prose";

export interface EditableTextBoxProps {
  value: string;
  manualCommit?: boolean
  onChange?: (value: string) => void;
  onCommit?: (value: string) => Promise<boolean>;
  startMode?: "view" | "edit";
  modeChange?: (mode: "view" | "edit") => void;
  placeholder?: string;
  canEdit?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
}

export function EditableTextBox({value: initialValue, manualCommit=false, onChange, onCommit, canEdit=false, placeholder, startMode = "view", onKeyDown}: EditableTextBoxProps) {
    const [revertValue, setRevertValue] = useState(initialValue);
    const [value, setValue] = useState(initialValue);
    const [editing, setEditing] = useState(startMode === "edit");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const sanitizedDescription = useMemo(() => {
        return sanitizeUserInput(value || placeholder || "");
    }, [value, placeholder])

    useEffect(() => {
        onChange?.(value);
    }, [value, onChange])

    useEffect(() => {
        if(success) {
            const timeout = setTimeout(() => {
                setSuccess(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [success])

    useEffect(() => {
        setValue(initialValue);
        setRevertValue(initialValue);
    }, [initialValue]);

    const revert = () => {
        setValue(revertValue);
        setEditing(false);
    }

    const commit = async () => {
        if(!onCommit) {
            setError("Failed to save");
            revert(); 
            return;
        }
        setSaving(true);
        const success = await onCommit(value);
        if(success) {
            setRevertValue(value);
            setError("")
        } else {
            setError("Failed to save");
        }
        setSuccess(success);
        setSaving(false);
        setEditing(false);
    }

    const beginEditing = () => {
        if(!canEdit) return;
        setEditing(true);
        setValue(revertValue);
        setError("")
        setSuccess(false)
    }

    const handleBlur = () => {
        if(!manualCommit) {
            commit();
        }
    }

    return <>
        {editing 
        ? <>
            <RichTextEditor 
                editable={canEdit}
                value={value} 
                onChange={setValue}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                />
            {manualCommit && 
                <div className="flex gap-2 mt-2">
                    <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={commit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="px-4 py-1 bg-gray-300 rounded" onClick={revert}>
                    Cancel
                    </button>
                </div>
            }
        </>
        : <Prose
            className={cn(
                canEdit ? "cursor-pointer" : undefined,
                !value ? "text-muted" : undefined,
                "whitespace-normal"
            )}
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            onClick={beginEditing}
            />
        }
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-1">Saved!</div>}
    </>
}
"use client"

import RichTextEditor from "./RichTextEditor";

export interface EditableTextBoxProps {
  value: string;
  manualCommit?: boolean
  onChange?: (value: string) => void;
  onCommit?: (value: string) => Promise<boolean>;
  placeholder?: string;
  canEdit?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
}

export function EditableTextBox({
  value, 
  manualCommit = false, 
  onChange, 
  onCommit, 
  canEdit = false, 
  placeholder, 
  onKeyDown
}: EditableTextBoxProps) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      onCommit={onCommit}
      canEdit={canEdit}
      placeholder={placeholder}
      manualCommit={manualCommit}
      onKeyDown={onKeyDown}
    />
  );
}
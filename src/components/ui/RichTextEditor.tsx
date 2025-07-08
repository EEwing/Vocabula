"use client"
import { Color, TextStyle } from "@tiptap/extension-text-style";
import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Prose } from "./Text/Prose";
import { cn, sanitizeUserInput } from "@/lib/utils";

type BubbleMenuItemProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  activeClasses?: string;
  inactiveClasses?: string;
  suppressDefaultStyles?: boolean
};

const BubbleMenuItem = ({children, onClick, isActive, className, activeClasses="border border-2 border-black bg-card font-bold", inactiveClasses="border border-0.5 border-border", suppressDefaultStyles=false}: BubbleMenuItemProps) => {
    return <button 
        onClick={() => onClick && onClick()} 
        className={`${!suppressDefaultStyles && "rounded-md w-8 h-8hover:bg-card"}
            ${cn(className)}
            ${isActive ? activeClasses : inactiveClasses}`}
    >
        {children}
    </button>
}

type RichTextEditorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onBlur"> & {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onCommit?: (value: string) => Promise<boolean>;
  canEdit?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  placeholder?: string;
  manualCommit?: boolean;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  onBlur, 
  onCommit,
  canEdit = false,
  onKeyDown, 
  placeholder,
  manualCommit = false,
  ...rest 
}: RichTextEditorProps) {
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveRequested, setSaveRequested] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [revertValue, setRevertValue] = useState(value);

  const editor = useEditor({
    editable: canEdit,
    immediatelyRender: false,
    autofocus: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          linkOnPaste: true,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
        }
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "rounded-md px-1",
        }
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: revertValue,
    editorProps: {
      attributes: {
        class: cn(
          "focus-visible:outline-offset-8 w-full max-w-none min-h-full focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-4",
        ),
      },
    },
    onBlur: ({editor, event}) => {
      const nextFocused = event.relatedTarget as HTMLElement;
      if(bubbleMenuRef.current?.contains(nextFocused) || editorRef.current?.contains(nextFocused)){
        event.preventDefault();
        return;
      }
      
      if (!manualCommit) {
        handleCommit();
      }
      onBlur?.(editor.getHTML() ?? "");
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    onCreate: () => {
      setIsHydrated(true);
    }
  });

  // Sync external value changes
  React.useEffect(() => {
    if(saving || saveRequested) return;

    setRevertValue(value);
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor, saving, saveRequested]);

  // Clear success message after delay
  React.useEffect(() => {
    if(success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  React.useEffect(() => {
    if(saveRequested && !saving) {
      if (!onCommit) {
        setError("Failed to save");
        return;
      }

      setSaveRequested(false);

      const attemptSave = async () => {
        setSaving(true);
        try {
          const newValue = editor?.getHTML() ?? "";
          if(newValue == revertValue) {
            return;
          }
          const success = await onCommit(newValue);
          if (success) {
            setError("");
            setSuccess(true);
            setRevertValue(newValue);
          } else {
            setError("Failed to save");
          }
        } catch (err) {
          setError(`Failed to save: ${err}`);
        } finally {
          setSaving(false);
        }
      }

      attemptSave()
    }
  }, [saveRequested, saving, onCommit, editor, revertValue])

  const handleCommit = () => {
    setSaveRequested(true);
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(revertValue);
    }
    setError("");
    setSuccess(false)
  };

  const sanitizedValue = sanitizeUserInput(value || placeholder || "");

  return <>
    <Prose {...rest}>
      {/* Show content immediately before editor hydrates */}
      {!isHydrated && (
        <div 
          className={cn(
            "focus-visible:outline-offset-8 w-full max-w-none min-h-full focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-4",
          )}
          dangerouslySetInnerHTML={{ __html: sanitizedValue }}
        />
      )}
      
      {/* Editor content - always rendered once hydrated */}
      <div style={{ display: !isHydrated ? 'none' : 'block' }}>
        <EditorContent editor={editor} ref={editorRef} onKeyDown={onKeyDown} tabIndex={0}/>
      </div>
      
      {editor && isHydrated && <BubbleMenu 
        editor={editor} 
        shouldShow={({ state }) => {
          const { from, to, empty } = state.selection;
          return editor.isFocused && !empty && from !== to;
        }}
      >
        <div className="popup-menu bg-background rounded-lg color-accent-foreground flex items-center gap-2 p-1 text-xl" ref={bubbleMenuRef}>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              className="text-2xl"
              activeClasses="border-2 border-black bg-card"
          >T</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              className="text-lg pt-1"
              activeClasses="border-2 border-black bg-card"
          >T</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              className="text-sm pt-2"
              activeClasses="border-2 border-black bg-card"
          >T</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
          >B</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              className="italic"
          >I</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              className="underline"
          >U</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              className="line-through"
          >A</BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFF9B1' }).run()}
              isActive={editor.isActive('highlight', {color: "#FFF9B1"})}
              className="p-3 rounded-full bg-[#FFF9B1] hover:border-border"
              activeClasses="border-2 border-black"
              inactiveClasses="border-2 border-white"
              suppressDefaultStyles
          ></BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#C8F7C5' }).run()}
              isActive={editor.isActive('highlight', {color: "#C8F7C5"})}
              className="p-3 rounded-full bg-[#C8F7C5] hover:border-border"
              activeClasses="border-2 border-black"
              inactiveClasses="border-2 border-white"
              suppressDefaultStyles
          ></BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#B3E5FC' }).run()}
              isActive={editor.isActive('highlight', {color: "#B3E5FC"})}
              className="p-3 rounded-full bg-[#B3E5FC] hover:border-border"
              activeClasses="border-2 border-black"
              inactiveClasses="border-2 border-white"
              suppressDefaultStyles
          ></BubbleMenuItem>
          <BubbleMenuItem
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFCDD2' }).run()}
              isActive={editor.isActive('highlight', {color: "#FFCDD2"})}
              className="p-3 rounded-full bg-[#FFCDD2] hover:border-border"
              activeClasses="border-2 border-black"
              inactiveClasses="border-2 border-white"
              suppressDefaultStyles
          ></BubbleMenuItem>
        </div>
      </BubbleMenu>}
      
      {manualCommit && (
        <div className="flex gap-2 mt-2">
          <button 
            className="px-4 py-1 bg-blue-600 text-white rounded" 
            onClick={handleCommit} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button 
            className="px-4 py-1 bg-gray-300 rounded" 
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </Prose>
    
    {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    {success && <div className="text-green-600 text-sm mt-1">Saved!</div>}
  </>
}
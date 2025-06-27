"use client"
import { Color, TextStyle } from "@tiptap/extension-text-style";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Prose } from "./Text/Prose";
import { cn } from "@/lib/utils";

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

type RichTextEditorProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({ value, onChange: onValueChange, editable = true, ...rest }:RichTextEditorProps) {
  const editor = useEditor({
    editable,
    immediatelyRender: false,
    autofocus: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          linkOnPaste: true,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
        },
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
    content: value,
    editorProps: {
      attributes: {
        class: "focus-visible:outline-offset-8 w-full max-w-none min-h-full focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-4",
      },
    },
    onUpdate: ({ editor }) => {
      onValueChange?.(editor.getHTML());
    },
  });

  return <>
    {/* <div className={`absolute z-50 -translate-y-full mb-2 flex flex-wrap gap-2 bg-card rounded-lg p-2 border border-border ${focused ? "" : "hidden"}`} role="tooltip">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic bg-gray-200 px-2 rounded' : 'px-2'}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline bg-gray-200 px-2 rounded' : 'px-2'}>U</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'bg-yellow-200 px-2 rounded' : 'px-2'}>H</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'font-bold text-xl bg-gray-200 px-2 rounded' : 'px-2'}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'font-bold text-lg bg-gray-200 px-2 rounded' : 'px-2'}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'font-bold text-md bg-gray-200 px-2 rounded' : 'px-2'}>H3</button>
        <input
        type="color"
        title="Text color"
        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
        />
        <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className="px-2">Reset Color</button>
    </div> */}
    {editor &&<BubbleMenu 
      editor={editor} 
      shouldShow={({ editor }) => {
        const { from, to, empty } = editor.state.selection;
        return editor.isFocused && !empty && from !== to;
      }}
    >
        <div className="popup-menu bg-background rounded-lg color-accent-foreground flex items-center gap-2 p-1 text-xl">
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
    <Prose {...rest}>
        <EditorContent editor={editor} />
    </Prose>
  </>
}
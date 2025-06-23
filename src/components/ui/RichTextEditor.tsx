import React, { useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { Card, CardContent } from "./card";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, height = "400px" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({multicolor: true}),
      TextStyle,
      Strike,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
      ListItem,
      OrderedList,
      BubbleMenuExtension.configure({
        element: document.querySelector('.popup-menu'),
      }),
      Color.configure({ types: ["textStyle"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "focus-visible:outline-offset-8 w-full prose dark:prose-invert prose-p:flex",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div>Loading editor...</div>;

  return (
    <Card className="p-2 w-full" style={{ minHeight: height }}>
        <CardContent>
            {/* <div className="flex flex-wrap gap-2 mb-2">
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
            {editor &&<BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
                <div className="popup-menu bg-background rounded-lg color-accent-foreground flex items-center gap-2 p-1 text-xl">
                    <button 
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-2 ${editor.isActive('bold') ? 'font-bold' : ""}`}
                        >
                        B
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-2 ${editor.isActive('bold') ? 'font-bold' : ""}`}
                        >
                        B
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-2 italic ${editor.isActive('italic') ? 'font-bold' : ""}`}
                        >
                        I
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`px-2 underline ${editor.isActive('underline') ? 'font-bold' : ""}`}
                        >
                        U
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`px-2 line-through ${editor.isActive('strike') ? 'font-bold' : ""}`}
                        >
                        A
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFF9B1' }).run()}
                        className={editor.isActive('highlight', {color: "#FFF9B1"}) ? 'p-3 rounded-full bg-[#FFF9B1] border-2 border-black' : 'p-3 rounded-full bg-[#FFF9B1] border-2 border-white'}
                        >
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#C8F7C5' }).run()}
                        className={editor.isActive('highlight', {color: "#C8F7C5"}) ? 'p-3 rounded-full bg-[#C8F7C5] border-2 border-black' : 'p-3 rounded-full bg-[#C8F7C5] border-2 border-white'}
                        >
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#B3E5FC' }).run()}
                        className={editor.isActive('highlight', {color: "#B3E5FC"}) ? 'p-3 rounded-full bg-[#B3E5FC] border-2 border-black' : 'p-3 rounded-full bg-[#B3E5FC] border-2 border-white'}
                        >
                    </button>
                    <button 
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFCDD2' }).run()}
                        className={editor.isActive('highlight', {color: "#FFCDD2"}) ? 'p-3 rounded-full bg-[#FFCDD2] border-2 border-black' : 'p-3 rounded-full bg-[#FFCDD2] border-2 border-white'}
                        >
                    </button>
                </div>
            </BubbleMenu>}
        <EditorContent editor={editor} style={{ minHeight: height }} />
        </CardContent>
    </Card>
  );
};

export default RichTextEditor; 
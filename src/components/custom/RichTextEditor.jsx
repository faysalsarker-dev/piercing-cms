import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Quote, List, ListOrdered, Code, Undo2, Redo2
} from 'lucide-react'

const RichTextEditor = ({ onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <ToggleGroup type="multiple" className="flex flex-wrap gap-2 border rounded-md p-2">
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleBold().run()} pressed={editor.isActive('bold')}>
          <Bold size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleItalic().run()} pressed={editor.isActive('italic')}>
          <Italic size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleUnderline().run()} pressed={editor.isActive('underline')}>
          <UnderlineIcon size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleStrike().run()} pressed={editor.isActive('strike')}>
          <Strikethrough size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} pressed={editor.isActive('heading', { level: 1 })}>
          H1
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} pressed={editor.isActive('heading', { level: 2 })}>
          H2
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} pressed={editor.isActive('heading', { level: 3 })}>
          H3
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleBulletList().run()} pressed={editor.isActive('bulletList')}>
          <List size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleOrderedList().run()} pressed={editor.isActive('orderedList')}>
          <ListOrdered size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleBlockquote().run()} pressed={editor.isActive('blockquote')}>
          <Quote size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().toggleCodeBlock().run()} pressed={editor.isActive('codeBlock')}>
          <Code size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={16} />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Editor */}
      <div className="border rounded-md p-4 min-h-[200px] prose dark:prose-invert">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor

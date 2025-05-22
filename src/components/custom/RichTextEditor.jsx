

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Quote,
  List,
  ListOrdered,
  Code,
  Undo2,
  Redo2,
  Link as LinkIcon,
  PaintBucket,
} from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RichTextEditor = ({ onChange }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [color, setColor] = useState('#000000');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      Color,
      TextStyle,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    // Cleanup editor on unmount
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  const handleLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const handleColor = () => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="space-y-4 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border rounded-lg p-3 bg-muted w-full">
        <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
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

          {[1, 2, 3].map((level) => (
            <ToggleGroupItem
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              pressed={editor.isActive('heading', { level })}
            >
              H{level}
            </ToggleGroupItem>
          ))}

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

        {/* Link Input */}
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Input
            type="text"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8"
          />
          <Button size="sm" variant="outline" onClick={handleLink}>
            <LinkIcon size={16} />
          </Button>
        </div>

        {/* Text Color Picker */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded"
          />
          <Button size="sm" variant="outline" onClick={handleColor}>
            <PaintBucket size={16} />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border rounded-lg p-4 min-h-[300px] w-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;

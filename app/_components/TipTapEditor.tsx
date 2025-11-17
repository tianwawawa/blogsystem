'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';

interface TipTapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function TipTapEditor({ value = '', onChange }: TipTapEditorProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '开始写你的博客内容...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!mounted) {
    return (
      <div className="border rounded-lg min-h-[200px] p-4 flex items-center justify-center text-gray-500">
        编辑器加载中...
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="border-b bg-gray-50 p-2 flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm rounded border ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <strong>粗体</strong>
        </button>
      </div>

      {/* 编辑器内容区域 */}
      <div className="min-h-[400px]">
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
        />
      </div>
    </div>
  );
}

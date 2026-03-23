import type { Editor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'

interface EditorPanelProps {
  editor: Editor | null
}

export function EditorPanel({ editor }: EditorPanelProps) {
  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className="[&_.tiptap]:tiptap-editor"
      />
      {editor?.isEmpty && (
        <p className="absolute left-8 bottom-5 text-sm text-muted-foreground pointer-events-none">
          Start with a headline, or type directly into the blank page.
        </p>
      )}
    </div>
  )
}

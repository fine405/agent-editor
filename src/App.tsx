import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const initialContent = `
  <h2>Minimal writing surface.</h2>
  <p>
    Built with <strong>Vite</strong>, <strong>React</strong>, <strong>TypeScript</strong>, and
    <strong>Tiptap</strong>.
  </p>
  <p>Use the toolbar to shape the text, or just start typing.</p>
`

type ToolbarButtonProps = {
  active?: boolean
  disabled?: boolean
  label: string
  onClick: () => void
}

function ToolbarButton({ active = false, disabled = false, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      className={`toolbar-button${active ? ' is-active' : ''}`}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

export default function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'editor-surface',
      },
    },
  })

  return (
    <main className="page-shell">
      <section className="editor-card" aria-label="Rich text editor">
        <div className="editor-header">
          <div className="hero-copy">
            <span className="eyebrow">Tiptap Starter</span>
            <h1>Quiet, fast, and editable.</h1>
            <p>
              A minimal editor shell with no extra dependency noise, tuned for writing and quick
              formatting.
            </p>
          </div>

          <div className="status-chip" aria-live="polite">
            {editor?.isEmpty ? 'Empty document' : 'Ready'}
          </div>
        </div>

        <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
          <ToolbarButton
            active={editor?.isActive('bold')}
            disabled={!editor}
            label="Bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            active={editor?.isActive('italic')}
            disabled={!editor}
            label="Italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            active={editor?.isActive('bulletList')}
            disabled={!editor}
            label="Bullet List"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton disabled={!editor} label="Clear Marks" onClick={() => editor?.chain().focus().unsetAllMarks().run()} />
        </div>

        <div className="editor-panel">
          <EditorContent editor={editor} />
          {editor?.isEmpty ? (
            <p className="empty-note">Start with a headline, or type directly into the blank page.</p>
          ) : null}
        </div>
      </section>
    </main>
  )
}

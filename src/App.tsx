import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toolbar } from '@/components/editor/toolbar'
import { EditorPanel } from '@/components/editor/editor-panel'
import { AgentPanel } from '@/components/agent/agent-panel'

const initialContent = `
  <h2>Minimal writing surface.</h2>
  <p>
    Built with <strong>Vite</strong>, <strong>React</strong>, <strong>TypeScript</strong>, and
    <strong>Tiptap</strong>.
  </p>
  <p>Use the toolbar to shape the text, or just start typing.</p>
`

export default function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  })

  return (
    <main className="page-shell">
      <div className="workspace-grid">
        <div className="workspace-header">
          <Badge variant="secondary" className="mb-2">
            Tiptap Starter
          </Badge>
          <h1>
            Quiet, fast, and editable.
          </h1>
          <p>
            A minimal editor shell and a narrow agent panel, tuned for writing and quick iteration.
          </p>
        </div>

        <section className="workspace-grid-inner">
          <Card className="workspace-card editor-card">
            <CardHeader className="workspace-card-header">
              <div>
                <CardTitle>Editor</CardTitle>
                <CardDescription>Rich text editing powered by Tiptap</CardDescription>
              </div>
              <Badge variant={editor?.isEmpty ? 'outline' : 'secondary'} aria-live="polite">
                {editor?.isEmpty ? 'Empty' : 'Ready'}
              </Badge>
            </CardHeader>

            <Toolbar editor={editor} />

            <CardContent className="workspace-card-content">
              <EditorPanel editor={editor} />
            </CardContent>
          </Card>

          <Card className="workspace-card agent-card">
            <CardHeader className="workspace-card-header">
              <div>
                <CardTitle>Agent</CardTitle>
                <CardDescription>Streaming chat wired to <code>/api/chat</code></CardDescription>
              </div>
            </CardHeader>

            <CardContent className="workspace-card-content agent-panel">
              <AgentPanel />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

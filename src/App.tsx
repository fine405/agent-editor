import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Toolbar } from '@/components/editor/toolbar'
import { EditorPanel } from '@/components/editor/editor-panel'

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
    <main className="grid min-h-screen place-items-center p-5 md:p-8">
      <div className="w-full max-w-[920px] space-y-6">
        {/* Hero header */}
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-2">
            Tiptap Starter
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
            Quiet, fast, and editable.
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-[56ch]">
            A minimal editor shell with no extra dependency noise, tuned for writing and quick formatting.
          </p>
        </div>

        {/* Editor card */}
        <Card className="overflow-hidden py-0 gap-0">
          <CardHeader className="flex-row items-center justify-between px-4 py-3 border-b">
            <div>
              <CardTitle className="text-sm">Editor</CardTitle>
              <CardDescription className="text-xs">Rich text editing powered by Tiptap</CardDescription>
            </div>
            <Badge variant={editor?.isEmpty ? 'outline' : 'secondary'} aria-live="polite">
              {editor?.isEmpty ? 'Empty' : 'Ready'}
            </Badge>
          </CardHeader>

          <Toolbar editor={editor} />

          <CardContent className="p-0">
            <EditorPanel editor={editor} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

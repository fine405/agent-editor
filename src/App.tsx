import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useChat } from '@ai-sdk/react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

function ChatBubble({
  role,
  text,
}: {
  role: 'assistant' | 'user'
  text: string
}) {
  return (
    <article className={`chat-bubble chat-bubble-${role}`}>
      <div className="chat-bubble-meta">{role === 'user' ? 'You' : 'Agent'}</div>
      <p>{text}</p>
    </article>
  )
}

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
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { messages, status, error, sendMessage, stop, clearError } = useChat()

  const isBusy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  async function submitPrompt() {
    const trimmed = input.trim()
    if (!trimmed || isBusy) {
      return
    }

    setInput('')
    clearError()
    await sendMessage({ text: trimmed })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitPrompt()
  }

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
              <Badge
                variant={error ? 'destructive' : isBusy ? 'secondary' : 'outline'}
                aria-live="polite"
              >
                {error ? 'Error' : isBusy ? 'Streaming' : 'Ready'}
              </Badge>
            </CardHeader>

            <CardContent className="workspace-card-content agent-panel">
              <div className="chat-log" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="chat-empty">
                    <p>Ask for a rewrite, summary, or next step. Responses stream in place.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const text = message.parts
                      .map((part) => (part.type === 'text' ? part.text : ''))
                      .filter(Boolean)
                      .join('')

                    return (
                      <ChatBubble
                        key={message.id}
                        role={message.role === 'assistant' ? 'assistant' : 'user'}
                        text={text}
                      />
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {error ? (
                <div className="chat-error" role="alert">
                  <span>Chat request failed.</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => clearError()}>
                    Dismiss
                  </Button>
                </div>
              ) : null}

              <form className="chat-composer" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="chat-input">
                  Chat prompt
                </label>
                <textarea
                  id="chat-input"
                  className="chat-input"
                  placeholder="Tell the agent what to draft, explain, or refine..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      void submitPrompt()
                    }
                  }}
                  rows={4}
                />

                <div className="chat-actions">
                  <p className="chat-hint">Enter sends. Shift+Enter makes a new line.</p>
                  <div className="chat-buttons">
                    {isBusy ? (
                      <Button type="button" variant="secondary" onClick={() => stop()}>
                        Stop
                      </Button>
                    ) : (
                      <Button type="submit" disabled={!input.trim()}>
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

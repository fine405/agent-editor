import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useChat } from '@ai-sdk/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChatBubble } from './chat-bubble'

export function AgentPanel() {
  const { messages, status, error, sendMessage, stop, clearError, setMessages } =
    useChat()

  const [input, setInput] = useState('')
  const chatLogRef = useRef<HTMLDivElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const userScrolledUpRef = useRef(false)

  const isBusy = status === 'submitted' || status === 'streaming'

  /* ── Smart auto-scroll ─────────────────────────────── */
  const isNearBottom = useCallback(() => {
    const el = chatLogRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }, [])

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'end',
    })
    userScrolledUpRef.current = false
    setShowScrollBtn(false)
  }, [])

  // Track user scroll
  useEffect(() => {
    const el = chatLogRef.current
    if (!el) return
    const onScroll = () => {
      const near = isNearBottom()
      userScrolledUpRef.current = !near
      setShowScrollBtn(!near)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isNearBottom])

  // Auto-scroll when new messages arrive (only if user is near bottom)
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      scrollToBottom(false)
    }
  }, [messages, scrollToBottom])

  /* ── Textarea auto-resize ──────────────────────────── */
  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    autoResize(e.target)
  }

  /* ── Submit ─────────────────────────────────────────── */
  async function submitPrompt() {
    const trimmed = input.trim()
    if (!trimmed || isBusy) return

    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    clearError()
    await sendMessage({ text: trimmed })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await submitPrompt()
  }

  /* ── Clear messages ─────────────────────────────────── */
  function handleClear() {
    setMessages([])
    clearError()
  }

  return (
    <>
      {/* Header actions row */}
      <div className="agent-header-actions">
        <Badge
          variant={error ? 'destructive' : isBusy ? 'secondary' : 'outline'}
          aria-live="polite"
        >
          {error ? 'Error' : isBusy ? 'Streaming' : 'Ready'}
        </Badge>

        {messages.length > 0 && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            title="Clear messages"
            aria-label="Clear messages"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat log */}
      <div className="chat-log-wrapper">
        <div className="chat-log" ref={chatLogRef} aria-live="polite">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p>Ask for a rewrite, summary, or next step.</p>
              <p className="chat-empty-sub">Responses stream in place. Use <kbd>Enter</kbd> to send.</p>
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

          {/* Streaming indicator */}
          {isBusy && (
            <div className="streaming-indicator">
              <span /><span /><span />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom FAB */}
        {showScrollBtn && (
          <button
            type="button"
            className="scroll-to-bottom"
            onClick={() => scrollToBottom(true)}
            aria-label="Scroll to bottom"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>

      {/* Error banner */}
      {error ? (
        <div className="chat-error" role="alert">
          <span>Chat request failed.</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => clearError()}>
            Dismiss
          </Button>
        </div>
      ) : null}

      {/* Composer */}
      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Chat prompt
        </label>
        <textarea
          ref={textareaRef}
          id="chat-input"
          className="chat-input"
          placeholder="Tell the agent what to draft, explain, or refine..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void submitPrompt()
            }
          }}
          rows={2}
        />

        <div className="chat-actions">
          <p className="chat-hint">Enter sends · Shift+Enter new line</p>
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
    </>
  )
}

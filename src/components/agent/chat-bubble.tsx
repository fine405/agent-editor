import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function ChatBubble({
  role,
  text,
}: {
  role: 'assistant' | 'user'
  text: string
}) {
  return (
    <article className={`chat-bubble chat-bubble-${role}`}>
      <div className="chat-bubble-meta">{role === 'user' ? 'You' : 'Agent'}</div>
      {role === 'assistant' ? (
        <div className="chat-bubble-md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      ) : (
        <p>{text}</p>
      )}
    </article>
  )
}

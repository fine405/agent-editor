import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { Context } from 'hono'

import { getConfig } from '../lib/config.js'

type ChatRequestBody = {
  messages?: UIMessage[]
}

const systemPrompt =
  'You are a concise backend coding assistant. Be direct, avoid tool orchestration, and keep replies practical.'

function isUIMessageArray(value: unknown): value is UIMessage[] {
  return Array.isArray(value)
}

export async function chatRoute(c: Context) {
  const config = getConfig()

  if (!config.openaiApiKey && !config.openaiBaseUrl) {
    return c.json(
      {
        error:
          'Set OPENAI_API_KEY for OpenAI cloud, or set OPENAI_BASE_URL to target a local OpenAI-compatible endpoint.',
      },
      500,
    )
  }

  const body = (await c.req.json()) as ChatRequestBody
  const messages = body.messages

  if (!isUIMessageArray(messages)) {
    return c.json({ error: '`messages` must be an array.' }, 400)
  }

  const modelMessages = await convertToModelMessages(messages)
  const provider = createOpenAI({
    apiKey: config.openaiApiKey,
    baseURL: config.openaiBaseUrl,
  })

  const result = streamText({
    model: provider(config.model),
    system: systemPrompt,
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}

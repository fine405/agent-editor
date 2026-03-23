export type AgentApiProvider = 'anthropic' | 'openai'

export type AgentApiConfig = {
  provider: AgentApiProvider
  anthropicApiKey?: string
  anthropicAuthToken?: string
  anthropicBaseUrl?: string
  openaiApiKey?: string
  openaiBaseUrl?: string
  model: string
  port: number
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return 3001
  }

  const port = Number(value)
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    return 3001
  }

  return port
}

function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) {
      return trimmed
    }
  }

  return undefined
}

function parseProvider(value: string | undefined): AgentApiProvider {
  return value?.trim().toLowerCase() === 'openai' ? 'openai' : 'anthropic'
}

function normalizeAnthropicBaseUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim()

  if (!trimmed) {
    return undefined
  }

  try {
    const url = new URL(trimmed)

    if (url.pathname === '' || url.pathname === '/') {
      url.pathname = '/v1'
      return url.toString().replace(/\/$/, '')
    }

    return trimmed
  } catch {
    return trimmed.endsWith('/v1')
      ? trimmed
      : `${trimmed.replace(/\/+$/, '')}/v1`
  }
}

export function getConfig(): AgentApiConfig {
  const provider = parseProvider(process.env.AI_PROVIDER)
  const openaiModel = process.env.OPENAI_MODEL?.trim() || 'gpt-5.2-codex'
  const anthropicModel =
    firstDefined(
      process.env.ANTHROPIC_MODEL,
      process.env.ANTHROPIC_DEFAULT_SONNET_MODEL,
      process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL,
      process.env.ANTHROPIC_DEFAULT_OPUS_MODEL,
    ) || 'claude-sonnet-4-5'

  return {
    provider,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY?.trim() || undefined,
    anthropicAuthToken:
      process.env.ANTHROPIC_AUTH_TOKEN?.trim() || undefined,
    anthropicBaseUrl: normalizeAnthropicBaseUrl(
      process.env.ANTHROPIC_BASE_URL,
    ),
    openaiApiKey: process.env.OPENAI_API_KEY?.trim() || undefined,
    openaiBaseUrl: process.env.OPENAI_BASE_URL?.trim() || undefined,
    model: provider === 'anthropic' ? anthropicModel : openaiModel,
    port: parsePort(process.env.PORT),
  }
}

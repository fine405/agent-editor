export type AgentApiConfig = {
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

export function getConfig(): AgentApiConfig {
  return {
    openaiApiKey: process.env.OPENAI_API_KEY?.trim() || undefined,
    openaiBaseUrl: process.env.OPENAI_BASE_URL?.trim() || undefined,
    model: process.env.OPENAI_MODEL?.trim() || 'gpt-5.2-codex',
    port: parsePort(process.env.PORT),
  }
}

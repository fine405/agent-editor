import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { getConfig } from './lib/config.js'
import { chatRoute } from './routes/chat.js'

const app = new Hono()

app.get('/health', c => c.json({ ok: true }))
app.post('/api/chat', chatRoute)

const config = getConfig()

serve(
  {
    fetch: app.fetch,
    port: config.port,
  },
  info => {
    console.log(`agent-api listening on http://localhost:${info.port}`)
  },
)

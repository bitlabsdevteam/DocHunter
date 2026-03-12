import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/health', async () => ({ ok: true, service: 'dochunter-api' }))
app.get('/api/status', async () => ({
  product: 'DocHunter',
  region: 'Japan',
  language: ['en', 'ja'],
  deployment: 'vercel-first',
  status: 'scaffold'
}))

app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })

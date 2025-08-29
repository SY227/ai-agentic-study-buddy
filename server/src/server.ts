import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import dns from 'node:dns'
import youtubeRouter from './routes/youtube.js'
dns.setDefaultResultOrder('ipv4first')
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { z } from 'zod'
import { ingestSources } from './utils/ingest.js'
import { synthesizeGuide } from './agents/summarize.js'
import { generateQuiz } from './agents/quiz.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const upload = multer({ storage: multer.memoryStorage() })

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/api/process_stream', upload.single('file'), async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/x-ndjson',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })
  const write = (obj: any) => res.write(JSON.stringify(obj) + '\n')
  const logText = (text: string) => write({ type: 'log', text })
  const progress = (key: string, text: string) => write({ type: 'progress', key, text })

  try {
    const payload = z.object({ urls: z.array(z.string().url()).max(3).optional() }).parse(
      JSON.parse(req.body?.payload || '{}')
    )
    const file = req.file || null

    logText('Planning the approach…')
    const plan = { requireCitations: true, quizItems: 30 }
    logText('Plan ready.')

    logText('Starting to read your sources…')
    const sources = await ingestSources(payload.urls || [], file, (i, total) => {
      logText(`Reading sources (${i}/${total})…`)
    })
    logText(`Found ${sources.length} source${sources.length === 1 ? '' : 's'}.`)

    progress('guide', 'Synthesizing study guide…')
    const guide = await synthesizeGuide(sources)
    progress('guide', 'Study guide ready.')
    write({ type: 'guide', guide })

    const totalQ = plan.quizItems
    let step = 1
    progress('quiz', `Synthesizing quiz (${step}/${totalQ})…`)
    const ticker = setInterval(() => {
      if (step < totalQ) {
        step += 1
        progress('quiz', `Synthesizing quiz (${step}/${totalQ})…`)
      }
    }, 140)
    let quiz: any
    try {
      quiz = await generateQuiz(guide, sources, totalQ)
    } finally {
      clearInterval(ticker)
    }
    progress('quiz', `Quiz complete (${totalQ}/${totalQ}).`)

    write({ type: 'result', guide, quiz })
    res.end()
  } catch (e: any) {
    write({ type: 'error', message: e?.message || 'Bad request' })
    res.end()
  }
})

const port = Number(process.env.PORT) || 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const staticDir = path.resolve(__dirname, 'public')
app.use(express.static(staticDir))
app.get('*', (_req, res) => { res.sendFile(path.join(staticDir, 'index.html')) })
app.use('/api/youtube', youtubeRouter)
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`)
})

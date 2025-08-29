import { Router } from 'express'
import { youtubeSearch } from '../services/youtube.js'
const router = Router()
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim()
  if (!q) return res.status(400).json({ error: 'q required' })
  try {
    const max = req.query.max ? Number(req.query.max) : undefined
    const items = await youtubeSearch(q, max)
    res.json({ items })
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) })
  }
})
export default router

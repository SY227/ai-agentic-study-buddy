import axios from 'axios'
export type YouTubeMeta = { videoId: string; title: string; channel: string; description: string; publishedAt: string }
const API = 'https://www.googleapis.com/youtube/v3'
const KEY = process.env.YOUTUBE_API_KEY || ''
export function parseVideoId(inputUrl: string): string {
  try {
    const u = new URL(inputUrl)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    if (u.searchParams.get('v')) return u.searchParams.get('v') || ''
    const parts = u.pathname.split('/')
    if (parts.includes('shorts')) return parts[parts.indexOf('shorts')+1] || ''
  } catch {}
  return ''
}
export async function getVideoMetaById(id: string): Promise<YouTubeMeta | null> {
  if (!KEY) throw new Error('YOUTUBE_API_KEY missing')
  const res = await axios.get(`${API}/videos`, { params: { key: KEY, id, part: 'snippet' } })
  const it = res.data?.items?.[0]
  if (!it) return null
  const s = it.snippet || {}
  return { videoId: id, title: String(s.title||''), channel: String(s.channelTitle||''), description: String(s.description||''), publishedAt: String(s.publishedAt||'') }
}

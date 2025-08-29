import type { YouTubeMeta } from '../services/youtube_meta.js'
import { parseVideoId, getVideoMetaById } from '../services/youtube_meta.js'
import { summarizeWithValidation } from './yt_reader.js'

export async function ingestYouTube(u: string): Promise<any> {
  const id = parseVideoId(u)
  if (!id) return null
  const meta: YouTubeMeta | null = await getVideoMetaById(id)
  if (!meta) return null
  const data = await summarizeWithValidation(u, meta)
  const body = [data.summary, ...(Array.isArray(data.key_points)?data.key_points:[])].filter(Boolean).join('\n\n')
  const title = (data.title && String(data.title)) || meta.title || 'YouTube'
  return { id: u, url: u, text: body, kind: 'youtube', title }
}

import { summarizeYouTubeUrl } from '../services/gemini.js'
import { SummarizePromptStrict } from './yt_schema_prompt.js'
import { toStrictObject } from './jsonStrict.js'
import { getYouTubeMetaByUrl, YouTubeMeta } from '../services/youtubeMeta.js'

type YtDoc = { id: string; url: string; text: string; kind: 'youtube'; title: string }

function section(label: string, items: string[]){ return items.length ? `${label}:\n` + items.map(x=>`• ${x}`).join('\n') : '' }

function buildBody(d:any): string {
  const parts: string[] = []
  if (d?.summary) parts.push(d.summary)
  if (Array.isArray(d?.key_points)) parts.push(section('Key Points', d.key_points))
  if (Array.isArray(d?.key_quotes)) parts.push(section('Key Quotes', d.key_quotes))
  if (Array.isArray(d?.timestamps)){
    const t = d.timestamps.map((t:any)=>`• ${t.time} — ${t.point}`)
    parts.push('Timestamps:\n'+t.join('\n'))
  }
  return parts.filter(Boolean).join('\n\n').trim()
}

export async function extractYouTubeDocStrict(u: string): Promise<YtDoc | null> {
  const meta: YouTubeMeta | null = await getYouTubeMetaByUrl(u)
  if (!meta) return null
  const ctx = `URL: ${u}\nExpected title: ${meta.title}\nExpected channel: ${meta.channel}\nExpected publishedAt: ${meta.publishedAt}`
  const raw = await summarizeYouTubeUrl(u, `${ctx}\n\n${SummarizePromptStrict}`)
  const obj = toStrictObject(raw)
  obj.videoId = meta.videoId; obj.url = u; obj.title = meta.title; obj.channel = meta.channel; obj.publishedAt = meta.publishedAt
  const body = buildBody(obj)
  return { id: u, url: u, text: body, kind: 'youtube', title: meta.title || 'YouTube' }
}

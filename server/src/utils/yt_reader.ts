import { summarizeYouTubeUrl } from '../services/gemini.js'
import { SummarizePromptStrict } from './yt_schema_prompt.js'
import { parseJsonOrThrow } from './json.js'
import type { YouTubeMeta } from '../services/youtube_meta.js'

function norm(s: string) { return (s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim() }
function overlap(a: string, b: string) {
  const A = new Set(norm(a).split(' ').filter(w=>w.length>2))
  const B = new Set(norm(b).split(' ').filter(w=>w.length>2))
  if (!A.size || !B.size) return 0
  let inter=0; A.forEach(w=>{ if(B.has(w)) inter++ })
  return inter / Math.min(A.size, B.size)
}

export async function summarizeWithValidation(url: string, meta: YouTubeMeta, retries = 1): Promise<any> {
  const baseCtx = `Title: ${meta.title}\nChannel: ${meta.channel}\nPublishedAt: ${meta.publishedAt}\nDescription:\n${meta.description.slice(0,1500)}`
  const prompt = `Use the URL and metadata to ensure specificity. Avoid generic platform summaries. Include details consistent with the talk.\n\nKnown metadata:\n${baseCtx}\n\n` + SummarizePromptStrict
  let raw = await summarizeYouTubeUrl(url, prompt)
  let data = parseJsonOrThrow(raw, 'YouTubeJSON')
  const text = [data.summary, ...(Array.isArray(data.key_points)?data.key_points:[])].join(' ')
  const scoreTitle = overlap(String(data.title||''), meta.title)
  const scoreChannel = overlap(String(data.channel||''), meta.channel)
  const scoreTextMeta = overlap(text, meta.title + ' ' + meta.description)
  if ((scoreTitle < 0.2 || scoreChannel < 0.2) && scoreTextMeta < 0.1 && retries > 0) {
    const strict = `Be strictly grounded to this talk. Name speakers/organizations mentioned in the video when present. Do not define what YouTube is.\n\nKnown metadata:\n${baseCtx}\n\n` + SummarizePromptStrict
    raw = await summarizeYouTubeUrl(url, strict)
    data = parseJsonOrThrow(raw, 'YouTubeJSON')
  }
  return data
}

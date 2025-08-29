import axios from 'axios'
const API = 'https://www.googleapis.com/youtube/v3'
const KEY = process.env.YOUTUBE_API_KEY || ''
const MAX = Number(process.env.MAX_VIDEOS || '8')
export type YouTubeVideo = { videoId: string; url: string; title: string; channel: string; publishedAt: string }
export async function youtubeSearch(q: string, max: number = MAX): Promise<YouTubeVideo[]> {
  if (!KEY) throw new Error('YOUTUBE_API_KEY missing')
  const res = await axios.get(`${API}/search`, {
    params: { key: KEY, q, part: 'snippet', type: 'video', maxResults: Math.min(max, 50) }
  })
  const items = res.data?.items || []
  return items.map((it: any) => {
    const id = it?.id?.videoId || ''
    const s = it?.snippet || {}
    return { videoId: id, url: `https://www.youtube.com/watch?v=${id}`, title: String(s.title || ''), channel: String(s.channelTitle || ''), publishedAt: String(s.publishedAt || '') }
  })
}

export type YouTubeMeta = { videoId: string; title: string; channel: string; publishedAt: string }
function pickId(u: string): string {
  try {
    const url = new URL(u)
    if (url.hostname === 'youtu.be') return url.pathname.slice(1)
    const v = url.searchParams.get('v'); if (v) return v
    const parts = url.pathname.split('/'); if (parts.includes('shorts')) return parts[parts.indexOf('shorts')+1] || ''
  } catch {}
  return ''
}
export async function getYouTubeMetaByUrl(u: string, key = process.env.YOUTUBE_API_KEY || ''): Promise<YouTubeMeta | null> {
  const id = pickId(u); if (!id || !key) return null
  const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`
  const res = await fetch(api); if (!res.ok) return null
  const data = await res.json().catch(() => null) as any
  const sn = data?.items?.[0]?.snippet; if (!sn) return null
  return { videoId: id, title: String(sn.title||''), channel: String(sn.channelTitle||''), publishedAt: String(sn.publishedAt||'') }
}

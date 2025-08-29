const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'

export async function buildGuideStream(opts: {
  urls: string[]
  file?: File | null
  onLog?: (text: string) => void
  onProgress?: (key: string, text: string) => void
  onGuide?: (guide: any) => void
  onDone?: (payload: { guide: any; quiz: any }) => void
  onError?: (msg: string) => void
}) {
  const form = new FormData()
  form.append('payload', JSON.stringify({ urls: opts.urls }))
  if (opts.file) form.append('file', opts.file)

  const res = await fetch(`${SERVER}/api/process_stream`, { method: 'POST', body: form })
  if (!res.ok || !res.body) throw new Error(`Server error ${res.status}`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let idx = buf.indexOf('\n')
    while (idx >= 0) {
      const line = buf.slice(0, idx).trim()
      buf = buf.slice(idx + 1)
      if (line) {
        try {
          const evt = JSON.parse(line)
          if (evt.type === 'log') opts.onLog?.(evt.text)
          if (evt.type === 'progress') opts.onProgress?.(evt.key, evt.text)
          if (evt.type === 'guide') opts.onGuide?.(evt.guide)
          if (evt.type === 'result') opts.onDone?.({ guide: evt.guide, quiz: evt.quiz })
          if (evt.type === 'error') opts.onError?.(evt.message || 'Error')
        } catch (e: any) {
          opts.onError?.(e?.message || 'Parse error')
        }
      }
      idx = buf.indexOf('\n')
    }
  }
}

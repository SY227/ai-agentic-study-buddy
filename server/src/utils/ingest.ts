import { extractYouTubeDocStrict } from './yt_reader_strict.js'
import { extractPdfDocStrict } from './pdf_reader_strict.js'

export type SourceDoc = { id: string; url?: string; title?: string; text: string; kind: 'youtube' | 'pdf' }

function isYouTubeUrl(u: string): boolean {
  try {
    const h = new URL(u).hostname.replace(/^www\./,'')
    return h === 'youtube.com' || h === 'youtu.be' || h.endsWith('.youtube.com')
  } catch { return false }
}

async function extractFromUrl(u: string): Promise<SourceDoc | null> {
  if (isYouTubeUrl(u)) {
    const doc = await extractYouTubeDocStrict(u)
    if (doc) return doc
  }
  return null
}

async function extractFromPdf(file: any): Promise<SourceDoc | null> {
  return await extractPdfDocStrict(file)
}

export async function ingestSources(
  urls: string[],
  file?: any,
  onProgress?: (i: number, total: number, label: string) => void
): Promise<SourceDoc[]> {
  const docs: SourceDoc[] = []
  const total = urls.length + (file?.buffer ? 1 : 0)
  let i = 0
  for (const u of urls) {
    onProgress?.(++i, total, u)
    try {
      const doc = await extractFromUrl(u)
      if (doc) docs.push(doc)
    } catch (e) {
      console.error('[ingest:url]', u, e)
    }
  }
  if (file?.buffer) {
    onProgress?.(++i, total, file.originalname || 'uploaded.pdf')
    try {
      const pdfDoc = await extractFromPdf(file)
      if (pdfDoc) docs.push(pdfDoc)
    } catch (e) {
      console.error('[ingest:pdf]', e)
    }
  }
  return docs
}

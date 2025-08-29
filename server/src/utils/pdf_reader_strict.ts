import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { getModel } from '../services/gemini.js'
import { toStrictObject } from './jsonStrict.js'

type PdfDoc = { id: string; url?: string; title?: string; text: string; kind: 'pdf' }

async function pdfToText(file: any): Promise<{ text: string; title: string }> {
  const title = file?.originalname ? String(file.originalname) : 'Uploaded PDF'
  if (!file?.buffer) return { text: '', title }
  const data = new Uint8Array(file.buffer)
  const doc = await getDocument({ data }).promise
  let text = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content: any = await page.getTextContent()
    const pageText = (content.items as any[]).map((it: any) => it.str).join(' ')
    text += pageText + '\n'
  }
  return { text: text.trim(), title }
}

function buildBody(obj: any): string {
  const parts: string[] = []
  if (obj?.summary) parts.push(obj.summary)
  if (Array.isArray(obj?.key_points) && obj.key_points.length) {
    parts.push('Key Points:\n' + obj.key_points.map((p: string) => `• ${p}`).join('\n'))
  }
  if (Array.isArray(obj?.key_figures) && obj.key_figures.length) {
    const lines = obj.key_figures.map((f: any) => {
      const m = [f.metric, f.value, f.unit].filter(Boolean).join(' ')
      return `• ${m}${f.context ? ` — ${f.context}` : ''}`
    })
    parts.push('Key Figures:\n' + lines.join('\n'))
  }
  if (Array.isArray(obj?.key_quotes) && obj.key_quotes.length) {
    const qs = obj.key_quotes.map((q: any) => `• “${q.quote}”${q.speaker ? ` — ${q.speaker}` : ''}${q.context ? ` (${q.context})` : ''}`)
    parts.push('Key Quotes:\n' + qs.join('\n'))
  }
  if (Array.isArray(obj?.sections) && obj.sections.length) {
    const secs = obj.sections.map((s: any) => {
      const bullets = Array.isArray(s.bullets) ? s.bullets.map((b: string) => `  - ${b}`).join('\n') : ''
      return `• ${s.title}\n${bullets}`
    })
    parts.push('Detailed Sections:\n' + secs.join('\n'))
  }
  return parts.join('\n\n').trim()
}

const PdfPrompt = `
Return ONLY valid JSON with this schema:
{
  "summary": "string",
  "key_points": ["string"],
  "key_figures": [{"metric":"string","value":"string","unit":"string","context":"string"}],
  "key_quotes": [{"quote":"string","speaker":"string","context":"string"}],
  "sections": [{"title":"string","bullets":["string"]}]
}
Be comprehensive and precise. Include every major idea, all quantitative details (numbers, dates, metrics) and qualitative insights (rationale, comparisons, implications) that appear in the document. If a field is inapplicable, return an empty array for it. Do not include code fences.
`

export async function extractPdfDocStrict(file: any): Promise<PdfDoc | null> {
  const { text, title } = await pdfToText(file)
  if (!text) return null
  const model = getModel('gemini-2.5-flash')
  const resp = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Source is a PDF named "${title}". Produce a comprehensive study-ready outline as JSON per schema.\n\n${PdfPrompt}\n\nPDF Content:\n${text.slice(0, 120_000)}` }]}],
    generationConfig: { responseMimeType: 'application/json' }
  })
  const raw = resp.response.text()
  const obj = toStrictObject(raw)
  const body = buildBody(obj)
  return { id: title, title, text: body || text, kind: 'pdf' }
}

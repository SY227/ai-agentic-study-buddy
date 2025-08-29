import 'dotenv/config'

const API = 'https://generativelanguage.googleapis.com/v1beta'
const KEY = process.env.GEMINI_API_KEY || ''

type Part = { text: string }
type Content = { role: 'user' | 'system'; parts: Part[] }

export async function genJSONViaREST(model: string, contents: Content[], generationConfig: any = {}) {
  if (!KEY) throw new Error('GEMINI_API_KEY missing')
  const url = `${API}/models/${encodeURIComponent(model)}:generateContent?key=${KEY}`
  const body = {
    contents,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
      ...generationConfig
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const msg = await res.text().catch(()=>'')
    throw new Error(`Gemini REST ${res.status}: ${msg}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('') || ''
  if (!text) throw new Error('Gemini REST: empty response text')
  return text
}

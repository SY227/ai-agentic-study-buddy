import { GoogleGenerativeAI } from '@google/generative-ai'
const KEY = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(KEY)
export function getModel(model = 'gemini-2.5-flash') {
  return genAI.getGenerativeModel({ model })
}
export async function summarizeYouTubeUrl(url: string, schemaPrompt: string) {
  if (!KEY) throw new Error('GEMINI_API_KEY missing')
  const model = getModel()
  const resp = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text:
`Analyze the YouTube video at this URL and return ONLY valid JSON per the schema.
URL: ${url}

${schemaPrompt}` }]}],
    generationConfig: { responseMimeType: 'application/json' }
  })
  return resp.response.text()
}

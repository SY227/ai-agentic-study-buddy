import type { SourceDoc } from '../utils/ingest.js'
import { parseJsonOrThrow } from '../utils/json.js'
import { genJSONViaREST } from '../utils/gemini_rest.js'

export async function generateQuiz(guide: any, _sources: SourceDoc[], count = 30) {
  const model = process.env.MODEL || 'gemini-2.5-flash'

  const sys = `Generate exactly ${count} multiple-choice questions grounded in the study guide.
Each item must have:
- "type": "mcq"
- "question": a clear prompt
- "choices": exactly 4 options
- "answer": the correct option text
- "rationale": a concise explanation
Return pure JSON with shape:
{ "items": [ { "type": "mcq", "question": "...", "choices": ["...","...","...","..."], "answer": "...", "rationale": "..." } ] }`

  const contents = [
    { role: 'user' as const, parts: [{ text: sys }] },
    { role: 'user' as const, parts: [{ text: `Study Guide:\n${JSON.stringify(guide, null, 2)}` }] }
  ]

  try {
    const raw = await genJSONViaREST(model, contents, { temperature: 0.5 })
    return parseJsonOrThrow(raw, 'Quiz')
  } catch {
    const raw = await genJSONViaREST('gemini-2.5-flash', contents, { temperature: 0.5 })
    return parseJsonOrThrow(raw, 'Quiz')
  }
}

import type { SourceDoc } from '../utils/ingest.js'
import { parseJsonOrThrow } from '../utils/json.js'
import { genJSONViaREST } from '../utils/gemini_rest.js'

export async function synthesizeGuide(sources: SourceDoc[]) {
  const model = process.env.MODEL || 'gemini-2.5-flash'
  const labeled = sources.map((s, i) => ({
    id: `S${i+1}`,
    url: s.url || s.id,
    title: s.title || s.id,
    excerpt: s.text.slice(0, 4000)
  }))

  const sys = `Produce a compact, practical study guide in JSON with fields:
- topic (string)
- overview (string)
- sections[]: { title, bullets[] } — bullets emphasize must-know ideas, mental models, quick heuristics, and common pitfalls.
- key_terms[]: { term, definition } — concise wording.
- figures_to_draw[] (array of strings) — visuals that make the concept stick.
Use only information grounded in the provided sources. Keep language clear and punchy. Return pure JSON only.`

  const contents = [
    { role: 'user' as const, parts: [{ text: sys }] },
    { role: 'user' as const, parts: [{ text: `Sources:\n${JSON.stringify(labeled, null, 2)}\n` }] },
    { role: 'user' as const, parts: [{ text: 'Return the Study Guide JSON now.' }] }
  ]

  try {
    const raw = await genJSONViaREST(model, contents, { temperature: 0.4 })
    return parseJsonOrThrow(raw, 'StudyGuide')
  } catch {
    const raw = await genJSONViaREST('gemini-2.5-flash', contents, { temperature: 0.4 })
    return parseJsonOrThrow(raw, 'StudyGuide')
  }
}

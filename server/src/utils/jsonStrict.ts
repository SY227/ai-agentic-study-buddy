import { jsonrepair } from 'jsonrepair'
export function toStrictObject(text: string): any {
  let t = (text || '').trim().replace(/^\uFEFF/, '')
  t = t.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/i, '').trim()
  try { return JSON.parse(t) } catch {}
  return JSON.parse(jsonrepair(t))
}

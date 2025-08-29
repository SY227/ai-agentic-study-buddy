export function parseJsonOrThrow(input: string, label = 'JSON'): any {
  const cleaned = input.replace(/```json\s*|```\s*$/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) throw new Error(label + ' parse error')
  const slice = cleaned.slice(start, end + 1)
  return JSON.parse(slice)
}

function tokens(s: string): Set<string> {
  return new Set((s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(w=>w.length>=4))
}
export function hasOverlap(a: string, b: string): boolean {
  const A = tokens(a), B = tokens(b)
  for (const t of A) if (B.has(t)) return true
  return false
}

export const BROWSER_HEADERS: Record<string, string> = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Referer': 'https://www.google.com/'
}
export async function fetchHtmlWithUA(u: string): Promise<string> {
  let res = await fetch(u, { headers: BROWSER_HEADERS, redirect: 'follow' })
  let html = await res.text()
  const looksConsent = res.url.includes('consent') || /(?:^|>|\s)consent/i.test(html)
  const looksShell = /About\b.*\bAdvertise\b.*\bDevelopers\b/s.test(html)
  if (looksConsent || looksShell) {
    const cookieHeaders = { ...BROWSER_HEADERS, Cookie: 'CONSENT=YES+cb.20210328-17-p0.en+F+678; SOCS=CAI' }
    res = await fetch(u, { headers: cookieHeaders, redirect: 'follow' })
    html = await res.text()
  }
  return html
}
